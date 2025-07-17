import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IntegrationInstructions as PipelineIcon,
  GitHub as GitHubIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Code as CodeIcon,
  BugReport as TestIcon,
  Security as SecurityIcon,
  AccountTree as BranchIcon,
  CloudUpload as DeployIcon,
  Check as ApproveIcon,
  Timeline as TimelineIcon,
  VerifiedUser as VerifiedIcon,
  Cancel as CancelIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

// Styled components for enhanced visuals
const StageCard = styled(Paper)(({ theme, active, completed, failed }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  height: '100%',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid',
  borderColor: failed ? theme.palette.error.main : 
               completed ? theme.palette.success.main : 
               active ? theme.palette.primary.main : 
               theme.palette.divider,
  backgroundColor: active ? 'rgba(25, 118, 210, 0.08)' : 'background.paper',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: active ? theme.shadows[6] : theme.shadows[2],
  },
}));

const ConnectorLine = styled(Box)(({ theme, active, completed, failed }) => ({
  position: 'relative',
  height: '4px',
  backgroundColor: failed ? theme.palette.error.main : 
                  completed ? theme.palette.success.main : 
                  active ? theme.palette.primary.main : 
                  theme.palette.divider,
  transition: 'background-color 0.3s ease',
}));

const StageIcon = styled(Box)(({ theme, active, completed, failed }) => ({
  width: 50,
  height: 50,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  backgroundColor: failed ? theme.palette.error.main : 
                  completed ? theme.palette.success.main : 
                  active ? theme.palette.primary.main : 
                  theme.palette.grey[300],
  transition: 'all 0.3s ease',
}));

// Define the pipeline stages
const PIPELINE_STAGES = [
  {
    id: 'code-scan',
    name: 'Code Scanning',
    icon: <CodeIcon />,
    description: 'Scanning QE branch for committed code changes',
    details: [
      'Clone repository',
      'Checkout QE branch',
      'Detect changes since last scan',
      'Analyze code quality'
    ]
  },
  {
    id: 'trigger-build',
    name: 'Trigger Build',
    icon: <BuildIcon />,
    description: 'Initiating build process on GitHub Actions runner',
    details: [
      'Prepare build configuration',
      'Start GitHub runner instance',
      'Initialize build environment',
      'Configure build parameters'
    ]
  },
  {
    id: 'automated-tests',
    name: 'Automated Tests',
    icon: <TestIcon />,
    description: 'Running automated test suites',
    details: [
      'Execute unit tests',
      'Run integration tests',
      'Perform UI tests',
      'Generate test coverage reports'
    ]
  },
  {
    id: 'security-scan',
    name: 'Security Scan',
    icon: <SecurityIcon />,
    description: 'Performing security vulnerability scanning',
    details: [
      'SAST (Static Application Security Testing)',
      'SCA (Software Composition Analysis)',
      'Secrets detection',
      'Compliance checking'
    ]
  },
  {
    id: 'qe-approval',
    name: 'QE Sign-off',
    icon: <ApproveIcon />,
    description: 'QE verification and sign-off',
    details: [
      'Review test results',
      'Verify all requirements met',
      'Approve test coverage',
      'Sign-off for deployment'
    ]
  },
  {
    id: 'deployment',
    name: 'Deployment',
    icon: <DeployIcon />,
    description: 'Deploying to production environment',
    details: [
      'Prepare deployment package',
      'Update configuration',
      'Deploy to target environment',
      'Health checks and verification'
    ]
  }
];

