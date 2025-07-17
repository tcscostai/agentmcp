import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState 
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  AccountTree as AccountTreeIcon,
  PlayArrow as PlayArrowIcon,
  Settings as SettingsIcon,
  Assignment as StoryIcon,
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  WebAsset as WebAssetIcon,
  BugReport as BugReportIcon,
  Code as CodeIcon,
  Build as BuildIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { makeOpenAIRequest } from '../services/configService';
import { getJiraConfig, getJiraProjects } from '../services/jiraService';

const AVAILABLE_AGENTS = {
  'Business Analyst': {
    icon: <AccountTreeIcon />,
    description: 'Analyzes business requirements and stakeholder needs'
  },
  'Requirements Analyzer': {
    icon: <AssignmentIcon />,
    description: 'Analyzes technical requirements and specifications'
  },
  'UI Generator': {
    icon: <WebAssetIcon />,
    description: 'Generates UI components and mockups'
  },
  'Test Designer': {
    icon: <BugReportIcon />,
    description: 'Creates test cases and scenarios'
  },
  'Code Generator': {
    icon: <CodeIcon />,
    description: 'Generates implementation code'
  },
  'DevOps Engineer': {
    icon: <BuildIcon />,
    description: 'Handles deployment and infrastructure'
  },
  'Security Analyst': {
    icon: <SecurityIcon />,
    description: 'Performs security analysis and compliance checks'
  },
  'QA Engineer': {
    icon: <SpeedIcon />,
    description: 'Ensures quality and performs testing'
  },
  'Documentation Writer': {
    icon: <DescriptionIcon />,
    description: 'Creates technical documentation'
  }
};

const CustomNode = ({ data }) => {
  const [isRunning, setIsRunning] = useState(false);
  
  return (
    <div style={{ 
      padding: '20px',
      background: isRunning ? '#e3f2fd' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      border: '2px solid',
      borderColor: data.isSelected ? '#1976d2' : '#e0e0e0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      width: '300px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          {data.icon || <AccountTreeIcon />}
        </div>
        <Typography variant="subtitle1" sx={{ 
          fontWeight: 600,
          color: '#1976d2',
        }}>
          {data.label}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ 
        color: 'text.secondary',
        mb: 2,
        lineHeight: 1.5
      }}>
        {data.description}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Chip 
          label={data.agent}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ borderRadius: '8px' }}
        />
        {isRunning && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="primary">Running</Typography>
            <CircularProgress size={16} />
          </Box>
        )}
      </Box>
    </div>
  );
};

const saveWorkflow = async (workflow) => {
  try {
    const response = await fetch('http://localhost:3001/api/workflows/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflow)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save workflow');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving workflow:', error);
    throw error;
  }
};

