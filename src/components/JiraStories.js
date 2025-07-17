import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Button,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
}));

const JiraStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/jira/projects');
      const data = await response.json();
      
      if (data.length > 0) {
        setProjects(data);
        setSelectedProject(data[0].key);
        fetchStories();
      } else {
        setError('No Jira projects found');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch Jira projects');
    }
  };

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching stories...');
      const response = await fetch('http://localhost:3001/api/jira/stories');
      const data = await response.json();
      
      // Save debug info
      setDebugInfo({
        responseStatus: response.status,
        data: data,
        timestamp: new Date().toISOString()
      });

      console.log('Response data:', data);

      if (data.issues && Array.isArray(data.issues)) {
        setStories(data.issues);
      } else {
        setError('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Debug Panel Component
  const DebugPanel = () => (
    <Paper 
      sx={{ 
        p: 2, 
        mb: 2, 
        bgcolor: '#f5f5f5',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="primary">Debug Panel</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchStories}
          startIcon={<RefreshIcon />}
        >
          Force Refresh Stories
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Chip 
          label={`Stories Count: ${stories.length}`} 
          color="primary" 
          variant="outlined" 
        />
        <Chip 
          label={`Last Updated: ${new Date().toLocaleTimeString()}`}
          color="secondary" 
          variant="outlined"
        />
      </Box>

      {debugInfo && (
        <Box>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Last Response Details:
          </Typography>
          <Paper 
            sx={{ 
              p: 2, 
              bgcolor: '#fff',
              maxHeight: '200px',
              overflow: 'auto',
              '& pre': {
                margin: 0,
                fontSize: '0.875rem'
              }
            }}
          >
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </Paper>
        </Box>
      )}
    </Paper>
  );

  return (
    <Box>
      {/* Always show debug panel at the top */}
      <DebugPanel />

      {loading && (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && stories.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No stories found in Jira. Please create some stories first.
        </Alert>
      )}

      {stories.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Jira Stories ({stories.length})
          </Typography>
          
          <Grid container spacing={2}>
            {stories.map((story) => (
              <Grid item xs={12} key={story.key}>
                <StyledCard>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {story.key}: {story.summary}
                    </Typography>
                    <Chip 
                      label={story.status} 
                      color={story.status === 'Done' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={story.type} size="small" variant="outlined" />
                    {story.priority && (
                      <Chip label={story.priority} size="small" variant="outlined" />
                    )}
                  </Box>
                  
                  {story.description && (
                    <Typography variant="body2" color="text.secondary">
                      {story.description}
                    </Typography>
                  )}
                  
                  {story.assignee && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Assignee: {story.assignee}
                    </Typography>
                  )}
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default JiraStories; 