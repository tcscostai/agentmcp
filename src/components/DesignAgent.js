import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Storage as StorageIcon,
  Psychology as PsychologyIcon,
  Build as BuildIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
}));

function DesignAgent() {
  const [knowledgeBaseOpen, setKnowledgeBaseOpen] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Knowledge Base Manager Card */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StorageIcon color="primary" />
                Knowledge Base Manager
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setKnowledgeBaseOpen(true)}
              >
                Manage Knowledge Base
              </Button>
            </Box>
            <Typography color="text.secondary" gutterBottom>
              Manage and organize your knowledge base resources
            </Typography>
          </StyledCard>
        </Grid>

        {/* Other cards can go here */}
      </Grid>

      {/* Knowledge Base Manager Dialog */}
      <Dialog 
        open={knowledgeBaseOpen} 
        onClose={() => setKnowledgeBaseOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StorageIcon color="primary" />
            Knowledge Base Manager
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            {['Requirements Documentation', 'API Specifications', 'Test Cases', 'Architecture Diagrams'].map((item, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  index === 0 ? (
                    <Chip 
                      label="Active" 
                      size="small" 
                      color="success"
                    />
                  ) : null
                }
              >
                <ListItemIcon>
                  <DescriptionIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={item}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Last updated: {
                          index === 0 ? '10 minutes ago' :
                          index === 1 ? '2 hours ago' :
                          index === 2 ? '1 day ago' :
                          '3 days ago'
                        }
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Memory: {
                            index === 0 ? '2.3 MB' :
                            index === 1 ? '1.8 MB' :
                            index === 2 ? '3.5 MB' :
                            '4.2 MB'
                          }
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Version: {`1.${index + 1}.0`}
                        </Typography>
                        <Typography variant="caption" color={
                          index === 0 ? 'success.main' :
                          index === 1 ? 'warning.main' :
                          'text.secondary'
                        }>
                          {
                            index === 0 ? 'High accuracy' :
                            index === 1 ? 'Needs review' :
                            index === 2 ? 'Validated' :
                            'Legacy'
                          }
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setKnowledgeBaseOpen(false)}>Close</Button>
          <Button variant="contained" color="primary">
            Add New Resource
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DesignAgent; 