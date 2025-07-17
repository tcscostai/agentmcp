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
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Avatar from '@mui/material/Avatar';
import ClaimRedeterminationDialog from './ClaimRedeterminationDialog';

const mockClaims = [
  {
    id: 'CLM-2024-101',
    patient: 'Alice Walker',
    provider: 'Dr. Henry Lee',
    status: 'Pending Rework',
    amount: '$1,800.00',
    days: 4,
    reason: 'TIN Mismatch',
  },
  {
    id: 'CLM-2024-102',
    patient: 'Brian Adams',
    provider: 'Dr. Susan Green',
    status: 'Appeal Filed',
    amount: '$2,400.00',
    days: 7,
    reason: 'Denied for Coverage',
  },
  {
    id: 'CLM-2024-103',
    patient: 'Cathy Brown',
    provider: 'Dr. Mark White',
    status: 'Pending Rework',
    amount: '$950.00',
    days: 2,
    reason: 'Incorrect Service Code',
  },
  {
    id: 'CLM-2024-104',
    patient: 'John Smith',
    provider: 'Dr. Sarah Johnson',
    status: 'Redetermination Level 1',
    amount: '$3,500.00',
    days: 5,
    reason: 'Benefit Rule Mismatch',
  }
];

const appealLetterMock = `
Dear Claims Department,\n\nI am writing to formally appeal the denial of claim CLM-2024-102 for patient Brian Adams.\n\nBased on policy section 4.2 and the patient's coverage history, this service should be eligible. Please review the attached documentation and reconsider the claim.\n\nSincerely,\nAppealsAgent
`;

