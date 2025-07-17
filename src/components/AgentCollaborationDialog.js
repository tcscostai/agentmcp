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
  Card,
  CardContent,
  Avatar,
  Chip,
  Grid,
  MenuItem,
} from '@mui/material';
import {
  Groups as GroupsIcon,
  Psychology as PsychologyIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

const AVAILABLE_AGENTS = [
  {
    id: 1,
    name: 'Requirements Analyzer',
    type: 'SDLC',
    icon: <PsychologyIcon />,
    color: '#007AFF'
  },
  {
    id: 2,
    name: 'Code Generator',
    type: 'Development',
    icon: <CodeIcon />,
    color: '#34C759'
  },
  {
    id: 3,
    name: 'Data Processor',
    type: 'MLOps',
    icon: <StorageIcon />,
    color: '#5856D6'
  }
];

const AgentCollaborationDialog = ({ open, onClose }) => {
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [agents, setAgents] = useState({ sdlc: [], rag: [], workflow: [] });

  const handleAgentSelect = (agent) => {
    setSelectedAgents(prev => 
      prev.find(a => a.id === agent.id)
        ? prev.filter(a => a.id !== agent.id)
        : [...prev, agent]
    );
  };

  const fetchAgents = async () => {
    try {
      console.log('Fetching agents...');
      const response = await fetch('/api/csnp/agents');
      const data = await response.json();
      console.log('Received agents data:', data);
      
      if (data && data.sdlc) {
        setAgents(data);
      } else {
        console.error('Invalid agents data format:', data);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAgents();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupsIcon color="primary" />
          <Typography>Agent Collaboration Designer</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          {/* Available Agents */}
          <Grid item xs={3}>
            <Paper sx={{ p: 2, height: '500px' }}>
              <Typography variant="subtitle1" gutterBottom>
                Available Agents
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {agents.sdlc && agents.sdlc.map((agent) => (
                  <MenuItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </MenuItem>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Collaboration Canvas */}
          <Grid item xs={9}>
            <Paper sx={{ p: 2, height: '500px', position: 'relative' }}>
              <Typography variant="subtitle1" gutterBottom>
                Collaboration Canvas
              </Typography>
              <Box sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'text.secondary'
              }}>
                <Typography>
                  Drag agents here to create collaborations
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary">
          Save Collaboration
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentCollaborationDialog; 