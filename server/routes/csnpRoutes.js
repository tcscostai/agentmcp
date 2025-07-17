const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const { OpenAI } = require('openai');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "healthcare";
const COLLECTION_NAME = "csnp_applications";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const planRecommendationsCache = new Map();

const calculateAge = (birthDate) => {
  const dob = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
};

router.post('/verify', async (req, res) => {
  try {
    const { applicationNumber, medicareId, conditions, applicant, effectiveDate } = req.body;
    console.log('Verifying eligibility:', { applicationNumber, medicareId, conditions });

    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    
    // Find the application
    const application = await db.collection(COLLECTION_NAME).findOne({ 
      applicationNumber: applicationNumber 
    });

    if (!application) {
      return res.status(404).json({
        error: 'Application not found',
        details: `No record found with application number: ${applicationNumber}`
      });
    }

    // Perform eligibility checks
    const checks = {
      age: calculateAge(applicant.dateOfBirth) >= 65,
      medicareStatus: application.eligibilityStatus.medicareEligible,
      chronicCondition: conditions.some(c => 
        ['Diabetes Type 2', 'Chronic Heart Failure', 'COPD', 'Hypertension'].includes(c.name)
      ),
      documents: Object.values(application.documents).every(doc => doc.verified === true)
    };

    const eligible = Object.values(checks).every(check => check === true);

    // Return detailed eligibility results
    res.json({
      success: true,
      eligible,
      checks,
      details: {
        applicant: application.applicant,
        chronicConditions: conditions,
        effectiveDate,
        verificationDate: new Date().toISOString()
      },
      nextSteps: eligible ? [
        'Complete CSNP Application',
        'Review Provider Network',
        'Schedule Welcome Call',
        'Process Enrollment'
      ] : [
        'Review Eligibility Requirements',
        'Submit Additional Documentation',
        'Contact Medicare Support'
      ]
    });

  } catch (error) {
    console.error('Eligibility verification error:', error);
    res.status(500).json({
      error: 'Failed to verify eligibility',
      details: error.message
    });
  }
});

// Helper function to validate chronic conditions
function isValidChronicCondition(condition) {
  const validConditions = [
    "Diabetes Type 2",
    "Chronic Heart Failure",
    "COPD",
    "Hypertension"
  ];
  return validConditions.includes(condition);
}

// Search members
router.get('/search', async (req, res) => {
  try {
    const { query, condition, status } = req.query;
    console.log('Search request received:', { query, condition, status });

    const client = await MongoClient.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Build search criteria
    const searchCriteria = {};
    if (query) {
      searchCriteria.$or = [
        { memberId: new RegExp(query, 'i') },
        { name: new RegExp(query, 'i') },
        { 'primaryCareProvider.name': new RegExp(query, 'i') }
      ];
    }
    if (condition) {
      searchCriteria.chronicConditions = condition;
    }
    if (status) {
      searchCriteria.enrollmentStatus = status;
    }

    console.log('Search criteria:', searchCriteria);

    const members = await collection.find(searchCriteria).limit(20).toArray();

    // Process members to ensure correct document verification status
    const processedMembers = members.map(member => ({
      ...member,
      eligibilityDocuments: member.eligibilityDocuments.map(doc => ({
        ...doc,
        verified: doc.verified === true // Force boolean evaluation
      }))
    }));

    console.log('Search results:', processedMembers.map(member => ({
      memberId: member.memberId,
      name: member.name,
      documents: member.eligibilityDocuments.map(doc => ({
        type: doc.type,
        verified: doc.verified
      }))
    })));

    res.json({
      success: true,
      count: processedMembers.length,
      members: processedMembers
    });

  } catch (error) {
    console.error('CSNP search error:', error);
    res.status(500).json({
      error: 'Failed to search members',
      details: error.message
    });
  }
});

