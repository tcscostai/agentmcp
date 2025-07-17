import { useState, useEffect } from 'react';
import { Box, Card, TextField, Button, Typography, Container, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 4,
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  maxWidth: '400px',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 122, 255, 0.15)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-50%',
    width: '200%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    transform: 'translateX(-100%)',
    animation: 'shimmer 3s infinite',
  },
  '@keyframes shimmer': {
    '100%': {
      transform: 'translateX(100%)',
    },
  },
}));

const Logo = styled(motion.div)({
  width: 120,
  height: 120,
  position: 'relative',
  marginBottom: 32,
});

const GradientBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: '#ffffff',
  zIndex: -1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(0,122,255,0.08), transparent 70%)',
  },
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    background: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      background: 'rgba(255, 255, 255, 1)',
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 4px 12px rgba(0, 122, 255, 0.1)',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: '12px 24px',
  fontSize: '1rem',
  textTransform: 'none',
  background: 'linear-gradient(45deg, #007AFF 30%, #5856D6 90%)',
  boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(45deg, #0055B2 30%, #4240AB 90%)',
    boxShadow: '0 6px 16px rgba(0, 122, 255, 0.4)',
    transform: 'translateY(-1px)',
  },
}));

const AnimatedTitle = styled(motion.h1)(({ theme }) => ({
  background: 'linear-gradient(45deg, #007AFF, #47A1FF)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundSize: '200% 200%',
  animation: 'gradient 3s ease infinite',
  '@keyframes gradient': {
    '0%': {
      backgroundPosition: '0% 50%'
    },
    '50%': {
      backgroundPosition: '100% 50%'
    },
    '100%': {
      backgroundPosition: '0% 50%'
    }
  }
}));

function Login({ onAuthChange }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // For demo purposes - accept both "admin" and "admin@inferage.com"
      const isValidEmail = email === 'admin' || email === 'admin@inferage.com';
      const isValidPassword = password === 'admin123';

      if (isValidEmail && isValidPassword) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', email);
        onAuthChange(true);
        navigate('/');
      } else {
        throw new Error('Invalid email or password. Try admin/admin123');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={false} sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <GradientBackground />
      <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative', zIndex: 1 }}>
        <StyledCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Logo
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
            >
              <img src="/logo.svg" alt="Logo" style={{ width: '100%', height: '100%' }} />
            </Logo>

            <Typography 
              component={AnimatedTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              variant="h3" 
              fontWeight="700"
              gutterBottom
              sx={{ mb: 3 }}
            >
              InferAge
            </Typography>

            <Typography
              component={motion.p}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              color="text.secondary"
              gutterBottom
            >
              Sign in to continue to InferAge
            </Typography>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              </motion.div>
            )}

            <Box
              component={motion.div}
              sx={{ width: '100%' }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <StyledTextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                disabled={loading}
                required
              />
              <StyledTextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!error}
                disabled={loading}
                required
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <StyledButton
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 4 }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{ width: 24, height: 24, borderRadius: '50%', 
                                border: '2px solid #fff', 
                                borderTopColor: 'transparent',
                                marginRight: 8 }}
                      />
                      Signing In...
                    </Box>
                  ) : (
                    'Sign In'
                  )}
                </StyledButton>
              </motion.div>
            </Box>
          </Box>
        </StyledCard>
      </Box>
    </Container>
  );
}

export default Login; 