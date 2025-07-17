import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, List, ListItem, ListItemText, Alert, TextField, Grid, Paper, LinearProgress } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CodeIcon from '@mui/icons-material/Code';
import { motion } from 'framer-motion';

const MobileDeveloperAssistDialog = ({ open, onClose }) => {
  const [architecturePlan, setArchitecturePlan] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedArchitecture, setSelectedArchitecture] = useState('');
  const [wireframePreview, setWireframePreview] = useState(null);
  const [wireframeDownloadInfo, setWireframeDownloadInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isGeneratingWireframes, setIsGeneratingWireframes] = useState(false);
  const [wireframeProgress, setWireframeProgress] = useState(0);
  const [showFieldWarning, setShowFieldWarning] = useState(false);

  // Debug logging for state changes
  useEffect(() => {
    console.log('State updated:', {
      wireframePreview,
      wireframeDownloadInfo,
      successMessage,
      error,
      loading
    });
  }, [wireframePreview, wireframeDownloadInfo, successMessage, error, loading]);

  // Add debug log at the top of the component
  console.log('[RENDER] wireframePreview:', wireframePreview, 'wireframeDownloadInfo:', wireframeDownloadInfo, 'successMessage:', successMessage, 'error:', error, 'isGeneratingWireframes:', isGeneratingWireframes);

  const generateWireframes = async () => {
    // Check required fields before making the request
    if (!architecturePlan || !selectedPlatform || !selectedArchitecture) {
      setShowFieldWarning(true);
      return;
    }
    setShowFieldWarning(false);
    try {
      setIsGeneratingWireframes(true);
      setWireframeProgress(0);
      setError(null);
      setSuccessMessage(null);

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

      // Create preview object from backend response
      const preview = {
        name: data.name,
        totalScreens: data.previewScreens,
        screens: data.screens
      };
      setWireframePreview(preview);
      console.log('[STATE] setWireframePreview:', preview);
      
      // Set download info
      const downloadInfo = {
        downloadUrl: data.downloadUrl,
        instructions: 'Click the button below to download the wireframe specifications.'
      };
      setWireframeDownloadInfo(downloadInfo);
      console.log('[STATE] setWireframeDownloadInfo:', downloadInfo);
      
      // Set success message
      setSuccessMessage(data.message);
      console.log('[STATE] setSuccessMessage:', data.message);
      setWireframeProgress(100);
      setIsGeneratingWireframes(false);
    } catch (error) {
      setIsGeneratingWireframes(false);
      setWireframeProgress(0);
      setError(`Error generating wireframes: ${error.message}`);
      console.log('[STATE] setError:', `Error generating wireframes: ${error.message}`);
    }
  };

  const handleDownload = () => {
    console.log('Download clicked, download info:', wireframeDownloadInfo);
    if (wireframeDownloadInfo?.downloadUrl) {
      console.log('Initiating download from:', wireframeDownloadInfo.downloadUrl);
      window.location.href = wireframeDownloadInfo.downloadUrl;
    } else {
      console.error('Download URL not available');
    }
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
            <CodeIcon sx={{ fontSize: 40 }} />
            Start Development
          </Typography>

          <Grid container spacing={4}>
            {/* Figma Wireframes Section */}
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
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" 
                      alt="Figma" 
                      style={{ width: 32, height: 32 }}
                    />
                    Figma Wireframes
                  </Typography>

                  <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                    Generate professional wireframes for your mobile application based on the architecture plan.
                    The wireframes will include all key screens and interactions defined in your requirements.
                  </Typography>

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
                  ) : wireframePreview ? (
                    <Box sx={{ mt: 3 }}>
                      {successMessage && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                          {successMessage}
                        </Alert>
                      )}
                      
                      {/* Wireframe Preview */}
                      <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          Wireframe Preview: {wireframePreview.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Total Screens: {wireframePreview.totalScreens}
                        </Typography>
                        <List>
                          {wireframePreview.screens.map((screen, index) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={screen.name}
                                secondary={`${screen.components?.length || 0} components`}
                              />
                            </ListItem>
                          ))}
                        </List>
                        
                        {/* Download Button */}
                        {wireframeDownloadInfo && (
                          <Box sx={{ mt: 2 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => window.location.href = wireframeDownloadInfo.downloadUrl}
                              startIcon={<CloudDownloadIcon />}
                            >
                              Download Wireframes
                            </Button>
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                              {wireframeDownloadInfo.instructions}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<CodeIcon />}
                        onClick={generateWireframes}
                        disabled={
                          isGeneratingWireframes ||
                          !architecturePlan ||
                          !selectedPlatform ||
                          !selectedArchitecture
                        }
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
                        {isGeneratingWireframes ? 'Generating...' : 'Generate Wireframes'}
                      </Button>
                      {showFieldWarning && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                          Please select a platform, architecture, and enter an architecture plan before generating wireframes.
                        </Alert>
                      )}
                    </Box>
                  )}

                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Mobile Developer Assistant</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Platform
          </Typography>
          <Button
            variant={selectedPlatform === 'ios' ? 'contained' : 'outlined'}
            onClick={() => setSelectedPlatform('ios')}
            sx={{ mr: 1 }}
          >
            iOS
          </Button>
          <Button
            variant={selectedPlatform === 'android' ? 'contained' : 'outlined'}
            onClick={() => setSelectedPlatform('android')}
          >
            Android
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Architecture
          </Typography>
          <Button
            variant={selectedArchitecture === 'native' ? 'contained' : 'outlined'}
            onClick={() => setSelectedArchitecture('native')}
            sx={{ mr: 1 }}
          >
            Native
          </Button>
          <Button
            variant={selectedArchitecture === 'cross-platform' ? 'contained' : 'outlined'}
            onClick={() => setSelectedArchitecture('cross-platform')}
          >
            Cross-Platform
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Architecture Plan
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={architecturePlan}
            onChange={(e) => setArchitecturePlan(e.target.value)}
            placeholder="Enter your architecture plan here..."
            variant="outlined"
          />
        </Box>

        {renderStartDevelopment()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MobileDeveloperAssistDialog; 