function WorkflowDesignerDialog({ open, onClose }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userStories, setUserStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loadingStories, setLoadingStories] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [runningNodeId, setRunningNodeId] = useState(null);
  const [success, setSuccess] = useState('');
  const [jiraConfig, setJiraConfig] = useState(null);
  const [executionResults, setExecutionResults] = useState({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [stories, setStories] = useState([]);

  const fetchJiraConfig = async () => {
    try {
      const configData = await getJiraConfig();
      if (!configData.success || !configData.isConfigured) {
        throw new Error('Jira is not configured');
      }

      const projectsData = await getJiraProjects();
      if (!projectsData.success) {
        throw new Error('Failed to fetch projects');
      }

      setJiraConfig(projectsData.projects);
      setError(''); // Clear any existing errors
    } catch (err) {
      setError('Failed to fetch Jira configuration');
      console.error('Jira config error:', err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchJiraConfig();
    }
  }, [open]);

  const fetchJiraStories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jira/stories');
      const data = await response.json();
      if (data && data.issues) {
        setStories(data.issues.map(issue => ({
          id: issue.id,
          key: issue.key,
          summary: issue.fields.summary,
          description: issue.fields.description,
          status: issue.fields.status.name,
          priority: issue.fields.priority?.name
        })));
      }
    } catch (error) {
      console.error('Error fetching Jira stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchJiraStories();
    }
  }, [open]);

  const handleStorySelect = (story) => {
    setSelectedStory(story);
    // Generate a default prompt based on the story
    setPrompt(`Create a workflow to implement the following user story: ${story.summary}\n\nAcceptance Criteria:\n${story.acceptanceCriteria || 'None provided'}`);
    setWorkflowName(`Workflow-${story.key}`);
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleGenerateWorkflow = async () => {
    if (!prompt.trim()) {
      setError('Please enter a workflow description');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/generate/workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          maxSteps: 5,
          storyKey: selectedStory?.key || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate workflow');
      }

      const data = await response.json();
      
      if (!data.steps || !Array.isArray(data.steps)) {
        throw new Error('Invalid workflow data received');
      }

      // Transform the steps into nodes and edges
      const newNodes = data.steps.map((step, index) => ({
        id: `${index + 1}`,
        type: 'customNode',
        position: { x: 250 * index, y: 100 },
        data: {
          label: step.name,
          description: step.description,
          agent: step.agent || 'default',
          icon: AVAILABLE_AGENTS[step.agent]?.icon || null,
          status: 'pending'
        }
      }));

      // Create edges between nodes
      const newEdges = newNodes.slice(0, -1).map((node, index) => ({
        id: `e${index + 1}-${index + 2}`,
        source: `${index + 1}`,
        target: `${index + 2}`,
        type: 'smoothstep',
        animated: true
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (error) {
      console.error('Workflow generation error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const executeWorkflow = async () => {
    if (nodes.length === 0) return;
    
    setIsExecuting(true);
    setError('');
    const results = {};

    try {
      // Execute nodes sequentially
      for (const node of nodes) {
        setRunningNodeId(node.id);
        
        // Update node status to running
        setNodes(nds => nds.map(n => ({
          ...n,
          data: {
            ...n.data,
            status: n.id === node.id ? 'running' : n.data.status
          }
        })));

        // Execute the agent
        const response = await fetch('http://localhost:3001/api/execute-agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agentType: node.data.agent,
            storyKey: selectedStory?.key,
            nodeId: node.id,
            data: {
              story: selectedStory,
              previousResults: results
            }
          })
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(`Failed to execute ${node.data.agent}: ${result.error}`);
        }

        // Store results
        results[node.id] = result;
        setExecutionResults(prev => ({
          ...prev,
          [node.id]: result
        }));

        // Update node status to completed
        setNodes(nds => nds.map(n => ({
          ...n,
          data: {
            ...n.data,
            status: n.id === node.id ? 'completed' : n.data.status
          }
        })));
      }

      setSuccess('Workflow executed successfully!');
    } catch (error) {
      setError(`Failed to execute workflow: ${error.message}`);
      // Mark current node as failed
      setNodes(nds => nds.map(n => ({
        ...n,
        data: {
          ...n.data,
          status: n.id === runningNodeId ? 'failed' : n.data.status
        }
      })));
    } finally {
      setIsExecuting(false);
      setRunningNodeId(null);
    }
  };

  const renderExecutionResults = () => {
    if (Object.keys(executionResults).length === 0) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Execution Results
        </Typography>
        {nodes.map(node => {
          const result = executionResults[node.id];
          if (!result) return null;

          return (
            <Paper key={node.id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {node.data.agent}
              </Typography>
              <Box sx={{ pl: 2 }}>
                {Object.entries(result.results || {}).map(([key, value]) => (
                  <Typography key={key} variant="body2">
                    <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
                  </Typography>
                ))}
              </Box>
            </Paper>
          );
        })}
      </Box>
    );
  };

  const handleSaveWorkflow = async () => {
    if (!workflowName.trim() || nodes.length === 0) return;
    
    setIsSaving(true);
    try {
      const workflowData = {
        name: workflowName,
        description: prompt,
        nodes,
        edges,
        storyKey: selectedStory?.key,
        createdAt: new Date().toISOString(),
      };
      
      const response = await saveWorkflow(workflowData);
      
      // Show success message
      setSuccess('Workflow saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 3000);
    } catch (error) {
      setError('Failed to save workflow: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePromptChange = (e) => {
    const newValue = e.target.value;
    console.log('Prompt changed:', newValue);
    setPrompt(newValue);
  };

  const nodeTypes = {
    customNode: CustomNode
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountTreeIcon color="primary" />
          <Typography>Workflow Designer</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mb: 3 }}>
          {/* User Stories Section */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Select User Story</Typography>
              <IconButton onClick={fetchJiraStories} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {stories.map((story) => (
                  <ListItem
                    key={story.id}
                    button
                    selected={selectedStory?.key === story.key}
                    onClick={() => handleStorySelect(story)}
                  >
                    <ListItemIcon>
                      <StoryIcon color={selectedStory?.key === story.key ? 'primary' : 'inherit'} />
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
          </Paper>

          {/* Prompt Section */}
          {selectedStory && (
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Workflow Prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the workflow you want to generate..."
              />
              <Button
                variant="contained"
                onClick={handleGenerateWorkflow}
                disabled={!prompt.trim() || loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{ mt: 1 }}
              >
                Generate
              </Button>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        <Box sx={{ height: 500, p: 2 }}>
          <Paper sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ 
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 1,
              display: 'flex',
              gap: 1
            }}>
              <Tooltip title="Run Workflow">
                <IconButton 
                  onClick={executeWorkflow}
                  disabled={nodes.length === 0 || isExecuting}
                  color={isExecuting ? 'primary' : 'default'}
                  sx={{ 
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  {isExecuting ? <CircularProgress size={24} /> : <PlayArrowIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton
                  sx={{ 
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              defaultEdgeOptions={{
                type: 'smoothstep',
                animated: true,
                style: { 
                  strokeWidth: 2,
                  stroke: '#2196f3',
                },
                markerEnd: {
                  type: 'arrowclosed',
                  color: '#2196f3',
                }
              }}
              connectionMode="loose"
              snapToGrid={true}
              snapGrid={[15, 15]}
            >
              <Background 
                color="#f0f0f0"
                gap={16}
                size={1}
                variant="dots"
              />
              <Controls 
                style={{
                  button: {
                    backgroundColor: 'white',
                    color: '#666',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: 'none',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }
                }}
              />
              <MiniMap 
                nodeColor={(node) => {
                  return node.data?.status === 'completed' ? '#4caf50' : '#1976d2';
                }}
                maskColor="rgba(255, 255, 255, 0.8)"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #eee',
                  borderRadius: 8,
                }}
              />
            </ReactFlow>
          </Paper>
        </Box>

        {nodes.length > 0 && (
          <TextField
            fullWidth
            label="Workflow Name"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            size="small"
            sx={{ mt: 2 }}
          />
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              position: 'absolute', 
              top: 16, 
              left: '50%', 
              transform: 'translateX(-50%)',
              zIndex: 1100,
              boxShadow: 2
            }}
          >
            {success}
          </Alert>
        )}

        {renderExecutionResults()}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          color="primary"
          disabled={nodes.length === 0 || !workflowName.trim() || isSaving}
          onClick={handleSaveWorkflow}
          startIcon={isSaving ? <CircularProgress size={20} /> : null}
        >
          {isSaving ? 'Saving...' : 'Save Workflow'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WorkflowDesignerDialog; 