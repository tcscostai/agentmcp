import React, { useEffect, useState } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  CircularProgress, 
  Alert,
  Typography 
} from '@mui/material';
import { getJiraConfig, getJiraProjects } from '../services/jiraService';

const UserStoryGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchJiraProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // First verify Jira is configured
      const configData = await getJiraConfig();
      if (!configData.success || !configData.isConfigured) {
        throw new Error('Jira is not configured. Please configure Jira in the Configuration page.');
      }

      // Then fetch projects
      const data = await getJiraProjects();
      if (!data.success || !data.isConfigured) {
        throw new Error('Jira is not configured. Please configure Jira in the Configuration page.');
      }

      setProjects(data.projects);
      if (data.projects.length > 0) {
        setSelectedProject(data.projects[0].key);
      }

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setProjects([]);
      setSelectedProject(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJiraProjects();
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        User Story Generator
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && projects.length > 0 && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Project</InputLabel>
          <Select
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(e.target.value)}
            label="Project"
          >
            {projects.map((project) => (
              <MenuItem key={project.key} value={project.key}>
                {project.name} ({project.key})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {!loading && !error && projects.length === 0 && (
        <Alert severity="info">
          No projects found. Please create a project in Jira first.
        </Alert>
      )}
    </Box>
  );
};

export default UserStoryGenerator; 