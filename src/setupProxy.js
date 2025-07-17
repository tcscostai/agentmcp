const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = function(app) {
  // Check if API key is available
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not set in the environment variables');
    return;
  }

  console.log('OpenAI API Key found, setting up proxy...');

  app.use(
    '/api/openai',
    createProxyMiddleware({
      target: 'https://api.openai.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/openai': '',
      },
      onProxyReq: (proxyReq) => {
        // Forward the API key from the server environment
        proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
        console.log('Proxy request headers:', proxyReq.getHeaders());
      },
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).json({
          error: 'Proxy Error',
          message: err.message
        });
      },
      logLevel: 'debug'
    })
  );
}; 