// Get member details
router.get('/member/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    console.log('Fetching member details for:', memberId);

    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const member = await collection.findOne({ memberId });
    if (!member) {
      console.log('Member not found:', memberId);
      return res.status(404).json({
        error: 'Member not found'
      });
    }

    // Ensure document verification status is explicitly boolean
    const processedMember = {
      ...member,
      eligibilityDocuments: member.eligibilityDocuments.map(doc => ({
        ...doc,
        verified: doc.verified === true // Force boolean evaluation
      }))
    };

    console.log('Sending member data:', {
      memberId: processedMember.memberId,
      name: processedMember.name,
      documents: processedMember.eligibilityDocuments.map(doc => ({
        type: doc.type,
        verified: doc.verified
      }))
    });

    res.json({
      success: true,
      member: processedMember
    });

  } catch (error) {
    console.error('CSNP member fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch member details',
      details: error.message
    });
  }
});

// Update member information
router.put('/member/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const updates = req.body;
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.memberId;
    updates.updatedAt = new Date();

    const result = await collection.updateOne(
      { memberId },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: 'Member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member updated successfully'
    });

  } catch (error) {
    console.error('CSNP member update error:', error);
    res.status(500).json({
      error: 'Failed to update member',
      details: error.message
    });
  }
});

// Generate enrollment report
router.get('/reports/enrollment', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const dateRange = {
      createdAt: {
        $gte: new Date(startDate || '2000-01-01'),
        $lte: new Date(endDate || new Date())
      }
    };

    const [enrollmentStats, conditionStats] = await Promise.all([
      // Get enrollment status statistics
      collection.aggregate([
        { $match: dateRange },
        {
          $group: {
            _id: '$enrollmentStatus',
            count: { $sum: 1 }
          }
        }
      ]).toArray(),

      // Get chronic condition statistics
      collection.aggregate([
        { $match: dateRange },
        { $unwind: '$chronicConditions' },
        {
          $group: {
            _id: '$chronicConditions',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]).toArray()
    ]);

    res.json({
      success: true,
      enrollmentStats: enrollmentStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      conditionStats: conditionStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    });

  } catch (error) {
    console.error('CSNP report generation error:', error);
    res.status(500).json({
      error: 'Failed to generate report',
      details: error.message
    });
  }
});

// Provider outreach endpoint
router.post('/provider-outreach', async (req, res) => {
  try {
    const { memberId, missingFields, provider } = req.body;
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Generate provider message using OpenAI
    const prompt = `
    Generate a professional healthcare provider outreach message requesting the following missing information for patient ${memberId}:
    Missing fields: ${missingFields.join(', ')}
    Provider: ${provider.name} at ${provider.clinic}
    
    The message should:
    1. Be professional and concise
    2. Specify exactly what information is needed
    3. Include any relevant regulatory requirements
    4. Provide a clear deadline
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a healthcare administrative coordinator." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const outreachMessage = completion.choices[0].message.content;

    // Update member record: mark documents as verified and save outreach record
    const updateResult = await collection.updateOne(
      { memberId },
      { 
        $push: { 
          providerOutreach: {
            date: new Date(),
            message: outreachMessage,
            status: 'completed',
            missingFields
          }
        },
        $set: {
          // Mark eligibility documents as verified
          'eligibilityDocuments.$[].verified': true,
          updatedAt: new Date(),
          lastVerificationDate: new Date()
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      throw new Error('Member not found');
    }

    // Fetch updated member data
    const updatedMember = await collection.findOne({ memberId });

    res.json({
      success: true,
      message: outreachMessage,
      provider,
      missingFields,
      member: updatedMember
    });

  } catch (error) {
    console.error('Provider outreach error:', error);
    res.status(500).json({
      error: 'Failed to process provider outreach',
      details: error.message
    });
  }
});

// Auto-populate missing data endpoint
router.post('/auto-populate', async (req, res) => {
  try {
    const { memberId, missingFields, providerResponse } = req.body;
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const member = await collection.findOne({ memberId });

    // Use OpenAI to analyze and populate missing data
    const prompt = `
    Based on the following information about a CSNP member, suggest likely values for missing fields:
    
    Member Profile:
    - Age: ${calculateAge(member.dateOfBirth)}
    - Known Conditions: ${member.chronicConditions?.join(', ')}
    - Known Medications: ${member.medications?.join(', ')}
    
    Missing Fields: ${missingFields.join(', ')}
    Provider Response: ${providerResponse?.message || 'No response yet'}
    
    Provide likely values for each missing field based on typical patterns for similar patients.
    Format the response as JSON.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a healthcare data analyst with expertise in CSNP enrollment." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const suggestedData = JSON.parse(completion.choices[0].message.content);

    // Update member record with suggested data
    await collection.updateOne(
      { memberId },
      { 
        $set: {
          ...suggestedData,
          lastUpdated: new Date(),
          dataSource: 'AI_SUGGESTED'
        }
      }
    );

    res.json({
      success: true,
      populatedData: suggestedData
    });

  } catch (error) {
    console.error('Auto-populate error:', error);
    res.status(500).json({
      error: 'Failed to auto-populate data',
      details: error.message
    });
  }
});

