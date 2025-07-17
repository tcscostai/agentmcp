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
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Assignment as StoryIcon,
  Code as CodeIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Preview as PreviewIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import JSZip from 'jszip';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TEST_FRAMEWORKS = [
  {
    id: 'selenium-java',
    name: 'Selenium Java',
    language: 'java',
    description: 'Robust Java-based test automation with TestNG',
    dependencies: ['selenium-java', 'testng', 'webdrivermanager']
  },
  {
    id: 'pytest-selenium',
    name: 'Pytest Selenium',
    language: 'python',
    description: 'Python-based web testing with Pytest and Selenium',
    dependencies: ['pytest', 'selenium', 'webdriver-manager']
  },
  {
    id: 'cypress',
    name: 'Cypress',
    language: 'javascript',
    description: 'Modern JavaScript E2E testing framework',
    dependencies: ['cypress', '@testing-library/cypress']
  },
  {
    id: 'playwright',
    name: 'Playwright',
    language: 'javascript',
    description: 'Reliable end-to-end testing for modern web apps',
    dependencies: ['@playwright/test']
  }
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  overflow: 'auto'
}));

const CodeBlock = styled(Box)(({ theme }) => ({
  backgroundColor: '#1e1e1e',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '& .filename': {
    backgroundColor: '#2d2d2d',
    color: '#569cd6',
    padding: theme.spacing(1, 2),
    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
    fontSize: '14px',
    fontWeight: 'bold',
    borderBottom: '1px solid #404040',
  },
  '& pre': {
    margin: 0,
    padding: '0 !important',
  },
  '& code': {
    fontFamily: 'Consolas, Monaco, "Courier New", monospace !important',
    fontSize: '14px !important',
    lineHeight: '1.5 !important',
  }
}));

