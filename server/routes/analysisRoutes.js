const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Get Jira stories
router.get('/stories', async (req, res) => {
  try {
    const auth = Buffer.from(
      `${process.env.JIRA_USERNAME}:${process.env.JIRA_TOKEN}`
    ).toString('base64');

    const response = await fetch(`${process.env.JIRA_URL}/rest/api/2/search?jql=project=SCRUM ORDER BY created DESC&fields=summary,description,status,issuetype,priority,assignee&maxResults=50`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analyze story endpoint
router.post('/analyze', async (req, res) => {
  try {
    const { story } = req.body;
    
    if (!story || !story.fields || !story.fields.summary) {
      throw new Error('Invalid story data - missing required fields');
    }

    const prompt = `
    Analyze this user story:
    Title: ${story.fields.summary}
    Description: ${story.fields.description || 'No description provided'}
    
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
          content: "You are a requirements analyst. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      success: true,
      analysis: {
        completenessScore: analysis.completenessScore || 0,
        findings: analysis.findings || [],
        suggestions: analysis.suggestions || []
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      details: error.message
    });
  }
});

module.exports = router; 