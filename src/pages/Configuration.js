import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOpenAIConfig } from '../services/configService';
import { getJiraConfig, saveJiraConfig } from '../services/jiraService';
import {
  Box, Typography, Grid, Card, TextField, Button, Alert, Snackbar,
  InputAdornment, IconButton, MenuItem, CircularProgress
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

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
}));

// Define configSections before using it in the component
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
  }
];

function Configuration() {
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isEnvKeyAvailable, setIsEnvKeyAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [jiraConfig, setJiraConfig] = useState({
    url: '',
    username: '',
    token: ''
  });

  // First useEffect for OpenAI config
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        const config = await getOpenAIConfig();
        if (!config) {
          setIsEnvKeyAvailable(false);
          return;
        }

        if (config.isValid) {
          setIsEnvKeyAvailable(true);
          setFormData(prev => ({
            ...prev,
            openaiModel: config.model || 'gpt-4'
          }));
        } else {
          setIsEnvKeyAvailable(false);
        }
      } catch (error) {
        console.error('Configuration error:', error);
        setIsEnvKeyAvailable(false);
      }
    };

    loadConfigs();
  }, []);

  // Add useEffect to fetch config on mount
  useEffect(() => {
    fetchJiraConfig();
  }, []);

  const handleChange = (name) => (event) => {
    setFormData(prev => ({
      ...prev,
      [name]: event.target.value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async (section) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (section.title === 'OpenAI Configuration') {
        // ... existing OpenAI config code ...
      } else if (section.title === 'Jira Configuration') {
        const data = await saveJiraConfig({
          url: formData.jiraUrl,
          username: formData.jiraUsername,
          token: formData.jiraToken
        });

        if (data.success) {
          setSuccess('Jira configuration saved successfully');
          await fetchJiraConfig(); // Refresh the config
        } else {
          throw new Error(data.error || 'Failed to save configuration');
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch('/api/jira/test');
      
      if (!response.ok) {
        throw new Error(`Connection test failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setSuccess('Jira connection test successful!');
      } else {
        throw new Error(data.error || 'Connection test failed');
      }
    } catch (error) {
      console.error('Test error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchJiraConfig = async () => {
    try {
      setLoading(true);
      const data = await getJiraConfig();
      
      if (data.success && data.isConfigured) {
        setFormData(prev => ({
          ...prev,
          jiraUrl: data.url,
          jiraUsername: data.username,
          jiraToken: '••••••••' // Don't show actual token
        }));
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600} color="primary">
        Configuration
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Configure your integrations and settings
      </Typography>

      <Grid container spacing={3}>
        {configSections.map((section, index) => (
          <Grid item xs={12} key={section.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StyledCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  {section.icon}
                  <Typography variant="h6">{section.title}</Typography>
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
                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                        onClick={() => handleSave(section)}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Configuration'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </StyledCard>
            </motion.div>
          </Grid>
        ))}
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

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          onClick={handleTest}
          disabled={loading}
        >
          Test Connection
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
}

export default Configuration; 