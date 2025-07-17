const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const upload = multer();

// Add DOMAINS constant
const DOMAINS = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Healthcare and medical domain',
    datasets: [
      {
        id: 'medical_records',
        name: 'Medical Records Dataset',
        description: 'Anonymized medical records for training',
        type: 'structured'
      },
      {
        id: 'clinical_trials',
        name: 'Clinical Trials Data',
        description: 'Historical clinical trial data',
        type: 'document'
      },
      {
        id: 'medical_imaging',
        name: 'Medical Imaging Dataset',
        description: 'Medical imaging and radiology data',
        type: 'image'
      }
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial services and banking',
    datasets: [
      {
        id: 'transactions',
        name: 'Transaction Dataset',
        description: 'Historical transaction data',
        type: 'structured'
      },
      {
        id: 'market_data',
        name: 'Market Data',
        description: 'Historical market trends and data',
        type: 'timeseries'
      },
      {
        id: 'risk_models',
        name: 'Risk Models',
        description: 'Financial risk assessment models',
        type: 'document'
      }
    ]
  },
  {
    id: 'retail',
    name: 'Retail',
    description: 'Retail and e-commerce',
    datasets: [
      {
        id: 'products',
        name: 'Product Catalog',
        description: 'Product information and metadata',
        type: 'structured'
      },
      {
        id: 'orders',
        name: 'Order History',
        description: 'Customer order data',
        type: 'structured'
      },
      {
        id: 'customer_feedback',
        name: 'Customer Feedback',
        description: 'Customer reviews and feedback',
        type: 'text'
      }
    ]
  }
];

// Update the template generation with more specific capabilities
const generateAgentTemplate = async (category, framework, config) => {
  const capabilities = analyzeDescription(config.description);
  
  const systemPrompt = `You are an expert AI agent developer specializing in ${framework} and ${category} agents.
Create a production-ready agent with the following capabilities:
${capabilities.features.map(cap => `- ${cap}`).join('\n')}

Required Integrations:
${capabilities.integrations.map(int => `- ${int}`).join('\n')}

The agent should:
1. Be fully functional and handle all edge cases
2. Include proper error handling and logging
3. Be well-documented with clear usage instructions
4. Follow best practices for ${framework}
5. Include all necessary integrations
6. Be production-ready with proper security measures

Generate only the Python code, no explanations.`;

  const userPrompt = `Create a ${category} agent named "${config.name}" that:
Description: ${config.description}

Required Features:
${capabilities.features.map(f => `- ${f}`).join('\n')}

Required Integrations:
${capabilities.integrations.map(i => `- ${i}`).join('\n')}

Use the ${framework} framework and implement all necessary handlers and utilities.

For CrewAI framework, create an agent that:
1. Initializes with proper tools and capabilities
2. Has clear task definitions
3. Implements proper error handling
4. Includes logging and monitoring
5. Has proper integration with external services
6. Returns structured responses`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });

  // Clean up the code if it contains markdown backticks
  let code = completion.choices[0].message.content;
  code = code.replace(/```python\n/g, '').replace(/```/g, '');

  // Add framework-specific imports
  const frameworkImports = {
    crewai: `
import os
from crewai import Agent, Task, Crew, Process
from langchain.llms import OpenAI
from langchain.tools import Tool
from typing import List, Dict
import logging
from datetime import datetime
from .jira_client import JiraClient

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize OpenAI
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
`,
    langchain: `
from langchain.agents import Tool, AgentExecutor, LLMSingleActionAgent
from langchain.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI
from langchain.prompts import MessagesPlaceholder
import os
import logging
from typing import List, Dict
from datetime import datetime
from .jira_client import JiraClient

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
`,
    autogen: `
import autogen
from typing import Dict, List, Optional
import os
import logging
from datetime import datetime
from .jira_client import JiraClient

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
`
  };

  return `${frameworkImports[framework]}\n${code}`;
};

// Add capability analysis function
const analyzeDescription = (description) => {
  const capabilities = {
    features: [],
    integrations: [],
    requirements: []
  };

  // Common patterns to detect
  const patterns = {
    jira: {
      regex: /jira|stories|tickets|issues/i,
      integration: 'Jira API Integration',
      features: ['Fetch Jira Stories', 'Story Analysis']
    },
    testing: {
      regex: /test cases|testing|test scenarios/i,
      features: ['Test Case Generation', 'Test Coverage Analysis']
    },
    openai: {
      regex: /generate|analyze|create|design/i,
      integration: 'OpenAI Integration',
      features: ['AI-Powered Analysis', 'Content Generation']
    }
  };

  // Analyze description for patterns
  Object.entries(patterns).forEach(([key, pattern]) => {
    if (pattern.regex.test(description)) {
      if (pattern.integration) {
        capabilities.integrations.push(pattern.integration);
      }
      capabilities.features.push(...pattern.features);
    }
  });

  return capabilities;
};