function PipelineBuilderWorkflow() {
  const [activeStage, setActiveStage] = useState(null);
  const [completedStages, setCompletedStages] = useState([]);
  const [failedStages, setFailedStages] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [pipelineSpeed, setPipelineSpeed] = useState('normal'); // slow, normal, fast
  const [showDetails, setShowDetails] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('qa-branch');
  const [environment, setEnvironment] = useState('staging');
  const [showInstructions, setShowInstructions] = useState(true);
  const [securityFixOpen, setSecurityFixOpen] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [securityScanProgress, setSecurityScanProgress] = useState(0);
  
  // Animation timing based on pipeline speed
  const getStageTime = () => {
    if (pipelineSpeed === 'fast') return 1500;
    if (pipelineSpeed === 'slow') return 5000;
    return 3000; // normal
  };

  // Add a log entry
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, timestamp, type }]);
  };

  // Handle running the pipeline
  const runPipeline = () => {
    setActiveStage(null);
    setCompletedStages([]);
    setFailedStages([]);
    setLogs([]);
    setIsRunning(true);
    
    addLog(`Starting pipeline execution on branch: ${selectedBranch}`, 'success');
    addLog(`Target environment: ${environment}`, 'info');
    
    // Simulate pipeline execution
    simulatePipelineExecution();
  };

  // Simulate pipeline execution with animations
  const simulatePipelineExecution = async () => {
    const stageTime = getStageTime();
    let shouldFail = false;

    // Process stages in sequence
    for (let i = 0; i < PIPELINE_STAGES.length; i++) {
      const stage = PIPELINE_STAGES[i];
      setActiveStage(stage.id);
      
      // Add log for stage start
      addLog(`Starting stage: ${stage.name}`, 'info');
      
      // Simulate stage execution
      await new Promise(resolve => setTimeout(resolve, stageTime));
      
      // Security scan stage should always fail for this demo
      if (stage.id === 'security-scan') {
        addLog('Running dependency vulnerability scan...', 'info');
        await new Promise(resolve => setTimeout(resolve, stageTime / 3));
        addLog('Found 3 high severity vulnerabilities in dependencies', 'error');
        addLog('CVE-2023-45127: Log4j vulnerability detected in v1.2.17', 'error');
        addLog('CVE-2022-39135: Spring Framework injection vulnerability', 'error');
        addLog('CVE-2023-38289: OpenSSL critical vulnerability', 'error');
        
        setFailedStages(prev => [...prev, stage.id]);
        addLog(`Failed in stage: ${stage.name}. Security vulnerabilities must be addressed.`, 'error');
        setIsRunning(false);
        return;
      }
      
      // Random chance to simulate failures in certain stages (except security which always fails)
      if (stage.id === 'automated-tests' && Math.random() < 0.2) {
        shouldFail = true;
      }
      
      if (shouldFail) {
        setFailedStages(prev => [...prev, stage.id]);
        addLog(`Failed in stage: ${stage.name}. Error detected.`, 'error');
        setIsRunning(false);
        return;
      }
      
      // Mark stage as completed
      setCompletedStages(prev => [...prev, stage.id]);
      addLog(`Completed stage: ${stage.name} successfully`, 'success');
      
      // Simulate some stage-specific logs
      if (stage.id === 'code-scan') {
        addLog('Found 12 files changed in last commit', 'info');
        addLog('Detected changes in core modules: authentication, payment-processor', 'info');
        addLog('Code quality scan successful - 0 critical issues', 'success');
      } else if (stage.id === 'trigger-build') {
        addLog('Initializing GitHub Actions runner: runner-8fcd94-linux', 'info');
        addLog('Runner environment: Ubuntu 22.04, Node 18.x, Java 17', 'info');
        addLog('Build environment prepared successfully', 'success');
      } else if (stage.id === 'automated-tests') {
        addLog('Running unit tests (245 tests)', 'info');
        await new Promise(resolve => setTimeout(resolve, stageTime / 4));
        addLog('Unit tests completed: 242 passed, 3 skipped, 0 failed', 'success');
        addLog('Running integration tests (53 tests)', 'info');
        await new Promise(resolve => setTimeout(resolve, stageTime / 4));
        addLog('Integration tests completed: 53 passed, 0 failed', 'success');
        addLog('Tests passed: 295 | Tests skipped: 3 | Tests failed: 0', 'success');
        addLog('Code coverage: 87.3%', 'info');
      } else if (stage.id === 'qe-approval') {
        addLog('Notifying QE team for approval via Slack channel #qe-approvals', 'info');
        await new Promise(resolve => setTimeout(resolve, stageTime / 2));
        addLog('QE Engineer "John Doe (john.doe@company.com)" reviewed and approved the changes', 'success');
        addLog('QE Comments: "All test cases pass and acceptance criteria met"', 'info');
      } else if (stage.id === 'deployment') {
        addLog('Preparing deployment package for staging environment', 'info');
        await new Promise(resolve => setTimeout(resolve, stageTime / 4));
        addLog('Executing database migration scripts (3 pending migrations)', 'info');
        await new Promise(resolve => setTimeout(resolve, stageTime / 4));
        addLog('Deployment in progress: updating 4 microservices', 'info');
        await new Promise(resolve => setTimeout(resolve, stageTime / 4));
        addLog('Running smoke tests on staging environment', 'info');
        await new Promise(resolve => setTimeout(resolve, stageTime / 4));
        addLog('Application successfully deployed to staging', 'success');
        addLog('New version: v2.3.5 (build #45892)', 'info');
        addLog('Deployment completed in 2m 15s', 'info');
        addLog('Health checks: All services operational (8/8)', 'success');
      }
    }
    
    // Pipeline completed
    setActiveStage(null);
    setIsRunning(false);
    addLog('Pipeline execution completed successfully!', 'success');
  };

  // Handle stopping the pipeline
  const stopPipeline = () => {
    setIsRunning(false);
    addLog('Pipeline execution stopped manually', 'warning');
  };

  // Reset the pipeline
  const resetPipeline = () => {
    setActiveStage(null);
    setCompletedStages([]);
    setFailedStages([]);
    addLog('Pipeline reset to initial state', 'info');
  };

  return (
    <Box>
      {/* Pre-Pipeline Manual Setup Instructions */}
      {showInstructions && (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            mb: 3, 
            borderColor: 'primary.light',
            backgroundColor: 'rgba(25, 118, 210, 0.05)',
            position: 'relative'
          }}
        >
          <IconButton 
            size="small" 
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={() => setShowInstructions(false)}
          >
            <CancelIcon fontSize="small" />
          </IconButton>
          
          <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon color="primary" fontSize="small" />
            Engineer Setup Instructions (Pre-Pipeline)
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Required Manual Steps Before Running Pipeline:
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
                    Environment Preparation
                  </Typography>
                  <Box component="ol" sx={{ pl: 2, m: 0 }}>
                    <li>
                      <Typography variant="body2">
                        Verify development environment is synced with latest dependencies
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        <code>npm ci</code> or <code>mvn clean install</code>
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        Run local test suite to ensure all tests pass
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        <code>npm test</code> or <code>./gradlew test</code>
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        Verify GitHub Actions permissions and secrets are configured
                      </Typography>
                    </li>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
                    Repository Configuration
                  </Typography>
                  <Box component="ol" sx={{ pl: 2, m: 0 }}>
                    <li>
                      <Typography variant="body2">
                        Ensure branch protection rules are enabled for target branches
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        Check CI workflow file exists at <code>.github/workflows/pipeline.yml</code>
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        Verify required status checks are enforced for PR approval
                      </Typography>
                    </li>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 1 }}>
                  <AlertTitle>Need Access?</AlertTitle>
                  Contact DevOps team at <strong>devops@company.com</strong> for GitHub repository access, 
                  runner configuration assistance, or deployment environment credentials.
                </Alert>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      {/* Pipeline Configuration */}
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Pipeline Configuration
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Source Branch</InputLabel>
              <Select
                value={selectedBranch}
                label="Source Branch"
                onChange={(e) => setSelectedBranch(e.target.value)}
                disabled={isRunning}
              >
                <MenuItem value="main">main</MenuItem>
                <MenuItem value="develop">develop</MenuItem>
                <MenuItem value="qa-branch">qa-branch</MenuItem>
                <MenuItem value="feature/new-ui">feature/new-ui</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Target Environment</InputLabel>
              <Select
                value={environment}
                label="Target Environment"
                onChange={(e) => setEnvironment(e.target.value)}
                disabled={isRunning}
              >
                <MenuItem value="dev">Development</MenuItem>
                <MenuItem value="staging">Staging</MenuItem>
                <MenuItem value="production">Production</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Pipeline Speed</InputLabel>
              <Select
                value={pipelineSpeed}
                label="Pipeline Speed"
                onChange={(e) => setPipelineSpeed(e.target.value)}
                disabled={isRunning}
              >
                <MenuItem value="slow">Slow (Demo)</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="fast">Fast</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                onClick={() => setShowInstructions(!showInstructions)}
                disabled={isRunning}
              >
                {showInstructions ? 'Hide' : 'Show'} Setup Instructions
              </Button>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={showDetails} 
                      onChange={(e) => setShowDetails(e.target.checked)}
                    />
                  } 
                  label="Show Details" 
                />
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={resetPipeline}
                  disabled={isRunning}
                >
                  Reset
                </Button>
                {isRunning ? (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<StopIcon />}
                    onClick={stopPipeline}
                  >
                    Stop Pipeline
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayArrowIcon />}
                    onClick={runPipeline}
                  >
                    Run Pipeline
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Pipeline Visualization */}
      <Grid container spacing={2}>
        {PIPELINE_STAGES.map((stage, index) => (
          <React.Fragment key={stage.id}>
            {/* Stage Card */}
            <Grid item xs={12} md={PIPELINE_STAGES.length === 6 ? 2 : 12 / PIPELINE_STAGES.length}>
              <Box sx={{ height: '100%' }}>
                <StageCard 
                  active={activeStage === stage.id}
                  completed={completedStages.includes(stage.id)}
                  failed={failedStages.includes(stage.id)}
                  elevation={activeStage === stage.id ? 4 : 1}
                >
                  {/* Stage Header */}
                  <Box sx={{ display: 'flex', mb: 2, alignItems: 'center', gap: 2 }}>
                    <motion.div
                      animate={{
                        scale: activeStage === stage.id ? [1, 1.1, 1] : 1,
                        rotate: activeStage === stage.id ? [0, 5, -5, 0] : 0,
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: activeStage === stage.id ? Infinity : 0,
                        repeatType: 'loop'
                      }}
                    >
                      <StageIcon 
                        active={activeStage === stage.id}
                        completed={completedStages.includes(stage.id)}
                        failed={failedStages.includes(stage.id)}
                      >
                        {failedStages.includes(stage.id) ? (
                          <ErrorIcon />
                        ) : completedStages.includes(stage.id) ? (
                          <CheckCircleIcon />
                        ) : (
                          stage.icon
                        )}
                      </StageIcon>
                    </motion.div>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {stage.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stage.description}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Stage Status */}
                  <Box>
                    {activeStage === stage.id && isRunning && (
                      <Box sx={{ mb: 2 }}>
                        <LinearProgress
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                          }} 
                        />
                      </Box>
                    )}
                    
                    {showDetails && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Box sx={{ mt: 1 }}>
                            {stage.details.map((detail, idx) => (
                              <Box 
                                key={idx} 
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  mb: 0.5,
                                  opacity: activeStage === stage.id && isRunning ? 
                                    (idx < (completedStages.includes(stage.id) ? stage.details.length : 2) ? 1 : 0.4) : 
                                    (completedStages.includes(stage.id) ? 1 : 0.7)
                                }}
                              >
                                <Box 
                                  sx={{ 
                                    width: 16, 
                                    height: 16, 
                                    mr: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    color: completedStages.includes(stage.id) ? 'success.main' : 
                                          activeStage === stage.id ? 'primary.main' : 'text.secondary',
                                  }}
                                >
                                  {completedStages.includes(stage.id) ? (
                                    <CheckCircleIcon fontSize="small" />
                                  ) : (
                                    idx < 2 && activeStage === stage.id && isRunning ? (
                                      <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ 
                                          duration: 1, 
                                          repeat: Infinity, 
                                          ease: 'linear' 
                                        }}
                                      >
                                        <RefreshIcon 
                                          fontSize="small" 
                                          sx={{ opacity: 0.8 }} 
                                        />
                                      </motion.div>
                                    ) : (
                                      <BranchIcon 
                                        fontSize="small" 
                                        sx={{ opacity: 0.5 }} 
                                      />
                                    )
                                  )}
                                </Box>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontSize: '0.8rem',
                                    textDecoration: completedStages.includes(stage.id) ? 'line-through' : 'none',
                                    color: completedStages.includes(stage.id) ? 'text.secondary' : 'text.primary'
                                  }}
                                >
                                  {detail}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </Box>

                  {/* Stage Status Icon */}
                  {(completedStages.includes(stage.id) || failedStages.includes(stage.id)) && (
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      {failedStages.includes(stage.id) ? (
                        <Tooltip title="Failed">
                          <CancelIcon color="error" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Completed">
                          <VerifiedIcon color="success" />
                        </Tooltip>
                      )}
                    </Box>
                  )}
                </StageCard>
              </Box>
            </Grid>
            
            {/* Connector line between stages */}
            {index < PIPELINE_STAGES.length - 1 && (
              <Grid 
                item 
                xs={0}
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box sx={{ width: '30px', display: 'flex', justifyContent: 'center' }}>
                  <motion.div
                    animate={{
                      x: activeStage === PIPELINE_STAGES[index + 1].id ? [0, 10, 0] : 0
                    }}
                    transition={{ 
                      duration: 1, 
                      repeat: activeStage === PIPELINE_STAGES[index + 1].id ? Infinity : 0,
                      repeatType: 'loop'
                    }}
                  >
                    <ArrowForwardIcon 
                      color={
                        failedStages.includes(stage.id) ? 'error' :
                        completedStages.includes(stage.id) && 
                        (completedStages.includes(PIPELINE_STAGES[index + 1].id) || 
                         activeStage === PIPELINE_STAGES[index + 1].id) ? 'success' : 'disabled'
                      }
                    />
                  </motion.div>
                </Box>
              </Grid>
            )}
          </React.Fragment>
        ))}
      </Grid>

      {/* Mobile view - vertical stages for smaller screens */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Pipeline Stages
        </Typography>
        <Stepper 
          activeStep={activeStage ? 
            PIPELINE_STAGES.findIndex(s => s.id === activeStage) : 
            completedStages.length > 0 ? 
              completedStages.length : 0
          } 
          orientation="vertical"
        >
          {PIPELINE_STAGES.map((stage) => (
            <Step key={stage.id}>
              <StepLabel
                error={failedStages.includes(stage.id)}
                completed={completedStages.includes(stage.id)}
              >
                {stage.name}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Pipeline Logs */}
      <Paper variant="outlined" sx={{ p: 2, mt: 3, backgroundColor: '#f5f5f5', height: '200px', overflow: 'auto' }}>
        <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimelineIcon fontSize="small" />
          Pipeline Logs
        </Typography>
        <Box 
          sx={{ 
            fontFamily: 'monospace', 
            fontSize: '0.85rem', 
            height: '100%',
            overflow: 'auto',
            color: '#555',
            backgroundColor: '#000',
            p: 1,
            borderRadius: 1
          }}
        >
          {logs.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#aaa', fontStyle: 'italic' }}>
              Run the pipeline to see execution logs...
            </Typography>
          ) : (
            logs.map((log, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 0.5, 
                  color: log.type === 'error' ? '#ff5252' : 
                         log.type === 'success' ? '#4caf50' : 
                         log.type === 'warning' ? '#ff9800' : '#fff'
                }}
              >
                <Typography variant="body2" component="span" sx={{ color: '#888' }}>
                  [{log.timestamp}]
                </Typography>{' '}
                {log.message}
              </Box>
            ))
          )}
        </Box>
      </Paper>

      {/* Actions for fixing security issues */}
      {failedStages.includes('security-scan') && !isRunning && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="warning"
            startIcon={<SecurityIcon />}
            onClick={() => setSecurityFixOpen(true)}
          >
            Fix Security Vulnerabilities
          </Button>
        </Box>
      )}

      {/* Security Vulnerability Fix Dialog */}
      <Dialog 
        open={securityFixOpen} 
        onClose={() => setSecurityFixOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'error.dark', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon />
            <Typography variant="h6">Security Vulnerabilities Detected</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertTitle>Pipeline Failed: Security Stage</AlertTitle>
            The following critical security vulnerabilities must be addressed before deployment can proceed.
          </Alert>

          {isFixing ? (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Security Remediation in Progress
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Scanning for vulnerabilities...</span>
                  <span>{securityScanProgress}%</span>
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={securityScanProgress} 
                  color="primary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              
              <Box sx={{ fontFamily: 'monospace', fontSize: '0.85rem', p: 2, bgcolor: '#000', color: '#4caf50', borderRadius: 1 }}>
                {securityScanProgress < 30 && (
                  <Typography variant="body2" component="div">
                    $ npm audit fix --force<br/>
                    Starting dependency upgrades...<br/>
                    Updating log4j-core from 1.2.17 to 2.17.1
                  </Typography>
                )}
                
                {securityScanProgress >= 30 && securityScanProgress < 60 && (
                  <Typography variant="body2" component="div">
                    Updated log4j-core 1.2.17 → 2.17.1<br/>
                    Updating spring-core from 5.3.9 to 5.3.24<br/>
                    Patching CVE-2022-39135...
                  </Typography>
                )}
                
                {securityScanProgress >= 60 && securityScanProgress < 90 && (
                  <Typography variant="body2" component="div">
                    Updated spring-core 5.3.9 → 5.3.24<br/>
                    Updating openssl from 1.1.1q to 3.1.2<br/>
                    Patching CVE-2023-38289...
                  </Typography>
                )}
                
                {securityScanProgress >= 90 && (
                  <Typography variant="body2" component="div">
                    Updated openssl 1.1.1q → 3.1.2<br/>
                    Running security scan...<br/>
                    No vulnerabilities found! ✓<br/>
                    All dependencies are now up to date and secure.
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell>CVE ID</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Affected Component</TableCell>
                      <TableCell>Recommended Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>CVE-2023-45127</TableCell>
                      <TableCell>
                        <Chip label="Critical" color="error" size="small" />
                      </TableCell>
                      <TableCell>Log4j vulnerability detected</TableCell>
                      <TableCell>log4j-core:1.2.17</TableCell>
                      <TableCell>Update to log4j-core:2.17.1</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>CVE-2022-39135</TableCell>
                      <TableCell>
                        <Chip label="High" color="error" size="small" />
                      </TableCell>
                      <TableCell>Spring Framework injection vulnerability</TableCell>
                      <TableCell>spring-core:5.3.9</TableCell>
                      <TableCell>Update to spring-core:5.3.24</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>CVE-2023-38289</TableCell>
                      <TableCell>
                        <Chip label="High" color="error" size="small" />
                      </TableCell>
                      <TableCell>OpenSSL critical vulnerability</TableCell>
                      <TableCell>openssl:1.1.1q</TableCell>
                      <TableCell>Update to openssl:3.1.2</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                Dependency Updates Required:
              </Typography>

              <Paper variant="outlined" sx={{ p: 2, fontFamily: 'monospace', bgcolor: 'grey.50' }}>
                <Typography variant="body2" component="pre" sx={{ m: 0 }}>
                  {`// In pom.xml, update these dependencies:
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.17.1</version>  <!-- Was 1.2.17 -->
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>5.3.24</version>  <!-- Was 5.3.9 -->
</dependency>

// In Dockerfile, update OpenSSL:
RUN apt-get update && apt-get install -y openssl=3.1.2`}
                </Typography>
              </Paper>

              <Alert severity="info" sx={{ mt: 3 }}>
                <AlertTitle>Next Steps</AlertTitle>
                After fixing these vulnerabilities, commit the changes and re-run the pipeline.
                Contact the security team at <strong>security@company.com</strong> if you need assistance.
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {isFixing ? (
            <Button 
              disabled
              variant="outlined"
            >
              Fixing vulnerabilities...
            </Button>
          ) : (
            <>
              <Button onClick={() => setSecurityFixOpen(false)}>Close</Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<CheckCircleIcon />}
                onClick={() => {
                  // Show fixing in progress
                  setIsFixing(true);
                  
                  // Simulate progress updates
                  const progressInterval = setInterval(() => {
                    setSecurityScanProgress(prev => {
                      const newProgress = prev + 5;
                      if (newProgress >= 100) {
                        clearInterval(progressInterval);
                        
                        // After completing progress, continue with pipeline
                        setTimeout(() => {
                          // Close dialog and continue with pipeline
                          setFailedStages([]);
                          setSecurityFixOpen(false);
                          setIsFixing(false);
                          setSecurityScanProgress(0);
                          
                          // Log the fix
                          addLog('Security vulnerabilities fixed through dependency updates', 'success');
                          addLog('Commit hash: 8d72a5e "Fix security vulnerabilities in dependencies"', 'info');
                          
                          // Start security rescan
                          setTimeout(() => {
                            setIsRunning(true);
                            
                            // Simulate scanning
                            addLog('Initiating security rescan...', 'info');
                            setActiveStage('security-scan');
                            
                            // After a delay, complete security scan
                            setTimeout(async () => {
                              addLog('Security rescan completed - No vulnerabilities found', 'success');
                              setCompletedStages(prev => [...prev, 'security-scan']);
                              
                              // Start QE approval
                              setActiveStage('qe-approval');
                              addLog('Starting stage: QE Sign-off', 'info');
                              addLog('Notifying QE team for approval via Slack channel #qe-approvals', 'info');
                              
                              // After a delay, complete QE approval
                              setTimeout(async () => {
                                addLog('QE Engineer "John Doe (john.doe@company.com)" reviewed and approved the changes', 'success');
                                addLog('QE Comments: "All security issues have been addressed, approved for deployment"', 'info');
                                addLog('Completed stage: QE Sign-off successfully', 'success');
                                setCompletedStages(prev => [...prev, 'qe-approval']);
                                
                                // Start deployment
                                setActiveStage('deployment');
                                addLog('Starting stage: Deployment', 'info');
                                addLog('Preparing deployment package for staging environment', 'info');
                                
                                // Simulate deployment sub-steps
                                setTimeout(() => {
                                  addLog('Executing database migration scripts (3 pending migrations)', 'info');
                                  
                                  setTimeout(() => {
                                    addLog('Deployment in progress: updating 4 microservices', 'info');
                                    
                                    setTimeout(() => {
                                      addLog('Running smoke tests on staging environment', 'info');
                                      
                                      setTimeout(() => {
                                        addLog('Application successfully deployed to staging', 'success');
                                        addLog('New version: v2.3.5 (build #45892)', 'info');
                                        addLog('Deployment completed in 2m 15s', 'info');
                                        addLog('Health checks: All services operational (8/8)', 'success');
                                        addLog('Completed stage: Deployment successfully', 'success');
                                        addLog('Pipeline execution completed successfully!', 'success');
                                        
                                        setCompletedStages(prev => [...prev, 'deployment']);
                                        setActiveStage(null);
                                        setIsRunning(false);
                                      }, 1000);
                                    }, 1000);
                                  }, 1000);
                                }, 1000);
                              }, 3000);
                            }, 3000);
                          }, 1000);
                        }, 1000);
                      }
                      return newProgress;
                    });
                  }, 200); // Update every 200ms
                }}
              >
                Fix Vulnerabilities & Continue Pipeline
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PipelineBuilderWorkflow; 