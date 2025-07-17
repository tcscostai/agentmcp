import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DesignAgent from './pages/DesignAgent';
import AnalyseAgents from './pages/AnalyseAgents';
import Configuration from './pages/Configuration';
import DesignSLMAgent from './pages/DesignSLMAgent';
import { useState, useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    console.log('Auth status:', authStatus);
    setIsAuthenticated(authStatus);
    setLoading(false);
  }, []);

  const handleAuthChange = (status) => {
    console.log('Auth status changing to:', status);
    setIsAuthenticated(status);
  };

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <Login onAuthChange={handleAuthChange} />
            } 
          />
          <Route
            element={
              isAuthenticated ? 
                <Layout onLogout={() => handleAuthChange(false)} /> : 
                <Navigate to="/login" replace />
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/design-agent" element={<DesignAgent />} />
            <Route path="/design-slm-agent" element={<DesignSLMAgent />} />
            <Route path="/analyse-agents" element={<AnalyseAgents />} />
            <Route path="/configuration" element={<Configuration />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
