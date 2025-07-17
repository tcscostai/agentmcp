import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import {
  Code as CodeIcon,
  Storage as StorageIcon,
  AccountTree as WorkflowIcon,
  Psychology as AIIcon,
  GitHub as GitHubIcon,
  Description as DescriptionIcon,
  Chat as ChatIcon,
  DataObject as DataObjectIcon,
  BarChart as BarChartIcon,
  CloudUpload as CloudUploadIcon,
  Terminal as TerminalIcon,
  BugReport as JiraIcon,
} from '@mui/icons-material';

// Define the simplified categories
const AGENT_CATEGORIES = [
  {
    id: 'sdlc',
    name: 'SDLC Agents',
    icon: <CodeIcon fontSize="large" />,
    color: '#007AFF',
    description: 'Agents for software development lifecycle'
  },
  {
    id: 'rag',
    name: 'RAG Agents',
    icon: <StorageIcon fontSize="large" />,
    color: '#34C759',
    description: 'Retrieval Augmented Generation agents'
  },
  {
    id: 'workflow',
    name: 'Workflow Agents',
    icon: <WorkflowIcon fontSize="large" />,
    color: '#5856D6',
    description: 'Multi-agent workflow orchestration'
  }
];

const DOMAINS = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Healthcare and medical domain'
  },
  {
    id: 'retail',
    name: 'Retail',
    description: 'Retail and e-commerce'
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Financial services and banking'
  }
];

const FRAMEWORKS = [
  {
    id: 'langchain',
    name: 'LangChain',
    description: 'Build applications with LLMs through composability'
  },
  {
    id: 'crewai',
    name: 'CrewAI',
    description: 'Orchestrate role-playing AI agents'
  },
  {
    id: 'autogen',
    name: 'AutoGen',
    description: 'Multi-agent conversation framework'
  }
];

// Add these tool categories
const TOOL_CATEGORIES = [
  {
    name: 'Development',
    tools: [
      { id: 'github', name: 'GitHub', icon: <GitHubIcon />, description: 'Source code management and CI/CD' },
      { id: 'vscode', name: 'VS Code', icon: <CodeIcon />, description: 'Code editing and debugging' },
      { id: 'terminal', name: 'Terminal', icon: <TerminalIcon />, description: 'Command line operations' }
    ]
  },
  {
    name: 'Project Management',
    tools: [
      { id: 'jira', name: 'Jira', icon: <JiraIcon />, description: 'Issue and project tracking' },
      { id: 'confluence', name: 'Confluence', icon: <DescriptionIcon />, description: 'Documentation and knowledge base' },
      { id: 'slack', name: 'Slack', icon: <ChatIcon />, description: 'Team communication' }
    ]
  },
  {
    name: 'Data & Analytics',
    tools: [
      { id: 'jupyter', name: 'Jupyter', icon: <DataObjectIcon />, description: 'Data analysis and visualization' },
      { id: 'tableau', name: 'Tableau', icon: <BarChartIcon />, description: 'Business intelligence' },
      { id: 'bigquery', name: 'BigQuery', icon: <StorageIcon />, description: 'Data warehousing' }
    ]
  }
];

// First, let's define the datasets based on domains
const DOMAIN_DATASETS = {
  healthcare: [
    { id: 'medical_records', name: 'Healthcare Records', description: 'Patient medical records and history' },
    { id: 'clinical_trials', name: 'Clinical Trials', description: 'Clinical trial data and outcomes' },
    { id: 'medical_imaging', name: 'Medical Imaging', description: 'Medical imaging and radiology data' }
  ],
  finance: [
    { id: 'transactions', name: 'Transaction Data', description: 'Financial transaction records' },
    { id: 'market_data', name: 'Market Data', description: 'Market trends and analysis' },
    { id: 'risk_models', name: 'Risk Models', description: 'Financial risk assessment data' }
  ],
  retail: [
    { id: 'sales_data', name: 'Sales Data', description: 'Retail sales transactions' },
    { id: 'inventory', name: 'Inventory Data', description: 'Product inventory management' },
    { id: 'customer_data', name: 'Customer Data', description: 'Customer behavior and preferences' }
  ]
};