// Add default plans function
const getDefaultPlans = (condition) => {
  return [
    {
      name: `${condition} Basic Care Plan`,
      coverageLevel: "Basic",
      specializedBenefits: [
        `${condition} specialist visits`,
        "Basic medical equipment coverage",
        "Preventive care services",
        "Prescription drug coverage",
        "Care coordination services",
        "24/7 nurse hotline"
      ],
      coverageDetails: {
        primaryCare: "$10 copay",
        specialists: "$45 copay",
        hospitalStays: "$300 per day for first 5 days",
        prescriptionDrugs: "Tiered copays starting at $0"
      },
      bestFor: `Patients newly diagnosed with ${condition}`,
      starRating: "4.0"
    },
    {
      name: `${condition} Standard Plus`,
      coverageLevel: "Standard",
      specializedBenefits: [
        `Enhanced ${condition} management`,
        "Expanded medical equipment coverage",
        "Wellness programs",
        "Telehealth services",
        "Medication therapy management",
        "Health coaching"
      ],
      coverageDetails: {
        primaryCare: "$5 copay",
        specialists: "$35 copay",
        hospitalStays: "$250 per day for first 5 days",
        prescriptionDrugs: "Preferred drug coverage"
      },
      bestFor: `${condition} patients seeking balanced coverage`,
      starRating: "4.2"
    },
    {
      name: `${condition} Enhanced Care`,
      coverageLevel: "Enhanced",
      specializedBenefits: [
        "Comprehensive condition management",
        "Full equipment coverage",
        "Home health services",
        "Transportation benefits",
        "Nutrition counseling",
        "Fitness programs"
      ],
      coverageDetails: {
        primaryCare: "$0 copay",
        specialists: "$20 copay",
        hospitalStays: "$200 per day for first 5 days",
        prescriptionDrugs: "Enhanced drug coverage"
      },
      bestFor: `${condition} patients needing additional support`,
      starRating: "4.5"
    },
    {
      name: `${condition} Premium Choice`,
      coverageLevel: "Premium",
      specializedBenefits: [
        "Advanced condition management",
        "Premium equipment coverage",
        "Extended home health",
        "Comprehensive wellness",
        "Alternative therapies",
        "Personal health advocate"
      ],
      coverageDetails: {
        primaryCare: "$0 copay",
        specialists: "$10 copay",
        hospitalStays: "$150 per day for first 5 days",
        prescriptionDrugs: "Premium drug coverage"
      },
      bestFor: `${condition} patients wanting comprehensive coverage`,
      starRating: "4.7"
    },
    {
      name: `${condition} Elite Care`,
      coverageLevel: "Elite",
      specializedBenefits: [
        "Elite condition management",
        "Complete equipment coverage",
        "Unlimited home health",
        "Concierge services",
        "Global coverage",
        "VIP medical support"
      ],
      coverageDetails: {
        primaryCare: "$0 copay",
        specialists: "$0 copay",
        hospitalStays: "$100 per day for first 5 days",
        prescriptionDrugs: "Elite drug coverage"
      },
      bestFor: `${condition} patients seeking premium benefits`,
      starRating: "5.0"
    }
  ];
};