const ClaimsAdjudicationsDialog = ({ open, onClose }) => {
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [action, setAction] = useState(null);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [tinValue, setTinValue] = useState('');
  const [tinSubmitted, setTinSubmitted] = useState(false);
  const [showProviderUpdate, setShowProviderUpdate] = useState(false);
  const [finalized, setFinalized] = useState(false);
  const [tinSource, setTinSource] = useState(null);
  const [outreachMethod, setOutreachMethod] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [providerTin, setProviderTin] = useState('');
  const providerPhone = '(555) 123-4567';
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [chatTIN, setChatTIN] = useState('');
  const [showRedeterminationDialog, setShowRedeterminationDialog] = useState(false);

  // Steps for Claim Rework
  const reworkSteps = [
    { label: 'Reviewing claim details', icon: <AssignmentIcon color="info" /> },
    { label: 'Correcting TIN', icon: <PersonIcon color="primary" /> },
    { label: 'Updating claim status', icon: <GavelIcon color="secondary" /> },
    { label: 'Finalizing rework', icon: <AutoAwesomeIcon color="success" /> },
  ];

  // Steps for Appeals & Grievances
  const appealSteps = [
    { label: 'Retrieving policy', icon: <PolicyIcon color="info" /> },
    { label: 'Analyzing claim history', icon: <AssignmentIcon color="primary" /> },
    { label: 'Drafting appeal letter', icon: <DescriptionIcon color="secondary" /> },
    { label: 'Generating response', icon: <AutoAwesomeIcon color="success" /> },
  ];

  const handleAction = (type) => {
    setAction(type);
    setStep(0);
    setDone(false);
    setShowLetter(false);
    let steps = type === 'rework' ? reworkSteps : appealSteps;
    let idx = 0;
    const interval = setInterval(() => {
      setStep(idx);
      idx++;
      if (idx === steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          if (type === 'appeal') setShowLetter(true);
        }, 800);
      }
    }, 1000);
  };

  const handleBack = () => {
    setAction(null);
    setStep(0);
    setDone(false);
    setShowLetter(false);
  };

  const handleDownload = () => {
    const blob = new Blob([appealLetterMock], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appeal_letter.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClaimSelect = (claim) => {
    setSelectedClaim(claim);
    if (claim.status === 'Redetermination Level 1') {
      setShowRedeterminationDialog(true);
    }
  };

  // AI claim summary and suggestion
  const renderClaimSummary = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Claim Summary</Typography>
      <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="body2"><b>Claim ID:</b> {selectedClaim.id}</Typography>
        <Typography variant="body2"><b>Patient:</b> {selectedClaim.patient}</Typography>
        <Typography variant="body2"><b>Provider:</b> {selectedClaim.provider}</Typography>
        <Typography variant="body2"><b>Status:</b> {selectedClaim.status}</Typography>
        <Typography variant="body2"><b>Amount:</b> {selectedClaim.amount}</Typography>
        <Typography variant="body2"><b>Days in Status:</b> {selectedClaim.days}</Typography>
        <Typography variant="body2"><b>Reason:</b> {selectedClaim.reason}</Typography>
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          <b>Missing/Incorrect:</b> TIN
        </Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <AutoAwesomeIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="body1" display="inline">
          AI Suggestion: This claim requires <b>Claim Rework</b> due to TIN Mismatch. Please proceed with rework.
        </Typography>
      </Box>
      <Button variant="contained" onClick={() => setAction('rework')} sx={{ mt: 2 }}>
        Start Claim Rework
      </Button>
    </motion.div>
  );

  // Enhanced Missing Details step
  const renderMissingDetails = () => (
    <Fade in={step === 0}>
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          <ErrorIcon color="error" sx={{ mr: 1 }} /> Missing Details
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          The claim is missing or has an incorrect TIN. Please proceed to correct the TIN.
        </Typography>
        {!tinSource ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Do you have the correct TIN, or does the provider need to supply it?
            </Typography>
            <Button variant="contained" sx={{ mr: 2 }} onClick={() => setTinSource('user')}>
              I have the TIN
            </Button>
            <Button variant="outlined" onClick={() => setTinSource('provider')}>
              Provider must supply TIN
            </Button>
          </Box>
        ) : tinSource === 'user' ? (
          <Button variant="contained" onClick={() => setStep(1)}>
            Next
          </Button>
        ) : !outreachMethod ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              How would you like to connect with the provider?
            </Typography>
            <Button variant="contained" sx={{ mr: 2 }} onClick={() => setShowChatDialog(true)}>
              Chat
            </Button>
            <Button variant="outlined" onClick={() => setOutreachMethod('call')}>
              Call
            </Button>
          </Box>
        ) : outreachMethod === 'call' ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Provider Outreach (Call)
            </Typography>
            <Box sx={{ bgcolor: '#f5f5f5', borderRadius: 2, p: 2, mb: 2 }}>
              <Typography variant="body2"><b>Provider:</b> {selectedClaim.provider}</Typography>
              <Typography variant="body2"><b>Phone:</b> {providerPhone}</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Please call the provider to obtain the TIN, then enter it below:
            </Typography>
            <TextField
              label="Provider TIN"
              value={providerTin}
              onChange={e => { setProviderTin(e.target.value); setTinValue(e.target.value); }}
              sx={{ mb: 2 }}
              fullWidth
            />
            <Button variant="contained" onClick={() => setStep(1)} disabled={!providerTin}>
              Continue
            </Button>
          </Box>
        ) : null}
        {/* Chat Dialog Popup */}
        <Dialog open={showChatDialog} onClose={() => setShowChatDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#1976d2', mr: 1 }}>P</Avatar>
            Provider Outreach (Chat)
          </DialogTitle>
          <DialogContent sx={{ bgcolor: '#f9f9fb', minHeight: 220 }}>
            <Box sx={{ mb: 2 }}>
              {chatStep >= 0 && (
                <Box sx={{ mb: 1, textAlign: 'right' }}>
                  <Box sx={{ display: 'inline-block', bgcolor: '#e3f2fd', borderRadius: 2, px: 2, py: 1 }}>
                    <Typography variant="body2">Hello, can you provide the TIN for claim {selectedClaim.id}?</Typography>
                  </Box>
                </Box>
              )}
              {chatStep >= 1 && (
                <Box sx={{ mb: 1, textAlign: 'left' }}>
                  <Box sx={{ display: 'inline-block', bgcolor: '#c8e6c9', borderRadius: 2, px: 2, py: 1 }}>
                    <Typography variant="body2">Sure, let me check…</Typography>
                  </Box>
                </Box>
              )}
              {chatStep >= 2 && (
                <Box sx={{ mb: 1, textAlign: 'left' }}>
                  <Box sx={{ display: 'inline-block', bgcolor: '#c8e6c9', borderRadius: 2, px: 2, py: 1 }}>
                    <Typography variant="body2">The TIN is 123456789.</Typography>
                  </Box>
                </Box>
              )}
            </Box>
            {chatStep < 2 ? (
              <Button variant="contained" fullWidth onClick={() => setChatStep(chatStep + 1)}>
                {chatStep === 0 ? 'Send' : 'Continue'}
              </Button>
            ) : (
              <Button variant="contained" color="success" fullWidth onClick={() => {
                setProviderTin('123456789');
                setTinValue('123456789');
                setShowChatDialog(false);
                setOutreachMethod('chat');
                setStep(1);
                setChatStep(0);
              }}>
                Accept TIN & Continue
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Fade>
  );

  // Enhanced Claim Rework Flow
  const renderReworkStepper = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => { setAction(null); setStep(0); setTinValue(''); setTinSubmitted(false); setShowProviderUpdate(false); setFinalized(false); setTinSource(null); setOutreachMethod(null); setProviderTin(''); }} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Claim Rework (AdjudicatorAgent)</Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Stepper activeStep={step} alternativeLabel>
        {["Reviewing Claim Details", "Correcting the TIN", "Updating Claim Status", "Finalizing Rework"].map((label, idx) => (
          <Step key={label} completed={step > idx}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4, mb: 2 }}>
        {step === 0 && renderMissingDetails()}
        {step === 1 && (
          <Fade in={step === 1}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} /> Correcting the TIN (Manual Step)
              </Typography>
              {!tinSubmitted ? (
                <Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Please enter the correct TIN for the provider:
                  </Typography>
                  <TextField
                    label="Provider TIN"
                    value={tinValue}
                    onChange={e => setTinValue(e.target.value)}
                    sx={{ mb: 2 }}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      setTinSubmitted(true);
                      setShowProviderUpdate(true);
                      setTimeout(() => setShowProviderUpdate(false), 1500);
                    }}
                    disabled={!tinValue}
                  >
                    Submit TIN
                  </Button>
                </Box>
              ) : (
                <Box>
                  {showProviderUpdate ? (
                    <Fade in={showProviderUpdate}>
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <AutoAwesomeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="body2">TIN submitted. Sending update to provider…</Typography>
                        <LinearProgress sx={{ mt: 2, height: 8, borderRadius: 4 }} />
                      </Box>
                    </Fade>
                  ) : (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body2">TIN updated successfully!</Typography>
                      <Button variant="contained" sx={{ mt: 2 }} onClick={() => setStep(2)}>
                        Next
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Fade>
        )}
        {step === 2 && (
          <Fade in={step === 2}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <GavelIcon color="secondary" sx={{ mr: 1 }} /> Updating Claim Status
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Claim status will be updated to "In Progress" and sent for further processing.
              </Typography>
              <Button variant="contained" onClick={() => setStep(3)}>
                Next
              </Button>
            </Box>
          </Fade>
        )}
        {step === 3 && (
          <Fade in={step === 3}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <AutoAwesomeIcon color="success" sx={{ mr: 1 }} /> Finalizing Rework
              </Typography>
              <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="body2"><b>Claim ID:</b> {selectedClaim.id}</Typography>
                <Typography variant="body2"><b>Patient:</b> {selectedClaim.patient}</Typography>
                <Typography variant="body2"><b>Provider:</b> {selectedClaim.provider}</Typography>
                <Typography variant="body2"><b>Status:</b> In Progress</Typography>
                <Typography variant="body2"><b>Amount:</b> {selectedClaim.amount}</Typography>
                <Typography variant="body2"><b>Days in Status:</b> {selectedClaim.days}</Typography>
                <Typography variant="body2"><b>Reason:</b> TIN Updated</Typography>
                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                  <b>TIN:</b> {tinValue}
                </Typography>
              </Box>
              <Button variant="contained" color="success" onClick={() => setFinalized(true)}>
                Submit
              </Button>
              {finalized && (
                <Fade in={finalized}>
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
                    <Typography variant="h6" color="success.main">Claim rework complete! Claim is ready for further processing.</Typography>
                    <Button variant="outlined" sx={{ mt: 2 }} onClick={onClose}>
                      Close
                    </Button>
                  </Box>
                </Fade>
              )}
            </Box>
          </Fade>
        )}
      </Box>
    </motion.div>
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GavelIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Claims Adjudications</Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {!selectedClaim ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Select a claim to adjudicate:
              </Typography>
              <Grid container spacing={3}>
                {mockClaims.map((claim) => (
                  <Grid item xs={12} md={6} key={claim.id}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        boxShadow: 3,
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)' },
                        cursor: 'pointer',
                      }}
                      onClick={() => handleClaimSelect(claim)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AssignmentIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                          <Typography variant="h6">{claim.id}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Patient: {claim.patient} | Provider: {claim.provider}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Status: {claim.status} | Amount: {claim.amount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Days in Status: {claim.days} | Reason: {claim.reason}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          ) : action === 'rework' ? (
            renderReworkStepper()
          ) : !action ? (
            renderClaimSummary()
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6">
                  {action === 'rework' ? 'Claim Rework (AdjudicatorAgent)' : 'Appeals & Grievances (AppealsAgent)'}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Stepper activeStep={done ? (action === 'rework' ? reworkSteps.length : appealSteps.length) : step} alternativeLabel>
                {(action === 'rework' ? reworkSteps : appealSteps).map((s, idx) => (
                  <Step key={s.label} completed={done && step > idx}>
                    <StepLabel icon={s.icon}>{s.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box sx={{ mt: 4, mb: 2 }}>
                {!done ? (
                  <LinearProgress variant="determinate" value={((step + 1) / (action === 'rework' ? reworkSteps.length : appealSteps.length)) * 100} sx={{ height: 8, borderRadius: 4 }} />
                ) : (
                  <Fade in={done}>
                    <Box sx={{ textAlign: 'center' }}>
                      <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
                      <Typography variant="h6" color="success.main">
                        {action === 'rework' ? 'Claim Rework Complete!' : 'Appeal Letter Generated!'}
                      </Typography>
                    </Box>
                  </Fade>
                )}
              </Box>
              {showLetter && (
                <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Generated Appeal Letter
                  </Typography>
                  <TextField
                    multiline
                    fullWidth
                    minRows={6}
                    value={appealLetterMock}
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 2, fontFamily: 'monospace' }}
                  />
                  <Button startIcon={<DownloadIcon />} onClick={handleDownload} variant="outlined">
                    Download Letter
                  </Button>
                </Box>
              )}
            </motion.div>
          )}
        </DialogContent>
      </Dialog>

      <ClaimRedeterminationDialog
        open={showRedeterminationDialog}
        onClose={() => {
          setShowRedeterminationDialog(false);
          setSelectedClaim(null);
        }}
      />
    </>
  );
};

export default ClaimsAdjudicationsDialog; 