function CustomAgentDesigner({ open, onClose, onAgentCreated }) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [toolConfig, setToolConfig] = useState({});
  const [agentConfig, setAgentConfig] = useState({
    name: '',
    description: '',
    tools: [],
    parameters: {}
  });
  const [trainingData, setTrainingData] = useState({
    useExisting: true,
    selectedDatasets: [],
    files: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const steps = [
    'Select Category',
    'Select Domain',
    'Choose Framework',
    'Configure Tools',
    'Agent Configuration',
    'Training Data',
    'Review & Create'
  ];

  const handleNext = async () => {
    if (!isStepValid(activeStep)) {
      setError('Please complete all required fields');
      return;
    }

    if (activeStep === steps.length - 1) {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3001/api/agents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category: selectedCategory,
            domain: selectedDomain,
            framework: selectedFramework,
            config: agentConfig,
            trainingData
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create agent');
        }

        const data = await response.json();
        
        // Call onAgentCreated with the category information
        onAgentCreated({
          ...data.agent,
          category: selectedCategory // Ensure category is included
        });

        // Show success message and close after a delay
        setSuccess('Agent created successfully!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {AGENT_CATEGORIES.map((category) => (
              <Grid item xs={12} md={4} key={category.id}>
                <Card 
                  onClick={() => setSelectedCategory(category.id)}
                  sx={{
                    cursor: 'pointer',
                    border: selectedCategory === category.id ? 2 : 1,
                    borderColor: selectedCategory === category.id ? 'primary.main' : 'divider'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      {React.cloneElement(category.icon, { style: { color: category.color } })}
                      <Typography variant="h6">{category.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            {DOMAINS.map((domain) => (
              <Grid item xs={12} md={4} key={domain.id}>
                <Card 
                  onClick={() => setSelectedDomain(domain.id)}
                  sx={{
                    cursor: 'pointer',
                    border: selectedDomain === domain.id ? 2 : 1,
                    borderColor: selectedDomain === domain.id ? 'primary.main' : 'divider'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{domain.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {domain.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            {FRAMEWORKS.map((framework) => (
              <Grid item xs={12} md={4} key={framework.id}>
                <Card 
                  onClick={() => setSelectedFramework(framework.id)}
                  sx={{
                    cursor: 'pointer',
                    border: selectedFramework === framework.id ? 2 : 1,
                    borderColor: selectedFramework === framework.id ? 'primary.main' : 'divider'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{framework.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {framework.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Configure Tools</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the tools your agent will use to perform tasks
            </Typography>
            
            {TOOL_CATEGORIES.map((category) => (
              <Box key={category.name} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  {category.name}
                </Typography>
                <Grid container spacing={2}>
                  {category.tools.map((tool) => (
                    <Grid item xs={12} md={4} key={tool.id}>
                      <Card
                        onClick={() => {
                          const newTools = agentConfig.tools.includes(tool.id)
                            ? agentConfig.tools.filter(t => t !== tool.id)
                            : [...agentConfig.tools, tool.id];
                          setAgentConfig({...agentConfig, tools: newTools});
                        }}
                        sx={{
                          cursor: 'pointer',
                          border: agentConfig.tools.includes(tool.id) ? 2 : 1,
                          borderColor: agentConfig.tools.includes(tool.id) ? 'primary.main' : 'divider',
                          bgcolor: agentConfig.tools.includes(tool.id) ? 'primary.50' : 'background.paper'
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {React.cloneElement(tool.icon, { 
                              color: agentConfig.tools.includes(tool.id) ? 'primary' : 'action' 
                            })}
                            <Typography variant="subtitle1">{tool.name}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {tool.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Agent Configuration</Typography>
            <TextField
              fullWidth
              label="Agent Name"
              value={agentConfig.name}
              onChange={(e) => setAgentConfig({...agentConfig, name: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={agentConfig.description}
              onChange={(e) => setAgentConfig({...agentConfig, description: e.target.value})}
            />
          </Box>
        );

      case 5:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Training Data</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select data sources to train your agent
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card
                  onClick={() => {
                    if (!trainingData.useExisting) {
                      setTrainingData({...trainingData, useExisting: true});
                    }
                  }}
                  sx={{
                    height: '100%',
                    border: trainingData.useExisting ? 2 : 1,
                    borderColor: trainingData.useExisting ? 'primary.main' : 'divider',
                    bgcolor: trainingData.useExisting ? 'primary.50' : 'background.paper'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <StorageIcon color={trainingData.useExisting ? 'primary' : 'action'} />
                      <Typography variant="h6">Use Existing Datasets</Typography>
                    </Box>
                    
                    {trainingData.useExisting && (
                      <Box onClick={(e) => e.stopPropagation()}>
                        <FormControl fullWidth>
                          <InputLabel id="dataset-select-label">Select Datasets</InputLabel>
                          <Select
                            labelId="dataset-select-label"
                            id="dataset-select"
                            multiple
                            value={trainingData.selectedDatasets}
                            onChange={(event) => {
                              const value = event.target.value;
                              setTrainingData({
                                ...trainingData,
                                selectedDatasets: value
                              });
                            }}
                            renderValue={(selected) => (
                              <Box sx={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: 0.5,
                                minHeight: 30,
                                p: 0.5 
                              }}>
                                {selected.map((value) => {
                                  const dataset = DOMAIN_DATASETS[selectedDomain]?.find(d => d.id === value);
                                  return (
                                    <Chip 
                                      key={value} 
                                      label={dataset?.name || value}
                                      color="primary"
                                      size="small"
                                      sx={{
                                        borderRadius: 1,
                                        '& .MuiChip-label': {
                                          px: 1,
                                        }
                                      }}
                                    />
                                  );
                                })}
                              </Box>
                            )}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 300
                                },
                                sx: {
                                  mt: 1,
                                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                  '& .MuiMenuItem-root': {
                                    py: 1,
                                    px: 2,
                                    borderRadius: 1,
                                    mx: 1,
                                    mb: 0.5,
                                    '&:hover': {
                                      bgcolor: 'primary.50'
                                    },
                                    '&.Mui-selected': {
                                      bgcolor: 'primary.100',
                                      '&:hover': {
                                        bgcolor: 'primary.200'
                                      }
                                    }
                                  }
                                }
                              }
                            }}
                            sx={{
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(0, 0, 0, 0.1)'
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main'
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main'
                              }
                            }}
                          >
                            {DOMAIN_DATASETS[selectedDomain]?.map((dataset) => (
                              <MenuItem 
                                key={dataset.id} 
                                value={dataset.id}
                              >
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {dataset.name}
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ fontSize: '0.8rem' }}
                                  >
                                    {dataset.description}
                                  </Typography>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card
                  onClick={() => setTrainingData({...trainingData, useExisting: false})}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    border: !trainingData.useExisting ? 2 : 1,
                    borderColor: !trainingData.useExisting ? 'primary.main' : 'divider',
                    bgcolor: !trainingData.useExisting ? 'primary.50' : 'background.paper'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CloudUploadIcon color={!trainingData.useExisting ? 'primary' : 'action'} />
                      <Typography variant="h6">Upload Custom Data</Typography>
                    </Box>
                    
                    {!trainingData.useExisting && (
                      <Box>
                        <Button
                          variant="outlined"
                          component="label"
                          fullWidth
                          sx={{ height: 100 }}
                        >
                          <Box sx={{ textAlign: 'center' }}>
                            <CloudUploadIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography>
                              Drop files here or click to upload
                            </Typography>
                          </Box>
                          <input
                            type="file"
                            hidden
                            multiple
                            onChange={(e) => setTrainingData({
                              ...trainingData,
                              files: Array.from(e.target.files)
                            })}
                          />
                        </Button>
                        
                        {trainingData.files.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Selected Files:
                            </Typography>
                            {trainingData.files.map((file, index) => (
                              <Chip
                                key={index}
                                label={file.name}
                                onDelete={() => {
                                  const newFiles = trainingData.files.filter((_, i) => i !== index);
                                  setTrainingData({...trainingData, files: newFiles});
                                }}
                                sx={{ m: 0.5 }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 6:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Review Configuration</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Category: {selectedCategory}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Domain: {selectedDomain}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Framework: {selectedFramework}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Tools: {agentConfig.tools.join(', ')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Name: {agentConfig.name}</Typography>
                <Typography variant="body2">{agentConfig.description}</Typography>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return selectedCategory;
      case 1:
        return selectedDomain;
      case 2:
        return selectedFramework;
      case 3:
        return agentConfig.tools.length > 0;
      case 4:
        return agentConfig.name && agentConfig.description;
      case 5:
        return trainingData.useExisting ? 
          trainingData.selectedDatasets.length > 0 : 
          trainingData.files.length > 0;
      case 6:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>Design Custom Agent</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ my: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {renderStepContent(activeStep)}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>Back</Button>
        )}
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={loading || !isStepValid(activeStep)}
        >
          {activeStep === steps.length - 1 ? 'Create Agent' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomAgentDesigner; 