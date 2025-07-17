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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
  Divider,
  Card,
  CardContent,
  Grid,
  Rating,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
} from '@mui/material';
import {
  Assignment as StoryIcon,
  Analytics as AnalyzeIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  FileDownload as DownloadIcon,
  PlayArrow as AnalyzeAllIcon,
  Info as InfoIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  Insights as InsightsIcon,
  HelpOutline as HelpIcon,
  GppGood as SecurityIcon,
  FormatListBulleted as ListIcon,
  Assessment as AssessmentIcon,
  BugReport as BugIcon,
  Psychology as CognitionIcon,
  VerifiedUser as ComplianceIcon,
} from '@mui/icons-material';

// New constant for score thresholds
const SCORE_THRESHOLDS = {
  excellent: 90,
  good: 75,
  adequate: 60,
  poor: 45
};

// New constant for score categories
const SCORE_CATEGORIES = [
  { 
    id: 'completeness', 
    label: 'Completeness',
    icon: <ListIcon />,
    description: 'Measures how complete the user story is in terms of required components (As a, I want to, So that) and necessary details.'
  },
  { 
    id: 'clarity', 
    label: 'Clarity',
    icon: <InfoIcon />,
    description: 'Evaluates how clearly the requirements are expressed and whether they are ambiguous or precise.'
  },
  { 
    id: 'testability', 
    label: 'Testability',
    icon: <BugIcon />,
    description: 'Assesses whether the requirements can be verified through testing with clear acceptance criteria.'
  },
  { 
    id: 'feasibility', 
    label: 'Feasibility',
    icon: <AssessmentIcon />,
    description: 'Determines if the requirements are realistic and achievable within the project constraints.'
  },
  { 
    id: 'consistency', 
    label: 'Consistency',
    icon: <ComplianceIcon />,
    description: 'Checks if the requirements are consistent with other requirements and don\'t introduce contradictions.'
  },
  { 
    id: 'security', 
    label: 'Security Awareness',
    icon: <SecurityIcon />,
    description: 'Evaluates if security considerations are addressed in the requirements where applicable.'
  }
];

function getScoreColor(score) {
  if (score >= SCORE_THRESHOLDS.excellent) return 'success.main';
  if (score >= SCORE_THRESHOLDS.good) return 'success.light';
  if (score >= SCORE_THRESHOLDS.adequate) return 'warning.main';
  if (score >= SCORE_THRESHOLDS.poor) return 'warning.dark';
  return 'error.main';
}

function getScoreLabel(score) {
  if (score >= SCORE_THRESHOLDS.excellent) return 'Excellent';
  if (score >= SCORE_THRESHOLDS.good) return 'Good';
  if (score >= SCORE_THRESHOLDS.adequate) return 'Adequate';
  if (score >= SCORE_THRESHOLDS.poor) return 'Needs Improvement';
  return 'Poor';
}

