const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

console.log('Initializing Jira routes');

// Helper function for Jira headers
const getJiraHeaders = () => ({
  'Authorization': `Basic ${Buffer.from(
    `${process.env.JIRA_USERNAME}:${process.env.JIRA_TOKEN}`
  ).toString('base64')}`,
  'Accept': 'application/json'
});

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log('Jira route hit:', {
    method: req.method,
    path: req.path,
    fullUrl: req.originalUrl,
    body: req.body
  });
  next();
});

// Test endpoint
router.get('/test', (req, res) => {
  console.log('Jira test endpoint hit');
  res.json({
    success: true,
    message: 'Jira routes are working'
  });
});

// Config endpoint
router.get('/config', async (req, res) => {
  try {
    // Check if Jira is configured
    if (!process.env.JIRA_URL || !process.env.JIRA_USERNAME || !process.env.JIRA_TOKEN) {
      return res.json({
        success: true,
        isConfigured: false,
        message: 'Jira is not configured'
      });
    }

    const auth = Buffer.from(
      `${process.env.JIRA_USERNAME}:${process.env.JIRA_TOKEN}`
    ).toString('base64');

    const response = await fetch(`${process.env.JIRA_URL}/rest/api/2/myself`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to verify Jira connection');
    }

    const userData = await response.json();
    res.json({
      success: true,
      isConfigured: true,
      url: process.env.JIRA_URL,
      username: process.env.JIRA_USERNAME,
      user: {
        displayName: userData.displayName,
        email: userData.emailAddress
      }
    });
  } catch (error) {
    console.error('Config error:', error);
    res.json({
      success: false,
      isConfigured: false,
      error: error.message
    });
  }
});

// Projects endpoint
router.get('/projects', async (req, res) => {
  try {
    console.log('Fetching Jira projects...');
    const auth = Buffer.from(
      `${process.env.JIRA_USERNAME}:${process.env.JIRA_TOKEN}`
    ).toString('base64');

    // First verify Jira is configured
    if (!process.env.JIRA_URL || !process.env.JIRA_USERNAME || !process.env.JIRA_TOKEN) {
      throw new Error('Jira is not configured');
    }

    const response = await fetch(`${process.env.JIRA_URL}/rest/api/2/project`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`);
    }

    const rawProjects = await response.json();
    console.log('Raw projects response:', rawProjects);

    // Ensure projects is an array
    if (!Array.isArray(rawProjects)) {
      throw new Error('Invalid projects data received from Jira');
    }

    const projects = rawProjects.map(project => ({
      id: project.id,
      key: project.key,
      name: project.name
    }));

    console.log('Formatted projects:', projects);

    res.json({
      success: true,
      isConfigured: true,
      message: 'Projects fetched successfully',
      total: projects.length,
      projects: projects
    });

  } catch (error) {
    console.error('Projects error:', error);
    res.status(200).json({  // Changed to 200 to handle application-level errors
      success: false,
      isConfigured: false,
      error: error.message || 'Failed to fetch projects'
    });
  }
});

// Stories endpoint
router.get('/stories', async (req, res) => {
  try {
    const auth = Buffer.from(
      `${process.env.JIRA_USERNAME}:${process.env.JIRA_TOKEN}`
    ).toString('base64');

    const jql = encodeURIComponent('project=SCRUM ORDER BY created DESC');
    const url = `${process.env.JIRA_URL}/rest/api/2/search?jql=${jql}&fields=summary,description,status,issuetype,priority,assignee&maxResults=50`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stories: ${response.status}`);
    }

    const data = await response.json();
    res.json({
      success: true,
      total: data.total,
      issues: data.issues
    });
  } catch (error) {
    console.error('Stories error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add this endpoint
router.post('/config/save', async (req, res) => {
  try {
    const { url, username, token } = req.body;

    // Validate the new configuration
    const auth = Buffer.from(`${username}:${token}`).toString('base64');
    const response = await fetch(`${url}/rest/api/2/myself`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Invalid Jira configuration');
    }

    // If validation successful, save to environment variables
    process.env.JIRA_URL = url;
    process.env.JIRA_USERNAME = username;
    process.env.JIRA_TOKEN = token;

    res.json({
      success: true,
      message: 'Jira configuration saved successfully'
    });
  } catch (error) {
    console.error('Save config error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update the create-story endpoint
router.post('/create-story', async (req, res) => {
  try {
    const { summary, description, acceptanceCriteria, priority, projectKey } = req.body;

    if (!summary || !description || !projectKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const auth = Buffer.from(
      `${process.env.JIRA_USERNAME}:${process.env.JIRA_TOKEN}`
    ).toString('base64');

    // Format the description with acceptance criteria
    const formattedDescription = `
${description}

*Acceptance Criteria:*
${acceptanceCriteria.map(criteria => `* ${criteria}`).join('\n')}
    `.trim();

    // Create the basic issue fields
    const issueFields = {
      project: {
        key: projectKey
      },
      summary: summary,
      description: formattedDescription,
      issuetype: {
        name: 'Story'
      }
    };

    // Only add priority if it's provided
    if (priority) {
      try {
        // First, verify if priority field is available
        const metaResponse = await fetch(`${process.env.JIRA_URL}/rest/api/2/issue/createmeta?projectKeys=${projectKey}&issuetypeNames=Story&expand=projects.issuetypes.fields`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
          }
        });

        const metaData = await metaResponse.json();
        const priorityField = metaData.projects[0]?.issuetypes[0]?.fields?.priority;

        if (priorityField) {
          // Verify if the priority value is valid
          const validPriorities = priorityField.allowedValues.map(p => p.name);
          if (validPriorities.includes(priority)) {
            issueFields.priority = { name: priority };
          }
        }
      } catch (error) {
        console.warn('Could not verify priority field:', error);
        // Continue without setting priority
      }
    }

    // Create the issue in Jira
    const response = await fetch(`${process.env.JIRA_URL}/rest/api/2/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        fields: issueFields
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Jira API error:', errorData);
      throw new Error(errorData.errors ? Object.values(errorData.errors).join(', ') : 'Failed to create story');
    }

    const data = await response.json();
    console.log('Story created:', data);

    res.json({
      success: true,
      key: data.key,
      id: data.id,
      self: data.self
    });

  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create story in Jira'
    });
  }
});

// Print registered routes at startup
const routes = router.stack
  .filter(r => r.route)
  .map(r => `${r.route.path} [${Object.keys(r.route.methods)}]`);
console.log('Jira routes registered:', routes);

module.exports = router; 