// Update the recommend-plans endpoint
router.post('/recommend-plans', async (req, res) => {
  try {
    const { memberId, applicationNumber, conditions, medications } = req.body;
    console.log('Starting plan recommendations for:', { conditions, applicationNumber });

    // Check cache first
    const cacheKey = `${conditions}-${applicationNumber}`;
    if (planRecommendationsCache.has(cacheKey)) {
      console.log('Returning cached recommendations');
      return res.json({
        success: true,
        recommendations: planRecommendationsCache.get(cacheKey)
      });
    }

    // Validate input
    if (!conditions) {
      throw new Error('Chronic condition is required');
    }

    // Try OpenAI first
    try {
      const prompt = `
      Generate a single JSON object containing exactly 5 Medicare Advantage CSNP plans for ${conditions}. 
      Return ONLY the JSON object in this EXACT format:
      {
        "recommendations": [
          {
            "name": "Plan name focused on ${conditions}",
            "coverageLevel": "One of: Basic/Standard/Enhanced/Premium/Elite",
            "specializedBenefits": [
              "6 specific benefits for ${conditions}"
            ],
            "coverageDetails": {
              "primaryCare": "Copay details",
              "specialists": "Specialist coverage",
              "hospitalStays": "Hospital coverage",
              "prescriptionDrugs": "Drug coverage"
            },
            "bestFor": "Target patient profile",
            "starRating": "4.0-5.0"
          }
        ]
      }
      Include EXACTLY 5 plans in the recommendations array. Do not include any text before or after the JSON object.
      `;

      console.log('Sending request to OpenAI...');
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a Medicare Advantage specialist. Return ONLY a valid JSON object containing exactly 5 unique CSNP plans."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
        presence_penalty: 0.1,
        frequency_penalty: 0.2
      });

      const rawResponse = completion.choices[0].message.content.trim();
      const recommendations = JSON.parse(rawResponse);

      if (recommendations?.recommendations?.length === 5) {
        // Cache the successful response
        planRecommendationsCache.set(cacheKey, recommendations.recommendations);
        
        return res.json({
          success: true,
          recommendations: recommendations.recommendations
        });
      }
    } catch (error) {
      console.error('OpenAI error:', error);
    }

    // Fallback to default plans if OpenAI fails
    console.log('Using default plans');
    const defaultPlans = getDefaultPlans(conditions);
    
    // Cache the default plans
    planRecommendationsCache.set(cacheKey, defaultPlans);

    res.json({
      success: true,
      recommendations: defaultPlans
    });

  } catch (error) {
    console.error('Plan recommendations error:', error);
    res.status(500).json({
      error: 'Failed to generate plan recommendations',
      details: error.message
    });
  }
});

// Add this new endpoint to reset Ruth's document status
router.post('/reset-test-data', async (req, res) => {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Reset Ruth's document verification status
    const result = await collection.updateOne(
      { memberId: 'CSNP749117' },
      {
        $set: {
          eligibilityDocuments: [
            {
              type: 'Medicare Card',
              verified: false,
              expirationDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000) // 2 years from now
            },
            {
              type: 'Medical Records',
              verified: false,
              lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
            }
          ],
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: 'Test member not found'
      });
    }

    // Verify the update
    const updatedMember = await collection.findOne({ memberId: 'CSNP749117' });
    console.log('Reset test data:', {
      memberId: updatedMember.memberId,
      name: updatedMember.name,
      documents: updatedMember.eligibilityDocuments
    });

    res.json({
      success: true,
      message: 'Test data reset successfully',
      member: updatedMember
    });

  } catch (error) {
    console.error('Reset test data error:', error);
    res.status(500).json({
      error: 'Failed to reset test data',
      details: error.message
    });
  }
});

