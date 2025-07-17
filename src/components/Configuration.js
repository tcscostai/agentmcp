import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOpenAIConfig } from '../services/configService';
import { CircularProgress } from '@mui/material';
import {
  Box, Typography, Grid, Card, TextField, Button, Alert, Snackbar,
  InputAdornment, IconButton, MenuItem
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Api as ApiIcon,
  BugReport as JiraIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Speed as SpeedIcon,
  Assessment as RallyIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

console.log('RallyIcon available:', !!RallyIcon);

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
}));

const configSections = [
  {
    title: 'OpenAI Configuration',
    icon: <PsychologyIcon />,
    fields: [
      {
        name: 'openaiKey',
        label: 'API Key',
        type: 'password',
        helperText: 'Enter your OpenAI API key'
      },
      {
        name: 'openaiModel',
        label: 'Model',
        type: 'select',
        options: [
          { value: 'gpt-4', label: 'GPT-4' },
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
        ],
        helperText: 'Select OpenAI model'
      }
    ]
  },
  {
    title: 'Jira Configuration',
    icon: <JiraIcon />,
    fields: [
      {
        name: 'jiraUrl',
        label: 'Jira URL',
        type: 'text',
        helperText: 'Enter your Jira instance URL'
      },
      {
        name: 'jiraUsername',
        label: 'Username',
        type: 'text',
        helperText: 'Enter your Jira username'
      },
      {
        name: 'jiraToken',
        label: 'API Token',
        type: 'password',
        helperText: 'Enter your Jira API token'
      }
    ]
  },
  {
    title: 'Rally Configuration',
    icon: <RallyIcon />,
    fields: [
      {
        name: 'rallyApiKey',
        label: 'Rally API Key',
        type: 'password',
        helperText: 'Enter your Rally API key',
      },
      {
        name: 'rallyWorkspace',
        label: 'Workspace',
        type: 'text',
        helperText: 'Enter your Rally workspace name',
      },
      {
        name: 'rallyProject',
        label: 'Project',
        type: 'text',
        helperText: 'Enter your Rally project name',
      },
      {
        name: 'rallyEnvironment',
        label: 'Environment',
        type: 'select',
        options: [
          { value: 'production', label: 'Production' },
          { value: 'staging', label: 'Staging' },
          { value: 'sandbox', label: 'Sandbox' }
        ],
        helperText: 'Select Rally environment'
      }
    ]
  },
  {
    title: 'GitHub Configuration',
    icon: <GitHubIcon />,
    fields: [
      {
        name: 'githubToken',
        label: 'GitHub Token',
        type: 'password',
        helperText: 'Enter your GitHub personal access token'
      },
      {
        name: 'githubUsername',
        label: 'Username',
        type: 'text',
        helperText: 'Enter your GitHub username'
      }
    ]
  }
];

function Configuration() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEnvKeyAvailable, setIsEnvKeyAvailable] = useState(false);

  useEffect(() => {
    // Load saved configurations
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      // Load OpenAI config
      const openaiConfig = await getOpenAIConfig();
      if (openaiConfig) {
        setFormData(prev => ({
          ...prev,
          openaiKey: openaiConfig.apiKey,
          openaiModel: openaiConfig.model
        }));
        setIsEnvKeyAvailable(openaiConfig.source === 'env');
      }

      // Load other configurations...
    } catch (error) {
      console.error('Error loading configurations:', error);
    }
  };

  const handleChange = (name) => (event) => {
    setFormData({ ...formData, [name]: event.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const testRallyConnection = async () => {
    try {
      setIsTestingConnection(true);
      setError('');

      const response = await fetch('http://localhost:3001/api/config/rally/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: formData.rallyApiKey,
          workspace: formData.rallyWorkspace,
          project: formData.rallyProject,
          environment: formData.rallyEnvironment
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect to Rally');
      }

      setSnackbar({
        open: true,
        message: 'Successfully connected to Rally!',
        severity: 'success'
      });
    } catch (err) {
      setError(`Rally connection failed: ${err.message}`);
      setSnackbar({
        open: true,
        message: `Rally connection failed: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = async (section) => {
    try {
      setLoading(true);
      setError('');

      if (section.title === 'Rally Configuration') {
        // Validate Rally fields
        if (!formData.rallyApiKey || !formData.rallyWorkspace || !formData.rallyProject) {
          throw new Error('All Rally fields are required');
        }

        // Save Rally configuration
        const response = await fetch('http://localhost:3001/api/config/rally', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: formData.rallyApiKey,
            workspace: formData.rallyWorkspace,
            project: formData.rallyProject,
            environment: formData.rallyEnvironment
          })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to save Rally configuration');
        }
      }

      setSnackbar({
        open: true,
        message: `${section.title} saved successfully!`,
        severity: 'success'
      });
    } catch (err) {
      setError(err.message);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  console.log('Config Sections:', configSections);
  console.log('Current Form Data:', formData);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600} color="primary">
        Configuration
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Configure your integration settings
      </Typography>

      <Grid container spacing={3}>
        {configSections.map((section, index) => {
          console.log('Rendering section:', section.title);
          return (
            <Grid item xs={12} key={section.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StyledCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    {section.icon}
                    <Typography variant="h6">
                      {section.title}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {section.fields.map((field) => (
                      <Grid item xs={12} md={6} key={field.name}>
                        {field.type === 'select' ? (
                          <TextField
                            select
                            fullWidth
                            label={field.label}
                            value={formData[field.name] || ''}
                            onChange={handleChange(field.name)}
                            helperText={field.helperText}
                          >
                            {field.options?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : (
                          <TextField
                            fullWidth
                            label={field.label}
                            type={field.type === 'password' && !showPassword[field.name] ? 'password' : 'text'}
                            value={formData[field.name] || ''}
                            onChange={handleChange(field.name)}
                            helperText={field.helperText}
                            InputProps={field.type === 'password' ? {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => togglePasswordVisibility(field.name)}
                                    edge="end"
                                  >
                                    {showPassword[field.name] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            } : undefined}
                          />
                        )}
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={() => handleSave(section)}
                          disabled={loading}
                        >
                          Save {section.title}
                        </Button>
                        {section.title === 'Rally Configuration' && (
                          <Button
                            variant="outlined"
                            onClick={testRallyConnection}
                            disabled={isTestingConnection}
                            startIcon={isTestingConnection ? <CircularProgress size={20} /> : null}
                          >
                            {isTestingConnection ? 'Testing...' : 'Test Connection'}
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </StyledCard>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Configuration; 