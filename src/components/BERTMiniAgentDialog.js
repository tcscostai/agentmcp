import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  LinearProgress,
  FormControlLabel,
  Switch,
  Radio,
  RadioGroup,
  Paper,
  CircularProgress,
  Dialog as ConfirmDialog,
  DialogContentText,
  Tooltip,
  Grid,
  FormHelperText,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Storage as StorageIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const VECTOR_DBS = [
  { value: 'pinecone', label: 'Pinecone', description: 'Managed vector database with high scalability' },
  { value: 'chroma', label: 'ChromaDB', description: 'Open-source embedding database, easy to set up' },
  { value: 'weaviate', label: 'Weaviate', description: 'Vector search engine with GraphQL support' },
  { value: 'milvus', label: 'Milvus', description: 'Highly scalable vector database' }
];

const AI_FRAMEWORKS = [
  { value: 'langchain', label: 'LangChain', description: 'Popular framework for LLM applications' },
  { value: 'llamaindex', label: 'LlamaIndex', description: 'Data framework for LLM applications' },
  { value: 'haystack', label: 'Haystack', description: 'End-to-end NLP framework' },
  { value: 'custom', label: 'Custom Implementation', description: 'Build your own integration' }
];

const TASK_TYPES = [
  { value: 'sentiment', label: 'Sentiment Analysis', description: 'Analyze text sentiment' },
  { value: 'classification', label: 'Text Classification', description: 'Classify text into categories' },
  { value: 'qa', label: 'Question Answering', description: 'Answer questions from context' },
  { value: 'summarization', label: 'Text Summarization', description: 'Generate text summaries' }
];

const sanitizeDockerName = (name) => {
  if (!name) return '';
  // Convert to lowercase, replace spaces and special chars with hyphens
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')  // Replace invalid chars with hyphen
    .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '')        // Remove leading/trailing hyphens
    .substring(0, 63);            // Kubernetes has a 63 character limit
};