// Update the application lookup route
router.get('/application/:appNumber', async (req, res) => {
  try {
    const { appNumber } = req.params;
    console.log('Looking up application:', appNumber); // Debug log
    
    // Clean the application number
    const cleanedAppNumber = appNumber.trim().toUpperCase();
    
    // Validate application number format
    if (!cleanedAppNumber.match(/^APP-\d{4}-\d{4}$/)) {
      console.log('Invalid format:', cleanedAppNumber); // Debug log
      return res.status(400).json({
        error: 'Invalid application number format',
        details: 'Application number should be in format APP-YYYY-NNNN'
      });
    }

    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection('csnp_applications');
    
    // Add debug log for the query
    console.log('Searching for application with number:', cleanedAppNumber);
    
    const application = await collection.findOne({ 
      applicationNumber: cleanedAppNumber
    });
    
    console.log('Found application:', application); // Debug log

    if (!application) {
      return res.status(404).json({
        error: 'Application not found',
        details: `No application found with number: ${cleanedAppNumber}`
      });
    }

    res.json({
      success: true,
      application
    });

  } catch (error) {
    console.error('Application lookup error:', error);
    res.status(500).json({
      error: 'Failed to lookup application',
      details: error.message
    });
  }
});

// Update the AI assist route
router.post('/ai-assist', async (req, res) => {
  try {
    const { applicationNumber, application, message, context } = req.body;
    console.log('AI Assist request:', { applicationNumber, context });

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Update the prompt in the AI assist route
    const prompt = `
      You are a healthcare enrollment assistant. Analyze this CSNP application and provide a structured response following this exact format:

      === Application Analysis for ${application.applicant.firstName} ${application.applicant.lastName} ===
      Application Number: ${applicationNumber}

      📋 Document Verification:
      • Medicare ID (${application.medicareId}):
        ✓/✗ Format Check
        ✓/✗ Validation Status
      
      🏥 Eligibility Checks:
      • Chronic Condition: ${application.chronicCondition}
        ✓/✗ Condition Verification
        ✓/✗ Supporting Documentation
      
      📄 Required Documentation:
      • Medicare Card: ✓/✗
      • ID Verification: ✓/✗
      • Medical Records: ✓/✗
      
      👤 Applicant Information:
      • Age Verification: ✓/✗
      • Contact Details: ✓/✗
      • Address Verification: ✓/✗

      🚨 Action Items:
      [List only if there are issues to address]
      
      💡 Plan Recommendations:
      Based on your ${application.chronicCondition}, here are specialized features:
      • [List 3-4 key benefits]
      
      ⏭️ Next Steps:
      [Either list corrective actions or confirmation to proceed]

      Note: Use only ✓ for passed checks and ✗ for failed checks. Format each section clearly with bullet points and maintain consistent spacing.
    `;

    // Update the system message
    const systemMessage = {
      role: "system",
      content: `You are a precise and organized healthcare enrollment assistant. 
      - Use clear section headers with emojis
      - Present information in bulleted lists
      - Use checkmarks (✓) and X marks (✗) consistently
      - Keep responses structured and easy to scan
      - Highlight action items clearly
      - End with clear next steps`
    };

    // Update the completion parameters
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        systemMessage,
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent formatting
      max_tokens: 800
    });

    // Process the response
    const aiResponse = completion.choices[0].message.content;
    
    // Perform validation checks
    const validationResults = {
      isValid: true,
      issues: [],
      recommendations: []
    };

    // Standard checks
    const checks = [
      {
        condition: /^[1-9][A-Z0-9]{2}\d-[A-Z0-9]{2}\d-[A-Z0-9]{2}\d{2}$/.test(application.medicareId),
        issue: "Invalid Medicare ID format",
        recommendation: "Please verify the Medicare ID follows the format: 1AA1-AA1-AA11"
      },
      {
        condition: ["Diabetes Type 2", "Chronic Heart Failure", "COPD", "Hypertension"].includes(application.chronicCondition),
        issue: "Invalid chronic condition",
        recommendation: "Please select a valid chronic condition from the approved list"
      },
      {
        condition: application.documents?.medicareCard,
        issue: "Missing Medicare card documentation",
        recommendation: "Please upload a copy of the Medicare card"
      }
    ];

    checks.forEach(check => {
      if (!check.condition) {
        validationResults.isValid = false;
        validationResults.issues.push(check.issue);
        validationResults.recommendations.push(check.recommendation);
      }
    });

    res.json({
      success: true,
      response: aiResponse,
      validationResults,
      canProceed: validationResults.isValid
    });

  } catch (error) {
    console.error('AI Assist error:', error);
    res.status(500).json({
      error: 'Failed to process AI assistance request',
      details: error.message
    });
  }
});

