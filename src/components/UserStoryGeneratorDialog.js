import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Collapse,
  Badge,
  Autocomplete,
  Rating,
  Switch,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Check as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ArrowDropDown as ArrowDropDownIcon,
  PersonOutline as PersonOutlineIcon,
  Assessment as AssessmentIcon,
  TrackChanges as TrackChangesIcon,
  Psychology as PsychologyIcon,
  FormatListBulleted as FormatListBulletedIcon,
  Speed as SpeedIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  EmojiObjects as EmojiObjectsIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBackIos as ArrowBackIosIcon,
  BusinessCenter as BusinessCenterIcon,
  LightbulbOutlined as LightbulbOutlinedIcon,
  InsertChartOutlined as InsertChartOutlinedIcon,
  PersonAdd as PersonAddIcon,
  Star as StarIcon,
  PriorityHigh as PriorityHighIcon,
  Cancel as CancelIcon,
  FileUpload as FileUploadIcon,
  DesignServices as DesignIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { getJiraConfig, getJiraProjects } from '../services/jiraService';

// Styled components for enhanced UI
const StoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '6px',
    height: '100%',
    background: theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.borderRadius * 2,
    borderBottomLeftRadius: theme.shape.borderRadius * 2,
  },
}));

const AnimatedBox = styled(motion.div)({
  width: '100%',
});

const CriteriaItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  backgroundColor: 'rgba(25, 118, 210, 0.05)',
  border: '1px solid rgba(25, 118, 210, 0.1)',
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.success.main,
    color: '#fff',
  },
}));

const PersonaAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  width: 70,
  height: 70,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  border: `2px solid ${theme.palette.background.paper}`,
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    minHeight: 20,
  },
  '& .MuiStepLabel-iconContainer': {
    paddingRight: theme.spacing(1),
  },
}));