function BERTMiniAgentDialog({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [config, setConfig] = useState({
    name: '',
    description: '',
    taskType: '',
    vectorDB: '',
    framework: '',
    useRAG: true,
    modelConfig: {
      batchSize: '32',
      maxLength: '128',
      temperature: '0.7'
    },
    deployment: {
      environment: 'local',
      resources: {
        cpu: '1',
        memory: '2Gi'
      }
    }
  });

  const [success, setSuccess] = useState(null);
  const [dockerStatus, setDockerStatus] = useState({
    isRunning: false,
    isChecking: true,
    error: null
  });
  const [showDockerPrompt, setShowDockerPrompt] = useState(false);
  const [buildStatus, setBuildStatus] = useState({
    stage: '',
    progress: 0,
    message: ''
  });

  const steps = ['Basic Info', 'Task Configuration', 'Infrastructure', 'Review'];

  const handleNext = async () => {
    try {
      setLoading(true);
      setError('');

      if (activeStep === steps.length - 1) {
        // Deploy the agent
        await deployAgent();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateDeploymentConfig = (config) => {
    // Basic validation
    if (!config.name) return 'Agent name is required';
    if (!config.taskType) return 'Task type is required';
    if (!config.deployment?.environment) return 'Deployment environment is required';

    // Resource validation
    if (config.deployment.environment !== 'local') {
      const { cpu, memory } = config.deployment.resources;
      
      // Validate CPU format (e.g., "0.5", "1", "2")
      if (!/^\d*\.?\d+$/.test(cpu)) {
        return 'Invalid CPU format. Use numbers only (e.g., 0.5, 1, 2)';
      }

      // Validate memory format (e.g., "512Mi", "1Gi", "2Gi")
      if (!/^\d+(?:\.\d+)?(?:Mi|Gi)$/.test(memory)) {
        return 'Invalid memory format. Use format like 512Mi or 2Gi';
      }
    }

    return '';
  };

  const validateConfig = () => {
    const errors = [];
    
    if (!config.name) {
      errors.push('Agent name is required');
    }

    if (!config.taskType) {
      errors.push('Task type is required');
    }

    if (config.useRAG) {
      if (!config.vectorDB) {
        errors.push('Vector database selection is required when using RAG');
      }
      if (!config.framework) {
        errors.push('AI framework selection is required when using RAG');
      }
    }

    return errors;
  };

  const deployAgent = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate configuration
      const validationErrors = validateConfig();
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      // Validate name
      const nameError = validateName(config.name);
      if (nameError) {
        throw new Error(nameError);
      }

      // Validate deployment configuration
      const deploymentError = validateDeploymentConfig(config);
      if (deploymentError) {
        throw new Error(deploymentError);
      }

      const sanitizedName = sanitizeDockerName(config.name);
      console.log('Sanitized name:', sanitizedName);

      // Prepare deployment configuration
      const deployConfig = {
        ...config,
        name: sanitizedName,
        deployment: {
          ...config.deployment,
          containerName: sanitizedName,
          resources: {
            cpu: config.deployment.resources.cpu.toString(),
            memory: config.deployment.resources.memory.toString()
          }
        },
        modelConfig: {
          ...config.modelConfig,
          batchSize: parseInt(config.modelConfig.batchSize, 10),
          maxLength: parseInt(config.modelConfig.maxLength, 10),
          temperature: parseFloat(config.modelConfig.temperature)
        }
      };

      console.log('Deploy config:', deployConfig);

      setBuildStatus({
        stage: 'preparing',
        progress: 10,
        message: 'Preparing deployment...'
      });

      // Check Docker if needed
      if (config.deployment.environment === 'docker' && !dockerStatus.isRunning) {
        throw new Error('Docker is not running. Please start Docker first.');
      }

      const response = await fetch('http://localhost:3001/api/deploy-slm-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deployConfig),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to deploy agent');
      }

      setSuccess({
        message: 'Agent deployed successfully!',
        deploymentInfo: data.deploymentInfo
      });

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Deployment error:', err);
      setError(err.message);
      setBuildStatus({ stage: '', progress: 0, message: '' });
    } finally {
      setLoading(false);
    }
  };

  const validateName = (name) => {
    if (!name) return 'Name is required';
    if (name.length < 3) return 'Name must be at least 3 characters';
    
    const sanitized = sanitizeDockerName(name);
    if (sanitized.length < 3) {
      return 'Name must contain at least 3 valid characters (a-z, 0-9, -)';
    }
    
    if (sanitized !== name.toLowerCase()) {
      return 'Name can only contain lowercase letters, numbers, and hyphens';
    }
    
    return '';
  };

  const checkDockerStatus = async () => {
    try {
      setDockerStatus(prev => ({ ...prev, isChecking: true, error: null }));
      
      const response = await fetch('http://localhost:3001/api/docker/status');
      const data = await response.json();

      console.log('Docker status response:', data);

      if (data.error) {
        setDockerStatus({
          isRunning: false,
          isChecking: false,
          error: data.error
        });
        return;
      }

      setDockerStatus({
        isRunning: data.isRunning,
        isChecking: false,
        error: null,
        info: data.info
      });

      if (!data.isRunning && config.deployment.environment === 'docker') {
        setShowDockerPrompt(true);
      }
    } catch (error) {
      console.error('Docker status check error:', error);
      setDockerStatus({
        isRunning: false,
        isChecking: false,
        error: error.message
      });
    }
  };

  useEffect(() => {
    if (open) {
      checkDockerStatus();
    }
  }, [open]);

  useEffect(() => {
    console.log('Docker status changed:', dockerStatus);
  }, [dockerStatus]);

  const handleStartDocker = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/docker/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start Docker');
      }

      // Poll for Docker status
      let attempts = 0;
      const maxAttempts = 30;
      const interval = setInterval(async () => {
        try {
          await checkDockerStatus();
          const status = await fetch('http://localhost:3001/api/docker/status').then(r => r.json());
          
          if (status.isRunning) {
            clearInterval(interval);
            setShowDockerPrompt(false);
            setDockerStatus({
              isRunning: true,
              isChecking: false,
              error: null,
              info: status.info
            });
          }
          
          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            throw new Error('Docker took too long to start');
          }
        } catch (error) {
          console.error('Docker polling error:', error);
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            setError('Failed to confirm Docker is running');
          }
        }
      }, 2000);

    } catch (error) {
      console.error('Docker start error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Agent Name"
              value={config.name}
              onChange={(e) => {
                const newName = e.target.value;
                const error = validateName(newName);
                setError(error);
                setConfig(prev => ({
                  ...prev,
                  name: newName
                }));
              }}
              error={!!error && error.includes('Name')}
              helperText={error && error.includes('Name') ? error : 'Use lowercase letters, numbers, and hyphens only'}
              sx={{ mb: 2 }}
            />
            {config.name && (
              <Typography variant="caption" color="text.secondary">
                Docker name will be: {sanitizeDockerName(config.name)}
              </Typography>
            )}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }} error={!!error && error.includes('Task type')}>
              <InputLabel>Task Type</InputLabel>
              <Select
                value={config.taskType}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  taskType: e.target.value
                }))}
                label="Task Type"
                required
              >
                {TASK_TYPES.map((task) => (
                  <MenuItem key={task.value} value={task.value}>
                    <Box>
                      <Typography variant="subtitle1">{task.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {error && error.includes('Task type') ? error : 'Select the type of task for this agent'}
              </FormHelperText>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={config.useRAG}
                  onChange={(e) => setConfig({ ...config, useRAG: e.target.checked })}
                />
              }
              label="Enable RAG (Retrieval-Augmented Generation)"
              sx={{ mb: 2 }}
            />

            {config.useRAG && (
              <>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Vector Database</InputLabel>
                  <Select
                    value={config.vectorDB}
                    onChange={(e) => setConfig({ ...config, vectorDB: e.target.value })}
                    label="Vector Database"
                  >
                    {VECTOR_DBS.map((db) => (
                      <MenuItem key={db.value} value={db.value}>
                        <Box>
                          <Typography variant="subtitle1">{db.label}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {db.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>AI Framework</InputLabel>
                  <Select
                    value={config.framework}
                    onChange={(e) => setConfig({ ...config, framework: e.target.value })}
                    label="AI Framework"
                  >
                    {AI_FRAMEWORKS.map((framework) => (
                      <MenuItem key={framework.value} value={framework.value}>
                        <Box>
                          <Typography variant="subtitle1">{framework.label}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {framework.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Deployment Environment
            </Typography>
            <RadioGroup
              value={config.deployment.environment}
              onChange={(e) => {
                const newValue = e.target.value;
                setConfig({
                  ...config,
                  deployment: { ...config.deployment, environment: newValue }
                });
                if (newValue === 'docker') {
                  checkDockerStatus();
                }
              }}
            >
              <FormControlLabel value="local" control={<Radio />} label="Local Deployment" />
              <FormControlLabel 
                value="docker" 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Docker Container
                    {config.deployment.environment === 'docker' && (
                      dockerStatus.isChecking ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} />
                          <Typography variant="caption" color="text.secondary">
                            Checking Docker...
                          </Typography>
                        </Box>
                      ) : dockerStatus.isRunning ? (
                        <Chip 
                          label="Docker Running" 
                          size="small" 
                          color="success" 
                          variant="outlined"
                          icon={<CheckIcon />} 
                        />
                      ) : (
                        <Tooltip title={error || 'Docker is not running'}>
                          <Chip 
                            label="Docker Not Running" 
                            size="small" 
                            color="error" 
                            variant="outlined" 
                            onClick={() => setShowDockerPrompt(true)}
                            icon={<ErrorIcon />}
                          />
                        </Tooltip>
                      )
                    )}
                  </Box>
                }
              />
              <FormControlLabel value="kubernetes" control={<Radio />} label="Kubernetes Cluster" />
            </RadioGroup>

            <Typography variant="subtitle2" gutterBottom>
              Resource Limits
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CPU Cores"
                  value={config.deployment.resources.cpu}
                  onChange={(e) => setConfig({
                    ...config,
                    deployment: {
                      ...config.deployment,
                      resources: {
                        ...config.deployment.resources,
                        cpu: e.target.value
                      }
                    }
                  })}
                  helperText="e.g., 0.5, 1, 2"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Memory"
                  value={config.deployment.resources.memory}
                  onChange={(e) => setConfig({
                    ...config,
                    deployment: {
                      ...config.deployment,
                      resources: {
                        ...config.deployment.resources,
                        memory: e.target.value
                      }
                    }
                  })}
                  helperText="e.g., 512Mi, 1Gi, 2Gi"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Configuration Review
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(config, null, 2)}
              </pre>
            </Paper>

            {loading && buildStatus.stage && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {buildStatus.message}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={buildStatus.progress} 
                  sx={{ mt: 1 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {buildStatus.stage === 'building' ? 'This might take 5-10 minutes for the first build' : ''}
                </Typography>
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PsychologyIcon color="primary" />
            <Typography variant="h6">Configure BERT-Mini Agent</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {loading && <LinearProgress sx={{ mt: 2 }} />}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success.message}
              <Typography variant="body2" sx={{ mt: 1 }}>
                Endpoint: {success.deploymentInfo.endpoint}
                <br />
                Container: {success.deploymentInfo.containerId}
                <br />
                Status: {success.deploymentInfo.status}
              </Typography>

              <Box sx={{ mt: 2, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Test your agent with these commands:
                </Typography>

                <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', mb: 1 }}>
                  {`# Test positive sentiment
curl -X POST \\
  ${success.deploymentInfo.endpoint} \\
  -H "Content-Type: application/json" \\
  -d '{"text": "This product is amazing and I love it!"}'`}
                </Typography>

                <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', mb: 1 }}>
                  {`# Test negative sentiment
curl -X POST \\
  ${success.deploymentInfo.endpoint} \\
  -H "Content-Type: application/json" \\
  -d '{"text": "This is terrible, I am very disappointed"}'`}
                </Typography>

                <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  {`# Test neutral/mixed sentiment
curl -X POST \\
  ${success.deploymentInfo.endpoint} \\
  -H "Content-Type: application/json" \\
  -d '{"text": "The product has both good and bad features"}'`}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Expected Response Format:
                  <pre style={{ margin: '8px 0' }}>
                    {JSON.stringify({
                      "sentiment": "positive/negative",
                      "confidence": 0.95,
                      "scores": {
                        "positive": 0.95,
                        "negative": 0.05
                      }
                    }, null, 2)}
                  </pre>
                </Typography>

                <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
                  💡 Tip: Higher confidence scores indicate stronger sentiment!
                </Typography>
              </Box>
            </Alert>
          )}

          {renderStepContent(activeStep)}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          {activeStep > 0 && !success && (
            <Button onClick={() => setActiveStep((prev) => prev - 1)}>
              Back
            </Button>
          )}
          {success ? (
            <Button
              variant="contained"
              color="primary"
              onClick={onClose}
            >
              Close
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || (activeStep === 1 && !config.taskType)}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {activeStep === steps.length - 1 ? 'Deploy' : 'Next'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={showDockerPrompt}
        onClose={() => setShowDockerPrompt(false)}
      >
        <DialogTitle>Docker Not Running</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Docker is required for container deployment but is not currently running. 
            Would you like to start Docker now?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDockerPrompt(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleStartDocker}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Start Docker
          </Button>
        </DialogActions>
      </ConfirmDialog>
    </>
  );
}

export default BERTMiniAgentDialog; 