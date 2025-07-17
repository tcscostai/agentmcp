import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Architecture as ArchitectureIcon,
  Cloud as CloudIcon,
  Storage as StorageIcon,
  Api as ApiIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Code as CodeIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import JSZip from 'jszip';

const ARCHITECTURE_TYPES = [
  {
    id: 'microservices',
    name: 'Microservices',
    description: 'Distributed microservices architecture',
    icon: <CloudIcon />,
    features: ['Service Discovery', 'API Gateway', 'Load Balancing', 'Containerization']
  },
  {
    id: 'monolithic',
    name: 'Monolithic',
    description: 'Traditional monolithic architecture',
    icon: <StorageIcon />,
    features: ['Single Codebase', 'Simplified Deployment', 'Vertical Scaling']
  },
  {
    id: 'serverless',
    name: 'Serverless',
    description: 'Event-driven serverless architecture',
    icon: <ApiIcon />,
    features: ['Auto-scaling', 'Pay-per-use', 'Event-driven', 'Managed Services']
  },
  {
    id: 'event-driven',
    name: 'Event-Driven',
    description: 'Event-based distributed architecture',
    icon: <SpeedIcon />,
    features: ['Message Queues', 'Event Sourcing', 'CQRS', 'Async Processing']
  }
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  overflow: 'auto'
}));

function ArchitectureAssistantDialog({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [requirements, setRequirements] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedArchitecture, setGeneratedArchitecture] = useState({
    components: [],
    relationships: [],
    patterns: [],
    considerations: []
  });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setRequirements('');
      setSelectedType('');
      setGenerating(false);
      setError('');
      setGeneratedArchitecture({
        components: [],
        relationships: [],
        patterns: [],
        considerations: []
      });
      setActiveTab(0);
    }
  }, [open]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError('');

      // Validate inputs
      if (!requirements.trim() || !selectedType) {
        throw new Error('Please fill in all required fields');
      }

      const response = await fetch('http://localhost:3001/api/generate/architecture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requirements: requirements.trim(),
          architectureType: selectedType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to generate architecture');
      }

      // Ensure data has all required properties
      const architectureData = {
        components: data.components || [],
        relationships: data.relationships || [],
        patterns: data.patterns || [],
        considerations: data.considerations || []
      };

      setGeneratedArchitecture(architectureData);
      setActiveTab(1);
    } catch (error) {
      console.error('Architecture generation error:', error);
      setError(typeof error === 'string' ? error : error.message);
    } finally {
      setGenerating(false);
    }
  };

  const downloadArchitecture = () => {
    if (!generatedArchitecture) return;

    const zip = new JSZip();
    
    // Create architecture.json with the full architecture data
    zip.file('architecture.json', JSON.stringify(generatedArchitecture, null, 2));

    // Create separate files for each section
    if (generatedArchitecture.components?.length) {
      zip.file('components.json', JSON.stringify(generatedArchitecture.components, null, 2));
    }

    if (generatedArchitecture.relationships?.length) {
      zip.file('relationships.json', JSON.stringify(generatedArchitecture.relationships, null, 2));
    }

    if (generatedArchitecture.patterns?.length) {
      zip.file('patterns.json', JSON.stringify(generatedArchitecture.patterns, null, 2));
    }

    if (generatedArchitecture.considerations?.length) {
      zip.file('considerations.json', JSON.stringify(generatedArchitecture.considerations, null, 2));
    }

    // Generate README.md with architecture overview
    const readme = `# ${selectedType.toUpperCase()} Architecture
Generated on: ${new Date().toLocaleString()}

## Components
${generatedArchitecture.components.map(c => `- ${c.name}: ${c.description}`).join('\n')}

## Relationships
${generatedArchitecture.relationships.map(r => `- ${r.source} → ${r.target}: ${r.description}`).join('\n')}

${generatedArchitecture.patterns.length ? `\n## Design Patterns\n${generatedArchitecture.patterns.join('\n')}` : ''}

${generatedArchitecture.considerations.length ? `\n## Considerations\n${generatedArchitecture.considerations.join('\n')}` : ''}
`;

    zip.file('README.md', readme);

    // Generate and download zip
    zip.generateAsync({ type: 'blob' }).then(content => {
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `architecture-${selectedType}-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  };

  const renderArchitectureData = () => {
    if (!generatedArchitecture) return null;

    return (
      <Box>
        <Typography variant="h6" gutterBottom>Components</Typography>
        {generatedArchitecture.components?.map((component, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">{component.name}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>Type: {component.type}</Typography>
            <Typography variant="body2">{component.description}</Typography>
            {component.responsibilities?.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" fontWeight="medium">Responsibilities:</Typography>
                <List dense>
                  {component.responsibilities.map((resp, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={resp} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        ))}

        <Typography variant="h6" gutterBottom>Relationships</Typography>
        {generatedArchitecture.relationships?.map((rel, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle1">
              {rel.source} → {rel.target}
            </Typography>
            <Typography variant="body2" color="text.secondary">Type: {rel.type}</Typography>
            <Typography variant="body2">{rel.description}</Typography>
          </Box>
        ))}

        {generatedArchitecture.patterns?.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>Design Patterns</Typography>
            <List>
              {generatedArchitecture.patterns.map((pattern, index) => (
                <ListItem key={index}>
                  <ListItemText primary={pattern} />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {generatedArchitecture.considerations?.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>Considerations</Typography>
            <List>
              {generatedArchitecture.considerations.map((consideration, index) => (
                <ListItem key={index}>
                  <ListItemText primary={consideration} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArchitectureIcon color="primary" />
          <Typography variant="h6">Architecture Assistant</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Architecture Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              label="Architecture Type"
            >
              {ARCHITECTURE_TYPES.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {type.icon}
                    <Box>
                      <Typography variant="subtitle1">{type.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Project Requirements"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Describe your project requirements, constraints, and goals..."
          />
        </Box>

        {selectedType && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Features:</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {ARCHITECTURE_TYPES.find(t => t.id === selectedType)?.features.map((feature, index) => (
                <Chip key={index} label={feature} />
              ))}
            </Box>
          </Paper>
        )}

        {generatedArchitecture && (
          <Box sx={{ mt: 3 }}>
            {renderArchitectureData()}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                startIcon={<DownloadIcon />}
                onClick={downloadArchitecture}
                variant="outlined"
              >
                Download Architecture
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={!requirements.trim() || !selectedType || generating}
          startIcon={generating ? <CircularProgress size={20} /> : null}
        >
          {generating ? 'Generating...' : 'Generate Architecture'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ArchitectureAssistantDialog; 