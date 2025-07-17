const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Helper function to generate test file content
const generateTestContent = async (story, framework) => {
  const prompt = `
    Generate a ${framework.language} test file for this user story:
    
    Story Key: ${story.key}
    Summary: ${story.fields.summary}
    Description: ${story.fields.description || 'No description provided'}
    Status: ${story.fields.status.name}
    Type: ${story.fields.issuetype.name}

    Use ${framework.name} framework and include:
    1. Test setup
    2. Test cases covering main functionality
    3. Error cases
    4. Cleanup
    
    Return ONLY the code without any explanation.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a test automation expert. Generate ${framework.language} test code using ${framework.name}.`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
};

// Generate tests endpoint
router.post('/tests', async (req, res) => {
  try {
    const { stories, framework } = req.body;
    console.log('Generating tests for:', { 
      storiesCount: stories.length,
      framework: framework.name 
    });

    const testFiles = {};
    const configFiles = {};

    // Generate main test file for each story
    for (const story of stories) {
      const fileName = `${story.key.toLowerCase()}_test`;
      const fileExtension = framework.language === 'java' ? '.java' : 
                          framework.language === 'python' ? '.py' : '.js';
      
      const testContent = await generateTestContent(story, framework);
      testFiles[fileName] = testContent;
    }

    // Generate config files based on framework
    if (framework.id === 'selenium-java') {
      configFiles['pom.xml'] = `
        <project>
          <dependencies>
            <dependency>
              <groupId>org.seleniumhq.selenium</groupId>
              <artifactId>selenium-java</artifactId>
              <version>4.11.0</version>
            </dependency>
            <dependency>
              <groupId>org.testng</groupId>
              <artifactId>testng</artifactId>
              <version>7.7.1</version>
            </dependency>
          </dependencies>
        </project>
      `;
    } else if (framework.id === 'cypress') {
      configFiles['cypress.config.js'] = `
        module.exports = {
          e2e: {
            setupNodeEvents(on, config) {},
            baseUrl: 'http://localhost:3000'
          }
        };
      `;
    }

    res.json({
      success: true,
      files: testFiles,
      config: configFiles
    });

  } catch (error) {
    console.error('Test generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 