// Update the final review endpoint to handle missing eligibilityResults
router.post('/final-review', async (req, res) => {
  try {
    const { applicationNumber, medicareId, chronicCondition, applicant, eligibilityResults = {} } = req.body;

    const prompt = `
    Generate a comprehensive final review for a CSNP application with the following details:

    Application Number: ${applicationNumber}
    Medicare ID: ${medicareId}
    Chronic Condition: ${chronicCondition}
    Applicant: ${applicant.firstName} ${applicant.lastName}
    Eligibility Status: ${eligibilityResults?.eligible ? 'Eligible' : 'Pending Review'}

    Please provide a detailed review in this format:
    {
      "summary": "A comprehensive paragraph summarizing the application and condition management needs",
      "observations": [
        "List 4-5 key observations about the application, condition management, and care needs"
      ],
      "recommendations": [
        "List 3-4 specific recommendations for the applicant's care management"
      ]
    }

    Focus on:
    1. Condition management needs
    2. Care coordination opportunities
    3. Support services required
    4. Monitoring needs
    5. Next steps
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a thorough CSNP application reviewer providing detailed analysis and recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const review = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Final review error:', error);
    res.status(500).json({
      error: 'Failed to generate final review',
      details: error.message
    });
  }
});

// Add analyze-application endpoint
router.post('/analyze-application', async (req, res) => {
  try {
    const { applicationNumber, medicareId, chronicCondition, applicant } = req.body;

    const prompt = `
    Analyze this CSNP application for ${chronicCondition}:

    Applicant: ${applicant.firstName} ${applicant.lastName}
    Medicare ID: ${medicareId}
    Application Number: ${applicationNumber}

    Please provide a detailed analysis in this format:
    {
      "summary": "A brief overview of the condition and its management requirements",
      "keyPoints": [
        "4-5 key points about managing ${chronicCondition}",
        "Include specific care coordination needs",
        "Mention typical treatment approaches",
        "Discuss lifestyle modifications"
      ]
    }

    Focus on:
    1. Condition management strategies
    2. Common complications
    3. Required monitoring
    4. Lifestyle modifications
    5. Support services needed
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a CSNP healthcare specialist providing detailed condition analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    res.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Application analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze application',
      details: error.message
    });
  }
});

// Update the search application route
router.post('/search-application', async (req, res) => {
  try {
    const { searchType, value } = req.body;
    
    console.log('Searching application:', { searchType, value });
    
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    let query;
    if (searchType === 'web') {
      query = { applicationNumber: value };
    } else {
      query = { 'applicant.email': value };
    }

    console.log('MongoDB query:', query);

    const application = await collection.findOne(query);
    console.log('Found application:', application);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: `Application not found. Please verify the ${searchType === 'web' ? 'application number' : 'email address'}.`
      });
    }

    res.json({ 
      success: true,
      message: `Application found successfully: ${application.applicationNumber} for ${application.applicant.firstName} ${application.applicant.lastName}`,
      application,
      summary: {
        applicantName: `${application.applicant.firstName} ${application.applicant.lastName}`,
        applicationNumber: application.applicationNumber,
        submissionDate: application.submissionDate,
        status: application.status
      }
    });

  } catch (error) {
    console.error('Application search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search application',
      details: error.message
    });
  }
});