const ColorBand = styled(Box)(({ theme, color = 'primary.main' }) => ({
  width: '100%',
  height: '8px',
  background: theme.palette[color.split('.')[0]][color.split('.')[1] || 'main'],
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

const PriorityChip = styled(Chip)(({ theme, priority }) => {
  const colors = {
    Highest: { bg: theme.palette.error.main, color: '#fff' },
    High: { bg: theme.palette.error.light, color: theme.palette.error.contrastText },
    Medium: { bg: theme.palette.warning.light, color: theme.palette.warning.contrastText },
    Low: { bg: theme.palette.success.light, color: theme.palette.success.contrastText },
    Lowest: { bg: theme.palette.success.light, color: theme.palette.success.contrastText },
  };

  return {
    backgroundColor: colors[priority]?.bg || theme.palette.grey[300],
    color: colors[priority]?.color || theme.palette.text.primary,
    fontWeight: 600,
    '& .MuiChip-icon': {
      color: 'inherit',
    },
  };
});

// Enhanced steps with better descriptions
const steps = [
  {
    label: 'Define Requirements',
    description: 'Describe the feature you want to develop in detailed requirements',
    icon: <AssignmentIcon />
  },
  {
    label: 'Review Generated Story',
    description: 'Preview and customize the AI-generated user story',
    icon: <PreviewIcon />
  },
  {
    label: 'Configure & Publish',
    description: 'Set up Jira project details and create the story',
    icon: <SaveIcon />
  }
];

// User personas for story perspectives
const userPersonas = [
  { id: 'endUser', name: 'End User', description: 'Focus on how this feature benefits the end user', icon: <PersonOutlineIcon /> },
  { id: 'businessStakeholder', name: 'Business Stakeholder', description: 'Focus on business value and outcomes', icon: <BusinessCenterIcon /> },
  { id: 'developer', name: 'Developer', description: 'Focus on technical implementation details', icon: <PsychologyIcon /> },
];

function UserStoryGeneratorDialog({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedStory, setGeneratedStory] = useState(null);
  const [jiraConfig, setJiraConfig] = useState(null);
  const [success, setSuccess] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('endUser');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [qualityScore, setQualityScore] = useState({
    clarity: 0,
    completeness: 0,
    testability: 0,
    value: 0,
    overall: 0
  });
  const [suggestions, setSuggestions] = useState([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customCriteria, setCustomCriteria] = useState('');
  const [storyPointOptions] = useState([1, 2, 3, 5, 8, 13]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [validationStatus, setValidationStatus] = useState({
    summary: true,
    description: true,
    acceptanceCriteria: true
  });
  const [generationProgress, setGenerationProgress] = useState(0);
  const [editedStory, setEditedStory] = useState(null);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [documentText, setDocumentText] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [figmaJson, setFigmaJson] = useState(null);
  const [figmaPreview, setFigmaPreview] = useState(null);
  const [figmaError, setFigmaError] = useState('');
  const [generateFigmaJson, setGenerateFigmaJson] = useState(false);
  const [previewFigmaPrototype, setPreviewFigmaPrototype] = useState(false);
  const [figmaJsonFile, setFigmaJsonFile] = useState(null);
  const [figmaJsonFileName, setFigmaJsonFileName] = useState('');
  const [figmaJsonUploaded, setFigmaJsonUploaded] = useState(false);
  const fileInputRef = React.useRef(null);
  const figmaJsonInputRef = React.useRef(null);
  const [additionalContextOpen, setAdditionalContextOpen] = useState(false);
  const [additionalContext, setAdditionalContext] = useState('');
  const [contextFiles, setContextFiles] = useState([]);
  const [contextFileInputRef] = useState(React.createRef());

  const fetchJiraData = async () => {
    try {
      setLoading(true);
      setError(null);

      // First verify Jira is configured
      const configData = await getJiraConfig();
      if (!configData.success || !configData.isConfigured) {
        console.warn('Jira is not configured, continuing with limited functionality');
        setJiraConfig(null);
        setProjects([]);
      } else {
        // Then fetch projects
        try {
          const projectsData = await getJiraProjects();
          if (!projectsData.success || !projectsData.isConfigured) {
            console.warn('Failed to fetch Jira projects, continuing with limited functionality');
            setProjects([]);
          } else {
            setProjects(projectsData.projects);
            if (projectsData.projects.length > 0) {
              setSelectedProject(projectsData.projects[0].key);
            }
          }
        } catch (projectError) {
          console.error('Error fetching Jira projects:', projectError);
          setProjects([]);
        }
        
        setJiraConfig(configData);
      }
    } catch (error) {
      console.error('Error fetching Jira data:', error);
      setJiraConfig(null);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchJiraData();
      setActiveStep(0);
      setRequirements('');
      setGeneratedStory(null);
      setEditedStory(null);
      setSuccess('');
      setError(null);
      setIsCustomizing(false);
      setCustomCriteria('');
      setShowAdvancedOptions(false);
      setQualityScore({
        clarity: 0,
        completeness: 0,
        testability: 0,
        value: 0,
        overall: 0
      });
      setSuggestions([]);
      setGenerationProgress(0);
      setDocumentUploaded(false);
      setDocumentText('');
      setDocumentName('');
      setUploadError('');
      setFigmaJson(null);
      setFigmaPreview(null);
      setFigmaError('');
      setGenerateFigmaJson(false);
      setPreviewFigmaPrototype(false);
      setFigmaJsonFile(null);
      setFigmaJsonFileName('');
      setFigmaJsonUploaded(false);
      setAdditionalContextOpen(false);
      setAdditionalContext('');
      setContextFiles([]);
    }
  }, [open]);

  // Simulate progress for better UX
  const simulateProgress = () => {
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    return () => clearInterval(interval);
  };

  const generateStory = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Start progress simulation
      const stopProgress = simulateProgress();
      
      console.log('Sending requirements:', requirements);
      console.log('Using persona:', selectedPersona);
      console.log('Figma JSON available:', !!figmaJson);

      const response = await fetch('/api/generate/story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          requirements,
          persona: selectedPersona,
          figmaJson: figmaJson,
          documentText: documentText
        }),
      });

      const data = await response.json();
      console.log('Received response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate story');
      }

      // Validate the response structure
      if (!data.summary || !data.description || !Array.isArray(data.acceptanceCriteria)) {
        console.error('Invalid story format:', data);
        throw new Error('Invalid story format received');
      }

      // Ensure all required fields are present
      const storyData = {
        summary: data.summary,
        description: data.description,
        acceptanceCriteria: data.acceptanceCriteria,
        priority: data.priority || 'Medium',
        storyPoints: data.storyPoints || 3
      };

      console.log('Generated story:', storyData);
      setGeneratedStory(storyData);
      setEditedStory(storyData);
      
      // Generate quality analysis
      analyzeStoryQuality(storyData);
      
      if (selectedPersona === 'developer') {
        if (generateFigmaJson) {
          try {
            const response = await fetch('/api/generate/figma-json', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ requirements, documentText, userStory: data }),
            });
            const figmaData = await response.json();
            if (!response.ok) throw new Error(figmaData.error || 'Failed to generate Figma JSON');
            setFigmaJson(figmaData.json);
            setFigmaError('');
            if (previewFigmaPrototype) {
              // Generate preview only if JSON is generated
              try {
                const previewResp = await fetch('/api/generate/figma-preview', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ figmaJson: figmaData.json, requirements, documentText }),
                });
                const previewData = await previewResp.json();
                if (!previewResp.ok) throw new Error(previewData.error || 'Failed to generate preview');
                setFigmaPreview(previewData.previewUrl);
              } catch (err) {
                setFigmaError(err.message || 'Failed to generate preview');
              }
            } else {
              setFigmaPreview(null);
            }
          } catch (err) {
            setFigmaError(err.message || 'Failed to generate Figma JSON');
            setFigmaJson(null);
            setFigmaPreview(null);
          }
        } else {
          setFigmaJson(null);
          setFigmaPreview(null);
        }
      }
      
      setActiveStep(1);
    } catch (error) {
      console.error('Story generation error:', error);
      setError(typeof error === 'string' ? error : error.message || 'Failed to generate story');
    } finally {
      setGenerationProgress(100);
      setLoading(false);
    }
  };
  
  const analyzeStoryQuality = (story) => {
    setIsAnalyzing(true);
    
    // Simulate an analysis (in a real app, this would call an API)
    setTimeout(() => {
      // Generate realistic quality scores
      const clarity = Math.floor(Math.random() * 20) + 80; // 80-100
      const completeness = Math.floor(Math.random() * 20) + 75; // 75-95
      const testability = Math.floor(Math.random() * 25) + 70; // 70-95
      const value = Math.floor(Math.random() * 15) + 80; // 80-95
      const overall = Math.floor((clarity + completeness + testability + value) / 4);
      
      setQualityScore({
        clarity,
        completeness,
        testability,
        value,
        overall
      });
      
      // Generate suggestions based on lower scores
      const newSuggestions = [];
      
      if (completeness < 85) {
        newSuggestions.push({
          title: "Add More Context",
          description: "Consider including more background information in the description."
        });
      }
      
      if (testability < 80) {
        newSuggestions.push({
          title: "Improve Acceptance Criteria",
          description: "Make acceptance criteria more specific and measurable."
        });
      }
      
      if (clarity < 85) {
        newSuggestions.push({
          title: "Clarify User Benefit",
          description: "Explicitly state how this benefits the end user in the story."
        });
      }
      
      setSuggestions(newSuggestions);
      setIsAnalyzing(false);
    }, 1500);
  };

  const pushToJira = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!jiraConfig || !jiraConfig.isConfigured) {
        throw new Error('Jira is not configured. Please configure Jira in the Configuration page before creating stories.');
      }
      
      if (!selectedProject) {
        throw new Error('Please select a project');
      }
      
      if (!editedStory) {
        throw new Error('No story to create');
      }
      
      // Validate story fields
      const storyValid = validateStory(editedStory);
      if (!storyValid) {
        throw new Error('Please address the validation errors before creating the story');
      }
      
      // Remove priority if it's not needed
      const { priority, ...otherFields } = editedStory;
      const storyData = {
        ...otherFields,
        projectKey: selectedProject
      };
      
      console.log('Pushing story to Jira:', storyData);

      const response = await fetch('/api/jira/create-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyData),
      });

      const data = await response.json();
      console.log('Jira creation response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create story in Jira');
      }

      setSuccess(`Story created successfully in Jira with key: ${data.key}`);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error pushing to Jira:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const validateStory = (story) => {
    const validation = {
      summary: !!story.summary && story.summary.length > 5,
      description: !!story.description && story.description.length > 10,
      acceptanceCriteria: Array.isArray(story.acceptanceCriteria) && story.acceptanceCriteria.length > 0
    };
    
    setValidationStatus(validation);
    return Object.values(validation).every(isValid => isValid);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      generateStory();
    } else if (activeStep === 1) {
      // Handle the case when Jira is not configured but proceed to next step
      setActiveStep(2);
    } else if (activeStep === 2) {
      if (!jiraConfig || !jiraConfig.isConfigured) {
        // For step 3 (index 2), if Jira is not configured, just show a success message
        setSuccess('User story has been successfully generated!');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        pushToJira();
      }
    }
  };
  
  const handleAddCustomCriteria = () => {
    if (!customCriteria.trim()) return;
    
    setEditedStory(prev => ({
      ...prev,
      acceptanceCriteria: [...prev.acceptanceCriteria, customCriteria]
    }));
    
    setCustomCriteria('');
  };
  
  const handleRemoveCriteria = (index) => {
    setEditedStory(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.filter((_, i) => i !== index)
    }));
  };
  
  const handleUpdateStoryPoints = (points) => {
    setEditedStory(prev => ({
      ...prev,
      storyPoints: points
    }));
  };
  
  const handleUpdatePriority = (priority) => {
    setEditedStory(prev => ({
      ...prev,
      priority: priority
    }));
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if the file is a PDF
    if (file.type !== 'application/pdf') {
      setUploadError('Please upload a PDF file');
      return;
    }

    setLoading(true);
    setUploadError('');
    setDocumentName(file.name);

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);

      // Upload the file to the server
      const response = await fetch('/api/generate/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract text from PDF');
      }

      // Set the extracted text as requirements
      setDocumentText(data.text);
      setRequirements(data.text);
      setDocumentUploaded(true);
      setSuccess('Document uploaded and text extracted successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      setUploadError(error.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDocument = () => {
    setDocumentUploaded(false);
    setDocumentText('');
    setDocumentName('');
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFigmaJsonUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if the file is a JSON
    if (file.type !== 'application/json') {
      setFigmaError('Please upload a JSON file');
      return;
    }

    setLoading(true);
    setFigmaError('');
    setFigmaJsonFileName(file.name);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const jsonContent = JSON.parse(e.target.result);
          setFigmaJson(jsonContent);
          setFigmaJsonUploaded(true);
          setSuccess('Figma JSON uploaded successfully');
        } catch (error) {
          setFigmaError('Invalid JSON file format');
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error reading Figma JSON:', error);
      setFigmaError(error.message || 'Failed to read Figma JSON');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFigmaJson = () => {
    setFigmaJsonUploaded(false);
    setFigmaJson(null);
    setFigmaJsonFileName('');
    setFigmaError('');
    if (figmaJsonInputRef.current) {
      figmaJsonInputRef.current.value = '';
    }
  };

  const handleAddContext = () => {
    setAdditionalContextOpen(true);
  };

  const handleCloseContext = () => {
    setAdditionalContextOpen(false);
  };

  const handleSaveContext = () => {
    if (additionalContext.trim()) {
      setRequirements(prev => prev + '\n\nAdditional Context:\n' + additionalContext);
    }
    setAdditionalContextOpen(false);
    setAdditionalContext('');
  };

  const handleContextFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setContextFiles(prev => [...prev, ...files]);
    
    // Read and extract text from files
    for (const file of files) {
      try {
        const text = await file.text();
        setAdditionalContext(prev => prev + '\n\n' + text);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  const handleRemoveContextFile = (index) => {
    setContextFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <AnimatedBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mt: 2, mb: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon color="primary" fontSize="small" />
                    Feature Requirements
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Describe the feature you want to implement in detail. Include context, goals, and constraints.
                  </Typography>
                  
                  {/* Document Upload Section */}
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      borderStyle: 'dashed',
                      borderColor: 'divider',
                      backgroundColor: 'background.default',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '100px',
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                          ref={fileInputRef}
                          id="pdf-upload-input"
                        />
                        
                        {documentUploaded ? (
                          <Box sx={{ width: '100%', textAlign: 'center' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <CheckIcon color="success" fontSize="small" />
                              Document Uploaded: {documentName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Text extracted and added to requirements below
                            </Typography>
                            <Button 
                              variant="outlined" 
                              color="error" 
                              size="small"
                              onClick={handleRemoveDocument}
                              startIcon={<CancelIcon />}
                            >
                              Remove Document
                            </Button>
                          </Box>
                        ) : (
                          <>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                              Upload a PDF Document
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                              Upload a document with requirements to automatically extract the text
                            </Typography>
                            <Button 
                              variant="outlined" 
                              onClick={() => fileInputRef.current.click()}
                              startIcon={<FileUploadIcon />}
                            >
                              Choose PDF File
                            </Button>
                            {uploadError && (
                              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                                {uploadError}
                              </Typography>
                            )}
                          </>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFigmaJsonUpload}
                          style={{ display: 'none' }}
                          ref={figmaJsonInputRef}
                          id="figma-json-upload-input"
                        />
                        
                        {figmaJsonUploaded ? (
                          <Box sx={{ width: '100%', textAlign: 'center' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <CheckIcon color="success" fontSize="small" />
                              Figma JSON Uploaded: {figmaJsonFileName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              JSON will be used to enhance story generation
                            </Typography>
                            <Button 
                              variant="outlined" 
                              color="error" 
                              size="small"
                              onClick={handleRemoveFigmaJson}
                              startIcon={<CancelIcon />}
                            >
                              Remove JSON
                            </Button>
                          </Box>
                        ) : (
                          <>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                              Upload Figma JSON
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                              Upload Figma JSON to enhance story generation with screen flows
                            </Typography>
                            <Button 
                              variant="outlined" 
                              onClick={() => figmaJsonInputRef.current.click()}
                              startIcon={<FileUploadIcon />}
                            >
                              Choose JSON File
                            </Button>
                            {figmaError && (
                              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                                {figmaError}
                              </Typography>
                            )}
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Add More Context Button - Moved here */}
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleAddContext}
                      sx={{
                        borderRadius: '20px',
                        textTransform: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease',
                        minWidth: '200px',
                        py: 1,
                      }}
                    >
                      Add More Context
                    </Button>
                  </Box>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    label="Requirements"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Describe the feature requirements in detail..."
                    helperText="Be as specific as possible about what the feature should do, who it's for, and why it matters"
                    variant="outlined"
                    sx={{ mt: 1, mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <ColorBand color="primary.main" />
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Story Perspective
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                        Choose a persona to optimize the story format:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {userPersonas.map(persona => (
                          <Box
                            key={persona.id}
                            onClick={() => setSelectedPersona(persona.id)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 1.5,
                              borderRadius: 1,
                              cursor: 'pointer',
                              border: '1px solid',
                              borderColor: selectedPersona === persona.id ? 'primary.main' : 'divider',
                              bgcolor: selectedPersona === persona.id ? 'primary.light' : 'background.paper',
                              color: selectedPersona === persona.id ? 'primary.contrastText' : 'text.primary',
                              opacity: selectedPersona === persona.id ? 1 : 0.7,
                              '&:hover': {
                                bgcolor: selectedPersona === persona.id ? 'primary.light' : 'action.hover',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: selectedPersona === persona.id ? 'primary.dark' : 'action.selected',
                                color: 'white',
                                mr: 1.5
                              }}
                            >
                              {persona.icon}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">{persona.name}</Typography>
                              <Typography variant="caption" color={selectedPersona === persona.id ? 'inherit' : 'text.secondary'}>
                                {persona.description}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                  {selectedPersona === 'developer' && (
                    <Card variant="outlined" sx={{ mt: 2, mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          <DesignIcon fontSize="small" sx={{ mr: 1, color: 'primary.main', verticalAlign: 'middle' }} />
                          Developer Design Options
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Switch
                              checked={generateFigmaJson}
                              onChange={e => setGenerateFigmaJson(e.target.checked)}
                              color="primary"
                              id="toggle-generate-figma-json"
                            />
                            <Typography htmlFor="toggle-generate-figma-json" variant="body1" sx={{ fontWeight: 500 }}>
                              Generate Figma JSON
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Switch
                              checked={previewFigmaPrototype}
                              onChange={e => setPreviewFigmaPrototype(e.target.checked)}
                              color="primary"
                              id="toggle-preview-figma-prototype"
                            />
                            <Typography htmlFor="toggle-preview-figma-prototype" variant="body1" sx={{ fontWeight: 500 }}>
                              Preview Figma Prototype
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        <LightbulbOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'warning.main', verticalAlign: 'middle' }} />
                        Tips for Great Requirements
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Include the 'why' behind the feature"
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Describe the user problem being solved" 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Mention any constraints or limitations"
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Specify expected behavior"
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Upload PDF documents for detailed specs"
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold' }}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Additional Context Dialog */}
            <Dialog
              open={additionalContextOpen}
              onClose={handleCloseContext}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  overflow: 'hidden'
                }
              }}
            >
              <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon />
                <Typography variant="h6">Add More Context</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton color="inherit" onClick={handleCloseContext} size="small">
                  <CancelIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Additional Context
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Add any additional context, documentation, or requirements that will help generate a better user story.
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      value={additionalContext}
                      onChange={(e) => setAdditionalContext(e.target.value)}
                      placeholder="Enter additional context, documentation, or requirements..."
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderStyle: 'dashed',
                        borderColor: 'divider',
                        backgroundColor: 'background.default',
                      }}
                    >
                      <input
                        type="file"
                        multiple
                        onChange={handleContextFileUpload}
                        style={{ display: 'none' }}
                        ref={contextFileInputRef}
                      />
                      <Box sx={{ textAlign: 'center' }}>
                        <Button
                          variant="outlined"
                          onClick={() => contextFileInputRef.current.click()}
                          startIcon={<FileUploadIcon />}
                          sx={{ mb: 2 }}
                        >
                          Upload Files
                        </Button>
                        <Typography variant="body2" color="text.secondary">
                          Upload additional documentation files (PDF, TXT, DOC)
                        </Typography>
                      </Box>

                      {contextFiles.length > 0 && (
                        <List dense sx={{ mt: 2 }}>
                          {contextFiles.map((file, index) => (
                            <ListItem
                              key={index}
                              secondaryAction={
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => handleRemoveContextFile(index)}
                                >
                                  <CancelIcon />
                                </IconButton>
                              }
                            >
                              <ListItemIcon>
                                <FileUploadIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary={file.name}
                                secondary={`${(file.size / 1024).toFixed(1)} KB`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button onClick={handleCloseContext} color="inherit">
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveContext}
                  disabled={!additionalContext.trim() && contextFiles.length === 0}
                >
                  Add Context
                </Button>
              </DialogActions>
            </Dialog>
          </AnimatedBox>
        );

      case 1:
        return (
          <AnimatedBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mt: 2 }}>
              {generatedStory && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PreviewIcon color="primary" fontSize="small" />
                        Generated User Story
                      </Typography>
                      <Box>
                        <Tooltip title="Edit Story">
                          <IconButton 
                            color={isCustomizing ? "primary" : "default"}
                            onClick={() => setIsCustomizing(!isCustomizing)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <StoryCard elevation={3}>
                      <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                        <PriorityChip 
                          label={editedStory?.priority || "Medium"} 
                          priority={editedStory?.priority || "Medium"}
                          size="small"
                        />
                        <Chip 
                          label={`${editedStory?.storyPoints || 3} Points`} 
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      
                      {isCustomizing ? (
                        <TextField
                          fullWidth
                          label="Summary"
                          value={editedStory?.summary || ''}
                          onChange={(e) => setEditedStory(prev => ({ ...prev, summary: e.target.value }))}
                          error={!validationStatus.summary}
                          helperText={!validationStatus.summary ? "Summary is required" : ""}
                          sx={{ mb: 2 }}
                        />
                      ) : (
                        <Typography variant="h6" gutterBottom>
                          {editedStory?.summary}
                        </Typography>
                      )}
                      
                      {isCustomizing ? (
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Description"
                          value={editedStory?.description || ''}
                          onChange={(e) => setEditedStory(prev => ({ ...prev, description: e.target.value }))}
                          error={!validationStatus.description}
                          helperText={!validationStatus.description ? "Description is required" : ""}
                          sx={{ mb: 2 }}
                        />
                      ) : (
                        <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                          {editedStory?.description}
                        </Typography>
                      )}
                      
                      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FormatListBulletedIcon color="primary" fontSize="small" />
                        Acceptance Criteria:
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        {isCustomizing ? (
                          <Box>
                            {editedStory?.acceptanceCriteria.map((criteria, index) => (
                              <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={criteria}
                                  onChange={(e) => {
                                    const newCriteria = [...editedStory.acceptanceCriteria];
                                    newCriteria[index] = e.target.value;
                                    setEditedStory(prev => ({ ...prev, acceptanceCriteria: newCriteria }));
                                  }}
                                />
                                <IconButton color="error" onClick={() => handleRemoveCriteria(index)}>
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            ))}
                            <Box sx={{ display: 'flex', mt: 1 }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Add new criteria"
                                value={customCriteria}
                                onChange={(e) => setCustomCriteria(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddCustomCriteria();
                                  }
                                }}
                              />
                              <Button 
                                variant="outlined" 
                                startIcon={<AddIcon />}
                                onClick={handleAddCustomCriteria}
                                disabled={!customCriteria.trim()}
                              >
                                Add
                              </Button>
                            </Box>
                            {!validationStatus.acceptanceCriteria && (
                              <Typography color="error" variant="caption">
                                At least one acceptance criterion is required
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <List dense>
                            {editedStory?.acceptanceCriteria.map((criteria, index) => (
                              <CriteriaItem key={index}>
                                <ListItemIcon>
                                  <StyledBadge badgeContent="✓">
                                    <CheckIcon color="primary" />
                                  </StyledBadge>
                                </ListItemIcon>
                                <ListItemText primary={criteria} />
                              </CriteriaItem>
                            ))}
                          </List>
                        )}
                      </Box>
                      
                      {isCustomizing && (
                        <Box sx={{ mt: 3 }}>
                          <Divider sx={{ mb: 2 }} />
                          <Typography variant="subtitle2" gutterBottom>
                            Story Configuration
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Priority</InputLabel>
                                <Select
                                  value={editedStory?.priority || 'Medium'}
                                  onChange={(e) => handleUpdatePriority(e.target.value)}
                                  label="Priority"
                                >
                                  <MenuItem value="Highest">Highest</MenuItem>
                                  <MenuItem value="High">High</MenuItem>
                                  <MenuItem value="Medium">Medium</MenuItem>
                                  <MenuItem value="Low">Low</MenuItem>
                                  <MenuItem value="Lowest">Lowest</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Story Points</InputLabel>
                                <Select
                                  value={editedStory?.storyPoints || 3}
                                  onChange={(e) => handleUpdateStoryPoints(e.target.value)}
                                  label="Story Points"
                                >
                                  {storyPointOptions.map(points => (
                                    <MenuItem key={points} value={points}>{points} Points</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </StoryCard>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined" sx={{ mb: 3 }}>
                      <CardHeader
                        title={
                          <Typography variant="subtitle1">
                            <AssessmentIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
                            Quality Analysis
                          </Typography>
                        }
                        subheader={
                          isAnalyzing ? 
                            "Analyzing story quality..." : 
                            `Overall Score: ${qualityScore.overall}/100`
                        }
                      />
                      <CardContent>
                        {isAnalyzing ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress size={40} />
                          </Box>
                        ) : (
                          <Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Clarity</span>
                                <span>{qualityScore.clarity}%</span>
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={qualityScore.clarity} 
                                sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                color="primary"
                              />
                              
                              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Completeness</span>
                                <span>{qualityScore.completeness}%</span>
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={qualityScore.completeness} 
                                sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                color="secondary"
                              />
                              
                              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Testability</span>
                                <span>{qualityScore.testability}%</span>
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={qualityScore.testability} 
                                sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                color="warning"
                              />
                              
                              <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Business Value</span>
                                <span>{qualityScore.value}%</span>
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={qualityScore.value} 
                                sx={{ height: 8, borderRadius: 4 }}
                                color="success"
                              />
                            </Box>
                            
                            {suggestions.length > 0 && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Improvement Suggestions
                                </Typography>
                                <List dense>
                                  {suggestions.map((suggestion, idx) => (
                                    <ListItem key={idx} sx={{ px: 0 }}>
                                      <ListItemIcon sx={{ minWidth: 30 }}>
                                        <LightbulbOutlinedIcon fontSize="small" color="warning" />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={suggestion.title}
                                        secondary={suggestion.description}
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                        secondaryTypographyProps={{ variant: 'caption' }}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          <InfoIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle', color: 'info.main' }} />
                          Story Details
                        </Typography>
                        
                        <List dense>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText 
                              primary="Persona Focus"
                              secondary={userPersonas.find(p => p.id === selectedPersona)?.name || "End User"}
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText 
                              primary="Suggested Points"
                              secondary={`${editedStory?.storyPoints || 3} Points`}
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText 
                              primary="Acceptance Criteria"
                              secondary={`${editedStory?.acceptanceCriteria.length || 0} Items`}
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                            />
                          </ListItem>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemText 
                              primary="Priority"
                              secondary={editedStory?.priority || "Medium"}
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Box>
          </AnimatedBox>
        );

      case 2:
        return (
          <AnimatedBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box>
              {!jiraConfig?.isConfigured ? (
                <Box>
                  <Alert 
                    severity="warning"
                    sx={{ mb: 3 }}
                    icon={<SaveIcon />}
                  >
                    Jira is not configured. You can still generate user stories, but they can't be automatically pushed to Jira.
                  </Alert>
                  
                  <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AssignmentIcon color="primary" fontSize="small" />
                      Generated User Story
                    </Typography>
                    
                    <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>
                      {editedStory?.summary}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                      {editedStory?.description}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                      Acceptance Criteria:
                    </Typography>
                    <List>
                      {editedStory?.acceptanceCriteria.map((criteria, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={criteria} />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Chip 
                        label={`Priority: ${editedStory?.priority}`} 
                        color="primary" 
                        variant="outlined"
                      />
                      <Chip 
                        label={`Story Points: ${editedStory?.storyPoints}`} 
                        color="secondary" 
                        variant="outlined"
                      />
                    </Box>
                  </Paper>
                  
                  <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      <InfoIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle', color: 'info.main' }} />
                      Configure Jira Integration
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      To enable pushing stories directly to Jira, please configure Jira integration in the Configuration page.
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Steps to configure Jira:
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <ArrowForwardIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Go to the Configuration page"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ArrowForwardIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Enter your Jira URL, username, and API token"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ArrowForwardIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Test the connection and save your settings"
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Box>
              ) : (
                <>
                  <Alert 
                    severity={jiraConfig?.isConfigured ? "info" : "warning"}
                    sx={{ mb: 3 }}
                    icon={<SaveIcon />}
                  >
                    {jiraConfig?.isConfigured 
                      ? 'Your story is ready to be created in Jira' 
                      : 'Jira needs to be configured before creating stories'}
                  </Alert>
                  
                  {jiraConfig?.isConfigured && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={7}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessCenterIcon color="primary" fontSize="small" />
                            Story Configuration
                          </Typography>
                          
                          <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                              <InputLabel>Select Project</InputLabel>
                              <Select
                                value={selectedProject || ''}
                                onChange={(e) => setSelectedProject(e.target.value)}
                                label="Select Project"
                              >
                                {projects.map((project) => (
                                  <MenuItem key={project.key} value={project.key}>
                                    {project.name} ({project.key})
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              The story will be created with the following attributes:
                            </Typography>
                            
                            <List dense>
                              <ListItem sx={{ py: 1 }}>
                                <ListItemIcon>
                                  <AssignmentIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Issue Type"
                                  secondary="Story"
                                />
                              </ListItem>
                              <ListItem sx={{ py: 1 }}>
                                <ListItemIcon>
                                  <PriorityHighIcon color={editedStory?.priority === "High" ? "error" : "disabled"} />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Priority"
                                  secondary={editedStory?.priority || 'Medium'}
                                />
                              </ListItem>
                              <ListItem sx={{ py: 1 }}>
                                <ListItemIcon>
                                  <SpeedIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Story Points"
                                  secondary={`${editedStory?.storyPoints} Points`}
                                />
                              </ListItem>
                              <ListItem sx={{ py: 1 }}>
                                <ListItemIcon>
                                  <PersonAddIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary="Assignee"
                                  secondary="Unassigned (will be set in Jira)"
                                />
                              </ListItem>
                            </List>
                          </Box>
                          
                          <Box>
                            <Tooltip title="Show more options" placement="top">
                              <Button
                                color="inherit"
                                startIcon={showAdvancedOptions ? <ExpandMoreIcon /> : <ExpandMoreIcon />}
                                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                                size="small"
                                sx={{ mb: 1 }}
                              >
                                {showAdvancedOptions ? "Hide Advanced Options" : "Show Advanced Options"}
                              </Button>
                            </Tooltip>
                            
                            <Collapse in={showAdvancedOptions}>
                              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Advanced Configuration
                                </Typography>
                                
                                <Grid container spacing={2}>
                                  <Grid item xs={6}>
                                    <FormControl fullWidth size="small">
                                      <InputLabel>Issue Type</InputLabel>
                                      <Select
                                        value="Story"
                                        label="Issue Type"
                                        disabled
                                      >
                                        <MenuItem value="Story">Story</MenuItem>
                                        <MenuItem value="Task">Task</MenuItem>
                                        <MenuItem value="Bug">Bug</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <FormControl fullWidth size="small">
                                      <InputLabel>Epic Link</InputLabel>
                                      <Select
                                        value=""
                                        label="Epic Link"
                                      >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value="EPIC-123">New User Onboarding</MenuItem>
                                        <MenuItem value="EPIC-456">Payment Processing</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Collapse>
                          </Box>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} md={5}>
                        <Card sx={{ mb: 3, position: 'relative', overflow: 'hidden' }}>
                          <ColorBand color="primary.main" />
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <img 
                                src="https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/apple-touch-icon.png" 
                                alt="Jira Logo"
                                width={32}
                                height={32}
                                style={{ marginRight: 12 }}
                              />
                              <Typography variant="subtitle1">
                                Jira Connection Status
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CheckIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                Connected to {jiraConfig?.url}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CheckIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                Logged in as {jiraConfig?.user?.displayName || jiraConfig?.username}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CheckIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                {projects.length} projects available
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                        
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            <InfoIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle', color: 'info.main' }} />
                            What happens next?
                          </Typography>
                          
                          <Typography variant="body2" color="text.secondary" paragraph>
                            When you click "Create in Jira", your user story will be:
                          </Typography>
                          
                          <StyledStepper orientation="vertical" activeStep={-1}>
                            <Step>
                              <StepLabel>
                                <Typography variant="body2">
                                  Created in the selected Jira project
                                </Typography>
                              </StepLabel>
                            </Step>
                            <Step>
                              <StepLabel>
                                <Typography variant="body2">
                                  Assigned the appropriate fields
                                </Typography>
                              </StepLabel>
                            </Step>
                            <Step>
                              <StepLabel>
                                <Typography variant="body2">
                                  Ready for team assignment and implementation
                                </Typography>
                              </StepLabel>
                            </Step>
                          </StyledStepper>
                        </Paper>
                      </Grid>
                    </Grid>
                  )}
                </>
              )}
            </Box>
          </AnimatedBox>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1, pb: 3 }}>
        <AssignmentIcon />
        <Typography variant="h6">AI User Story Generator</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit" onClick={onClose} size="small">
          <CancelIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 4, pb: 4, pt: 3 }}>
        {loading && generationProgress < 100 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Generating user story...</span>
              <span>{generationProgress}%</span>
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={generationProgress}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
        )}
        
        <StyledStepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((step, index) => {
            // Modify label for the last step when Jira is not configured
            const stepLabel = (index === 2 && (!jiraConfig || !jiraConfig.isConfigured)) 
              ? { ...step, label: 'Summary', description: 'Review your generated user story' }
              : step;
              
            return (
              <Step key={stepLabel.label}>
                <StepLabel 
                  StepIconProps={{
                    icon: stepLabel.icon
                  }}
                >
                  <Typography variant="subtitle2">{stepLabel.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stepLabel.description}
                  </Typography>
                </StepLabel>
              </Step>
            );
          })}
        </StyledStepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {loading && generationProgress >= 100 && <CircularProgress sx={{ mb: 3 }} />}

        {renderStepContent(activeStep)}

        {selectedPersona === 'developer' && (
          <Box sx={{ mt: 4 }}>
            {generateFigmaJson && figmaJson && (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <DesignIcon fontSize="small" sx={{ mr: 1, color: 'primary.main', verticalAlign: 'middle' }} />
                    Figma JSON
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(figmaJson, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'figma-design.json';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    startIcon={<FileUploadIcon />}
                  >
                    Download Figma JSON
                  </Button>
                </CardContent>
              </Card>
            )}
            {previewFigmaPrototype && figmaPreview && (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    <PreviewIcon fontSize="small" sx={{ mr: 1, color: 'primary.main', verticalAlign: 'middle' }} />
                    Figma Prototype Preview
                  </Typography>
                  <img 
                    src={figmaPreview} 
                    alt="Figma Preview" 
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '4px', marginBottom: '16px' }} 
                  />
                </CardContent>
              </Card>
            )}
            {figmaError && (
              <Alert severity="error" sx={{ mt: 2 }}>{figmaError}</Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Button onClick={onClose} color="inherit">Cancel</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {activeStep > 0 && (
              <Button 
                onClick={handleBack}
                startIcon={<ArrowBackIosIcon fontSize="small" />}
                disabled={loading}
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || (activeStep === 0 && !requirements.trim()) || (activeStep === steps.length - 1 && !jiraConfig?.isConfigured)}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              endIcon={activeStep < steps.length - 1 ? <ArrowForwardIcon /> : null}
            >
              {activeStep === steps.length - 1 ? 
                (jiraConfig?.isConfigured ? 'Create in Jira' : 'Finish') : 
                (activeStep === 0 ? 'Generate' : 'Next')
              }
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default UserStoryGeneratorDialog; 