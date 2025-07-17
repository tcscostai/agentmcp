import { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  Typography, 
  IconButton, 
  Chip,
  LinearProgress,
  Tab,
  Tabs,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
}));

function AnalyseAgents() {
  const [slmMetrics, setSlmMetrics] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [error, setError] = useState(null);

  const fetchSLMMetrics = async () => {
    try {
      setLoadingMetrics(true);
      setError(null);
      console.log('Fetching metrics from macagent...');
      
      const response = await fetch('http://localhost:5001/api/agents/macagent/metrics', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received metrics:', data);
      
      if (!data || typeof data.cpu === 'undefined') {
        throw new Error('Invalid metrics data received');
      }
      
      const transformedMetrics = [{
        id: 'macagent',
        name: 'BERT-Mini Agent',
        status: 'running',
        metrics: {
          cpu: data.cpu || 0,
          memory: data.memory || 0,
          requestsPerSecond: data.requests_per_second || 0,
          successRate: data.success_rate || 0,
          uptime: data.uptime || '0:00:00'
        }
      }];

      console.log('Transformed metrics:', transformedMetrics);
      setSlmMetrics(transformedMetrics);
    } catch (error) {
      console.error('Error fetching SLM metrics:', error);
      setError(`Failed to fetch metrics: ${error.message}`);
      setSlmMetrics([]);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    fetchSLMMetrics();
    const interval = setInterval(fetchSLMMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              SLM Agent Metrics
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchSLMMetrics}
              disabled={loadingMetrics}
            >
              Refresh
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loadingMetrics ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : slmMetrics.length === 0 ? (
            <Alert 
              severity="info"
              action={
                <Button color="inherit" size="small" onClick={fetchSLMMetrics}>
                  Retry
                </Button>
              }
            >
              No SLM agents currently running. Make sure the BERT-Mini agent is deployed.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {slmMetrics.map((metric) => (
                <Grid item xs={12} md={6} key={metric.id}>
                  <StyledCard>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">{metric.name}</Typography>
                      <Chip 
                        label={metric.status} 
                        color={metric.status === 'running' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">CPU Usage</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">{metric.metrics.cpu}%</Typography>
                          <TrendingUpIcon 
                            color={metric.metrics.cpu > 80 ? 'error' : 'success'} 
                            fontSize="small" 
                          />
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Memory</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">{metric.metrics.memory}MB</Typography>
                          <TrendingUpIcon 
                            color={metric.metrics.memory > 1024 ? 'error' : 'success'} 
                            fontSize="small" 
                          />
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Requests/sec</Typography>
                        <Typography variant="h6">{metric.metrics.requestsPerSecond}</Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Success Rate</Typography>
                        <Typography variant="h6" color={metric.metrics.successRate >= 95 ? 'success.main' : 'error.main'}>
                          {metric.metrics.successRate}%
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Uptime</Typography>
                        <Typography variant="h6">{metric.metrics.uptime}</Typography>
                      </Grid>
                    </Grid>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default AnalyseAgents; 