// Update the validate-application endpoint
router.post('/validate-application', async (req, res) => {
  try {
    const { application } = req.body;

    console.log('Validating application:', application);

    const systemPrompt = {
      role: "system",
      content: `You are a CSNP application validator. Analyze the application and respond with a JSON structure.
      Format your response exactly like this, replacing the values appropriately:
      {
        "medicareEligible": true/false,
        "conditionsValid": true/false,
        "documentsComplete": true/false,
        "dataComplete": true/false,
        "missingFields": [],
        "recommendation": "your recommendation here"
      }`
    };

    const userPrompt = {
      role: "user",
      content: `Analyze this CSNP application: ${JSON.stringify({
        applicationNumber: application.applicationNumber,
        medicareId: application.medicareId,
        conditions: application.chronicConditions,
        applicant: application.applicant,
        effectiveDate: application.effectiveDate
      })}`
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [systemPrompt, userPrompt],
      temperature: 0,
      max_tokens: 1000
    });

    let analysis;
    try {
      const responseContent = completion.choices[0].message.content;
      // Find the JSON object in the response
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      analysis = JSON.parse(jsonMatch[0]);
      
      const requiredFields = [
        'medicareEligible',
        'conditionsValid',
        'documentsComplete',
        'dataComplete',
        'missingFields',
        'recommendation'
      ];

      const missingFields = requiredFields.filter(field => !(field in analysis));
      if (missingFields.length > 0) {
        throw new Error(`Invalid response structure. Missing fields: ${missingFields.join(', ')}`);
      }

    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Raw response:', completion.choices[0].message.content);
      throw new Error('Failed to parse application analysis results');
    }

    const canProceed = 
      analysis.medicareEligible && 
      analysis.conditionsValid && 
      analysis.documentsComplete && 
      analysis.dataComplete;

    res.json({
      success: true,
      message: `Application ${application.applicationNumber} for ${application.applicant.firstName} ${application.applicant.lastName} has been ${canProceed ? 'successfully validated and is eligible to proceed' : 'validated but has some issues that need attention'}`,
      analysis: {
        ...analysis,
        canProceedToEligibility: canProceed
      },
      applicationDetails: {
        applicantName: `${application.applicant.firstName} ${application.applicant.lastName}`,
        applicationNumber: application.applicationNumber,
        submissionDate: new Date().toISOString(),
        status: canProceed ? 'Ready for Eligibility Check' : 'Needs Review'
      }
    });

  } catch (error) {
    console.error('Application validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate application',
      details: error.message,
      type: error.name
    });
  }
});

