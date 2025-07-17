import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';

const ChainOfThoughtDialog = ({ open, onClose }) => {
  const [steps, setSteps] = useState([]);
  const [newStep, setNewStep] = useState('');

  const handleAddStep = () => {
    if (newStep.trim()) {
      setSteps([...steps, {
        id: Date.now(),
        content: newStep,
        confidence: 0.8
      }]);
      setNewStep('');
    }
  };

  const handleDeleteStep = (id) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PsychologyIcon color="primary" />
          <Typography>Chain of Thought Designer</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Add Reasoning Steps
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              placeholder="Enter reasoning step"
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleAddStep}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>
        </Box>

        <Paper sx={{ p: 2 }}>
          <List>
            {steps.map((step, index) => (
              <ListItem
                key={step.id}
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <ListItemIcon>
                  <LightbulbIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={step.content}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Chip 
                        label={`Confidence: ${(step.confidence * 100).toFixed(0)}%`}
                        size="small"
                        color={step.confidence > 0.7 ? 'success' : 'warning'}
                      />
                    </Box>
                  }
                />
                <IconButton onClick={() => handleDeleteStep(step.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary">
          Save Chain
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChainOfThoughtDialog; 