// Add these helper functions
const generateRequirements = (capabilities) => {
  const requirements = [
    'openai>=1.0.0',
    'python-dotenv>=1.0.0',
    'logging>=0.5.1.2'
  ];

  if (capabilities.integrations.includes('Jira API Integration')) {
    requirements.push('jira>=3.5.1');
  }

  return requirements.join('\n');
};

const generateReadme = (config, capabilities) => {
  return `# ${config.name}

## Description
${config.description}

## Features
${capabilities.features.map(f => `- ${f}`).join('\n')}

## Integrations
${capabilities.integrations.map(i => `- ${i}`).join('\n')}

## Setup
1. Install requirements:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

2. Set up environment variables:
   \`\`\`bash
   OPENAI_API_KEY=your_openai_key
   JIRA_URL=your_jira_url
   JIRA_USERNAME=your_jira_username
   JIRA_TOKEN=your_jira_token
   \`\`\`

## Usage
\`\`\`python
from agent import ${config.name.replace(/\s+/g, '')}Agent

agent = ${config.name.replace(/\s+/g, '')}Agent()
result = agent.run()
\`\`\`
`;
};

// Create agent implementation
const createAgentImplementation = async (category, template, config, tool) => {
  const agentDir = path.join(__dirname, '..', 'agents', category, config.name);
  
  // Create agent directory
  await fs.mkdir(agentDir, { recursive: true });

  // Generate main agent file
  const agentCode = `
import os
from datetime import datetime
from jira import JIRA
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ${config.name.replace(/\s+/g, '')}:
    def __init__(self):
        self.jira = JIRA(
            server=os.getenv('JIRA_URL'),
            basic_auth=(os.getenv('JIRA_USERNAME'), os.getenv('JIRA_TOKEN'))
        )
        self.project_key = os.getenv('JIRA_PROJECT_KEY')
        logger.info(f"Initialized {self.__class__.__name__} with project key: {self.project_key}")

    async def execute_task(self, task_type, params=None):
        """Execute agent tasks based on type"""
        try:
            if task_type == 'analyze_requirements':
                return await self.analyze_requirements(params)
            elif task_type == 'generate_test_cases':
                return await self.generate_test_cases(params)
            elif task_type == 'run_test_suite':
                return await self.run_test_suite(params)
            else:
                raise ValueError(f"Unknown task type: {task_type}")
        except Exception as e:
            logger.error(f"Error executing task {task_type}: {str(e)}")
            raise

    async def analyze_requirements(self, story_key):
        """Analyze requirements for a given story"""
        try:
            story = self.jira.issue(story_key)
            analysis = await self._analyze_with_openai(story.fields.description)
            return {
                'story_key': story_key,
                'analysis': analysis,
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error analyzing requirements: {str(e)}")
            raise

    async def generate_test_cases(self, story_key):
        """Generate test cases for a story"""
        try:
            story = self.jira.issue(story_key)
            test_cases = await self._generate_test_cases_with_openai(
                story.fields.description,
                getattr(story.fields, 'customfield_10016', '') # Acceptance criteria
            )
            return {
                'story_key': story_key,
                'test_cases': test_cases,
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error generating test cases: {str(e)}")
            raise

    async def _analyze_with_openai(self, description):
        """Use OpenAI to analyze requirements"""
        try:
            response = await openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert requirements analyst."},
                    {"role": "user", "content": f"Analyze these requirements:\n{description}"}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise

    async def _generate_test_cases_with_openai(self, description, acceptance_criteria):
        """Use OpenAI to generate test cases"""
        try:
            response = await openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert test case designer."},
                    {"role": "user", "content": f"""
                        Generate test cases for:
                        Description: {description}
                        Acceptance Criteria: {acceptance_criteria}
                    """}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise
`;

  await fs.writeFile(path.join(agentDir, 'agent.py'), agentCode);

  // Create agent endpoint handler
  const handlerCode = `
const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

router.post('/execute', async (req, res) => {
    try {
        const { task_type, params } = req.body;
        
        // Spawn Python agent process
        const agentProcess = spawn('python', [
            path.join(__dirname, 'agent.py'),
            task_type,
            JSON.stringify(params)
        ]);

        let result = '';
        let error = '';

        agentProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        agentProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        agentProcess.on('close', (code) => {
            if (code !== 0) {
                res.status(500).json({ error: error || 'Agent execution failed' });
                return;
            }
            res.json({ result: JSON.parse(result) });
        });
    } catch (error) {
        console.error('Agent execution error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
`;

  await fs.writeFile(path.join(agentDir, 'handler.js'), handlerCode);

  // Create requirements.txt for Python dependencies
  const requirementsContent = `
jira==3.5.1
openai==1.3.0
python-dotenv==1.0.0
`;

  await fs.writeFile(path.join(agentDir, 'requirements.txt'), requirementsContent);

  return agentDir;
};

