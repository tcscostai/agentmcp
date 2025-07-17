import React, { useState, useEffect } from 'react';
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
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
  Divider,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  AccessTime as TimeIcon,
  Message as MessageIcon,
  Call as CallIcon,
  VolumeUp as VolumeUpIcon,
  RecordVoiceOver as VoiceIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import styled from '@emotion/styled';

const steps = ['Provider Selection', 'Outreach Method', 'Verification', 'Summary'];

const CallScriptCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  background: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const VolumeButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 70,
  top: 16,
}));

function ProviderOutreachDialog({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [outreachMethod, setOutreachMethod] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [callStatus, setCallStatus] = useState('');
  const [scriptStep, setScriptStep] = useState(0);
  const [showScript, setShowScript] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [browserSupported, setBrowserSupported] = useState(true);
  const [ambientSound] = useState(() => {
    const audio = new Audio('https://actions.google.com/sounds/v1/ambiences/hospital_room.ogg');
    audio.preload = 'auto';
    return audio;
  });
  const [phoneRingSound] = useState(() => {
    const audio = new Audio('https://actions.google.com/sounds/v1/phone/phone_ring_classic.ogg');
    audio.preload = 'auto';
    return audio;
  });

  // Mock provider data
  const providers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Primary Care',
      hospital: 'Central Medical Center',
      availability: 'Available Now',
      lastContact: '2 days ago',
      status: 'active',
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      hospital: 'Heart & Vascular Institute',
      availability: 'Available in 15 mins',
      lastContact: '1 week ago',
      status: 'busy',
    },
    // Add more mock providers as needed
  ];

  const callScript = [
    {
      speaker: 'Agent',
      text: "Hello Dr. Sarah, this is the Healthcare Verification System calling."
    },
    {
      speaker: 'Doctor',
      text: "Yes, speaking."
    },
    {
      speaker: 'Agent',
      text: "We're reaching out regarding your patient John Smith, who has listed you as their primary care physician."
    },
    {
      speaker: 'Doctor',
      text: "Oh, John... yes, what can I help you with?"
    },
    {
      speaker: 'Agent',
      text: "Could you please verify if the patient is currently under your care for diabetes type 2?"
    },
    {
      speaker: 'Doctor',
      text: "Yep, he's my patient. Been treating his diabetes since January."
    },
    {
      speaker: 'Agent',
      text: "Thank you for confirming. This verification will be documented in our system."
    },
    {
      speaker: 'Doctor',
      text: "No problem, is that all?"
    },
    {
      speaker: 'Agent',
      text: "Yes, that's all. Thank you for your time, Doctor."
    }
  ];

  useEffect(() => {
    // Check for browser support
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
      
      // Load voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log('Voices loaded:', voices.length);
        }
      };

      // Add event listener only if speechSynthesis is available
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Initial load attempt
      loadVoices();

      // Cleanup
      return () => {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.onvoiceschanged) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setBrowserSupported(false);
    }
  }, []); // Empty dependency array

  const speak = (text, voice = 'agent') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Enhanced voice selection with specific voice preferences
      if (voice === 'doctor') {
        // Try to find a deep male voice for the doctor
        utterance.voice = voices.find(v => 
          v.name.toLowerCase().includes('google us english male') ||
          v.name.toLowerCase().includes('daniel') ||
          v.name.toLowerCase().includes('microsoft david')
        ) || voices.find(v => v.name.toLowerCase().includes('male')) || voices[0];
        
        // Adjust doctor's voice characteristics
        utterance.pitch = 0.9;     // Slightly deeper voice
        utterance.rate = 0.85;     // Slightly slower, more deliberate speech
        utterance.volume = 0.9;    // Slightly quieter than the agent
      } else {
        // Agent voice settings
        utterance.voice = voices.find(v => 
          v.name.toLowerCase().includes('google us english female') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('microsoft zira')
        ) || voices.find(v => v.name.toLowerCase().includes('female')) || voices[0];
        
        utterance.pitch = 1.1;     // Slightly higher pitch for agent
        utterance.rate = 0.95;     // Normal professional pace
        utterance.volume = 1;      // Full volume for clarity
      }
    }

    // Add background effects based on the speaker
    if (voice === 'doctor') {
      // Play ambient hospital sounds at low volume
      ambientSound.volume = 0.1;
      ambientSound.loop = true;
      ambientSound.play().catch(console.error);
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      // Stop ambient sound when doctor stops speaking
      if (voice === 'doctor') {
        ambientSound.pause();
        ambientSound.currentTime = 0;
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleNext = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (activeStep === 2) {
        // Simulate verification process
        const mockVerification = {
          verified: true,
          timestamp: new Date().toISOString(),
          provider: selectedProvider,
          method: outreachMethod,
          notes: 'Patient condition verified. Documentation received.',
        };
        setVerificationStatus(mockVerification);
      }

      setActiveStep((prev) => prev + 1);
    } catch (err) {
      setError('Failed to process request: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
  };

  const simulateCall = async () => {
    setCallStatus('connecting');
    
    try {
      // Initialize audio silently
      await Promise.all([
        ambientSound.play().then(() => {
          ambientSound.pause();
          ambientSound.currentTime = 0;
        }),
        phoneRingSound.play().then(() => {
          phoneRingSound.pause();
          phoneRingSound.currentTime = 0;
        })
      ]).catch(() => console.log('Audio initialization skipped'));
      
      // Play phone ringing sound
      phoneRingSound.volume = 0.3;
      await phoneRingSound.play().catch(() => console.log('Ring sound skipped'));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      phoneRingSound.pause();
      phoneRingSound.currentTime = 0;
      
      setCallStatus('connected');
      setShowScript(true);
      
      const progressScript = async () => {
        for (let i = 0; i < callScript.length; i++) {
          setScriptStep(i);
          const currentLine = callScript[i];
          
          if (i > 0 && callScript[i-1].speaker !== currentLine.speaker) {
            await new Promise(resolve => setTimeout(resolve, 800));
          }
          
          if (currentLine.speaker.toLowerCase() === 'doctor') {
            try {
              ambientSound.volume = 0.1;
              ambientSound.loop = true;
              await ambientSound.play().catch(() => console.log('Ambient sound skipped'));
            } catch (error) {
              console.warn('Failed to play ambient sound:', error);
            }
          }
          
          speak(
            currentLine.text, 
            currentLine.speaker.toLowerCase() === 'doctor' ? 'doctor' : 'agent'
          );
          
          const baseDelay = currentLine.text.length * 50;
          const naturalPause = Math.random() * 500 + 500;
          await new Promise(resolve => setTimeout(resolve, baseDelay + naturalPause));
        }
      };
      
      progressScript();
    } catch (error) {
      console.error('Error during call simulation:', error);
      // Don't show error to user, just continue without audio
    }
  };

  const renderProviderSelection = () => (
    <Grid container spacing={2}>
      {providers.map((provider) => (
        <Grid item xs={12} key={provider.id}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              border: selectedProvider?.id === provider.id ? 2 : 1,
              borderColor: selectedProvider?.id === provider.id ? 'primary.main' : 'divider',
            }}
            onClick={() => handleProviderSelect(provider)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HospitalIcon color="primary" />
                  <Box>
                    <Typography variant="h6">{provider.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {provider.specialty} • {provider.hospital}
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  label={provider.availability}
                  color={provider.status === 'active' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <TimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Last Contact: {provider.lastContact}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderOutreachMethod = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Outreach Method
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              border: outreachMethod === 'phone' ? 2 : 1,
              borderColor: outreachMethod === 'phone' ? 'primary.main' : 'divider',
            }}
            onClick={() => setOutreachMethod('phone')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="primary" />
                <Typography>Phone Call</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Direct communication with provider's office
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              border: outreachMethod === 'email' ? 2 : 1,
              borderColor: outreachMethod === 'email' ? 'primary.main' : 'divider',
            }}
            onClick={() => setOutreachMethod('email')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="primary" />
                <Typography>Email</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Send detailed verification request
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderVerification = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Provider Verification Call
      </Typography>
      
      {!browserSupported && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Text-to-speech is not supported in your browser. The conversation will be displayed as text only.
        </Alert>
      )}
      
      {!showScript ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CallScriptCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <CallIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {callStatus === 'connecting' ? 'Connecting...' : 'Ready to Call'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedProvider?.name}
                </Typography>
              </Box>
            </Box>
            
            {callStatus === 'connecting' ? (
              <LinearProgress sx={{ mt: 2 }} />
            ) : (
              <Button
                variant="contained"
                startIcon={<CallIcon />}
                onClick={simulateCall}
                fullWidth
              >
                Start Call
              </Button>
            )}
          </CallScriptCard>
        </Box>
      ) : (
        <Box>
          <CallScriptCard>
            <Box sx={{ position: 'absolute', right: 16, top: 16 }}>
              <Chip 
                icon={<VolumeUpIcon />} 
                label="Live Call" 
                color="success"
                sx={{ animation: 'pulse 2s infinite' }}
              />
            </Box>
            
            <VolumeButton 
              onClick={() => {
                if (speaking) {
                  window.speechSynthesis?.cancel();
                  setSpeaking(false);
                } else {
                  speak(callScript[scriptStep].text, callScript[scriptStep].speaker.toLowerCase());
                }
              }}
            >
              {speaking ? 
                <VolumeUpIcon color="primary" /> : 
                <VolumeUpIcon color="action" />
              }
            </VolumeButton>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Call Duration: {Math.floor(scriptStep * 3)} seconds
              </Typography>
            </Box>

            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {callScript.slice(0, scriptStep + 1).map((line, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                    opacity: index === scriptStep ? 1 : 0.7,
                    position: 'relative',
                    ...(index === scriptStep && speaking && {
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: -8,
                        top: '50%',
                        width: 4,
                        height: '80%',
                        backgroundColor: 'primary.main',
                        transform: 'translateY(-50%)',
                        animation: 'pulse 1s infinite'
                      }
                    })
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: line.speaker === 'Agent' ? 'primary.main' : 'secondary.main'
                    }}
                  >
                    {line.speaker === 'Agent' ? <VoiceIcon /> : <PersonIcon />}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {line.speaker}
                    </Typography>
                    <Typography>
                      {line.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CallScriptCard>
        </Box>
      )}
    </Box>
  );

  const renderSummary = () => (
    <Box>
      <Alert severity="success" sx={{ mb: 2 }}>
        Provider verification completed successfully
      </Alert>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Verification Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Provider: {selectedProvider.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Method: {outreachMethod === 'phone' ? 'Phone Call' : 'Email'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Timestamp: {new Date().toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return renderProviderSelection();
      case 1:
        return renderOutreachMethod();
      case 2:
        return renderVerification();
      case 3:
        return renderSummary();
      default:
        return null;
    }
  };

  const styles = `
    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
      100% {
        opacity: 1;
      }
    }
  `;

  useEffect(() => {
    return () => {
      // Cleanup audio when component unmounts
      ambientSound.pause();
      phoneRingSound.pause();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HospitalIcon color="primary" />
            <Typography variant="h6">Provider Outreach</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
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

          {renderStepContent(activeStep)}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          {activeStep > 0 && activeStep < steps.length - 1 && (
            <Button onClick={() => setActiveStep((prev) => prev - 1)}>
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || 
                (activeStep === 0 && !selectedProvider) ||
                (activeStep === 1 && !outreachMethod)}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {activeStep === steps.length - 2 ? 'Complete Verification' : 'Next'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProviderOutreachDialog; 