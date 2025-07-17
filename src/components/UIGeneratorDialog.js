import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Tooltip,
  Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  FolderOpen as FolderIcon,
  Code as CodeIcon,
  Preview as PreviewIcon,
  Save as SaveIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { 
  analyzeProject, 
  generateChanges, 
  applyChanges
} from '../services/uiGenerator';
import { formatFolderStructure } from '../utils/folderUtils';
import { getOpenAIConfig, makeOpenAIRequest } from '../services/configService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'rgba(0, 0, 0, 0.03)',
  borderRadius: theme.shape.borderRadius,
  fontFamily: 'monospace',
  overflow: 'auto',
  maxHeight: '300px',
}));

const steps = ['Project Setup', 'Component Description', 'Review & Deploy'];

// Constants for local storage
const RECENT_PATHS_KEY = 'recentProjectPaths';
const MAX_RECENT_PATHS = 5;

function UIGeneratorDialog({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    projectPath: '',
    componentName: '',
    description: '',
    targetPath: '',
    placement: 'root'
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [folderStructure, setFolderStructure] = useState([]);
  const [recentPaths, setRecentPaths] = useState([]);
  const [showRecentPaths, setShowRecentPaths] = useState(false);
  const [pathValidation, setPathValidation] = useState({
    isValid: false,
    message: ''
  });

  const fileInputRef = useRef(null);

  // Load recent paths on mount
  useEffect(() => {
    const savedPaths = localStorage.getItem(RECENT_PATHS_KEY);
    if (savedPaths) {
      setRecentPaths(JSON.parse(savedPaths));
    }
  }, []);

  // Function to validate path
  const validatePath = async (path) => {
    try {
      if (!path) {
        return { isValid: false, message: 'Path is required' };
      }

      // Basic path validation before making server request
      if (!path.includes('/')) {
        return { isValid: false, message: 'Invalid path format' };
      }

      const response = await fetch('http://localhost:3001/api/validate-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });

      if (!response.ok) {
        throw new Error('Path validation request failed');
      }

      const data = await response.json();
      return {
        isValid: data.isValid,
        message: data.message || (data.isValid ? 'Path is valid' : 'Invalid project path')
      };
    } catch (err) {
      console.error('Path validation error:', err);
      return { 
        isValid: false, 
        message: 'Path validation failed - please check the path and try again' 
      };
    }
  };

  // Function to add path to recent paths
  const addToRecentPaths = (path) => {
    const updatedPaths = [
      path,
      ...recentPaths.filter(p => p !== path)
    ].slice(0, MAX_RECENT_PATHS);
    
    setRecentPaths(updatedPaths);
    localStorage.setItem(RECENT_PATHS_KEY, JSON.stringify(updatedPaths));
  };

  // Function to remove path from recent paths
  const removeFromRecentPaths = (pathToRemove) => {
    const updatedPaths = recentPaths.filter(path => path !== pathToRemove);
    setRecentPaths(updatedPaths);
    localStorage.setItem(RECENT_PATHS_KEY, JSON.stringify(updatedPaths));
  };

  // Add effect to check configuration on mount
  useEffect(() => {
    const checkConfig = async () => {
      const config = await getOpenAIConfig();
      if (!config || !config.apiKey) {
        setError(
          'OpenAI API key not configured. Please go to the Configuration page to set up your API key first.'
        );
      } else {
        setError(''); // Clear error if config is valid
      }
    };
    
    checkConfig();
  }, []);

  const handleFolderSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const validateFiles = (files) => {
    // Only check source code files that we need to analyze
    const allowedExtensions = [
      // JavaScript/TypeScript
      '.js', '.jsx', '.ts', '.tsx',
      // Styles
      '.css', '.scss', '.sass', '.less',
      // Templates
      '.html', '.ejs', '.hbs',
      // Config files we care about
      'package.json', 'tsconfig.json'
    ];
    
    // Filter out any files we don't need to analyze
    const sourceFiles = Array.from(files).filter(file => {
      const filename = file.name.toLowerCase();
      return allowedExtensions.some(ext => 
        filename.endsWith(ext) || 
        // Special handling for package.json and tsconfig.json
        filename === 'package.json' || 
        filename === 'tsconfig.json'
      );
    });

    // Make sure we have at least one valid source file
    if (sourceFiles.length === 0) {
      setError('No source code files found. Please select a folder containing JavaScript/TypeScript files.');
      return false;
    }

    return true;
  };

  const handleFolderChange = async (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        setLoading(true);
        setError('');
        
        // Get the selected project name from the first file's path
        const fullPath = files[0].webkitRelativePath;
        const projectName = fullPath.split('/')[0];

        // Get all root level files to find the project directory
        const rootFiles = Array.from(files).filter(file => 
          file.webkitRelativePath.split('/').length === 2 && 
          file.webkitRelativePath.includes('package.json')
        );

        if (rootFiles.length === 0) {
          throw new Error('Could not find package.json in project root');
        }

        // Get the project path from package.json location
        const packageJsonPath = rootFiles[0].webkitRelativePath;
        const projectPath = packageJsonPath.split('/package.json')[0];

        // Construct the full system path
        const suggestedPath = `/Users/saurabhdubey/AIEntropy/${projectPath}`;
        
        // Get the actual system path by prompting the user with the suggested path
        const systemPath = prompt('Please enter the full system path to your project:', suggestedPath);
        
        if (!systemPath) {
          throw new Error('Project path is required');
        }

        // First analyze the project structure
        const analysisResult = await analyzeProject(files);
        
        if (!analysisResult || !analysisResult.structure) {
          throw new Error('Failed to analyze project structure');
        }

        // Validate the path
        const validation = await validatePath(systemPath);
        setPathValidation(validation);

        if (!validation.isValid) {
          throw new Error(validation.message);
        }

        // Add to recent paths if valid
        addToRecentPaths(systemPath);

        console.log('Project analysis:', {
          projectName,
          systemPath,
          files: analysisResult.structure.files.length
        });
        
        // Update form data with absolute system path
        setFormData(prev => ({
          ...prev,
          projectPath: systemPath,
          projectStructure: {
            files: analysisResult.structure.files || [],
            rootDir: systemPath
          },
          targetPath: `${systemPath}/src/components`
        }));

        setSuccess(`Project loaded successfully at ${systemPath}`);
      } catch (err) {
        console.error('Project analysis error:', err);
        setError('Failed to analyze project: ' + err.message);
        setPathValidation({
          isValid: false,
          message: err.message
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper function to create directory structure
  const createDirectoryStructure = (files) => {
    const structure = [];
    const paths = new Set();

    Array.from(files).forEach(file => {
      const parts = file.webkitRelativePath.split('/');
      let currentPath = '';

      // Skip the first part as it's the root
      for (let i = 1; i < parts.length; i++) {
        currentPath += '/' + parts[i];
        paths.add(currentPath);
      }
    });

    // Convert paths to tree structure
    return Array.from(paths).sort().map(path => ({
      name: path.split('/').pop(),
      path: path,
      type: path.includes('.') ? 'file' : 'directory'
    }));
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      setError('');

      if (activeStep === 0) {
        // Validate project path
        if (!formData.projectPath || !formData.projectStructure) {
          throw new Error('Please select a project folder first');
        }
        setActiveStep((prev) => prev + 1);
      } else if (activeStep === 1) {
        // Validate component details
        if (!formData.componentName || !formData.description || !formData.targetPath) {
          throw new Error('Please fill in all fields');
        }

        try {
          // Generate changes instead of component
          const result = await generateChanges(formData);
          if (result.changes) {
            setGeneratedCode(JSON.stringify(result.changes, null, 2));
            setActiveStep((prev) => prev + 1);
          } else {
            throw new Error('No changes generated');
          }
        } catch (err) {
          console.error('Generation error in dialog:', err);
          throw new Error(`Failed to generate changes: ${err.message}`);
        }
      }
    } catch (err) {
      console.error('Error in handleNext:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleDeploy = async () => {
    try {
      setLoading(true);
      setError('');

      // Parse the generated changes
      const changes = typeof generatedCode === 'string' ? 
        JSON.parse(generatedCode) : generatedCode;

      // Step 1: Show what's being analyzed
      setSuccess('Analyzing project structure...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Show what changes are being made
      setSuccess('Generating required changes...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 3: Apply the changes
      setSuccess('Applying changes to project...');
      const result = await applyChanges(formData, changes);
      
      if (result.success) {
        const createdFiles = result.files?.created || [];
        const modifiedFiles = result.files?.modified || [];
        
        setSuccess(`
          Changes applied successfully!
          ${createdFiles.length > 0 ? `\nCreated: ${createdFiles.join(', ')}` : ''}
          ${modifiedFiles.length > 0 ? `\nModified: ${modifiedFiles.join(', ')}` : ''}
        `);
        
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        throw new Error(result.message || 'Some changes failed to apply');
      }
    } catch (err) {
      console.error('Deployment error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a helper function to navigate to config
  const handleGoToConfig = () => {
    onClose(); // Close the dialog
    // Use your routing method to navigate to config page
    window.location.href = '/configuration';
  };

  // Render the path selection UI
  const renderPathSelection = () => (
    <Box sx={{ mt: 2 }}>
      {/* Hidden file input for directory selection */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFolderChange}
        style={{ display: 'none' }}
        webkitdirectory=""
        directory=""
        multiple
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          label="Project Path"
          value={formData.projectPath}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FolderIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Show Recent Paths">
                  <IconButton onClick={() => setShowRecentPaths(!showRecentPaths)}>
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
                {pathValidation.isValid ? (
                  <Tooltip title="Path is valid">
                    <CheckIcon color="success" />
                  </Tooltip>
                ) : (
                  pathValidation.message && (
                    <Tooltip title={pathValidation.message}>
                      <ErrorIcon color="error" />
                    </Tooltip>
                  )
                )}
              </InputAdornment>
            ),
          }}
          error={!pathValidation.isValid && !!pathValidation.message}
          helperText={pathValidation.message}
        />
        <Button
          variant="contained"
          onClick={handleFolderSelect}
          startIcon={<FolderIcon />}
        >
          Browse
        </Button>
      </Box>

      {/* Recent Paths Collapse */}
      <Collapse in={showRecentPaths}>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Recent Projects
          </Typography>
          <List dense>
            {recentPaths.map((path, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => removeFromRecentPaths(path)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText
                  primary={path.split('/').pop()}
                  secondary={path}
                />
                <Chip
                  label="Select"
                  size="small"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      projectPath: path,
                      targetPath: `${path}/src/components`
                    }));
                    setShowRecentPaths(false);
                  }}
                  sx={{ ml: 1 }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Collapse>
    </Box>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPathSelection();
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Component Name"
              value={formData.componentName}
              onChange={(e) => setFormData({ ...formData, componentName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Component Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              helperText="Describe what the UI component should do and where it should appear in the app"
              placeholder="Example: Create a responsive navigation header with a logo, menu items, and a search bar. Place it at the top of the app."
            />
            <TextField
              select
              fullWidth
              label="Component Location"
              value={formData.placement || 'root'}
              onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
              sx={{ mt: 2 }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="root">Root Level (Direct child of App)</option>
              <option value="header">Header Section</option>
              <option value="main">Main Content Area</option>
              <option value="footer">Footer Section</option>
              <option value="sidebar">Sidebar</option>
            </TextField>
            <TextField
              fullWidth
              label="Target Path"
              value={formData.targetPath}
              onChange={(e) => setFormData({ ...formData, targetPath: e.target.value })}
              sx={{ mt: 2 }}
              helperText="Component will be created here and imported into App.js"
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Generated Component Code:
            </Typography>
            <StyledPaper>
              <pre>{generatedCode}</pre>
            </StyledPaper>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CodeIcon color="primary" />
          <Typography variant="h6">UI Component Generator</Typography>
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

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }} 
            onClose={() => setError('')}
            action={
              error.includes('OpenAI API key') && (
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={handleGoToConfig}
                >
                  Go to Configuration
                </Button>
              )
            }
          >
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            Back
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleDeploy}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            Deploy Component
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <PreviewIcon />}
          >
            {activeStep === 1 ? 'Generate' : 'Next'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default UIGeneratorDialog; 