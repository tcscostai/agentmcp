import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Card,
  CardContent,
  Divider,
  Stack,
  Tooltip,
  IconButton,
  Dialog as SubDialog,
  ListItemText,
  ListItemIcon,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  List,
  ListItem,
} from '@mui/material';

import {
  Upload as UploadIcon,
  Assessment as AssessmentIcon,
  BugReport as TestingIcon,
  Description as ReportIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  PictureAsPdf as PdfIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  CompareArrows as CompareArrowsIcon,
  Storage as DatabaseIcon,
  Save as SaveIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Insights as InsightsIcon,
  CheckCircle as CheckCircleIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

import { styled } from '@mui/material/styles';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
}));

const ResultsSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& .MuiTableContainer-root': {
    marginTop: theme.spacing(2)
  }
}));

const StyledRecommendationCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  background: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
}));

const AnalyticsCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const MetricBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const DataCorrectionDialog = ({ open, onClose, memberData, dbSources }) => {
  const [selectedDb, setSelectedDb] = useState('');
  const [dbResults, setDbResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [correctedData, setCorrectedData] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [editValues, setEditValues] = useState({});
  const [updateStatus, setUpdateStatus] = useState(null);

  const mockDbSearch = async () => {
    setLoading(true);
    // Simulate DB search delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock database results
    const results = {
      'local_db': {
        memberId: memberData.memberId,
        name: memberData.name,
        dateOfBirth: '1982/02/15',
        effectiveDate: '2024/02/23',
        planId: 'Plan 2',
        found: true,
        differences: ['dateOfBirth', 'effectiveDate']
      },
      'cms_db': {
        memberId: memberData.memberId,
        name: memberData.name,
        dateOfBirth: '1982/02/15',
        effectiveDate: '2024/02/01',
        planId: 'Plan 2',
        found: true,
        differences: ['effectiveDate']
      }
    };

    setDbResults(results[selectedDb]);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedDb) {
      mockDbSearch();
    }
  }, [selectedDb]);

  const handleEditField = (field) => {
    setEditMode(prev => ({ ...prev, [field]: true }));
    setEditValues(prev => ({ ...prev, [field]: dbResults[field] }));
  };

  const handleValueChange = (field, value) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const handleCorrection = async (field) => {
    setLoading(true);
    try {
      if (selectedDb === 'local_db') {
        // Simulate local database update
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUpdateStatus({
          type: 'success',
          message: `Successfully updated ${field} in local database`
        });
        setEditMode(prev => ({ ...prev, [field]: false }));
      } else if (selectedDb === 'cms_db') {
        // Show CMS update process
        setUpdateStatus({
          type: 'info',
          message: `To update ${field} in CMS:
          1. Submit form CMS-1234 with the corrected information
          2. Include supporting documentation
          3. Allow 3-5 business days for processing
          4. Track status using Transaction ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });
      }
    } catch (error) {
      setUpdateStatus({
        type: 'error',
        message: 'Failed to update data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center">
          <CompareArrowsIcon color="primary" />
          <Typography variant="h6">Data Verification & Correction</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Database Selection */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Select Database Source</InputLabel>
              <Select
                value={selectedDb}
                onChange={(e) => setSelectedDb(e.target.value)}
                label="Select Database Source"
              >
                {dbSources.map((db) => (
                  <MenuItem key={db.id} value={db.id}>
                    <ListItemIcon>
                      <DatabaseIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={db.name}
                      secondary={db.description} 
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Update Status Messages */}
          {updateStatus && (
            <Grid item xs={12}>
              <Alert 
                severity={updateStatus.type}
                onClose={() => setUpdateStatus(null)}
                sx={{ mb: 2 }}
              >
                <Typography 
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {updateStatus.message}
                </Typography>
              </Alert>
            </Grid>
          )}

          {/* Comparison Results */}
          {loading ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>
                  {selectedDb === 'local_db' 
                    ? 'Updating database records...' 
                    : 'Preparing CMS update process...'}
                </Typography>
              </Box>
            </Grid>
          ) : dbResults && (
            <>
              <Grid item xs={12}>
                <Alert 
                  severity={dbResults.found ? "warning" : "error"}
                  variant="outlined"
                >
                  {dbResults.found ? (
                    <>
                      Found record with {dbResults.differences.length} discrepancies
                      {selectedDb === 'cms_db' && (
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Note: CMS database updates require formal submission process
                        </Typography>
                      )}
                    </>
                  ) : (
                    "No matching record found"
                  )}
                </Alert>
              </Grid>
              
              {dbResults.found && (
                <Grid item xs={12}>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Field</TableCell>
                          <TableCell>Current Value</TableCell>
                          <TableCell>Database Value</TableCell>
                          <TableCell width="250">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(dbResults)
                          .filter(([key]) => !['found', 'differences'].includes(key))
                          .map(([field, dbValue]) => (
                            <TableRow key={field}>
                              <TableCell>{field}</TableCell>
                              <TableCell>
                                <Typography
                                  color={
                                    dbResults.differences.includes(field) 
                                      ? "error" 
                                      : "textPrimary"
                                  }
                                >
                                  {memberData[field] || 'Missing'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {editMode[field] ? (
                                  <TextField
                                    size="small"
                                    value={editValues[field]}
                                    onChange={(e) => handleValueChange(field, e.target.value)}
                                    fullWidth
                                  />
                                ) : (
                                  dbValue
                                )}
                              </TableCell>
                              <TableCell>
                                {dbResults.differences.includes(field) && (
                                  <Stack direction="row" spacing={1}>
                                    {editMode[field] ? (
                                      <>
                                        <Button
                                          size="small"
                                          variant="contained"
                                          onClick={() => handleCorrection(field)}
                                          startIcon={<SaveIcon />}
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          size="small"
                                          onClick={() => setEditMode(prev => ({ ...prev, [field]: false }))}
                                        >
                                          Cancel
                                        </Button>
                                      </>
                                    ) : (
                                      <Button
                                        size="small"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleEditField(field)}
                                      >
                                        {selectedDb === 'local_db' ? 'Update' : 'Request Update'}
                                      </Button>
                                    )}
                                  </Stack>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </SubDialog>
  );
};

const MemberDetailsDialog = ({ trc, open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [memberRecommendations, setMemberRecommendations] = useState({});
  const [showDataCorrection, setShowDataCorrection] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Mock database sources
  const dbSources = [
    {
      id: 'local_db',
      name: 'Local Member Database',
      description: 'Internal member management system'
    },
    {
      id: 'cms_db',
      name: 'CMS Database',
      description: 'Centers for Medicare & Medicaid Services'
    }
  ];

  useEffect(() => {
    if (trc && open) {
      generateMemberRecommendations();
    }
  }, [trc, open]);

  const generateMemberRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/trr/member-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trcCode: trc.trcCode,
          members: trc.affectedMembers
        })
      });

      const data = await response.json();
      setMemberRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(`TRC ${trc.trcCode} - Member Recommendations`, 14, 15);
    
    // Add summary
    doc.setFontSize(12);
    doc.text(`Total Affected Members: ${trc.affectedMembers.length}`, 14, 25);
    
    // Prepare table data
    const tableData = trc.affectedMembers.map(member => [
      member.memberId,
      member.name,
      member.effectiveDate,
      member.reason,
      memberRecommendations[member.memberId]
        ?.map(rec => rec.message)
        .join('\n') || 'No recommendations'
    ]);

    // Add table
    doc.autoTable({
      startY: 35,
      head: [['Member ID', 'Name', 'Effective Date', 'Reason', 'Recommendations']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        4: { cellWidth: 80 } // Wider column for recommendations
      },
    });

    doc.save(`TRC_${trc.trcCode}_recommendations.pdf`);
  };

  const handleVerifyData = (member) => {
    setSelectedMember(member);
    setShowDataCorrection(true);
  };

  if (!trc) return null;
  
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 1
          }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6">
                TRC {trc.trcCode} Analysis
              </Typography>
              <Chip 
                label={`${trc.affectedMembers.length} Members`} 
                color="primary" 
                size="small" 
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              {loading && <CircularProgress size={24} />}
              <Tooltip title="Export to PDF">
                <IconButton onClick={exportToPDF}>
                  <PdfIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {trc.affectedMembers.map((member, idx) => (
              <StyledRecommendationCard key={idx}>
                <CardContent>
                  <Grid container spacing={2}>
                    {/* Member Info Section */}
                    <Grid item xs={12} md={4}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {member.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {member.memberId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Effective: {member.effectiveDate}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="error.main"
                          sx={{ 
                            p: 1, 
                            bgcolor: 'error.lighter',
                            borderRadius: 1,
                            display: 'inline-block'
                          }}
                        >
                          {member.reason}
                        </Typography>
                      </Stack>
                    </Grid>

                    {/* Recommendations Section */}
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle2" color="primary">
                          Resolution Steps
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<DatabaseIcon />}
                          onClick={() => handleVerifyData(member)}
                        >
                          Verify Data
                        </Button>
                      </Box>
                      {memberRecommendations[member.memberId] ? (
                        <Stack spacing={1}>
                          {memberRecommendations[member.memberId].map((rec, recIdx) => (
                            <Alert 
                              key={recIdx} 
                              severity={rec.type} 
                              variant="outlined"
                              icon={
                                rec.type === 'error' ? <ErrorIcon /> :
                                rec.type === 'warning' ? <WarningIcon /> :
                                <InfoIcon />
                              }
                              sx={{
                                '& .MuiAlert-message': {
                                  width: '100%'
                                }
                              }}
                            >
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {rec.message}
                                </Typography>
                              </Box>
                            </Alert>
                          ))}
                        </Stack>
                      ) : (
                        <Typography color="text.secondary" variant="body2">
                          {loading ? 
                            'Analyzing enrollment data and generating specific resolution steps...' : 
                            'Generating recommendations...'
                          }
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledRecommendationCard>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: 1, borderColor: 'divider', px: 3 }}>
          <Button onClick={onClose} variant="outlined">Close</Button>
          <Button 
            variant="contained" 
            onClick={exportToPDF}
            startIcon={<PdfIcon />}
          >
            Export Report
          </Button>
        </DialogActions>
      </Dialog>

      <DataCorrectionDialog
        open={showDataCorrection}
        onClose={() => setShowDataCorrection(false)}
        memberData={selectedMember}
        dbSources={dbSources}
      />
    </>
  );
};

function TRRProcessingDialog({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedTRC, setSelectedTRC] = useState(null);

  const steps = ['Upload TRR File', 'Analysis & Processing', 'Recommendations'];

  const handleFileUpload = async (event) => {
    try {
      const uploadedFile = event.target.files[0];
      if (!uploadedFile) return;

      if (!uploadedFile.name.endsWith('.csv')) {
        setError('Please upload a CSV file');
        return;
      }

      setFile(uploadedFile);
      setError('');
    } catch (err) {
      setError('Error uploading file: ' + err.message);
    }
  };

  const processTRRFile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch('http://localhost:3001/api/trr/analyze', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (!response.ok) {
        throw new Error('Failed to process TRR file');
      }

      const result = await response.json();
      setAnalysis(result);
      setActiveStep(2);
    } catch (err) {
      setError('Error processing file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseMemberDetails = () => {
    setSelectedTRC(null);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="trr-file-upload"
            />
            <label htmlFor="trr-file-upload">
              <UploadBox>
                <UploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Upload TRR File
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Drag and drop your CSV file here or click to browse
                </Typography>
                {file && (
                  <Chip
                    label={file.name}
                    onDelete={() => setFile(null)}
                    sx={{ mt: 2 }}
                  />
                )}
              </UploadBox>
            </label>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Processing TRR Data
            </Typography>
            <Box sx={{ width: '100%', mb: 3 }}>
              <LinearProgress 
                variant="determinate" 
                value={processingProgress} 
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                {processingProgress}% Complete
              </Typography>
            </Box>
          </Box>
        );

      case 2:
        return analysis ? (
          <ResultsSection>
            <Grid container spacing={3}>
              {/* Summary Statistics - Updated Design */}
              <Grid item xs={12}>
                <StyledPaper>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6">Summary Statistics</Typography>
                    <Chip 
                      icon={<AnalyticsIcon />}
                      label="Real-time Analysis"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <MetricBox>
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.light' }}>
                          <AssessmentIcon color="primary" />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2">Total Records</Typography>
                          <Typography variant="h4">{analysis.totalRecords}</Typography>
                        </Box>
                      </MetricBox>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <MetricBox>
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'success.light' }}>
                          <CheckCircleIcon color="success" />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2">Accepted</Typography>
                          <Typography variant="h4" color="success.main">
                            {analysis.accepted}
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              ({analysis.summary.acceptanceRate.toFixed(1)}%)
                            </Typography>
                          </Typography>
                        </Box>
                      </MetricBox>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <MetricBox>
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'error.light' }}>
                          <ErrorIcon color="error" />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2">Rejected</Typography>
                          <Typography variant="h4" color="error.main">
                            {analysis.rejected}
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              ({analysis.summary.rejectionRate.toFixed(1)}%)
                            </Typography>
                          </Typography>
                        </Box>
                      </MetricBox>
                    </Grid>
                  </Grid>
                </StyledPaper>
              </Grid>

              {/* Predictive Analysis */}
              <Grid item xs={12}>
                <AnalyticsCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <TrendingUpIcon color="primary" />
                      <Typography variant="h6">Predictive Analysis</Typography>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <StyledPaper>
                          <Typography variant="subtitle2" color="primary" gutterBottom>
                            Projected Acceptance Rate
                          </Typography>
                          <Typography variant="h4">
                            {(analysis.summary.acceptanceRate + 15).toFixed(1)}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            After implementing recommendations
                          </Typography>
                        </StyledPaper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <StyledPaper>
                          <Typography variant="subtitle2" color="primary" gutterBottom>
                            Risk Assessment
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h4">Medium</Typography>
                            <Chip 
                              label="Action Needed" 
                              color="warning" 
                              size="small" 
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Based on rejection patterns
                          </Typography>
                        </StyledPaper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <StyledPaper>
                          <Typography variant="subtitle2" color="primary" gutterBottom>
                            Trend Analysis
                          </Typography>
                          <Typography variant="h4" color="success.main">
                            Improving
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Compared to last period
                          </Typography>
                        </StyledPaper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </AnalyticsCard>
              </Grid>

              {/* Pattern Analysis */}
              <Grid item xs={12}>
                <AnalyticsCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <InsightsIcon color="primary" />
                      <Typography variant="h6">Pattern Analysis</Typography>
                    </Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <StyledPaper>
                          <Typography variant="subtitle2" gutterBottom>
                            Common Rejection Patterns
                          </Typography>
                          <List>
                            {analysis.rejectionDetails.byTRC.slice(0, 3).map((trc, idx) => (
                              <ListItem key={idx} divider>
                                <ListItemIcon>
                                  <Chip 
                                    label={`TRC ${trc.trcCode}`} 
                                    size="small" 
                                    color="primary"
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={`${trc.percentage.toFixed(1)}% of Rejections`}
                                  secondary={trc.reasons[0]}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </StyledPaper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <StyledPaper>
                          <Typography variant="subtitle2" gutterBottom>
                            Impact Analysis
                          </Typography>
                          <List>
                            <ListItem divider>
                              <ListItemIcon>
                                <ErrorIcon color="error" />
                              </ListItemIcon>
                              <ListItemText
                                primary="High Impact Issues"
                                secondary={`${analysis.rejectionDetails.byTRC.length} TRC codes affecting operations`}
                              />
                            </ListItem>
                            <ListItem divider>
                              <ListItemIcon>
                                <WarningIcon color="warning" />
                              </ListItemIcon>
                              <ListItemText
                                primary="Process Bottlenecks"
                                secondary="Data validation and eligibility verification"
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <InfoIcon color="info" />
                              </ListItemIcon>
                              <ListItemText
                                primary="Improvement Opportunities"
                                secondary="Automated validation could reduce rejections by 35%"
                              />
                            </ListItem>
                          </List>
                        </StyledPaper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </AnalyticsCard>
              </Grid>

              {/* Existing Rejection Details Table - with updated styling */}
              <Grid item xs={12}>
                <AnalyticsCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Rejection Analysis by TRC Code</Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>TRC Code</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Percentage</TableCell>
                            <TableCell>Common Reasons</TableCell>
                            <TableCell>Affected Members</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {analysis.rejectionDetails.byTRC.map((trc) => (
                            <TableRow key={trc.trcCode}>
                              <TableCell>{trc.trcCode}</TableCell>
                              <TableCell>{trc.count}</TableCell>
                              <TableCell>{trc.percentage.toFixed(1)}%</TableCell>
                              <TableCell>
                                {trc.reasons.map((reason, idx) => (
                                  <Chip 
                                    key={idx} 
                                    label={reason} 
                                    size="small" 
                                    sx={{ m: 0.5 }} 
                                  />
                                ))}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  onClick={() => setSelectedTRC(trc)}
                                >
                                  View {trc.affectedMembers.length} Members
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </AnalyticsCard>
              </Grid>

              {/* AI Recommendations - with updated styling */}
              <Grid item xs={12}>
                <AnalyticsCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <PsychologyIcon color="primary" />
                      <Typography variant="h6">AI-Powered Recommendations</Typography>
                    </Box>
                    <Stack spacing={2}>
                      {analysis.recommendations.map((rec, idx) => (
                        <Alert 
                          key={idx} 
                          severity={rec.type} 
                          variant="outlined"
                          sx={{
                            '& .MuiAlert-message': {
                              width: '100%'
                            }
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                              {rec.type === 'error' ? 'Critical Action Required' :
                               rec.type === 'warning' ? 'Important Consideration' :
                               'Process Improvement'}
                            </Typography>
                            <Typography variant="body2">
                              {rec.message}
                            </Typography>
                          </Box>
                        </Alert>
                      ))}
                    </Stack>
                  </CardContent>
                </AnalyticsCard>
              </Grid>
            </Grid>
          </ResultsSection>
        ) : null;

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && file) {
      setActiveStep(1);
      processTRRFile();
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssessmentIcon color="primary" />
            <Typography>TRR Processing Workflow</Typography>
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
          {activeStep === 0 && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!file || loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Process File
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <MemberDetailsDialog
        trc={selectedTRC}
        open={Boolean(selectedTRC)}
        onClose={handleCloseMemberDetails}
      />
    </>
  );
}

export default TRRProcessingDialog; 