import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from '@mui/lab';
import {
  PhoneAndroid as MobileIcon,
  Code as CodeIcon,
  Build as BuildIcon,
  BugReport as BugIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Add as AddIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Architecture as ArchitectureIcon,
  AccountTree as AccountTreeIcon,
  PlaylistPlay as PlaylistPlayIcon,
  PlayArrow as PlayArrowIcon,
  Star as StarIcon,
  CloudUpload as CloudUploadIcon,
  Cloud as CloudIcon,
  CloudDownload as CloudDownloadIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

console.log('MOBILE DEVELOPER ASSIST DIALOG LOADED');

const APP_TYPES = [
  {
    id: 'new',
    name: 'New App Development',
    icon: <AddIcon />,
    description: 'Start a new mobile application project'
  },
  {
    id: 'existing',
    name: 'Existing App',
    icon: <EditIcon />,
    description: 'Work with an existing mobile application'
  }
];

const MOBILE_PLATFORMS = [
  {
    id: 'ios',
    name: 'iOS',
    icon: <MobileIcon />,
    color: '#007AFF',
    description: 'Apple iOS platform development',
    requirements: ['Xcode', 'iOS SDK', 'CocoaPods', 'Swift/Objective-C']
  },
  {
    id: 'android',
    name: 'Android',
    icon: <MobileIcon />,
    color: '#34C759',
    description: 'Google Android platform development',
    requirements: ['Android Studio', 'Android SDK', 'Gradle', 'Java/Kotlin']
  }
];

const APP_ARCHITECTURE = [
  {
    id: 'native',
    name: 'Native Development',
    icon: <CodeIcon />,
    description: 'Platform-specific native development',
    subTypes: {
      ios: ['Swift', 'Objective-C'],
      android: ['Kotlin', 'Java']
    }
  },
  {
    id: 'hybrid',
    name: 'Hybrid Development',
    icon: <BuildIcon />,
    description: 'Cross-platform development',
    subTypes: {
      ios: ['React Native', 'Flutter', 'Ionic'],
      android: ['React Native', 'Flutter', 'Ionic']
    }
  }
];

const SYSTEM_REQUIREMENTS = {
  ios: [
    { 
      name: 'Xcode', 
      version: '14.0+', 
      required: true,
      checkCommand: 'xcodebuild -version',
      installGuide: 'https://developer.apple.com/xcode/',
      icon: <CodeIcon />
    },
    { 
      name: 'iOS SDK', 
      version: '16.0+', 
      required: true,
      checkCommand: 'xcrun --show-sdk-version',
      installGuide: 'https://developer.apple.com/ios/',
      icon: <MobileIcon />
    },
    { 
      name: 'CocoaPods', 
      version: '1.12.0+', 
      required: true,
      checkCommand: 'pod --version',
      installGuide: 'https://cocoapods.org/',
      icon: <BuildIcon />
    },
    { 
      name: 'Swift', 
      version: '5.0+', 
      required: true,
      checkCommand: 'swift --version',
      installGuide: 'https://swift.org/download/',
      icon: <CodeIcon />
    },
    { 
      name: 'Git', 
      version: '2.0+', 
      required: true,
      checkCommand: 'git --version',
      installGuide: 'https://git-scm.com/downloads',
      icon: <CodeIcon />
    }
  ],
  android: [
    { 
      name: 'Android Studio', 
      version: '2022.1+', 
      required: true,
      checkCommand: 'studio.sh --version',
      installGuide: 'https://developer.android.com/studio',
      icon: <CodeIcon />
    },
    { 
      name: 'Android SDK', 
      version: '33+', 
      required: true,
      checkCommand: 'sdkmanager --list',
      installGuide: 'https://developer.android.com/studio#command-tools',
      icon: <MobileIcon />
    },
    { 
      name: 'Gradle', 
      version: '7.0+', 
      required: true,
      checkCommand: 'gradle --version',
      installGuide: 'https://gradle.org/install/',
      icon: <BuildIcon />
    },
    { 
      name: 'Java', 
      version: '11+', 
      required: true,
      checkCommand: 'java -version',
      installGuide: 'https://adoptium.net/',
      icon: <CodeIcon />
    },
    { 
      name: 'Git', 
      version: '2.0+', 
      required: true,
      checkCommand: 'git --version',
      installGuide: 'https://git-scm.com/downloads',
      icon: <CodeIcon />
    }
  ]
};

const MobileDeveloperAssistDialog = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAppType, setSelectedAppType] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedArchitecture, setSelectedArchitecture] = useState('');
  const [scanningProgress, setScanningProgress] = useState(0);
  const [scanningStatus, setScanningStatus] = useState('idle'); // idle, scanning, complete, error
  const [systemCheckResults, setSystemCheckResults] = useState([]);
  const [checkResults, setCheckResults] = useState({});
  const [currentCheckIndex, setCurrentCheckIndex] = useState(0);
  const [technicalDoc, setTechnicalDoc] = useState(null);
  const [architecturePlan, setArchitecturePlan] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isGeneratingWireframes, setIsGeneratingWireframes] = useState(false);
  const [wireframeProgress, setWireframeProgress] = useState(0);
  const [wireframeUrl, setWireframeUrl] = useState(null);
  const [wireframePreview, setWireframePreview] = useState(null);
  const [wireframeScreens, setWireframeScreens] = useState([]);
  const [showFieldWarning, setShowFieldWarning] = useState(false);
  const [showPlanWarning, setShowPlanWarning] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [codeGenerationProgress, setCodeGenerationProgress] = useState(0);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [projectStructure, setProjectStructure] = useState(null);

  const steps = [
    'Select App Type',
    'Choose Platform',
    'Select Architecture',
    'System Check',
    'Technical Documentation',
    'Architecture Planning',
    'Start Development',
    'Generate Code'
  ];

  const parseVersionOutput = (output, tool) => {
    try {
      console.log(`Parsing version for ${tool}:`, output); // Debug log
      
      switch (tool) {
        case 'Xcode':
          // Handle Xcode command line tools error case
          if (output.includes('xcode-select: error')) {
            return null;
          }
          // Xcode version format: "Xcode 14.3.1" or "Xcode 14.3.1 Build version 14E222b"
          const xcodeMatch = output.match(/Xcode\s+(\d+\.\d+(\.\d+)?)/);
          const version = xcodeMatch ? xcodeMatch[1] : null;
          console.log('Parsed Xcode version:', version); // Debug log
          return version;
        
        case 'iOS SDK':
          // SDK version format: "15.4"
          const sdkVersion = output.trim();
          console.log('Parsed iOS SDK version:', sdkVersion); // Debug log
          return sdkVersion;
        
        case 'CocoaPods':
          // CocoaPods version format: "1.15.2"
          const podVersion = output.trim();
          console.log('Parsed CocoaPods version:', podVersion); // Debug log
          return podVersion;
        
        case 'Swift':
          // Swift version format: "swift-driver version: 1.120.5 Apple Swift version 6.1"
          const swiftMatch = output.match(/Swift version\s+(\d+\.\d+)/);
          const swiftVersion = swiftMatch ? swiftMatch[1] : null;
          console.log('Parsed Swift version:', swiftVersion); // Debug log
          return swiftVersion;
        
        case 'Git':
          // Git version format: "git version 2.39.5 (Apple Git-154)"
          const gitMatch = output.match(/git version\s+(\d+\.\d+(\.\d+)?)/);
          const gitVersion = gitMatch ? gitMatch[1] : null;
          console.log('Parsed Git version:', gitVersion); // Debug log
          return gitVersion;
        
        default:
          const defaultVersion = output.trim();
          console.log('Parsed default version:', defaultVersion); // Debug log
          return defaultVersion;
      }
    } catch (error) {
      console.error('Version parsing error:', error);
      return null;
    }
  };

  const compareVersions = (current, required) => {
    try {
      console.log('Comparing versions:', { current, required }); // Debug log
      
      if (!current) return false; // Handle null/undefined current version
      
      // Clean up version strings and remove '+' from required version
      const cleanCurrent = current.replace(/[^0-9.]/g, '');
      const cleanRequired = required.replace(/[^0-9.]/g, '');
      
      console.log('Cleaned versions:', { cleanCurrent, cleanRequired }); // Debug log
      
      // Split versions into parts
      const currentParts = cleanCurrent.split('.').map(Number);
      const requiredParts = cleanRequired.split('.').map(Number);
      
      console.log('Version parts:', { currentParts, requiredParts }); // Debug log
      
      // Compare each part
      for (let i = 0; i < Math.max(currentParts.length, requiredParts.length); i++) {
        const currentPart = currentParts[i] || 0;
        const requiredPart = requiredParts[i] || 0;
        
        console.log(`Comparing part ${i}:`, { currentPart, requiredPart }); // Debug log
        
        if (currentPart > requiredPart) {
          console.log('Version check passed: current > required'); // Debug log
          return true;
        }
        if (currentPart < requiredPart) {
          console.log('Version check failed: current < required'); // Debug log
          return false;
        }
      }
      
      console.log('Version check passed: versions are equal'); // Debug log
      return true; // Versions are equal
    } catch (error) {
      console.error('Version comparison error:', error);
      return false;
    }
  };

  const checkSystemRequirement = async (requirement) => {
    try {
      console.log(`Checking requirement: ${requirement.name}`);

      // Call the mobile requirements check endpoint
      const response = await fetch('/api/mobile/check-requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform: selectedPlatform
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Requirements check response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Requirements check failed');
      }

      // Find the matching requirement from the response
      const matchedRequirement = data.requirements.find(
        req => req.name.toLowerCase() === requirement.name.toLowerCase()
      );

      if (!matchedRequirement) {
        return {
          status: 'error',
          message: 'Requirement not found in system check',
          currentVersion: 'Unknown'
        };
      }

      return {
        status: matchedRequirement.status,
        version: requirement.version,
        currentVersion: matchedRequirement.currentVersion,
        message: matchedRequirement.status === 'success' 
          ? 'Version check passed'
          : `Version mismatch. Required: ${requirement.version}, Found: ${matchedRequirement.currentVersion}`,
        installationGuide: matchedRequirement.installationGuide,
        verificationCommand: matchedRequirement.verificationCommand
      };

    } catch (error) {
      console.error(`Exception checking ${requirement.name}:`, error);
      return { 
        status: 'error', 
        message: error.message,
        currentVersion: 'Error'
      };
    }
  };

  const startSystemScan = async () => {
    setScanningStatus('scanning');
    setScanningProgress(0);
    setSystemCheckResults([]);
    setCurrentCheckIndex(0);
    setCheckResults({});

    const requirements = SYSTEM_REQUIREMENTS[selectedPlatform];
    
    try {
      for (let i = 0; i < requirements.length; i++) {
        setCurrentCheckIndex(i);
        const result = await checkSystemRequirement(requirements[i]);
        setCheckResults(prev => ({
          ...prev,
          [requirements[i].name]: result
        }));
        setScanningProgress(((i + 1) / requirements.length) * 100);
        
        // Add a small delay between checks to show the animation
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Ensure all checks are complete
      setScanningStatus('complete');
      setCurrentCheckIndex(requirements.length); // Set to length to indicate all checks are done
    } catch (error) {
      console.error('Error during system scan:', error);
      setScanningStatus('error');
    }
  };

  const RequirementCheckAnimation = ({ requirement, status, progress }) => {
    const result = checkResults[requirement.name];
    const isChecking = status === 'checking' && !result;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <ListItem
          sx={{
            bgcolor: 'background.paper',
            mb: 1,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s ease'
          }}
        >
          <ListItemIcon>
            <motion.div
              animate={{ 
                scale: isChecking ? [1, 1.2, 1] : 1,
                rotate: isChecking ? [0, 360] : 0
              }}
              transition={{ 
                duration: 2,
                repeat: isChecking ? Infinity : 0,
                ease: "linear"
              }}
            >
              {isChecking ? (
                <CircularProgress size={24} />
              ) : result?.status === 'success' ? (
                <CheckCircleIcon color="success" />
              ) : (
                <ErrorIcon color="error" />
              )}
            </motion.div>
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {requirement.icon}
                <Typography variant="subtitle1">{requirement.name}</Typography>
              </Box>
            }
            secondary={
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Required Version: {requirement.version}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isChecking ? 'Checking...' : 
                   result?.status === 'success' ? 
                   `Installed (${result.currentVersion})` : 
                   result?.message || 'Not installed or version mismatch'}
                </Typography>
              </Box>
            }
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {result?.status === 'error' && (
              <Tooltip title="Install Required">
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => window.open(requirement.installGuide, '_blank')}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </ListItem>
      </motion.div>
    );
  };

  const handleAppTypeSelect = (type) => {
    setSelectedAppType(type);
    setActiveStep(1);
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    setActiveStep(2);
  };

  const handleArchitectureSelect = (architecture) => {
    setSelectedArchitecture(architecture);
    setActiveStep(3);
    startSystemScan();
  };

  const handleContinue = async () => {
    if (activeStep === 3) { // After system check
      setActiveStep(4); // Move to technical documentation step
    } else if (activeStep === 4 && technicalDoc) { // After document upload
      await analyzeTechnicalDocument();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setTechnicalDoc(file);
    }
  };

  const analyzeTechnicalDocument = async () => {
    try {
      setIsAnalyzing(true);
      setAnalysisProgress(0);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', technicalDoc);
      formData.append('platform', selectedPlatform);
      formData.append('architecture', selectedArchitecture);

      // Call the mobile document analysis endpoint
      const response = await fetch('/api/mobile/analyze/document', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Analysis response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      // Set the analysis data directly without formatting
      setArchitecturePlan(data.analysis);
      setActiveStep(5); // Move to architecture planning step
      setIsAnalyzing(false);
      setAnalysisProgress(100);
    } catch (error) {
      console.error('Error analyzing document:', error);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      
      // Show error to user
      setArchitecturePlan(`Error analyzing document: ${error.message}\n\nPlease ensure:\n1. The document format is supported\n2. The server is running and accessible\n3. You have sufficient API credits\n\nTry uploading the document again.`);
      setActiveStep(5); // Still move to next step to show error
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const renderSystemCheck = () => {
    const requirements = SYSTEM_REQUIREMENTS[selectedPlatform];
    
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            System Requirements Check
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {scanningStatus === 'scanning' ? 
              'Scanning your system for required dependencies...' : 
              'System check complete'}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={scanningProgress}
              sx={{ 
                height: 10, 
                borderRadius: 5,
                '& .MuiLinearProgress-bar': {
                  transition: 'transform 0.5s ease-in-out'
                }
              }}
            />
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {scanningStatus === 'scanning' ? 'Scanning...' : 'Complete'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(scanningProgress)}%
              </Typography>
            </Box>
          </Box>
        </Box>

        <AnimatePresence>
          <List>
            {requirements.map((requirement, index) => (
              <RequirementCheckAnimation
                key={requirement.name}
                requirement={requirement}
                status={
                  index < currentCheckIndex ? 'success' :
                  index === currentCheckIndex ? 'checking' :
                  'pending'
                }
                progress={scanningProgress}
              />
            ))}
          </List>
        </AnimatePresence>

        {scanningStatus === 'complete' && (
          <Box sx={{ mt: 3 }}>
            <Alert 
              severity={
                Object.values(checkResults).every(r => r.status === 'success') 
                  ? 'success' 
                  : 'warning'
              }
            >
              {Object.values(checkResults).every(r => r.status === 'success')
                ? 'All system requirements are met!'
                : 'Some requirements are missing or need updates.'}
            </Alert>
          </Box>
        )}
      </Box>
    );
  };

  const renderTechnicalDocumentStep = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Upload Technical Documentation
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Please upload your technical requirements document (PDF, DOC, TXT)
        </Typography>

        <Box
          sx={{
            mt: 3,
            p: 3,
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: 2,
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.dark',
              bgcolor: 'action.hover'
            }
          }}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {technicalDoc ? technicalDoc.name : 'Click to upload document'}
          </Typography>
          <Typography color="text.secondary">
            {technicalDoc ? 'Click to change file' : 'Supported formats: PDF, DOC, DOCX, TXT'}
          </Typography>
        </Box>

        {isAnalyzing && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Analyzing Document...
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={analysisProgress}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This may take a few moments. Please wait...
            </Typography>
          </Box>
        )}

        {!isAnalyzing && technicalDoc && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Document ready for analysis. Click "Analyze Document" to proceed.
          </Alert>
        )}
      </Box>
    );
  };

  const renderArchitecturePlan = () => {
    if (!architecturePlan) return null;

    // Check if architecturePlan is a string (error message)
    if (typeof architecturePlan === 'string' && architecturePlan.startsWith('Error analyzing document:')) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box>
            <Typography variant="h6" gutterBottom color="error">
              Error Analyzing Document
            </Typography>
            <Paper 
              sx={{ 
                p: 3, 
                mt: 2, 
                bgcolor: 'error.light',
                color: 'error.main',
                borderRadius: 2,
                boxShadow: 3
              }}
            >
              <pre style={{ 
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                margin: 0
              }}>
                {architecturePlan}
              </pre>
            </Paper>
          </Box>
        </motion.div>
      );
    }

    // Check if architecturePlan is a valid object with required properties
    if (typeof architecturePlan !== 'object' || !architecturePlan.systemArchitecture) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box>
            <Typography variant="h6" gutterBottom color="error">
              Invalid Architecture Plan
            </Typography>
            <Paper 
              sx={{ 
                p: 3, 
                mt: 2, 
                bgcolor: 'error.light',
                color: 'error.main',
                borderRadius: 2,
                boxShadow: 3
              }}
            >
              <Typography>
                The architecture plan data is not in the expected format. Please try analyzing the document again.
              </Typography>
            </Paper>
          </Box>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box>
          <Typography variant="h4" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            color: 'primary.main',
            fontWeight: 'bold',
            mb: 4
          }}>
            <ArchitectureIcon sx={{ fontSize: 40 }} />
            Architecture and Implementation Plan
          </Typography>

          <Box sx={{ mt: 3 }}>
            {/* System Architecture Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Paper sx={{ 
                p: 4, 
                mb: 4, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <Typography variant="h5" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  color: 'primary.main',
                  mb: 3
                }}>
                  <AccountTreeIcon sx={{ fontSize: 32 }} />
                  System Architecture
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                  {architecturePlan.systemArchitecture.overview}
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>Components:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {architecturePlan.systemArchitecture.components.map((comp, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Chip 
                          label={comp} 
                          color="primary" 
                          variant="outlined"
                          sx={{ 
                            fontSize: '1rem',
                            padding: '20px 10px',
                            '&:hover': {
                              bgcolor: 'primary.main',
                              color: 'white'
                            }
                          }}
                        />
                      </motion.div>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>Architecture Diagram:</Typography>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      mt: 2, 
                      bgcolor: 'grey.50',
                      borderRadius: 2,
                      border: '1px dashed',
                      borderColor: 'primary.main'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {architecturePlan.systemArchitecture.diagram}
                    </Typography>
                  </Paper>
                </Box>
              </Paper>
            </motion.div>

            {/* Technology Stack Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper sx={{ 
                p: 4, 
                mb: 4, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <Typography variant="h5" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  color: 'primary.main',
                  mb: 3
                }}>
                  <CodeIcon sx={{ fontSize: 32 }} />
                  Technology Stack
                </Typography>
                <Grid container spacing={3}>
                  {Object.entries(architecturePlan.technologyStack).map(([category, technologies], index) => (
                    <Grid item xs={12} md={6} key={category}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card sx={{ 
                          height: '100%',
                          bgcolor: 'grey.50',
                          '&:hover': {
                            bgcolor: 'grey.100',
                            transform: 'scale(1.02)',
                            transition: 'all 0.3s ease'
                          }
                        }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ 
                              textTransform: 'capitalize',
                              color: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              {category}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {technologies.map((tech, techIndex) => (
                                <motion.div
                                  key={techIndex}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3, delay: techIndex * 0.1 }}
                                >
                                  <Chip 
                                    label={tech} 
                                    size="small"
                                    sx={{ 
                                      bgcolor: 'primary.light',
                                      color: 'primary.contrastText',
                                      '&:hover': {
                                        bgcolor: 'primary.main'
                                      }
                                    }}
                                  />
                                </motion.div>
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>

            {/* Implementation Phases Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper sx={{ 
                p: 4, 
                mb: 4, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <Typography variant="h5" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  color: 'primary.main',
                  mb: 3
                }}>
                  <PlaylistPlayIcon sx={{ fontSize: 32 }} />
                  Implementation Phases
                </Typography>
                <Timeline>
                  {architecturePlan.implementationPhases.map((phase, index) => (
                    <TimelineItem key={index}>
                      <TimelineSeparator>
                        <TimelineDot color="primary" sx={{ p: 2 }}>
                          <PlayArrowIcon />
                        </TimelineDot>
                        {index < architecturePlan.implementationPhases.length - 1 && (
                          <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                        )}
                      </TimelineSeparator>
                      <TimelineContent>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                          <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                            <Typography variant="h6" component="span" sx={{ color: 'primary.main' }}>
                              {phase.phase}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Duration: {phase.duration}
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                              {phase.description}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>Deliverables:</Typography>
                              <List dense>
                                {phase.deliverables.map((del, idx) => (
                                  <ListItem key={idx}>
                                    <ListItemIcon>
                                      <CheckCircleIcon color="primary" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary={del} />
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          </Paper>
                        </motion.div>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Paper>
            </motion.div>

            {/* Key Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper sx={{ 
                p: 4, 
                mb: 4, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <Typography variant="h5" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  color: 'primary.main',
                  mb: 3
                }}>
                  <StarIcon sx={{ fontSize: 32 }} />
                  Key Features
                </Typography>
                <Grid container spacing={3}>
                  {architecturePlan.keyFeatures.map((feature, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card sx={{ 
                          height: '100%',
                          bgcolor: 'grey.50',
                          '&:hover': {
                            bgcolor: 'grey.100',
                            transform: 'scale(1.02)',
                            transition: 'all 0.3s ease'
                          }
                        }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                              {feature.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {feature.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <Chip 
                                label={feature.priority} 
                                size="small"
                                color={
                                  feature.priority.toLowerCase() === 'high' ? 'error' :
                                  feature.priority.toLowerCase() === 'medium' ? 'warning' : 'success'
                                }
                                sx={{ fontWeight: 'bold' }}
                              />
                            </Box>
                            {feature.dependencies.length > 0 && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>Dependencies:</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                  {feature.dependencies.map((dep, idx) => (
                                    <Chip 
                                      key={idx} 
                                      label={dep} 
                                      size="small" 
                                      variant="outlined"
                                      sx={{ 
                                        borderColor: 'primary.main',
                                        '&:hover': {
                                          bgcolor: 'primary.main',
                                          color: 'white'
                                        }
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>

            {/* Security Considerations Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Paper sx={{ 
                p: 4, 
                mb: 4, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <Typography variant="h5" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  color: 'primary.main',
                  mb: 3
                }}>
                  <SecurityIcon sx={{ fontSize: 32 }} />
                  Security Considerations
                </Typography>
                <Grid container spacing={3}>
                  {architecturePlan.securityConsiderations.map((security, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card sx={{ 
                          height: '100%',
                          bgcolor: 'grey.50',
                          '&:hover': {
                            bgcolor: 'grey.100',
                            transform: 'scale(1.02)',
                            transition: 'all 0.3s ease'
                          }
                        }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                              {security.area}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {security.description}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>Mitigation Strategy:</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {security.mitigation}
                            </Typography>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>

            {/* Performance Optimization Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Paper sx={{ 
                p: 4, 
                mb: 4, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <Typography variant="h5" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  color: 'primary.main',
                  mb: 3
                }}>
                  <SpeedIcon sx={{ fontSize: 32 }} />
                  Performance Optimization
                </Typography>
                <Grid container spacing={3}>
                  {architecturePlan.performanceOptimization.map((optimization, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card sx={{ 
                          height: '100%',
                          bgcolor: 'grey.50',
                          '&:hover': {
                            bgcolor: 'grey.100',
                            transform: 'scale(1.02)',
                            transition: 'all 0.3s ease'
                          }
                        }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                              {optimization.area}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {optimization.strategy}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>Expected Impact:</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {optimization.expectedImpact}
                            </Typography>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>

            {/* Testing Strategy Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Paper sx={{ 
                p: 4, 
                mb: 4, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <Typography variant="h5" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  color: 'primary.main',
                  mb: 3
                }}>
                  <BugIcon sx={{ fontSize: 32 }} />
                  Testing Strategy
                </Typography>
                <Grid container spacing={3}>
                  {Object.entries(architecturePlan.testingStrategy).map(([type, approach], index) => (
                    <Grid item xs={12} md={6} key={type}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card sx={{ 
                          height: '100%',
                          bgcolor: 'grey.50',
                          '&:hover': {
                            bgcolor: 'grey.100',
                            transform: 'scale(1.02)',
                            transition: 'all 0.3s ease'
                          }
                        }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ 
                              textTransform: 'capitalize',
                              color: 'primary.main'
                            }}>
                              {type.replace(/([A-Z])/g, ' $1').trim()}
                            </Typography>
                            <Typography variant="body2">
                              {approach}
                            </Typography>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>

            {/* Deployment Plan Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Paper sx={{ 
                p: 4, 
                mb: 4, 
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease'
                }
              }}>
                <Typography variant="h5" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  color: 'primary.main',
                  mb: 3
                }}>
                  <CloudUploadIcon sx={{ fontSize: 32 }} />
                  Deployment Plan
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <Card sx={{ 
                        height: '100%',
                        bgcolor: 'grey.50',
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'scale(1.02)',
                          transition: 'all 0.3s ease'
                        }
                      }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>Environments</Typography>
                          <List dense>
                            {architecturePlan.deploymentPlan.environments.map((env, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <CloudIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={env} />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Card sx={{ 
                        height: '100%',
                        bgcolor: 'grey.50',
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'scale(1.02)',
                          transition: 'all 0.3s ease'
                        }
                      }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>Deployment Steps</Typography>
                          <List dense>
                            {architecturePlan.deploymentPlan.deploymentSteps.map((step, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <PlayArrowIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={step} />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Card sx={{ 
                        height: '100%',
                        bgcolor: 'grey.50',
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'scale(1.02)',
                          transition: 'all 0.3s ease'
                        }
                      }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>Rollback Strategy</Typography>
                          <Typography variant="body2">
                            {architecturePlan.deploymentPlan.rollbackStrategy}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(architecturePlan, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'architecture-plan.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  sx={{
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  Download Plan
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => {
                    setArchitecturePlan(null);
                    setActiveStep(4);
                  }}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      bgcolor: 'primary.light',
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  Upload New Document
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </motion.div>
    );
  };

  const generateWireframes = async () => {
    // Check required fields before making the request
    if (!architecturePlan || !selectedPlatform || !selectedArchitecture) {
      setShowFieldWarning(true);
      return;
    }
    setShowFieldWarning(false);
    // Check for sufficiently detailed architecture plan
    if (architecturePlan.length < 20) {
      setShowPlanWarning(true);
      return;
    }
    setShowPlanWarning(false);
    try {
      setIsGeneratingWireframes(true);
      setWireframeProgress(0);

      // Call the wireframe generation endpoint
      const response = await fetch('/api/mobile/generate-wireframes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          architecturePlan,
          platform: selectedPlatform,
          architecture: selectedArchitecture
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Wireframe generation response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Wireframe generation failed');
      }

      setWireframeUrl(data.downloadUrl);
      setWireframePreview({
        name: data.name,
        totalScreens: data.previewScreens
      });
      setWireframeScreens(data.screens || []);
      setWireframeProgress(100);
      setIsGeneratingWireframes(false);
    } catch (error) {
      console.error('Error generating wireframes:', error);
      setIsGeneratingWireframes(false);
      setWireframeProgress(0);
      // Show error to user
      alert(`Error generating wireframes: ${error.message}\n\nPlease try again later.`);
    }
  };

  const handleDownload = async () => {
    try {
      if (!wireframeUrl) {
        console.error('Download URL not available');
        return;
      }

      console.log('Initiating download from:', wireframeUrl);
      
      // Fetch the file with proper headers
      const response = await fetch(wireframeUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the filename from the Content-Disposition header or use a default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'wireframes.json';
      if (contentDisposition) {
        const matches = /filename="(.+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading wireframes:', error);
      alert('Error downloading wireframes. Please try again.');
    }
  };

  const generateCode = async () => {
    try {
      setIsGeneratingCode(true);
      setCodeGenerationProgress(0);

      const response = await fetch('/api/mobile/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          architecturePlan,
          platform: selectedPlatform,
          architecture: selectedArchitecture,
          wireframes: wireframePreview
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Code generation response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Code generation failed');
      }

      setGeneratedCode(data.code);
      setProjectStructure(data.projectStructure);
      setCodeGenerationProgress(100);
      setIsGeneratingCode(false);
    } catch (error) {
      console.error('Error generating code:', error);
      setIsGeneratingCode(false);
      setCodeGenerationProgress(0);
      alert(`Error generating code: ${error.message}\n\nPlease try again later.`);
    }
  };

  const renderCodeGeneration = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box>
          <Typography variant="h4" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            color: 'primary.main',
            fontWeight: 'bold',
            mb: 4
          }}>
            <CodeIcon sx={{ fontSize: 40 }} />
            Generate Project Code
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Paper sx={{ 
                  p: 4, 
                  mb: 4, 
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    color: 'primary.main',
                    mb: 3
                  }}>
                    <CodeIcon sx={{ fontSize: 32 }} />
                    Project Code Generation
                  </Typography>

                  <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    Generate the complete project code structure based on your architecture plan and wireframes.
                    This will create all necessary files and configurations for your {selectedPlatform} app using {selectedArchitecture} architecture.
                  </Typography>

                  {isGeneratingCode ? (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Generating Project Code...
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={codeGenerationProgress}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This may take a few moments. Please wait...
                      </Typography>
                    </Box>
                  ) : generatedCode ? (
                    <Box sx={{ mt: 3 }}>
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Project code generated successfully!
                      </Alert>
                      
                      {/* Project Structure Preview */}
                      <Box sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1, bgcolor: '#fafbfc' }}>
                        <Typography variant="h6" gutterBottom>
                          Project Structure
                        </Typography>
                        <pre style={{ 
                          whiteSpace: 'pre-wrap',
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                          margin: 0,
                          padding: '1rem',
                          backgroundColor: '#f5f5f5',
                          borderRadius: '4px',
                          overflow: 'auto'
                        }}>
                          {projectStructure}
                        </pre>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            const blob = new Blob([JSON.stringify(generatedCode, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${selectedPlatform}-${selectedArchitecture}-project.zip`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          startIcon={<CloudDownloadIcon />}
                        >
                          Download Project
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<RefreshIcon />}
                          onClick={() => {
                            setGeneratedCode(null);
                            setProjectStructure(null);
                            generateCode();
                          }}
                          sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                        >
                          Regenerate
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<CodeIcon />}
                        onClick={generateCode}
                        sx={{
                          bgcolor: 'primary.main',
                          py: 2,
                          px: 4,
                          '&:hover': {
                            bgcolor: 'primary.dark',
                            transform: 'translateY(-2px)',
                            boxShadow: 3
                          }
                        }}
                      >
                        Generate Project Code
                      </Button>
                    </Box>
                  )}
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    );
  };

  const renderStartDevelopment = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box>
          <Typography variant="h4" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            color: 'primary.main',
            fontWeight: 'bold',
            mb: 4
          }}>
            <BuildIcon sx={{ fontSize: 40 }} />
            Start Development
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Paper sx={{ 
                  p: 4, 
                  mb: 4, 
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    color: 'primary.main',
                    mb: 3
                  }}>
                    <BuildIcon sx={{ fontSize: 32 }} />
                    Generate Wireframes
                  </Typography>

                  <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    Generate wireframes for your {selectedPlatform} app based on the architecture plan.
                    This will create a visual representation of your app's screens and components.
                  </Typography>

                  {showFieldWarning && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Please ensure you have completed all previous steps and have a valid architecture plan.
                    </Alert>
                  )}

                  {showPlanWarning && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      The architecture plan seems too brief. Please provide more detailed specifications for better wireframe generation.
                    </Alert>
                  )}

                  {isGeneratingWireframes ? (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Generating Wireframes...
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={wireframeProgress}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This may take a few moments. Please wait...
                      </Typography>
                    </Box>
                  ) : wireframeUrl ? (
                    <Box sx={{ mt: 3 }}>
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Wireframes generated successfully!
                      </Alert>
                      
                      {/* Wireframe Preview */}
                      <Box sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1, bgcolor: '#fafbfc' }}>
                        <Typography variant="h6" gutterBottom>
                          Wireframe Preview
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {wireframePreview.name} - {wireframePreview.totalScreens} screens
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleDownload}
                          startIcon={<CloudDownloadIcon />}
                        >
                          Download Wireframes
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<RefreshIcon />}
                          onClick={() => {
                            setWireframeUrl(null);
                            setWireframePreview(null);
                            setWireframeScreens([]);
                            generateWireframes();
                          }}
                          sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                        >
                          Regenerate
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<BuildIcon />}
                        onClick={generateWireframes}
                        sx={{
                          bgcolor: 'primary.main',
                          py: 2,
                          px: 4,
                          '&:hover': {
                            bgcolor: 'primary.dark',
                            transform: 'translateY(-2px)',
                            boxShadow: 3
                          }
                        }}
                      >
                        Generate Wireframes
                      </Button>
                    </Box>
                  )}
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    );
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {APP_TYPES.map((type) => (
              <Grid item xs={12} md={6} key={type.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => handleAppTypeSelect(type.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ color: 'primary.main' }}>{type.icon}</Box>
                      <Typography variant="h6">{type.name}</Typography>
                    </Box>
                    <Typography color="text.secondary">{type.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            {MOBILE_PLATFORMS.map((platform) => (
              <Grid item xs={12} md={6} key={platform.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => handlePlatformSelect(platform.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ color: platform.color }}>{platform.icon}</Box>
                      <Typography variant="h6">{platform.name}</Typography>
                    </Box>
                    <Typography color="text.secondary" gutterBottom>
                      {platform.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Requirements:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {platform.requirements.map((req, index) => (
                          <Chip
                            key={index}
                            label={req}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            {APP_ARCHITECTURE.map((arch) => (
              <Grid item xs={12} md={6} key={arch.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => handleArchitectureSelect(arch.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ color: 'primary.main' }}>{arch.icon}</Box>
                      <Typography variant="h6">{arch.name}</Typography>
                    </Box>
                    <Typography color="text.secondary" gutterBottom>
                      {arch.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Available Technologies:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {arch.subTypes[selectedPlatform].map((tech, index) => (
                          <Chip
                            key={index}
                            label={tech}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 3:
        return renderSystemCheck();

      case 4:
        return renderTechnicalDocumentStep();

      case 5:
        return renderArchitecturePlan();

      case 6:
        return renderStartDevelopment();

      case 7:
        return renderCodeGeneration();

      default:
        return null;
    }
  };

  console.log('[RENDER] wireframeUrl:', wireframeUrl, 'isGeneratingWireframes:', isGeneratingWireframes, 'activeStep:', activeStep);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MobileIcon color="primary" />
          <Typography>Mobile Developer Assistant</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {activeStep > 0 && activeStep < steps.length - 1 && (
          <Button onClick={() => setActiveStep(prev => prev - 1)}>
            Back
          </Button>
        )}
        {activeStep === 3 && scanningStatus === 'complete' && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleContinue}
          >
            Continue
          </Button>
        )}
        {activeStep === 4 && technicalDoc && !isAnalyzing && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleContinue}
          >
            Analyze Document
          </Button>
        )}
        {activeStep === 5 && architecturePlan && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setActiveStep(6)}
          >
            Start Development
          </Button>
        )}
        {activeStep === 6 && wireframeUrl && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setActiveStep(7)}
          >
            Generate Code
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MobileDeveloperAssistDialog; 