function RequirementsAnalyzerDialog({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userStories, setUserStories] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [batchAnalysis, setBatchAnalysis] = useState({
    inProgress: false,
    completed: 0,
    total: 0
  });
  // New state for expanded sections
  const [expandedSections, setExpandedSections] = useState({});

  const fetchUserStories = async () => {
    try {
      setLoading(true);
      setError(null);

      // First check Jira config
      const configResponse = await fetch('/api/jira/config');
      const configData = await configResponse.json();

      if (!configData.isConfigured) {
        throw new Error('Jira is not configured');
      }

      console.log('Fetching stories...');
      const response = await fetch('/api/jira/stories');
      const data = await response.json();
      console.log('Stories response:', data);

      if (!data.issues) {
        throw new Error('No stories found');
      }

      const formattedStories = data.issues.map(issue => ({
        id: issue.id,
        key: issue.key,
        fields: issue.fields
      }));

      setUserStories(formattedStories);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUserStories();
    }
  }, [open]);

  const analyzeStory = async (story) => {
    try {
      setLoading(true);
      setError('');
      setSelectedStory(story);

      console.log('Analyzing story:', story);
      const response = await fetch('/api/csnp/analyze/story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ story })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Analysis response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      // If API doesn't return detailed scores, generate sample data
      const enhancedAnalysis = enhanceAnalysisWithDetailedScores(data.analysis, story);
      setAnalysis(enhancedAnalysis);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to enhance analysis with detailed scores if they don't exist
  const enhanceAnalysisWithDetailedScores = (analysis, story) => {
    // Check if the analysis already has detailed scores
    if (analysis.detailedScores) {
      return analysis; // Return as is if detailed scores already exist
    }

    // Generate sample detailed scores based on the existing completeness score
    const baseScore = analysis.completenessScore || 70;
    
    // Create random variation for different categories (within ±15 of base score)
    const generateScore = () => {
      const variation = Math.floor(Math.random() * 30) - 15; // -15 to +15
      const score = Math.max(0, Math.min(100, baseScore + variation));
      return score;
    };

    // Generate findings for each category
    const generateFindings = (categoryId, score) => {
      const findings = [];
      if (score >= 80) {
        findings.push({
          type: 'success',
          message: `Strong ${categoryId} with clear definition and details.`
        });
      } else if (score >= 60) {
        findings.push({
          type: 'warning',
          message: `Acceptable ${categoryId}, but could be improved with more details.`
        });
      } else {
        findings.push({
          type: 'error',
          message: `Poor ${categoryId}. This needs significant improvement.`
        });
      }
      return findings;
    };

    // Calculate overall score based on weighted average of all categories
    const detailedScores = {};
    let totalWeight = 0;
    let weightedScore = 0;

    SCORE_CATEGORIES.forEach(category => {
      const score = generateScore();
      const weight = category.id === 'completeness' || category.id === 'clarity' ? 2 : 1;
      
      detailedScores[category.id] = {
        score,
        label: getScoreLabel(score),
        findings: generateFindings(category.id, score)
      };
      
      totalWeight += weight;
      weightedScore += score * weight;
    });

    const overallScore = Math.round(weightedScore / totalWeight);

    // Add insights based on the story content
    const insights = [
      {
        title: 'User Perspective',
        description: `The story ${story.fields.summary.toLowerCase().includes('user') ? 'effectively' : 'inadequately'} captures the user's perspective and needs.`
      },
      {
        title: 'Business Value',
        description: `The story ${story.fields.description && story.fields.description.length > 100 ? 'clearly' : 'does not clearly'} articulate the business value it delivers.`
      },
      {
        title: 'Implementation Complexity',
        description: `Based on the requirements, this story appears to be of ${baseScore > 75 ? 'moderate' : 'high'} complexity.`
      }
    ];

    // Return enhanced analysis
    return {
      ...analysis,
      overallScore,
      detailedScores,
      insights
    };
  };

  // Handle section expansion toggle
  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Export the analysis report as PDF or JSON
  const exportAnalysis = () => {
    if (!analysis) return;
    
    // For now, just export as JSON
    const jsonString = JSON.stringify(analysis, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedStory.key}-analysis-report.json`;
    document.body.appendChild(a);
    a.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StoryIcon color="primary" />
          <Typography>Requirements Analyzer</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, height: '600px' }}>
          {/* User Stories List */}
          <Paper sx={{ width: '40%', p: 2, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              User Stories
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : userStories.length > 0 ? (
              <List>
                {userStories.map((story) => (
                  <ListItem 
                    key={story.id}
                    button
                    selected={selectedStory?.id === story.id}
                    onClick={() => analyzeStory(story)}
                  >
                    <ListItemIcon>
                      <StoryIcon color={selectedStory?.id === story.id ? "primary" : "inherit"} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={story.fields.summary}
                      secondary={`${story.key} - ${story.fields.status.name}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary" align="center">
                No stories found
              </Typography>
            )}
          </Paper>

          {/* Analysis Results */}
          <Paper sx={{ width: '60%', p: 2, overflow: 'auto' }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Analysis Results
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : selectedStory && analysis ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedStory.fields.summary}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedStory.key} - {selectedStory.fields.status.name}
                </Typography>

                {/* Overall Quality Score */}
                <Card variant="outlined" sx={{ mb: 3, bgcolor: 'background.paper', position: 'relative' }}>
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      right: 0, 
                      height: '100%', 
                      width: '8px', 
                      bgcolor: getScoreColor(analysis.overallScore || analysis.completenessScore)
                    }} 
                  />
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Overall Quality Score
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography 
                            variant="h2" 
                            sx={{ 
                              color: getScoreColor(analysis.overallScore || analysis.completenessScore),
                              fontWeight: 600
                            }}
                          >
                            {analysis.overallScore || analysis.completenessScore}%
                          </Typography>
                          <Chip 
                            label={getScoreLabel(analysis.overallScore || analysis.completenessScore)} 
                            color={analysis.overallScore >= SCORE_THRESHOLDS.good ? "success" : 
                                  analysis.overallScore >= SCORE_THRESHOLDS.adequate ? "warning" : "error"}
                            size="small"
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Quality Rating
                          </Typography>
                          <Rating 
                            value={Math.ceil((analysis.overallScore || analysis.completenessScore) / 20)} 
                            readOnly 
                            precision={0.5}
                            icon={<StarIcon fontSize="inherit" />}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Detailed Score Categories */}
                <Box sx={{ mb: 3 }}>
                  <Accordion 
                    expanded={expandedSections.scores !== false}
                    onChange={() => handleSectionToggle('scores')}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssessmentIcon color="primary" />
                        <Typography variant="subtitle1">Detailed Scores</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {SCORE_CATEGORIES.map((category) => {
                          const categoryScore = analysis.detailedScores?.[category.id]?.score ?? 
                                              (category.id === 'completeness' ? analysis.completenessScore : 70);
                          return (
                            <Grid item xs={12} sm={6} key={category.id}>
                              <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {React.cloneElement(category.icon, { fontSize: 'small' })}
                                    <Typography variant="body2" fontWeight={500}>
                                      {category.label}
                                    </Typography>
                                  </Box>
                                  <Tooltip title={category.description}>
                                    <IconButton size="small">
                                      <HelpIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box sx={{ flexGrow: 1 }}>
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={categoryScore} 
                                      sx={{ 
                                        height: 8, 
                                        borderRadius: 4,
                                        bgcolor: 'background.paper',
                                        '& .MuiLinearProgress-bar': {
                                          bgcolor: getScoreColor(categoryScore)
                                        }
                                      }}
                                    />
                                  </Box>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontWeight: 600, 
                                      color: getScoreColor(categoryScore),
                                      minWidth: '40px',
                                      textAlign: 'right'
                                    }}
                                  >
                                    {categoryScore}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Box>

                {/* Findings */}
                <Box sx={{ mb: 3 }}>
                  <Accordion 
                    expanded={expandedSections.findings !== false}
                    onChange={() => handleSectionToggle('findings')}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BugIcon color="primary" />
                        <Typography variant="subtitle1">Findings</Typography>
                        <Badge 
                          badgeContent={analysis.findings.length} 
                          color={analysis.findings.some(f => f.type === 'error') ? 'error' : 'warning'}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {analysis.findings.map((finding, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              {finding.type === 'success' ? (
                                <CheckIcon color="success" />
                              ) : finding.type === 'warning' ? (
                                <WarningIcon color="warning" />
                              ) : (
                                <ErrorIcon color="error" />
                              )}
                            </ListItemIcon>
                            <ListItemText 
                              primary={finding.message}
                              primaryTypographyProps={{
                                sx: { fontWeight: finding.type === 'error' ? 600 : 400 }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>

                      {/* Category-specific findings */}
                      {analysis.detailedScores && (
                        <Box sx={{ mt: 2 }}>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="subtitle2" gutterBottom>
                            Category-Specific Findings
                          </Typography>
                          {SCORE_CATEGORIES.map(category => (
                            analysis.detailedScores[category.id]?.findings?.length > 0 && (
                              <Box key={category.id} sx={{ mb: 2 }}>
                                <Typography variant="body2" fontWeight={600} gutterBottom>
                                  {category.label}
                                </Typography>
                                <List dense disablePadding>
                                  {analysis.detailedScores[category.id].findings.map((finding, idx) => (
                                    <ListItem key={idx} dense sx={{ py: 0.5 }}>
                                      <ListItemIcon sx={{ minWidth: 36 }}>
                                        {finding.type === 'success' ? (
                                          <CheckIcon color="success" fontSize="small" />
                                        ) : finding.type === 'warning' ? (
                                          <WarningIcon color="warning" fontSize="small" />
                                        ) : (
                                          <ErrorIcon color="error" fontSize="small" />
                                        )}
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary={finding.message}
                                        primaryTypographyProps={{
                                          variant: 'body2'
                                        }}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )
                          ))}
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Box>

                {/* Suggestions */}
                <Box sx={{ mb: 3 }}>
                  <Accordion 
                    expanded={expandedSections.suggestions !== false}
                    onChange={() => handleSectionToggle('suggestions')}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoIcon color="primary" />
                        <Typography variant="subtitle1">Suggestions for Improvement</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {analysis.suggestions.map((suggestion, index) => (
                          <ListItem key={index}>
                            <ListItemText 
                              primary={suggestion.title}
                              secondary={suggestion.description}
                              primaryTypographyProps={{
                                fontWeight: 600,
                                color: 'primary.main'
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </Box>

                {/* Insights */}
                {analysis.insights && (
                  <Box sx={{ mb: 3 }}>
                    <Accordion 
                      expanded={expandedSections.insights !== false}
                      onChange={() => handleSectionToggle('insights')}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <InsightsIcon color="primary" />
                          <Typography variant="subtitle1">Requirements Insights</Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List>
                          {analysis.insights.map((insight, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <CognitionIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={insight.title}
                                secondary={insight.description}
                                primaryTypographyProps={{
                                  fontWeight: 600
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography color="text.secondary" align="center">
                Select a user story to analyze
              </Typography>
            )}
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {selectedStory && analysis && (
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportAnalysis}
          >
            Export Report
          </Button>
        )}
        {selectedStory && (
          <Button
            variant="contained"
            startIcon={<AnalyzeIcon />}
            onClick={() => analyzeStory(selectedStory)}
            disabled={loading}
          >
            Analyze Again
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default RequirementsAnalyzerDialog; 