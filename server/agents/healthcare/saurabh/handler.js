
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
