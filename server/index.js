const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');
const axios = require('axios');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const fs = require('fs').promises;
const ragRoutes = require('./routes/ragRoutes');
const agentRoutes = require('./routes/agentRoutes');
const trrRoutes = require('./routes/trrRoutes');
const csnpRoutes = require('./routes/csnpRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const jiraRoutes = require('./routes/jiraRoutes');
const testRoutes = require('./routes/testRoutes');
const storyRoutes = require('./routes/storyRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const mobileRoutes = require('./routes/mobileRoutes');

// Create Express app
const app = express();

async function startServer() {
  try {
    // Basic middleware
    app.use(express.json({ limit: '100mb' }));
    app.use(express.urlencoded({ limit: '100mb', extended: true }));

    // Debug middleware to log all requests
    app.use((req, res, next) => {
      console.log('Request received:', {
        method: req.method,
        path: req.path,
        url: req.url,
        headers: req.headers
      });
      next();
    });

    // CORS configuration
    app.use(cors({
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Origin', 'X-Requested-With'],
      exposedHeaders: ['Content-Length', 'Content-Type'],
      credentials: true
    }));

    // Mount Jira routes first
    app.use('/api/jira', jiraRoutes);

    // Test endpoint
    app.get('/api/test', (req, res) => {
      res.json({
        success: true,
        message: 'API is working'
      });
    });

    // Other routes
    app.use('/api/csnp', csnpRoutes);
    app.use('/api/analysis', analysisRoutes);
    app.use('/api/rag', ragRoutes);
    app.use('/api/agents', agentRoutes);
    app.use('/api/trr', trrRoutes);
    app.use('/api/generate', testRoutes);
    
    // Story routes (including PDF extraction)
    console.log('Registering story routes...');
    app.use('/api/generate', storyRoutes);
    
    app.use('/api/generate', workflowRoutes);

    // Mobile routes
    console.log('Registering mobile routes...');
    app.use('/api/mobile', mobileRoutes);

    // Log all registered routes
    console.log('Registered routes:');
    app._router.stack
      .filter(r => r.route || r.name === 'router')
      .forEach(r => {
        if (r.route) {
          console.log(`${r.route.path} [${Object.keys(r.route.methods)}]`);
        } else if (r.name === 'router') {
          const baseRoute = r.regexp.toString().match(/^\^\\\/([^\\]*)/);
          const base = baseRoute ? baseRoute[1] : '';
          console.log(`/${base} [router]`);
          // Try to log child routes
          if (r.handle && r.handle.stack) {
            r.handle.stack.filter(sr => sr.route).forEach(sr => {
              console.log(`  ${sr.route.path} [${Object.keys(sr.route.methods)}]`);
            });
          }
        }
      });

    // 404 handler
    app.use((req, res) => {
      console.log('404 Not Found:', req.method, req.url);
      res.status(404).json({
        success: false,
        error: 'Not Found'
      });
    });

    // Error handler
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
  