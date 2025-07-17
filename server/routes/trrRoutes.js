const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { OpenAI } = require('openai');
const { MongoClient } = require('mongodb');

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload a CSV file'));
    }
  }
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize progress map
const progressMap = new Map();

// Update the TRR processing endpoint
router.post('/process', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    console.log('Starting TRR processing for file:', req.file.originalname);

    // Create a unique processing ID
    const processId = Date.now().toString();
    
    // Initialize progress in memory
    progressMap.set(processId, {
      status: 'processing',
      progress: 0,
      currentStep: 'Initializing'
    });

    // Process the file in chunks to provide real progress
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    const totalLines = lines.length;
    
    let processedLines = 0;
    const processedData = [];

    // Process in smaller chunks
    const chunkSize = 100;
    for (let i = 0; i < lines.length; i += chunkSize) {
      const chunk = lines.slice(i, i + chunkSize);
      
      // Process each line in the chunk
      for (const line of chunk) {
        try {
          const processedLine = await processLine(line);
          if (processedLine) {
            processedData.push(processedLine);
          }
        } catch (error) {
          console.error('Error processing line:', error);
          // Continue processing other lines
        }
        
        processedLines++;
        
        // Update progress
        const progress = Math.min(Math.floor((processedLines / totalLines) * 100), 99);
        progressMap.set(processId, {
          status: 'processing',
          progress,
          currentStep: `Processing line ${processedLines} of ${totalLines}`
        });
      }
    }

    // Save processed data
    const result = await saveProcessedData(processedData);

    // Mark as complete
    progressMap.set(processId, {
      status: 'complete',
      progress: 100,
      currentStep: 'Processing complete'
    });

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      processId,
      message: 'TRR processing started',
      totalRecords: totalLines
    });

  } catch (error) {
    console.error('TRR processing error:', error);
    
    // Update progress map with error
    if (req.processId) {
      progressMap.set(req.processId, {
        status: 'error',
        progress: 0,
        currentStep: 'Error: ' + error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to process TRR file',
      details: error.message
    });
  }
});

// Add progress checking endpoint
router.get('/progress/:processId', (req, res) => {
  const { processId } = req.params;
  const progress = progressMap.get(processId) || {
    status: 'not_found',
    progress: 0,
    currentStep: 'Process not found'
  };

  res.json({
    success: true,
    ...progress
  });

  // Clean up completed processes after a delay
  if (progress.status === 'complete' || progress.status === 'error') {
    setTimeout(() => {
      progressMap.delete(processId);
    }, 5000);
  }
});

// Helper function to process each line
async function processLine(line) {
  try {
    // Add your line processing logic here
    const processedLine = {
      // Process the line data
      raw: line,
      timestamp: new Date()
    };
    return processedLine;
  } catch (error) {
    console.error('Line processing error:', error);
    return null;
  }
}

// Helper function to save processed data
async function saveProcessedData(data) {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection('trr_data');
    
    const result = await collection.insertMany(data);
    await client.close();
    
    return result;
  } catch (error) {
    console.error('Save data error:', error);
    throw error;
  }
}

router.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = [];
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }

    // Process CSV file with error handling
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv({
          mapValues: ({ header, value }) => value.trim(),
          strict: true
        }))
        .on('data', (data) => {
          // Normalize field names
          const normalizedData = {
            MemberID: data.MemberID || data['Member ID'] || data.Member_ID,
            Name: data.Name,
            DateOfBirth: data['Date of Birth'] || data.DateOfBirth || data.DOB,
            EffectiveDate: data['Effective Date'] || data.EffectiveDate,
            PlanID: data['Plan ID'] || data.PlanID,
            ContractID: data['Contract ID'] || data.ContractID,
            TRCCode: data['TRC Code'] || data.TRCCode || data.TRC_Code,
            Status: data.Status,
            Reason: data.Reason
          };
          results.push(normalizedData);
        })
        .on('end', () => resolve())
        .on('error', reject);
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    if (results.length === 0) {
      throw new Error('No valid data found in CSV file');
    }

    // Process the data
    const analysis = await analyzeTRRData(results);
    res.json(analysis);

  } catch (error) {
    console.error('Error processing TRR file:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to process TRR file',
      details: error.message
    });
  }
});