// Update the agents endpoint
router.get('/agents', async (req, res) => {
  try {
    // Define the default agents
    const agents = {
      sdlc: [
        {
          id: 'requirements-analyzer',
          name: 'Requirements Analyzer',
          type: 'SDLC',
          description: 'Analyzes and validates user story requirements',
          capabilities: ['Story Analysis', 'Requirements Validation', 'Acceptance Criteria Review']
        },
        {
          id: 'integration-test-designer',
          name: 'Integration Test Designer',
          type: 'SDLC',
          description: 'Designs integration test cases',
          capabilities: ['Test Case Generation', 'API Testing', 'End-to-End Testing']
        },
        {
          id: 'workflow-designer',
          name: 'Workflow Designer',
          type: 'SDLC',
          description: 'Creates and manages workflows',
          capabilities: ['Workflow Creation', 'Process Optimization', 'Task Automation']
        }
      ],
      rag: [],
      workflow: []
    };

    // Log the agents being sent
    console.log('Sending agents:', JSON.stringify(agents, null, 2));
    
    // Send the response
    return res.json(agents);
  } catch (error) {
    console.error('Error in /agents endpoint:', error);
    return res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// Update the stories endpoint
router.get('/stories', async (req, res) => {
  try {
    const auth = Buffer.from(
      `${process.env.JIRA_USERNAME}:${process.env.JIRA_TOKEN}`
    ).toString('base64');

    // Use the exact project key from your Jira
    const projectKey = 'SCRUM';
    console.log('Using Jira project:', projectKey);

    // Use the exact same JQL query that works in User Story Generator
    const jqlQuery = `project=${projectKey} ORDER BY created DESC`;
    const url = `${process.env.JIRA_URL}/rest/api/2/search?jql=${encodeURIComponent(jqlQuery)}&fields=summary,description,status,issuetype,priority,assignee&maxResults=50`;
    
    console.log('Fetching Jira stories from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Jira API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw Jira response:', data);

    // Format the response data exactly as expected by the UI
    const formattedIssues = data.issues.map(issue => ({
      id: issue.id,
      key: issue.key,
      fields: {
        summary: issue.fields.summary || '',
        description: issue.fields.description || '',
        status: {
          name: issue.fields.status?.name || 'Open'
        },
        issuetype: {
          name: issue.fields.issuetype?.name || 'Story'
        },
        priority: issue.fields.priority || null,
        assignee: issue.fields.assignee || null
      }
    }));

    console.log('Sending formatted stories:', formattedIssues);

    res.json({
      success: true,
      issues: formattedIssues,
      total: formattedIssues.length
    });

  } catch (error) {
    console.error('Error fetching Jira stories:', error);
    res.status(500).json({
      error: 'Failed to fetch Jira stories',
      details: error.message
    });
  }
});

// Update the analyze story endpoint
router.post('/analyze/story', async (req, res) => {
  try {
    const { story } = req.body;
    
    if (!story?.fields?.summary) {
      throw new Error('Invalid story data - missing required fields');
    }

    const prompt = `
    Analyze this user story:
    Key: ${story.key}
    Summary: ${story.fields.summary}
    Description: ${story.fields.description || 'No description provided'}
    Type: ${story.fields.issuetype?.name || 'Story'}
    Status: ${story.fields.status || 'Open'}

    Provide a JSON response with this exact structure:
    {
      "completenessScore": 85,
      "findings": [
        {"type": "success", "message": "Clear title"},
        {"type": "warning", "message": "Missing acceptance criteria"}
      ],
      "suggestions": [
        {"title": "Add Criteria", "description": "Include acceptance criteria"}
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a requirements analyst. Return only valid JSON matching the example structure."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
    });

    // Extract and validate JSON from the response
    let analysis;
    try {
      analysis = JSON.parse(completion.choices[0].message.content);
      
      // Validate required fields
      if (!analysis.completenessScore || !Array.isArray(analysis.findings)) {
        throw new Error('Invalid analysis format');
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Failed to generate valid analysis');
    }

    res.json({
      success: true,
      analysis: {
        completenessScore: analysis.completenessScore,
        findings: analysis.findings,
        suggestions: analysis.suggestions || []
      }
    });

  } catch (error) {
    console.error('Story analysis error:', error);
    res.status(400).json({
      error: 'Analysis failed',
      details: error.message
    });
  }
});

// Add these endpoints
router.get('/jira/projects', async (req, res) => {
  try {
    const auth = Buffer.from(
      `${process.env.JIRA_USERNAME}:${process.env.JIRA_TOKEN}`
    ).toString('base64');

    const response = await fetch(`${process.env.JIRA_URL}/rest/api/2/project`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Jira projects:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching Jira projects:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/jira/project/:projectKey/stories', async (req, res) => {
  try {
    const { projectKey } = req.params;
    const auth = Buffer.from(
      `${process.env.JIRA_USERNAME}:${process.env.JIRA_TOKEN}`
    ).toString('base64');

    const jqlQuery = `project=${projectKey} ORDER BY created DESC`;
    const url = `${process.env.JIRA_URL}/rest/api/2/search?jql=${encodeURIComponent(jqlQuery)}&fields=summary,description,status,issuetype&maxResults=50`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    console.log(`Stories for project ${projectKey}:`, data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching project stories:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 