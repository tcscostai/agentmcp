const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Set up multer for file uploads
const uploadsDir = path.resolve(path.join(__dirname, '../../uploads'));

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory at:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ 
  dest: uploadsDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'), false);
    }
    cb(null, true);
  }
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/story', async (req, res) => {
  try {
    const { requirements, persona, figmaJson, documentText } = req.body;

    if (!requirements && !documentText) {
      return res.status(400).json({
        success: false,
        error: 'Requirements or document text is required'
      });
    }

    console.log('Generating story for requirements:', requirements);
    console.log('Using persona:', persona || 'default');
    console.log('Figma JSON provided:', !!figmaJson);
    console.log('Document text provided:', !!documentText);

    // Extract screen information from Figma JSON if provided
    let screenInfo = '';
    if (figmaJson) {
      const screenNames = [];
      const screenFlows = new Map();

      function extractScreenInfo(obj, parentName = null) {
        if (obj && typeof obj === 'object') {
          if (obj.name && obj.type === 'FRAME') {
            screenNames.push(obj.name);
            if (parentName) {
              if (!screenFlows.has(parentName)) {
                screenFlows.set(parentName, []);
              }
              screenFlows.get(parentName).push(obj.name);
            }
          }
          if (Array.isArray(obj.children)) {
            obj.children.forEach(child => extractScreenInfo(child, obj.name));
          }
        }
      }

      extractScreenInfo(figmaJson);

      if (screenNames.length > 0) {
        screenInfo = `
          Screens identified: ${screenNames.join(', ')}
          Navigation flows:
          ${Array.from(screenFlows.entries())
            .map(([from, to]) => `${from} → ${to.join(', ')}`)
            .join('\n')}
        `;
      }
    }

    // Adjust the prompt based on the persona if provided
    let personaContext = '';
    if (persona === 'endUser') {
      personaContext = 'Focus on how this feature benefits the end user. Use language that emphasizes user outcomes and experience.';
    } else if (persona === 'businessStakeholder') {
      personaContext = 'Focus on business value and outcomes. Use language that emphasizes ROI, efficiency, and strategic alignment.';
    } else if (persona === 'developer') {
      personaContext = 'Focus on technical implementation details. Use language that addresses technical feasibility and integration.';
    }

    const prompt = `
      Generate a user story based on these requirements:
      ${requirements || ''}

      ${documentText ? `Additional context from document:\n${documentText}` : ''}

      ${screenInfo ? `Screen and navigation information:\n${screenInfo}` : ''}

      ${personaContext}

      Respond with a JSON object that strictly follows this format (no additional text, just the JSON):
      {
        "summary": "A brief one-line summary of the story",
        "description": "Detailed description of the story",
        "acceptanceCriteria": ["List of acceptance criteria"],
        "priority": "Medium",
        "storyPoints": 3,
        "screenFlows": [
          {
            "from": "Screen name",
            "to": "Screen name",
            "action": "User action that triggers this navigation"
          }
        ]
      }

      Make sure the story follows INVEST principles:
      - Independent
      - Negotiable
      - Valuable
      - Estimable
      - Small
      - Testable

      If screen flows are provided, include them in the acceptance criteria and ensure the story covers the complete user journey.

      Remember to return ONLY the JSON object, no other text.
    `;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert agile product owner who writes clear, concise user stories. Always respond with valid JSON only, no additional text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    let storyData;
    try {
      // Extract JSON from the response
      const jsonString = completion.choices[0].message.content.trim();
      storyData = JSON.parse(jsonString);
      
      // Validate required fields
      if (!storyData.summary || !storyData.description || !Array.isArray(storyData.acceptanceCriteria)) {
        throw new Error('Invalid story format');
      }

      // Ensure screenFlows is always an array
      if (!storyData.screenFlows) {
        storyData.screenFlows = [];
      }
    } catch (parseError) {
      console.error('Failed to parse story data:', parseError);
      console.log('Raw response:', completion.choices[0].message.content);
      throw new Error('Failed to generate valid story format');
    }

    console.log('Generated story:', storyData);

    res.json({
      success: true,
      ...storyData
    });

  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate story'
    });
  }
});

