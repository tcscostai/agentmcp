import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  IconButton,
  Chip,
  Collapse,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Psychology as PsychologyIcon,
  DataObject as DataObjectIcon,
  ModelTraining as ModelTrainingIcon,
  Assessment as AssessmentIcon,
  CloudUpload as CloudUploadIcon,
  MonitorHeart as MonitorIcon,
  PlayArrow as PlayArrowIcon,
  Settings as SettingsIcon,
  AutoFixHigh as AutoFixHighIcon,
  TrendingUp as TrendingUpIcon,
  Description as DescriptionIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import BERTMiniAgentDialog from '../components/BERTMiniAgentDialog';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
}));

const AgentCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    '& .agent-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  padding: '8px 24px',
}));

const SLM_CATEGORIES = [
  {
    value: 'base_models',
    label: 'Base Model Agents',
    icon: <PsychologyIcon fontSize="large" />,
    color: '#007AFF',
    description: 'Foundation small language models',
    subAgents: [
      {
        name: 'BERT-Mini Agent',
        icon: <PsychologyIcon />,
        description: 'Lightweight BERT model for basic NLP tasks',
        features: ['4 layers', '256 hidden size', 'Fast inference', 'Low resource usage'],
        status: 'stable'
      },
      {
        name: 'DistilBERT Agent',
        icon: <DataObjectIcon />,
        description: 'Distilled BERT for efficient processing',
        features: ['6 layers', '40% smaller', 'Faster training', '97% BERT performance'],
        status: 'stable'
      },
      {
        name: 'TinyBERT Agent',
        icon: <SpeedIcon />,
        description: 'Highly compressed BERT model',
        features: ['4 layers', 'Knowledge distillation', 'Mobile-friendly', 'Quick responses'],
        status: 'beta'
      }
    ]
  },
  {
    value: 'specialized_models',
    label: 'Specialized Agents',
    icon: <ModelTrainingIcon fontSize="large" />,
    color: '#34C759',
    description: 'Task-specific small language models',
    subAgents: [
      {
        name: 'Text Classifier',
        icon: <ModelTrainingIcon />,
        description: 'Efficient text classification model',
        features: ['Sentiment analysis', 'Topic classification', 'Intent detection', 'Low latency'],
        status: 'stable'
      },
      {
        name: 'QA Assistant',
        icon: <AssessmentIcon />,
        description: 'Lightweight question answering model',
        features: ['Context understanding', 'Fast responses', 'Memory efficient', 'Local deployment'],
        status: 'stable'
      },
      {
        name: 'Summarizer',
        icon: <DescriptionIcon />,
        description: 'Compact text summarization model',
        features: ['Extractive summarization', 'Abstractive options', 'Configurable length', 'Quick processing'],
        status: 'beta'
      }
    ]
  },
  {
    value: 'deployment',
    label: 'Deployment Agents',
    icon: <CloudUploadIcon fontSize="large" />,
    color: '#5856D6',
    description: 'Deploy and optimize small language models',
    subAgents: [
      {
        name: 'Model Quantizer',
        icon: <CloudUploadIcon />,
        description: 'Optimize models for deployment',
        features: ['8-bit quantization', 'Model pruning', 'Size optimization', 'Performance tuning'],
        status: 'stable'
      },
      {
        name: 'Edge Deployer',
        icon: <MonitorIcon />,
        description: 'Deploy models to edge devices',
        features: ['Mobile deployment', 'Edge optimization', 'Offline support', 'Battery efficiency'],
        status: 'beta'
      },
      {
        name: 'Performance Monitor',
        icon: <SpeedIcon />,
        description: 'Monitor and optimize model performance',
        features: ['Latency tracking', 'Resource monitoring', 'Auto-scaling', 'Performance alerts'],
        status: 'stable'
      }
    ]
  },
  {
    value: 'fine_tuning',
    label: 'Fine-Tuning Agents',
    icon: <AutoFixHighIcon fontSize="large" />,
    color: '#FF9500',
    description: 'Customize and fine-tune small models',
    subAgents: [
      {
        name: 'Domain Adapter',
        icon: <TrendingUpIcon />,
        description: 'Adapt models to specific domains',
        features: ['Domain adaptation', 'Minimal data needed', 'Quick fine-tuning', 'Performance preservation'],
        status: 'stable'
      },
      {
        name: 'Task Optimizer',
        icon: <AssessmentIcon />,
        description: 'Optimize models for specific tasks',
        features: ['Task-specific tuning', 'Parameter efficient', 'Performance metrics', 'Validation tools'],
        status: 'beta'
      }
    ]
  }
];

function DesignSLMAgent() {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [bertMiniDialogOpen, setBertMiniDialogOpen] = useState(false);

  const handleCategoryClick = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight={600} color="primary">
            Design SLM Agent
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage Small Language Model agents
          </Typography>
        </Box>
        <StyledButton
          variant="contained"
          startIcon={<AddIcon />}
        >
          Create Custom SLM Agent
        </StyledButton>
      </Box>

      <Grid container spacing={3}>
        {SLM_CATEGORIES.map((category, index) => (
          <Grid item xs={12} key={category.label}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StyledCard>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: `${category.color}15`,
                        color: category.color,
                      }}
                    >
                      {category.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {category.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton onClick={() => handleCategoryClick(index)}>
                    <ExpandMoreIcon 
                      sx={{ 
                        transform: expandedCategory === index ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s'
                      }} 
                    />
                  </IconButton>
                </Box>

                <Collapse in={expandedCategory === index}>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {category.subAgents.map((agent) => (
                      <Grid item xs={12} md={6} key={agent.name}>
                        <AgentCard onClick={() => setBertMiniDialogOpen(true)}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 2,
                                bgcolor: `${category.color}15`,
                                color: category.color,
                                height: 'fit-content',
                              }}
                            >
                              {agent.icon}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {agent.name}
                                </Typography>
                                <Chip 
                                  label={agent.status} 
                                  size="small"
                                  color={agent.status === 'stable' ? 'success' : 'warning'}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                {agent.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                {agent.features.map((feature) => (
                                  <Chip
                                    key={feature}
                                    label={feature}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </Box>
                          </Box>
                          <Box 
                            className="agent-actions"
                            sx={{ 
                              position: 'absolute',
                              right: 16,
                              bottom: 16,
                              opacity: 0,
                              transform: 'translateY(10px)',
                              transition: 'all 0.3s',
                              display: 'flex',
                              gap: 1,
                            }}
                          >
                            <IconButton size="small" sx={{ bgcolor: 'background.paper' }}>
                              <PlayArrowIcon />
                            </IconButton>
                            <IconButton size="small" sx={{ bgcolor: 'background.paper' }}>
                              <SettingsIcon />
                            </IconButton>
                          </Box>
                        </AgentCard>
                      </Grid>
                    ))}
                  </Grid>
                </Collapse>
              </StyledCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <BERTMiniAgentDialog 
        open={bertMiniDialogOpen}
        onClose={() => setBertMiniDialogOpen(false)}
      />
    </Box>
  );
}

export default DesignSLMAgent; 