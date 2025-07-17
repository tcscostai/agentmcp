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
  Chip,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Fade,
  Tooltip,
  Divider,
  TextField,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Assignment as AssignmentIcon,
  Gavel as GavelIcon,
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Person as PersonIcon,
  Policy as PolicyIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  VerifiedUser as VerifiedUserIcon,
  Edit as EditIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const REDETERMINATION_STEPS = [
  {
    label: 'Retrieve Previous Denial',
    icon: <HistoryIcon />,
    description: 'Retrieving previous denial data and documentation',
    duration: 2000
  },
  {
    label: 'Complete Redetermination Form',
    icon: <DescriptionIcon />,
    description: 'Fill out the Medicare Redetermination Request Form',
    duration: 0, // Manual step
    isManual: true
  },
  {
    label: 'Collect Required Evidence',
    icon: <AttachFileIcon />,
    description: 'Gather and attach supporting documentation',
    duration: 0, // Manual step
    isManual: true
  },
  {
    label: 'Validate Benefit Rules',
    icon: <PolicyIcon />,
    description: 'Validating claim against current benefit rules',
    duration: 2500
  },
  {
    label: 'Generate Resolution',
    icon: <AutoAwesomeIcon />,
    description: 'Generating redetermination resolution',
    duration: 2000
  },
  {
    label: 'Finalize Redetermination',
    icon: <CheckCircleIcon />,
    description: 'Finalizing redetermination decision',
    duration: 1500
  }
];

const REQUIRED_EVIDENCE = [
  'Original denial letter',
  'Medical records supporting the service',
  'Provider documentation',
  'Any additional supporting documentation',
  'Power of Attorney documentation (if applicable)'
];

const mockClaim = {
  id: 'CLM-2024-104',
  patient: 'John Smith',
  provider: 'Dr. Sarah Johnson',
  status: 'Redetermination Level 1',
  amount: '$3,500.00',
  days: 5,
  reason: 'Benefit Rule Mismatch',
  previousDenial: {
    date: '2024-02-15',
    reason: 'Service not covered under current benefit plan',
    documentation: 'Denial letter and policy documentation attached'
  },
  benefitRules: {
    planType: 'PPO',
    coveragePeriod: '2024-01-01 to 2024-12-31',
    applicableRules: [
      'Rule 4.2: Coverage for specialized procedures',
      'Rule 7.1: Out-of-network provider requirements',
      'Rule 9.3: Prior authorization requirements'
    ]
  }
};