// PDF Extraction route
router.post('/extract-pdf', upload.single('file'), async (req, res) => {
  console.log('Received PDF extraction request');
  
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  console.log('File path:', req.file.path);
  
  try {
    // Read the PDF file
    const dataBuffer = fs.readFileSync(req.file.path);
    
    // Parse the PDF
    const data = await pdfParse(dataBuffer);
    
    // Clean up - delete the uploaded file
    try {
      fs.unlinkSync(req.file.path);
    } catch (unlinkError) {
      console.error('Error deleting file:', unlinkError);
    }
    
    // Send the extracted text
    res.json({ 
      success: true, 
      text: data.text
    });
  } catch (error) {
    console.error('Error extracting PDF:', error);
    
    // Clean up - delete the uploaded file even if extraction failed
    try {
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
    } catch (unlinkError) {
      console.error('Error deleting file:', unlinkError);
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to extract text from PDF'
    });
  }
});

// Figma JSON generation route
router.post('/figma-json', async (req, res) => {
  try {
    const { requirements, documentText, userStory } = req.body;
    if (!requirements && !documentText) {
      return res.status(400).json({ success: false, error: 'Requirements or documentText are required' });
    }
    // Compose a prompt for Figma JSON
    const prompt = `
      Based on the following requirements and user story, generate a Figma-compatible JSON for a UI prototype. 
      Requirements: ${requirements || ''}
      Document Text: ${documentText || ''}
      User Story: ${JSON.stringify(userStory)}
      Respond with a JSON object that represents a simple Figma document (frames, layers, text, etc). Return ONLY the JSON, no extra text.
    `;
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert Figma plugin that generates valid Figma JSON for UI prototypes. Always respond with valid JSON only, no extra text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5
    });
    let figmaJson;
    try {
      const jsonString = completion.choices[0].message.content.trim();
      figmaJson = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse Figma JSON:', parseError);
      return res.status(500).json({ success: false, error: 'Failed to generate valid Figma JSON' });
    }
    res.json({ success: true, json: figmaJson });
  } catch (error) {
    console.error('Figma JSON generation error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate Figma JSON' });
  }
});

// Figma Preview route using DALL·E
router.post('/figma-preview', async (req, res) => {
  try {
    const { figmaJson, requirements, documentText, userStory } = req.body;
    // Summarize the Figma JSON for prompt
    const screenNames = [];
    function extractNames(obj) {
      if (obj && typeof obj === 'object') {
        if (obj.name) screenNames.push(obj.name);
        if (Array.isArray(obj.children)) obj.children.forEach(extractNames);
      }
    }
    extractNames(figmaJson);

    const summary = userStory?.summary || '';
    const description = userStory?.description || '';
    const screens = screenNames.length ? `Screens/components: ${screenNames.join(', ')}` : '';

    // Use GPT-4 to generate a DALL·E prompt
    const gptPrompt = `
      You are an expert UI designer. Write a detailed prompt for an AI image generator to create a screenshot of a modern React JS web application. 
      The app should look like a real React/Material UI app, with clean buttons, text fields, and layout. 
      Use the following context:
      - User story: ${summary}. ${description}
      - Requirements: ${requirements || ''}
      - Document text: ${documentText || ''}
      - ${screens}
      Focus on a clean, modern, professional look. The image should look like a real app screenshot, not a drawing or wireframe.
      Only output the prompt for the image generator.
    `;

    const gptResponse = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: gptPrompt }
      ],
      temperature: 0.5
    });

    let dallePrompt = gptResponse.choices[0].message.content.trim();
    dallePrompt = dallePrompt.slice(0, 1000); // Ensure it's within DALL·E's limit

    const dalleResponse = await openai.images.generate({
      prompt: dallePrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url'
    });

    const imageUrl = dalleResponse.data[0].url;
    res.json({ success: true, previewUrl: imageUrl, dallePrompt });
  } catch (error) {
    console.error('Vision/DALL·E image generation error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate preview' });
  }
});

module.exports = router; 