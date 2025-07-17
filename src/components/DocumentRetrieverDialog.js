import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Grid,
  Card,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Storage as StorageIcon,
  CloudUpload as CloudUploadIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const DATA_SOURCES = [
  { 
    id: 'mongodb', 
    label: 'MongoDB Atlas', 
    icon: <StorageIcon />,
    description: 'Use MongoDB Atlas Vector Search for efficient document storage and retrieval'
  },
  { 
    id: 'api', 
    label: 'API Endpoint', 
    icon: <CloudUploadIcon />,
    description: 'Connect to an external API endpoint for document processing'
  }
];

export default function DocumentRetrieverDialog({ open, onClose }) {
  const getSteps = () => dataSource === 'mongodb' 
    ? ['Select Data Source', 'Select Collection', 'Query'] 
    : ['Select Data Source', 'Vector DB', 'Query'];

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vectorDB, setVectorDB] = useState('');
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [dataSource, setDataSource] = useState('');
  const [mongoDbUrl, setMongoDbUrl] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');

  const formatMongoDBUrl = (url) => {
    try {
      const [prefix, rest] = url.split('mongodb+srv://');
      if (!rest) return url;
      
      const [credentials, host] = rest.split('@');
      if (!credentials || !host) return url;
      
      const [username, password] = credentials.split(':');
      if (!username || !password) return url;
      
      return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}`;
    } catch (error) {
      return url;
    }
  };

  const fetchCollections = async (url) => {
    try {
      const response = await fetch('http://localhost:3001/api/rag/mongodb-collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch collections');
      }

      const data = await response.json();
      setCollections(data.collections);
    } catch (error) {
      throw new Error(`Failed to fetch collections: ${error.message}`);
    }
  };

  const handleQuery = async () => {
    try {
      setLoading(true);
      setError('');
      setQueryResult(null);

      // Get the collection name without the database prefix
      const collectionName = selectedCollection.split('.')[1];
      const databaseName = selectedCollection.split('.')[0];

      console.log('Querying:', { 
        database: databaseName, 
        collection: collectionName 
      }); // Debug log

      const response = await fetch('http://localhost:3001/api/rag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'mongodb',
          config: {
            url: mongoDbUrl,
            database: databaseName,
            collection: collectionName
          },
          query: query,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.message || 'Failed to execute query');
      }

      const data = await response.json();
      setQueryResult(data);
    } catch (error) {
      console.error('Query error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testMongoDBConnection = async (url) => {
    try {
      const response = await fetch('http://localhost:3001/api/rag/test-mongodb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to connect to MongoDB');
      }

      return true;
    } catch (error) {
      throw new Error(`MongoDB Connection Error: ${error.message}`);
    }
  };

  const handleNext = async () => {
    try {
      if (activeStep === 0 && dataSource === 'mongodb') {
        setLoading(true);
        setError('');
        
        // Test MongoDB connection
        await testMongoDBConnection(mongoDbUrl);
        
        // Fetch collections if connection successful
        await fetchCollections(mongoDbUrl);
        
        // Go to collection selection step
        setActiveStep(1);
      } else if (activeStep === 1 && dataSource === 'mongodb') {
        if (!selectedCollection) {
          setError('Please select a collection');
          return;
        }
        // Go directly to query step
        setActiveStep(2);
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (activeStep === 2 && dataSource === 'mongodb') {
      setActiveStep(0); // Go back directly to data source step
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  const renderStepContent = (activeStep) => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Data Source</InputLabel>
              <Select
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
                label="Data Source"
              >
                {DATA_SOURCES.map((source) => (
                  <MenuItem key={source.id} value={source.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {source.icon}
                      <Typography>{source.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {dataSource === 'mongodb' && (
              <TextField
                fullWidth
                label="MongoDB Atlas URL"
                value={mongoDbUrl}
                onChange={(e) => setMongoDbUrl(e.target.value)}
                helperText="Enter your MongoDB Atlas connection string"
              />
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Select Collection
            </Typography>
            {collections.length > 0 ? (
              <FormControl fullWidth>
                <InputLabel>Collection</InputLabel>
                <Select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  label="Collection"
                >
                  {collections.map((collection) => (
                    <MenuItem 
                      key={collection.id} 
                      value={collection.id}
                    >
                      {collection.displayName} ({collection.documentCount} documents)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Alert severity="info">
                No collections found in the database
              </Alert>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Enter your query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            {renderQueryResult()}
          </Box>
        );

      default:
        return null;
    }
  };

  const renderQueryResult = () => {
    if (!queryResult) return null;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Answer:
        </Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography>{queryResult.answer}</Typography>
        </Paper>

        {queryResult.sources && queryResult.sources.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Sources:
            </Typography>
            <List>
              {queryResult.sources.map((source, index) => (
                <ListItem 
                  key={index}
                  sx={{ 
                    bgcolor: 'background.paper',
                    mb: 1,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">
                          {source.name} (ID: {source.patient_id})
                        </Typography>
                        <Chip 
                          label={`${source.relevance}% match`}
                          color="primary"
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography component="div" variant="body2">
                          <strong>Conditions:</strong> {source.conditions.join(', ')}
                        </Typography>
                        <Typography component="div" variant="body2">
                          <strong>Medications:</strong> {source.medications.join(', ')}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Document Retriever</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {getSteps().map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            Back
          </Button>
        )}
        {activeStep === 2 ? (
          <Button
            variant="contained"
            onClick={handleQuery}
            disabled={!query.trim() || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            Query
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              loading || 
              (activeStep === 0 && !dataSource) ||  // Check if data source is selected
              (activeStep === 0 && dataSource === 'mongodb' && !mongoDbUrl) ||  // Check MongoDB URL
              (activeStep === 1 && !selectedCollection)  // Check if collection is selected
            }
            startIcon={loading && <CircularProgress size={20} />}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
} 