// Update the trainAgent function
const trainAgent = async (agentConfig) => {
  try {
    const { trainingData, config } = agentConfig;
    
    // Initialize training datasets array
    let trainingDatasets = [];

    // Handle existing datasets
    if (trainingData.useExisting && Array.isArray(trainingData.selectedDatasets)) {
      trainingDatasets = trainingData.selectedDatasets;
    }

    // Handle uploaded files
    if (!trainingData.useExisting && Array.isArray(trainingData.files)) {
      trainingDatasets = trainingData.files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }));
    }

    // Simulate training process
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      success: true,
      trainedDatasets: trainingDatasets.length,
      metrics: {
        accuracy: 0.95,
        loss: 0.05,
        epochs: 10
      }
    };
  } catch (error) {
    console.error('Error in trainAgent:', error);
    throw error;
  }
};

// Add this route handler
router.post('/', async (req, res) => {
  try {
    const agentConfig = req.body;
    
    // Validate required fields
    if (!agentConfig.category || !agentConfig.domain || !agentConfig.framework) {
      throw new Error('Missing required configuration fields');
    }

    // Train the agent
    const trainingResult = await trainAgent(agentConfig);

    // Create agent record
    const agent = {
      id: `agent_${Date.now()}`,
      name: agentConfig.config.name,
      description: agentConfig.config.description,
      category: agentConfig.category,
      framework: agentConfig.framework,
      domain: agentConfig.domain,
      tools: agentConfig.config.tools,
      training: trainingResult,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // In a real implementation, you would save this to a database
    console.log('Created agent:', agent);

    res.json({
      success: true,
      agent
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update the GET endpoint to handle category-specific metadata files
router.get('/', async (req, res) => {
  try {
    const agentTypes = ['sdlc', 'rag', 'workflow'];
    const allAgents = {};

    for (const type of agentTypes) {
      const categoryDir = path.join(__dirname, '..', 'agents', type);
      const metadataPath = path.join(categoryDir, 'metadata.json');
      
      try {
        await fs.mkdir(categoryDir, { recursive: true });
        let data;
        try {
          data = await fs.readFile(metadataPath, 'utf8');
        } catch (error) {
          // If file doesn't exist, create it with empty array
          data = '[]';
          await fs.writeFile(metadataPath, data);
        }
        allAgents[type] = JSON.parse(data);
      } catch (error) {
        console.error(`Error reading metadata for ${type}:`, error);
        allAgents[type] = [];
      }
    }

    console.log('Retrieved agents:', allAgents);
    res.json(allAgents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate utility files
async function generateUtilities(capabilities) {
  const utilities = {};

  if (capabilities.integrations.includes('Jira API Integration')) {
    utilities['jira_client.py'] = `
import os
from jira import JIRA
import logging

logger = logging.getLogger(__name__)

class JiraClient:
    def __init__(self):
        self.client = JIRA(
            server=os.getenv('JIRA_URL'),
            basic_auth=(os.getenv('JIRA_USERNAME'), os.getenv('JIRA_TOKEN'))
        )

    def get_stories(self, project_key, max_results=50):
        try:
            stories = self.client.search_issues(
                f'project = {project_key} AND issuetype = Story',
                maxResults=max_results
            )
            return [self._format_story(story) for story in stories]
        except Exception as e:
            logger.error(f"Error fetching Jira stories: {e}")
            raise

    def _format_story(self, story):
        return {
            'key': story.key,
            'summary': story.fields.summary,
            'description': story.fields.description,
            'acceptance_criteria': getattr(story.fields, 'customfield_10016', ''),
            'status': story.fields.status.name
        }
`;
  }

  return utilities;
}

// Update the delete route handler
router.delete('/agents/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    
    // Get the agent metadata
    const metadataPath = path.join(__dirname, '..', 'agents', 'metadata.json');
    const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
    
    // Find the agent
    const agentIndex = metadata.findIndex(agent => agent.id === agentId);
    if (agentIndex === -1) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Get agent details
    const agent = metadata[agentIndex];
    
    // Delete the agent directory
    await fs.rm(agent.path, { recursive: true, force: true });
    
    // Update metadata
    metadata.splice(agentIndex, 1);
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    res.json({ 
      success: true, 
      message: `Agent ${agent.name} deleted successfully` 
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ 
      error: 'Failed to delete agent',
      details: error.message 
    });
  }
});

// Add this route handler for TRR processing
router.post('/trr-workflow', upload.fields([
  { name: 'pdpFile', maxCount: 1 },
  { name: 'trrFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { pdpFile, trrFile } = req.files;
    const workflowId = `trr-${Date.now()}`;

    // Initialize workflow tracker
    const workflow = {
      id: workflowId,
      status: 'processing',
      stages: [],
      results: {
        pdpAnalysis: null,
        trcProcessing: null,
        falloutReport: null,
        testResults: null
      }
    };

    // 1. File Validation Stage
    workflow.stages.push({
      name: 'file_validation',
      status: 'processing',
      startTime: new Date()
    });

    const fileValidation = await validateFiles(pdpFile[0], trrFile[0]);
    if (!fileValidation.success) {
      throw new Error(`File validation failed: ${fileValidation.error}`);
    }

    // 2. TRC Processing Stage
    workflow.stages.push({
      name: 'trc_processing',
      status: 'processing',
      startTime: new Date()
    });

    const trcResults = await processTRCs(trrFile[0]);
    workflow.results.trcProcessing = trcResults;

    // 3. Generate Fallout Report
    workflow.stages.push({
      name: 'fallout_analysis',
      status: 'processing',
      startTime: new Date()
    });

    const falloutReport = await generateFalloutReport(trcResults);
    workflow.results.falloutReport = falloutReport;

    // 4. Automated Testing
    workflow.stages.push({
      name: 'automated_testing',
      status: 'processing',
      startTime: new Date()
    });

    const testResults = await runAutomatedTests(trcResults.processedTRCs);
    workflow.results.testResults = testResults;

    // Update workflow status
    workflow.status = 'completed';
    workflow.completionTime = new Date();

    res.json({
      success: true,
      workflowId,
      results: workflow.results,
      summary: {
        totalTRCs: trcResults.totalTRCs,
        processedSuccessfully: trcResults.successCount,
        fallouts: falloutReport.totalFallouts,
        testsPassed: testResults.passedTests,
        testsFailed: testResults.failedTests
      }
    });

  } catch (error) {
    console.error('TRR Workflow Error:', error);
    res.status(500).json({
      error: 'TRR processing failed',
      details: error.message
    });
  }
});

// Helper functions for TRR processing
async function validateFiles(pdpFile, trrFile) {
  // Implement file validation logic
  return {
    success: true,
    pdpValidation: {
      isValid: true,
      records: 0,
      errors: []
    },
    trrValidation: {
      isValid: true,
      records: 0,
      errors: []
    }
  };
}

async function processTRCs(trrFile) {
  // Implement TRC processing logic
  return {
    totalTRCs: 0,
    successCount: 0,
    failureCount: 0,
    processedTRCs: [],
    errors: []
  };
}

async function generateFalloutReport(trcResults) {
  // Implement fallout report generation
  return {
    totalFallouts: 0,
    categories: [],
    details: []
  };
}

async function runAutomatedTests(processedTRCs) {
  // Implement automated testing logic
  return {
    passedTests: 0,
    failedTests: 0,
    testCases: [],
    coverage: 0
  };
}

// Update the GET agents route
router.get('/agents', async (req, res) => {
  try {
    const agents = {
      multiagent_workflows: [
        {
          id: 'trr_processor',
          name: 'TRR Processing Workflow',
          description: 'Automated TRR file processing and validation workflow',
          // ... rest of the agent configuration
        }
      ],
      sdlc: [],
      rag: [],
      workflow: []
    };

    console.log('Sending agents:', agents);
    res.json(agents);
  } catch (error) {
    console.error('Error retrieving agents:', error);
    res.status(500).json({ error: 'Failed to retrieve agents' });
  }
});

// Add this route handler for agent deletion
router.delete('/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    
    // Validate agent ID format
    if (!agentId.startsWith('agent_')) {
      throw new Error('Invalid agent ID format');
    }

    // In a real implementation, you would delete from your database
    console.log('Deleting agent:', agentId);

    res.json({
      success: true,
      message: 'Agent deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 