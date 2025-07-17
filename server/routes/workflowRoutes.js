const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/workflow', async (req, res) => {
  try {
    const { prompt, maxSteps = 5, storyKey } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Workflow prompt is required'
      });
    }

    console.log('Generating workflow for:', { prompt, maxSteps, storyKey });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a workflow automation expert. Generate workflow steps that follow this format:
            {
              "steps": [
                {
                  "name": "Step name",
                  "description": "Detailed step description",
                  "agent": "requirements-analyzer|integration-test-designer|workflow-designer",
                  "inputs": ["input1", "input2"],
                  "outputs": ["output1", "output2"]
                }
              ]
            }`
        },
        {
          role: "user",
          content: `Generate a workflow with maximum ${maxSteps} steps for this requirement: ${prompt}`
        }
      ],
      temperature: 0.7
    });

    let workflowData;
    try {
      const jsonString = completion.choices[0].message.content.trim();
      workflowData = JSON.parse(jsonString);

      if (!Array.isArray(workflowData.steps)) {
        throw new Error('Invalid workflow format');
      }

      // Validate and clean each step
      workflowData.steps = workflowData.steps.map(step => ({
        name: step.name || 'Unnamed Step',
        description: step.description || 'No description provided',
        agent: step.agent || 'workflow-designer',
        inputs: Array.isArray(step.inputs) ? step.inputs : [],
        outputs: Array.isArray(step.outputs) ? step.outputs : []
      }));

    } catch (parseError) {
      console.error('Failed to parse workflow:', parseError);
      console.log('Raw response:', completion.choices[0].message.content);
      throw new Error('Failed to generate valid workflow format');
    }

    console.log('Generated workflow:', workflowData);

    res.json({
      success: true,
      storyKey,
      steps: workflowData.steps
    });

  } catch (error) {
    console.error('Workflow generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate workflow'
    });
  }
});

module.exports = router; 