async function analyzeTRRData(data) {
  try {
    // Basic statistics
    const totalRecords = data.length;
    const accepted = data.filter(record => 
      record.Status?.toLowerCase() === 'accepted'
    ).length;
    const rejected = data.filter(record => 
      record.Status?.toLowerCase() === 'rejected'
    ).length;

    // Detailed rejection analysis
    const rejectionDetails = data
      .filter(record => record.Status?.toLowerCase() === 'rejected')
      .map(record => ({
        memberId: record.MemberID,
        name: record.Name,
        trcCode: record.TRCCode,
        reason: record.Reason,
        effectiveDate: record.EffectiveDate
      }));

    // Group rejections by TRC code with member details
    const rejectionsByTRC = {};
    rejectionDetails.forEach(record => {
      if (!rejectionsByTRC[record.trcCode]) {
        rejectionsByTRC[record.trcCode] = {
          count: 0,
          members: [],
          reasons: new Set()
        };
      }
      rejectionsByTRC[record.trcCode].count++;
      rejectionsByTRC[record.trcCode].members.push({
        memberId: record.memberId,
        name: record.name,
        reason: record.reason,
        effectiveDate: record.effectiveDate
      });
      if (record.reason) {
        rejectionsByTRC[record.trcCode].reasons.add(record.reason);
      }
    });

    // TRC code analysis with detailed information
    const trcAnalysis = Object.entries(rejectionsByTRC)
      .map(([code, data]) => ({
        code,
        count: data.count,
        percentage: (data.count / totalRecords) * 100,
        members: data.members,
        reasons: Array.from(data.reasons)
      }))
      .sort((a, b) => b.count - a.count);

    // Get AI recommendations with more context
    const prompt = `As a TRR analysis expert, analyze this healthcare enrollment data and provide specific recommendations:

Total Records Processed: ${totalRecords}
Accepted Enrollments: ${accepted} (${((accepted/totalRecords) * 100).toFixed(1)}%)
Rejected Enrollments: ${rejected} (${((rejected/totalRecords) * 100).toFixed(1)}%)

TRC Code Distribution with Rejection Reasons:
${trcAnalysis.map(trc => `
TRC ${trc.code}: ${trc.count} cases (${trc.percentage.toFixed(1)}%)
Common Reasons: ${trc.reasons.join('; ') || 'No specific reasons provided'}`
).join('\n')}

Based on this detailed analysis:
1. Identify the top 3 critical issues causing rejections
2. Provide specific, actionable recommendations for each major TRC code
3. Suggest process improvements to address the most common rejection reasons
4. Highlight any concerning patterns in the rejection data
5. Recommend preventive measures for the most frequent rejection scenarios

Format your response as clear, numbered recommendations with specific actions for each TRC code.`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are a healthcare enrollment and TRR processing expert. Provide clear, actionable recommendations based on the data analysis. Focus on specific issues and their solutions." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const recommendations = aiResponse.choices[0].message.content
      .split('\n')
      .filter(rec => rec.trim())
      .map(rec => ({
        type: rec.toLowerCase().includes('critical') ? 'error' : 
              rec.toLowerCase().includes('warning') ? 'warning' : 'info',
        message: rec.replace(/^\d+\.\s*/, '')
      }));

    return {
      totalRecords,
      accepted,
      rejected,
      trcAnalysis,
      recommendations,
      summary: {
        acceptanceRate: (accepted/totalRecords) * 100,
        rejectionRate: (rejected/totalRecords) * 100,
        topTRCCodes: trcAnalysis.slice(0, 5)
      },
      rejectionDetails: {
        byTRC: trcAnalysis.map(trc => ({
          trcCode: trc.code,
          count: trc.count,
          percentage: trc.percentage,
          reasons: trc.reasons,
          affectedMembers: trc.members.map(m => ({
            memberId: m.memberId,
            name: m.name,
            reason: m.reason,
            effectiveDate: m.effectiveDate
          }))
        }))
      }
    };

  } catch (error) {
    console.error('Error in analyzeTRRData:', error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
}

// Add this new endpoint
router.post('/member-recommendations', async (req, res) => {
  try {
    const { trcCode, members } = req.body;
    const recommendations = {};

    // Group members by reason to reduce API calls
    const membersByReason = members.reduce((acc, member) => {
      const key = `${member.reason || 'Unknown'}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(member);
      return acc;
    }, {});

    // Generate one recommendation per unique reason
    const prompt = `As a Medicare/Healthcare enrollment specialist, analyze these member rejections for TRC Code ${trcCode}:

${Object.entries(membersByReason).map(([reason, groupMembers]) => `
REJECTION GROUP:
Reason: ${reason}
Affected Members: ${groupMembers.length}
Sample Cases:
${groupMembers.slice(0, 3).map(m => `- Member ${m.name} (ID: ${m.memberId}), Effective Date: ${m.effectiveDate}`).join('\n')}

`).join('\n')}

For each rejection group, provide:
1. Specific eligibility verification steps
2. Required documentation and evidence needed
3. Step-by-step resolution process
4. Timeline considerations
5. Compliance requirements

Focus on Medicare/Healthcare specific procedures and requirements. Include exact forms, systems, or processes needed for resolution.

Format your response using these sections for each reason:
REASON: [Rejection Reason]
• [Detailed recommendations]`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a senior Medicare/Healthcare enrollment specialist with expertise in TRC codes and eligibility requirements. 
          Provide extremely specific, actionable recommendations that reference:
          - Exact Medicare eligibility verification processes
          - Specific documentation requirements
          - CMS guidelines and timeframes
          - Required forms and evidence
          - Systems and tools used for verification
          Start each group with 'REASON:' followed by the exact rejection reason.`
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    // Parse the response and distribute recommendations
    const response = aiResponse.choices[0].message.content;
    const reasonGroups = response.split('REASON:').filter(group => group.trim());

    reasonGroups.forEach(group => {
      const [reason, ...recs] = group.trim().split('\n');
      const reasonKey = reason.trim();
      const recommendationList = recs
        .filter(rec => rec.trim())
        .map(rec => ({
          type: rec.toLowerCase().includes('critical') ? 'error' :
                rec.toLowerCase().includes('warning') ? 'warning' : 'info',
          message: rec.replace(/^[•-]\s*/, '').trim()
        }));

      // Assign recommendations to all members with matching reason
      members.forEach(member => {
        if ((member.reason || 'Unknown').toLowerCase().includes(reasonKey.toLowerCase())) {
          recommendations[member.memberId] = recommendationList;
        }
      });
    });

    // Ensure all members have recommendations
    members.forEach(member => {
      if (!recommendations[member.memberId]) {
        // Assign general recommendations if no specific ones were matched
        recommendations[member.memberId] = [{
          type: 'info',
          message: `For ${member.reason}: Verify eligibility in CMS MARX system, check documentation requirements in Medicare Processing Manual Chapter 2, and submit corrected information through MARx or MCD as appropriate.`
        }];
      }
    });

    res.json({ recommendations });
  } catch (error) {
    console.error('Error generating member recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations',
      details: error.message 
    });
  }
});

module.exports = router; 