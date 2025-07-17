import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper,
  IconButton,
  Collapse,
} from '@mui/material';
import { 
  PlayArrow as StartIcon, 
  Stop as StopIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
}));

const ServerManager = () => {
  const [serverStatus, setServerStatus] = useState('stopped');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/status');
      if (response.ok) {
        setServerStatus('running');
      } else {
        setServerStatus('stopped');
      }
    } catch (err) {
      setServerStatus('stopped');
    }
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const startServer = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:3001/api/start', {
        method: 'POST',
      });
      
      if (response.ok) {
        setServerStatus('running');
        addLog('Server started successfully');
      } else {
        throw new Error('Failed to start server');
      }
    } catch (err) {
      setError(err.message);
      addLog(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const stopServer = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:3001/api/stop', {
        method: 'POST',
      });
      
      if (response.ok) {
        setServerStatus('stopped');
        addLog('Server stopped successfully');
      } else {
        throw new Error('Failed to stop server');
      }
    } catch (err) {
      setError(err.message);
      addLog(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message }]);
  };

  return (
    <StyledPaper>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">Local Server</Typography>
          <Box 
            sx={{ 
              width: 10, 
              height: 10, 
              borderRadius: '50%', 
              bgcolor: serverStatus === 'running' ? 'success.main' : 'error.main',
              transition: 'background-color 0.3s'
            }} 
          />
          <Typography color="text.secondary">
            {serverStatus.charAt(0).toUpperCase() + serverStatus.slice(1)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={checkServerStatus} size="small">
            <RefreshIcon />
          </IconButton>
          <IconButton 
            onClick={() => setExpanded(!expanded)} 
            sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
            size="small"
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<StartIcon />}
          onClick={startServer}
          disabled={loading || serverStatus === 'running'}
        >
          Start Server
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<StopIcon />}
          onClick={stopServer}
          disabled={loading || serverStatus === 'stopped'}
        >
          Stop Server
        </Button>
      </Box>

      <Collapse in={expanded}>
        <Box 
          sx={{ 
            mt: 2, 
            maxHeight: 200, 
            overflow: 'auto',
            bgcolor: 'grey.100',
            borderRadius: 1,
            p: 1,
            fontFamily: 'monospace'
          }}
        >
          {logs.map((log, index) => (
            <Box key={index} sx={{ fontSize: '0.875rem' }}>
              <Typography component="span" color="text.secondary">
                [{log.timestamp}]
              </Typography>{' '}
              {log.message}
            </Box>
          ))}
        </Box>
      </Collapse>
    </StyledPaper>
  );
};

export default ServerManager; 