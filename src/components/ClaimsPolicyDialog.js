import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  Tooltip,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Assignment as AssignmentIcon,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  MedicalServices as MedicalServicesIcon,
  Psychology as PsychologyIcon,
  Send as SendIcon,
  Policy as PolicyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const mockProviders = [
  { id: 1, name: 'City General Hospital', status: 'pending', lastRequest: '2024-03-15' },
  { id: 2, name: 'Metro Medical Center', status: 'completed', lastRequest: '2024-03-10' },
  { id: 3, name: 'Community Health Clinic', status: 'pending', lastRequest: '2024-03-14' },
];

const mockClaims = [
  {
    id: 'CLM-2024-001',
    patient: 'John Smith',
    provider: 'Dr. Sarah Johnson',
    type: 'Medical',
    status: 'Under Review',
    priority: 'High',
    aiConfidence: 0.89,
    serviceDate: '2024-03-10',
    amount: '$1,250.00',
  },
  {
    id: 'CLM-2024-002',
    patient: 'Mary Johnson',
    provider: 'Dr. Michael Brown',
    type: 'Dental',
    status: 'Pending',
    priority: 'Medium',
    aiConfidence: 0.75,
    serviceDate: '2024-03-12',
    amount: '$850.00',
  },
  {
    id: 'CLM-2024-003',
    patient: 'Robert Wilson',
    provider: 'Dr. Emily Davis',
    type: 'Vision',
    status: 'Approved',
    priority: 'Low',
    aiConfidence: 0.92,
    serviceDate: '2024-03-14',
    amount: '$2,100.00',
  },
];

const mockPolicies = [
  {
    id: 1,
    name: 'Standard Medical Coverage',
    status: 'Active',
    coverage: {
      medical: '80%',
      dental: '50%',
      vision: '70%'
    },
    lastUpdated: '2024-03-15',
    documents: ['policy_doc.pdf', 'coverage_details.pdf']
  },
  {
    id: 2,
    name: 'Premium Health Plan',
    status: 'Active',
    coverage: {
      medical: '90%',
      dental: '80%',
      vision: '90%'
    },
    lastUpdated: '2024-03-10',
    documents: ['premium_policy.pdf', 'coverage_guide.pdf']
  }
];

const ClaimsPolicyDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('policy');
  const [processing, setProcessing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showPolicyDetails, setShowPolicyDetails] = useState(false);
  const [showProviderAnimation, setShowProviderAnimation] = useState(false);
  const [providerAnimationDone, setProviderAnimationDone] = useState(false);
  const [reviewingClaim, setReviewingClaim] = useState(null);
  const [aiReviewStep, setAiReviewStep] = useState(0);
  const [aiReviewDone, setAiReviewDone] = useState(false);
  const aiReviewSteps = [
    { label: 'Verifying patient information', icon: <PersonIcon color="info" /> },
    { label: 'Checking policy coverage', icon: <PolicyIcon color="primary" /> },
    { label: 'Reviewing service codes', icon: <AssignmentIcon color="secondary" /> },
    { label: 'Validating claim amount', icon: <AttachMoneyIcon color="success" /> },
    { label: 'Finalizing review', icon: <AutoAwesomeIcon color="primary" /> },
  ];

  const handleRequestRecords = (providerId) => {
    setShowProviderAnimation(true);
    setProviderAnimationDone(false);
    setTimeout(() => {
      setProviderAnimationDone(true);
      setTimeout(() => {
        setShowProviderAnimation(false);
      }, 1200);
    }, 2200);
  };

  const handleReviewClaim = (claim) => {
    setReviewingClaim(claim);
    setAiReviewStep(0);
    setAiReviewDone(false);
    let step = 0;
    const interval = setInterval(() => {
      setAiReviewStep(step);
      step++;
      if (step === aiReviewSteps.length) {
        clearInterval(interval);
        setTimeout(() => setAiReviewDone(true), 800);
      }
    }, 900);
  };

  const closeReviewDialog = () => {
    setReviewingClaim(null);
    setAiReviewStep(0);
    setAiReviewDone(false);
  };

  const handleAiTriage = () => {
    setAiProgress(0);
    const interval = setInterval(() => {
      setAiProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handlePolicySelect = (policy) => {
    setSelectedPolicy(policy);
    setShowPolicyDetails(true);
  };

  const renderProviderAnimation = () => (
    <Dialog open={showProviderAnimation} maxWidth="xs" fullWidth>
      <DialogContent sx={{ textAlign: 'center', py: 6 }}>
        {!providerAnimationDone ? (
          <>
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              style={{ display: 'inline-block' }}
            >
              <SendIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
            </motion.div>
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ display: 'inline-block', marginLeft: 24 }}
            >
              <MedicalServicesIcon sx={{ fontSize: 48, color: theme.palette.success.main }} />
            </motion.div>
            <Typography variant="h6" sx={{ mt: 4 }}>
              Contacting Provider…
            </Typography>
            <LinearProgress sx={{ mt: 3, height: 8, borderRadius: 4 }} />
          </>
        ) : (
          <>
            <CheckCircleIcon sx={{ fontSize: 56, color: theme.palette.success.main, mb: 2 }} />
            <Typography variant="h6">Records Requested!</Typography>
          </>
        )}
      </DialogContent>
    </Dialog>
  );

  const renderMedicalRecords = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        {mockProviders.map((provider) => (
          <Grid item xs={12} key={provider.id}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MedicalServicesIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{provider.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Request: {provider.lastRequest}
                    </Typography>
                  </Box>
                  <Chip
                    label={provider.status}
                    color={provider.status === 'completed' ? 'success' : 'warning'}
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => handleRequestRecords(provider.id)}
                    disabled={processing}
                  >
                    Request Records
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {renderProviderAnimation()}
    </motion.div>
  );

  const renderClaimReview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        {mockClaims.map((claim) => (
          <Grid item xs={12} key={claim.id}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssignmentIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{claim.id}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Patient: {claim.patient} | Provider: {claim.provider}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Service Date: {claim.serviceDate} | Amount: {claim.amount}
                    </Typography>
                  </Box>
                  <Chip
                    label={claim.status}
                    color={
                      claim.status === 'Approved'
                        ? 'success'
                        : claim.status === 'Under Review'
                        ? 'warning'
                        : 'default'
                    }
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<AssignmentIcon />}
                    onClick={() => handleReviewClaim(claim)}
                  >
                    Review Claim
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {reviewingClaim && (
        <Dialog open={!!reviewingClaim} maxWidth="xs" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AutoAwesomeIcon color="primary" sx={{ mr: 1 }} />
              AI Claim Analysis
            </Box>
          </DialogTitle>
          <DialogContent sx={{ py: 4 }}>
            {!aiReviewDone ? (
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                  {aiReviewSteps.slice(0, aiReviewStep + 1).map((step, idx) => (
                    <Fade in={aiReviewStep >= idx} key={step.label} timeout={600}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {step.icon}
                        <Typography variant="body1" sx={{ ml: 1 }}>{step.label}…</Typography>
                        {aiReviewStep > idx && <CheckCircleIcon color="success" sx={{ ml: 1 }} />}
                      </Box>
                    </Fade>
                  ))}
                </Box>
                <LinearProgress variant="determinate" value={((aiReviewStep + 1) / aiReviewSteps.length) * 100} sx={{ height: 8, borderRadius: 4, mb: 2 }} />
                <Typography variant="body2" color="text.secondary" align="center">
                  AI is analyzing the claim details…
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" color="success.main">All checks passed!</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  This claim is ready for approval.
                </Typography>
                <Button variant="contained" sx={{ mt: 3 }} onClick={closeReviewDialog}>
                  Close
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );

  const renderSmartTriage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PsychologyIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h6">AI-Powered Smart Triage</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Automatically analyze and categorize claims using advanced AI algorithms
          </Typography>
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={aiProgress}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  backgroundColor: 'primary.main',
                },
              }}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            onClick={handleAiTriage}
            disabled={aiProgress > 0}
            fullWidth
          >
            Start AI Triage
          </Button>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {mockClaims.map((claim) => (
          <Grid item xs={12} key={claim.id}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AutoAwesomeIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">Claim #{claim.id}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI Confidence: {(claim.aiConfidence * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <Chip
                    label={claim.priority}
                    color={
                      claim.priority === 'High'
                        ? 'error'
                        : claim.priority === 'Medium'
                        ? 'warning'
                        : 'success'
                    }
                    sx={{ mr: 2 }}
                  />
                  <Tooltip title="AI Analysis Complete">
                    <CheckCircleIcon color="success" />
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );

  const renderPolicyManagement = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={3}>
        {mockPolicies.map((policy) => (
          <Grid item xs={12} key={policy.id}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PolicyIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{policy.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated: {policy.lastUpdated}
                    </Typography>
                  </Box>
                  <Chip
                    label={policy.status}
                    color="success"
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<InfoIcon />}
                    onClick={() => handlePolicySelect(policy)}
                  >
                    View Details
                  </Button>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Coverage Summary:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2">
                        Medical: {policy.coverage.medical}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2">
                        Dental: {policy.coverage.dental}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2">
                        Vision: {policy.coverage.vision}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={showPolicyDetails}
        onClose={() => setShowPolicyDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PolicyIcon sx={{ mr: 1 }} />
            Policy Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPolicy && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedPolicy.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Last Updated: {selectedPolicy.lastUpdated}
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Coverage Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" color="primary">
                        {selectedPolicy.coverage.medical}
                      </Typography>
                      <Typography variant="body2">Medical Coverage</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" color="primary">
                        {selectedPolicy.coverage.dental}
                      </Typography>
                      <Typography variant="body2">Dental Coverage</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" color="primary">
                        {selectedPolicy.coverage.vision}
                      </Typography>
                      <Typography variant="body2">Vision Coverage</Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Policy Documents
                </Typography>
                <Grid container spacing={2}>
                  {selectedPolicy.documents.map((doc, index) => (
                    <Grid item xs={12} key={index}>
                      <Card sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AssignmentIcon sx={{ mr: 1 }} />
                          <Typography variant="body2">{doc}</Typography>
                          <Button
                            size="small"
                            startIcon={<CloudUploadIcon />}
                            sx={{ ml: 'auto' }}
                          >
                            Download
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '80vh',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PolicyIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Claims Policy Management</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant={activeTab === 'policy' ? 'contained' : 'text'}
                onClick={() => setActiveTab('policy')}
                startIcon={<PolicyIcon />}
              >
                Policy Management
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={activeTab === 'records' ? 'contained' : 'text'}
                onClick={() => setActiveTab('records')}
                startIcon={<MedicalServicesIcon />}
              >
                Medical Records
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={activeTab === 'claims' ? 'contained' : 'text'}
                onClick={() => setActiveTab('claims')}
                startIcon={<AssignmentIcon />}
              >
                Claim Review
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={activeTab === 'triage' ? 'contained' : 'text'}
                onClick={() => setActiveTab('triage')}
                startIcon={<PsychologyIcon />}
              >
                Smart Triage
              </Button>
            </Grid>
          </Grid>
        </Box>

        {activeTab === 'policy' && renderPolicyManagement()}
        {activeTab === 'records' && renderMedicalRecords()}
        {activeTab === 'claims' && renderClaimReview()}
        {activeTab === 'triage' && renderSmartTriage()}
      </DialogContent>
    </Dialog>
  );
};

export default ClaimsPolicyDialog; 