const ClaimRedeterminationDialog = ({ open, onClose }) => {
  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResolution, setShowResolution] = useState(false);
  const [resolutionComplete, setResolutionComplete] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(mockClaim);
  const [showForm, setShowForm] = useState(false);
  const [showEvidenceList, setShowEvidenceList] = useState(false);
  const [formData, setFormData] = useState({
    memberName: '',
    memberID: '',
    providerName: '',
    serviceDate: '',
    denialDate: '',
    reasonForAppeal: '',
    additionalComments: ''
  });
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);

  const handleStartRedetermination = () => {
    setIsProcessing(true);
    let currentStep = 0;
    
    const processStep = () => {
      if (currentStep < REDETERMINATION_STEPS.length) {
        setStep(currentStep);
        if (!REDETERMINATION_STEPS[currentStep].isManual) {
          setTimeout(() => {
            currentStep++;
            processStep();
          }, REDETERMINATION_STEPS[currentStep].duration);
        }
      } else {
        setIsProcessing(false);
        setShowResolution(true);
      }
    };
    
    processStep();
  };

  const handleCompleteRedetermination = () => {
    setResolutionComplete(true);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setShowEvidenceList(true);
  };

  const handleEvidenceComplete = () => {
    setShowEvidenceList(false);
    setEvidenceUploaded(true);
    // Continue with the automated steps
    setIsProcessing(true);
    setStep(3); // Skip to validation step
    let currentStep = 3;
    
    const processRemainingSteps = () => {
      if (currentStep < REDETERMINATION_STEPS.length) {
        setStep(currentStep);
        setTimeout(() => {
          currentStep++;
          processRemainingSteps();
        }, REDETERMINATION_STEPS[currentStep].duration);
      } else {
        setIsProcessing(false);
        setShowResolution(true);
      }
    };
    
    processRemainingSteps();
  };

  const renderClaimDetails = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Claim Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="body2"><b>Claim ID:</b> {selectedClaim.id}</Typography>
          <Typography variant="body2"><b>Patient:</b> {selectedClaim.patient}</Typography>
          <Typography variant="body2"><b>Provider:</b> {selectedClaim.provider}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body2"><b>Amount:</b> {selectedClaim.amount}</Typography>
          <Typography variant="body2"><b>Status:</b> {selectedClaim.status}</Typography>
          <Typography variant="body2"><b>Days in Status:</b> {selectedClaim.days}</Typography>
        </Grid>
      </Grid>
    </Box>
  );

  const renderPreviousDenial = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Previous Denial Details
      </Typography>
      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="body2"><b>Denial Date:</b> {selectedClaim.previousDenial.date}</Typography>
        <Typography variant="body2"><b>Reason:</b> {selectedClaim.previousDenial.reason}</Typography>
        <Typography variant="body2"><b>Documentation:</b> {selectedClaim.previousDenial.documentation}</Typography>
      </Paper>
    </Box>
  );

  const renderBenefitRules = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Applicable Benefit Rules
      </Typography>
      <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="body2"><b>Plan Type:</b> {selectedClaim.benefitRules.planType}</Typography>
        <Typography variant="body2"><b>Coverage Period:</b> {selectedClaim.benefitRules.coveragePeriod}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}><b>Applicable Rules:</b></Typography>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          {selectedClaim.benefitRules.applicableRules.map((rule, index) => (
            <li key={index}>
              <Typography variant="body2">{rule}</Typography>
            </li>
          ))}
        </ul>
      </Paper>
    </Box>
  );

  const renderRedeterminationForm = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Medicare Redetermination Request Form (1st Level Appeal)
      </Typography>
      <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Member Name"
              value={formData.memberName}
              onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Member ID"
              value={formData.memberID}
              onChange={(e) => setFormData({ ...formData, memberID: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Provider Name"
              value={formData.providerName}
              onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Service Date"
              type="date"
              value={formData.serviceDate}
              onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Denial Date"
              type="date"
              value={formData.denialDate}
              onChange={(e) => setFormData({ ...formData, denialDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reason for Appeal"
              multiline
              rows={3}
              value={formData.reasonForAppeal}
              onChange={(e) => setFormData({ ...formData, reasonForAppeal: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Additional Comments"
              multiline
              rows={3}
              value={formData.additionalComments}
              onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleFormSubmit}
            disabled={!formData.memberName || !formData.memberID || !formData.providerName}
          >
            Submit Form
          </Button>
        </Box>
      </Paper>
    </Box>
  );

  const renderEvidenceCollection = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Required Evidence Collection
      </Typography>
      <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please attach the following required documents:
        </Typography>
        <Box sx={{ mb: 3 }}>
          {REQUIRED_EVIDENCE.map((evidence, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachFileIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">{evidence}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <WarningIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="subtitle2" color="warning.dark">
              Important Notes:
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            • All documents must be clear and legible
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Medical records should be relevant to the denied service
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Power of Attorney documentation must be current and valid
          </Typography>
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => setShowEvidenceList(false)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleEvidenceComplete}
          >
            Complete Evidence Collection
          </Button>
        </Box>
      </Paper>
    </Box>
  );

  const renderResolution = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Redetermination Resolution
      </Typography>
      <Paper sx={{ p: 2, bgcolor: '#e8f5e9' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Based on the review of previous denial and current benefit rules, this claim should be <b>APPROVED</b>.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <b>Resolution Details:</b>
        </Typography>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>
            <Typography variant="body2">
              Service is covered under Rule 4.2 for specialized procedures
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Provider meets out-of-network requirements per Rule 7.1
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Prior authorization was obtained and documented
            </Typography>
          </li>
        </ul>
        <Button
          variant="contained"
          color="success"
          onClick={handleCompleteRedetermination}
          sx={{ mt: 2 }}
        >
          Complete Redetermination
        </Button>
      </Paper>
    </Box>
  );

  const renderCompletion = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Redetermination Completed Successfully
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        The claim has been approved and is ready for processing
      </Typography>
      <Button variant="outlined" onClick={onClose}>
        Close
      </Button>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GavelIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Claim Redetermination Level 1</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {!isProcessing && !showResolution && !resolutionComplete ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {renderClaimDetails()}
            {renderPreviousDenial()}
            {renderBenefitRules()}
            {showForm ? (
              renderRedeterminationForm()
            ) : showEvidenceList ? (
              renderEvidenceCollection()
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowForm(true)}
                sx={{ mt: 2 }}
              >
                Start Redetermination Process
              </Button>
            )}
          </motion.div>
        ) : isProcessing ? (
          <Box sx={{ mt: 4 }}>
            <Stepper activeStep={step} alternativeLabel>
              {REDETERMINATION_STEPS.map((s, idx) => (
                <Step key={s.label} completed={step > idx}>
                  <StepLabel icon={s.icon}>{s.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box sx={{ mt: 4, mb: 2 }}>
              <Fade in={true}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {REDETERMINATION_STEPS[step].icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {REDETERMINATION_STEPS[step].label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {REDETERMINATION_STEPS[step].description}
                  </Typography>
                  {!REDETERMINATION_STEPS[step].isManual && (
                    <LinearProgress 
                      variant="determinate" 
                      value={((step + 1) / REDETERMINATION_STEPS.length) * 100}
                      sx={{ mt: 2, height: 8, borderRadius: 4 }} 
                    />
                  )}
                </Box>
              </Fade>
            </Box>
          </Box>
        ) : resolutionComplete ? (
          renderCompletion()
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {renderClaimDetails()}
            {renderResolution()}
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClaimRedeterminationDialog; 