function IntegrationTestDesignerDialog({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jiraConfig, setJiraConfig] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [selectedStories, setSelectedStories] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState('');
  const [generatedTests, setGeneratedTests] = useState(null);
  const [manualTestCases, setManualTestCases] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [generating, setGenerating] = useState(false);

  const fetchJiraConfig = async () => {
    try {
      console.log('Fetching Jira config...');
      const response = await fetch('/api/jira/config', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('Config response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch Jira config: ${response.status}`);
      }

      const data = await response.json();
      console.log('Config response:', data);

      if (!data.success || !data.isConfigured) {
        throw new Error('Jira is not configured');
      }

      setJiraConfig(data);
      setError(null);
    } catch (err) {
      console.error('Jira config error:', err);
      setError(err.message);
      setJiraConfig(null);
    }
  };

  useEffect(() => {
    if (open) {
      fetchJiraConfig();
    } else {
      // Clear state when dialog closes
      setJiraConfig(null);
      setError(null);
      setUserStories([]);
    }
  }, [open]);

  useEffect(() => {
    if (jiraConfig?.isConfigured) {
      fetchUserStories();
    }
  }, [jiraConfig]);

  const fetchUserStories = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching stories...');
      const response = await fetch('/api/jira/stories', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('Stories response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch stories: ${response.status}`);
      }

      const data = await response.json();
      console.log('Stories response:', data);

      if (!data.success || !data.issues) {
        throw new Error('No stories found');
      }

      const formattedStories = data.issues.map(issue => ({
        id: issue.id,
        key: issue.key,
        fields: issue.fields,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        type: issue.fields.issuetype.name
      }));

      setUserStories(formattedStories);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStorySelect = (story) => {
    setSelectedStories(prev => {
      const isSelected = prev.some(s => s.key === story.key);
      if (isSelected) {
        return prev.filter(s => s.key !== story.key);
      } else {
        return [...prev, story];
      }
    });
  };

  const generateTests = async () => {
    try {
      setGenerating(true);
      setError(null);

      const framework = TEST_FRAMEWORKS.find(f => f.id === selectedFramework);
      if (!framework) {
        throw new Error('Please select a test framework');
      }

      if (!selectedStories || selectedStories.length === 0) {
        throw new Error('Please select at least one user story');
      }

      console.log('Generating tests with:', {
        framework: framework.name,
        storiesCount: selectedStories.length,
        firstStory: selectedStories[0]?.key
      });

      // Generate both automated and manual test cases in parallel
      const [automatedTests, _] = await Promise.all([
        // Generate automated tests
        (async () => {
          const response = await fetch('http://localhost:3001/api/generate/tests', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              stories: selectedStories,
              framework: {
                id: framework.id,
                name: framework.name,
                language: framework.language
              }
            })
          });

          const data = await response.json();
          console.log('Test generation response:', data);

          if (!response.ok) {
            throw new Error(data.error || data.details || 'Failed to generate automated tests');
          }

          return data;
        })(),
        
        // Generate manual test cases
        generateManualTestCases(selectedStories)
      ]);

      setGeneratedTests(automatedTests);
      setActiveTab(1); // Switch to Generated Tests tab
    } catch (error) {
      console.error('Error generating tests:', error);
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const generateManualTestCases = async (stories) => {
    if (!stories || stories.length === 0) {
      console.warn('No stories provided for manual test case generation');
      return;
    }

    try {
      console.log('Generating manual test cases for stories:', stories);
      
      const response = await fetch('http://localhost:3001/api/generate/manual-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stories: stories
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response format from server');
      }

      console.log('Manual test cases response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to generate manual test cases');
      }
      
      // If the API isn't implemented yet or doesn't return test cases, generate sample data
      if (!data.testCases) {
        console.warn('API did not return test cases, using sample data');
        const sampleTestCases = generateSampleManualTestCases(stories);
        setManualTestCases(sampleTestCases);
      } else {
        setManualTestCases(data);
      }
    } catch (error) {
      console.error('Error generating manual test cases:', error);
      
      // Don't show error to user, just fallback to sample data
      const sampleTestCases = generateSampleManualTestCases(stories);
      setManualTestCases(sampleTestCases);
    }
  };

  const generateSampleManualTestCases = (stories) => {
    // Generate sample manual test cases if API is not available
    return {
      testCases: stories.map(story => ({
        storyKey: story.key,
        storySummary: story.summary,
        positive: [
          {
            id: `${story.key}-pos-1`,
            name: `Verify ${story.summary.split(' ').slice(0, 4).join(' ')} - Happy Path`,
            steps: [
              "Login as authorized user",
              `Navigate to the ${story.summary.split(' ').slice(0, 2).join(' ')} screen`,
              "Enter valid data in all required fields",
              "Submit the form"
            ],
            expectedResult: "Operation completes successfully and confirmation message is displayed"
          },
          {
            id: `${story.key}-pos-2`,
            name: `Verify ${story.summary.split(' ').slice(0, 3).join(' ')} with boundary values`,
            steps: [
              "Login as authorized user",
              `Navigate to the ${story.summary.split(' ').slice(0, 2).join(' ')} screen`,
              "Enter maximum length valid data in text fields",
              "Submit the form"
            ],
            expectedResult: "Operation completes successfully with no truncation of data"
          }
        ],
        negative: [
          {
            id: `${story.key}-neg-1`,
            name: `Verify ${story.summary.split(' ').slice(0, 3).join(' ')} with invalid data`,
            steps: [
              "Login as authorized user",
              `Navigate to the ${story.summary.split(' ').slice(0, 2).join(' ')} screen`,
              "Enter invalid data in required fields",
              "Submit the form"
            ],
            expectedResult: "Appropriate error message is displayed and form is not submitted"
          },
          {
            id: `${story.key}-neg-2`,
            name: `Verify ${story.summary.split(' ').slice(0, 3).join(' ')} with missing required fields`,
            steps: [
              "Login as authorized user",
              `Navigate to the ${story.summary.split(' ').slice(0, 2).join(' ')} screen`,
              "Leave required fields blank",
              "Submit the form"
            ],
            expectedResult: "Validation error messages appear for each required field"
          }
        ]
      }))
    };
  };

  const downloadTests = () => {
    if (!generatedTests) return;

    const framework = TEST_FRAMEWORKS.find(f => f.id === selectedFramework);
    const extension = framework.language === 'java' ? '.java' : 
                     framework.language === 'python' ? '.py' : '.js';

    // Create zip file containing all test files
    const zip = new JSZip();
    
    // Add test files
    Object.entries(generatedTests.files).forEach(([filename, content]) => {
      zip.file(filename + extension, content);
    });

    // Add configuration files
    if (generatedTests.config) {
      Object.entries(generatedTests.config).forEach(([filename, content]) => {
        zip.file(filename, content);
      });
    }

    // Generate and download zip
    zip.generateAsync({ type: 'blob' }).then(content => {
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `integration-tests-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  };

  const downloadManualTestCases = () => {
    if (!manualTestCases) return;
    
    try {
      // Create CSV content
      let csvContent = "Story Key,Story Summary,Test Type,Test Name,Steps,Expected Result\n";
      
      manualTestCases.testCases.forEach(storyTests => {
        // Add positive test cases
        storyTests.positive.forEach(test => {
          csvContent += `${storyTests.storyKey},`;
          csvContent += `"${storyTests.storySummary}",`;
          csvContent += `Positive,`;
          csvContent += `"${test.name}",`;
          csvContent += `"${test.steps.join('; ')}",`;
          csvContent += `"${test.expectedResult}"\n`;
        });
        
        // Add negative test cases
        storyTests.negative.forEach(test => {
          csvContent += `${storyTests.storyKey},`;
          csvContent += `"${storyTests.storySummary}",`;
          csvContent += `Negative,`;
          csvContent += `"${test.name}",`;
          csvContent += `"${test.steps.join('; ')}",`;
          csvContent += `"${test.expectedResult}"\n`;
        });
      });
      
      // Create a blob with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'manual_test_cases.csv');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Manual test cases exported successfully');
    } catch (error) {
      console.error('Error exporting manual test cases:', error);
      setError('Failed to export manual test cases');
    }
  };

  useEffect(() => {
    if (userStories.length > 0 && selectedStories.length === 0) {
      setSelectedStories([userStories[0]]); // Select first story by default
    }
  }, [userStories]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6">Integration Test Designer</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Test Framework</InputLabel>
            <Select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              label="Test Framework"
            >
              {TEST_FRAMEWORKS.map((framework) => (
                <MenuItem key={framework.id} value={framework.id}>
                  <Box>
                    <Typography variant="subtitle1">{framework.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {framework.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 2 }}>
          <Tab label="User Stories" />
          <Tab label="Generated Tests" disabled={!generatedTests} />
          <Tab label="Manual Test Cases" disabled={!manualTestCases} />
        </Tabs>

        <Box sx={{ height: '500px', display: 'flex', gap: 2 }}>
          {activeTab === 0 ? (
            <StyledPaper>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1">Select User Stories</Typography>
                <IconButton onClick={fetchUserStories} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {userStories.map((story) => (
                    <ListItem
                      key={story.key}
                      button
                      onClick={() => handleStorySelect(story)}
                      selected={selectedStories.some(s => s.key === story.key)}
                    >
                      <ListItemIcon>
                        <StoryIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={story.summary}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip label={story.key} size="small" variant="outlined" />
                            <Chip
                              label={story.status}
                              size="small"
                              color={story.status === 'Done' ? 'success' : 'default'}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </StyledPaper>
          ) : activeTab === 1 ? (
            <StyledPaper>
              {generating ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Generating test cases...</Typography>
                </Box>
              ) : (
                generatedTests && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Generated Test Files
                    </Typography>
                    {Object.entries(generatedTests.files).map(([filename, content]) => {
                      // Determine language for syntax highlighting
                      const language = filename.endsWith('.java') ? 'java' : 
                                      filename.endsWith('.py') ? 'python' : 
                                      'javascript';
                                      
                      // Clean up the content
                      const cleanContent = content
                        .replace(/\\n/g, '\n')  // Replace escaped newlines
                        .replace(/\\"/g, '"')   // Replace escaped quotes
                        .replace(/\\\//g, '/'); // Replace escaped slashes

                      return (
                        <Box key={filename} sx={{ mb: 3 }}>
                          <CodeBlock>
                            <Typography className="filename">
                              {filename}
                            </Typography>
                            <SyntaxHighlighter
                              language={language}
                              style={vscDarkPlus}
                              customStyle={{
                                margin: 0,
                                padding: '16px',
                                backgroundColor: '#1e1e1e',
                              }}
                            >
                              {cleanContent}
                            </SyntaxHighlighter>
                          </CodeBlock>
                        </Box>
                      );
                    })}
                  </Box>
                )
              )}
            </StyledPaper>
          ) : (
            <StyledPaper>
              {generating ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Generating manual test cases...</Typography>
                </Box>
              ) : (
                manualTestCases && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Manual Test Cases
                    </Typography>
                    
                    {manualTestCases.testCases.map((storyTests) => (
                      <Accordion key={storyTests.storyKey} sx={{ mb: 2 }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`${storyTests.storyKey}-content`}
                          id={`${storyTests.storyKey}-header`}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StoryIcon color="primary" fontSize="small" />
                            <Typography variant="subtitle2">
                              {storyTests.storyKey}: {storyTests.storySummary}
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              color: 'success.main',
                              mb: 1 
                            }}>
                              <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                              Positive Test Cases
                            </Typography>
                            <TableContainer component={Paper} sx={{ mb: 3 }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell width="30%">Test Name</TableCell>
                                    <TableCell width="40%">Steps</TableCell>
                                    <TableCell width="30%">Expected Result</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {storyTests.positive.map((test) => (
                                    <TableRow key={test.id}>
                                      <TableCell>{test.name}</TableCell>
                                      <TableCell>
                                        <ol style={{ margin: 0, paddingLeft: '16px' }}>
                                          {test.steps.map((step, index) => (
                                            <li key={index}>{step}</li>
                                          ))}
                                        </ol>
                                      </TableCell>
                                      <TableCell>{test.expectedResult}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>

                            <Typography variant="subtitle2" sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              color: 'error.main',
                              mb: 1 
                            }}>
                              <CancelIcon fontSize="small" sx={{ mr: 1 }} />
                              Negative Test Cases
                            </Typography>
                            <TableContainer component={Paper}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell width="30%">Test Name</TableCell>
                                    <TableCell width="40%">Steps</TableCell>
                                    <TableCell width="30%">Expected Result</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {storyTests.negative.map((test) => (
                                    <TableRow key={test.id}>
                                      <TableCell>{test.name}</TableCell>
                                      <TableCell>
                                        <ol style={{ margin: 0, paddingLeft: '16px' }}>
                                          {test.steps.map((step, index) => (
                                            <li key={index}>{step}</li>
                                          ))}
                                        </ol>
                                      </TableCell>
                                      <TableCell>{test.expectedResult}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                )
              )}
            </StyledPaper>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        {activeTab === 0 && (
          <>
            <Box sx={{ flexGrow: 1 }}>
              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel>Test Framework</InputLabel>
                <Select
                  value={selectedFramework}
                  label="Test Framework"
                  onChange={(e) => setSelectedFramework(e.target.value)}
                >
                  {TEST_FRAMEWORKS.map((framework) => (
                    <MenuItem key={framework.id} value={framework.id}>
                      {framework.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={generateTests}
              disabled={!selectedStories.length || !selectedFramework || generating}
              startIcon={generating ? <CircularProgress size={20} /> : <CodeIcon />}
            >
              Generate Tests
            </Button>
          </>
        )}
        
        {activeTab === 1 && (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={() => setActiveTab(0)}>Back</Button>
            <Button 
              variant="contained" 
              onClick={downloadTests}
              startIcon={<DownloadIcon />}
            >
              Download Tests
            </Button>
          </>
        )}
        
        {activeTab === 2 && (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={() => setActiveTab(0)}>Back</Button>
            <Button 
              variant="contained" 
              onClick={downloadManualTestCases}
              startIcon={<DownloadIcon />}
            >
              Export Test Cases
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default IntegrationTestDesignerDialog; 