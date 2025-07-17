import { Box, Grid, Card, Typography, IconButton, LinearProgress, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Schedule as ScheduleIcon,
  Chat as ChatIcon,
  SmartToy as SmartToyIcon,
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  BarChart, 
  Bar,
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  height: '100%',
}));

const StatCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

// Mock data for graphs
const lineData = Array.from({ length: 24 }, (_, i) => ({
  name: `${i}:00`,
  value: Math.floor(Math.random() * 100)
}));

const pieData = [
  { name: 'UI Agents', value: 35, color: '#007AFF' },
  { name: 'Content Agents', value: 25, color: '#5856D6' },
  { name: 'Translation Agents', value: 20, color: '#FF2D55' },
  { name: 'Other Agents', value: 20, color: '#FF9500' },
];

const barData = Array.from({ length: 7 }, (_, i) => ({
  name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  successful: Math.floor(Math.random() * 100),
  failed: Math.floor(Math.random() * 20),
}));

const areaData = Array.from({ length: 24 }, (_, i) => ({
  name: `${i}:00`,
  cpu: Math.floor(Math.random() * 100),
  memory: Math.floor(Math.random() * 100),
}));

const stats = [
  { title: 'Active Agents', value: '24', icon: <MemoryIcon />, color: '#007AFF', progress: 80 },
  { title: 'Success Rate', value: '95%', icon: <TrendingUpIcon />, color: '#34C759', progress: 95 },
  { title: 'Avg Response Time', value: '1.2s', icon: <SpeedIcon />, color: '#5856D6', progress: 75 },
  { title: 'Uptime', value: '99.9%', icon: <ScheduleIcon />, color: '#FF2D55', progress: 99 },
];

// Add new mock data for agent communications
const agentCommunications = [
  {
    id: 1,
    from: 'UI Agent',
    to: 'Content Agent',
    message: 'Processing user request for content generation...',
    timestamp: '2s ago',
    status: 'active',
    avatar: '🤖'
  },
  {
    id: 2,
    from: 'Translation Agent',
    to: 'UI Agent',
    message: 'Translation completed for Spanish market',
    timestamp: '5s ago',
    status: 'completed',
    avatar: '🌐'
  },
  {
    id: 3,
    from: 'Content Agent',
    to: 'UI Agent',
    message: 'Content generated successfully',
    timestamp: '8s ago',
    status: 'completed',
    avatar: '📝'
  },
  {
    id: 4,
    from: 'Analytics Agent',
    to: 'All Agents',
    message: 'Performance metrics updated',
    timestamp: '12s ago',
    status: 'active',
    avatar: '📊'
  }
];

// Add new styled components for agent communications
const AgentMessageCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
  }
}));

const ConnectionLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  height: '2px',
  background: 'linear-gradient(90deg, #007AFF, #5856D6)',
  transformOrigin: 'left',
  zIndex: 1,
}));

function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600} color="primary">
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Real-time monitoring of your AI agents
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: `${stat.color}15`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {stat.value}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stat.progress}
                    sx={{ 
                      mt: 1, 
                      bgcolor: `${stat.color}15`,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: stat.color,
                      }
                    }} 
                  />
                </Box>
              </StatCard>
            </motion.div>
          </Grid>
        ))}

        {/* Performance Graph */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StyledCard>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Agent Performance
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#007AFF" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </StyledCard>
          </motion.div>
        </Grid>

        {/* Agent Distribution */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <StyledCard>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Agent Distribution
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </StyledCard>
          </motion.div>
        </Grid>

        {/* Success/Failure Rate */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <StyledCard>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Success/Failure Rate
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="successful" fill="#34C759" />
                    <Bar dataKey="failed" fill="#FF3B30" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </StyledCard>
          </motion.div>
        </Grid>

        {/* Resource Usage */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <StyledCard>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Resource Usage
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer>
                  <AreaChart data={areaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="cpu" 
                      stackId="1" 
                      stroke="#007AFF" 
                      fill="#007AFF" 
                      fillOpacity={0.2} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="memory" 
                      stackId="1" 
                      stroke="#5856D6" 
                      fill="#5856D6" 
                      fillOpacity={0.2} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </StyledCard>
          </motion.div>
        </Grid>

        {/* Add new Agent Communications section */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <StyledCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ChatIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight={600}>
                    Agent Communications
                  </Typography>
                </Box>
                
                <Box sx={{ position: 'relative', minHeight: '300px' }}>
                  {/* Agent Communication Network */}
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 2,
                    position: 'relative',
                    p: 2
                  }}>
                    {/* Agent Nodes */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <Avatar sx={{ 
                        bgcolor: 'primary.main', 
                        width: 56, 
                        height: 56,
                        fontSize: '1.5rem'
                      }}>
                        🤖
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>UI Agent</Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <Avatar sx={{ 
                        bgcolor: 'secondary.main', 
                        width: 56, 
                        height: 56,
                        fontSize: '1.5rem'
                      }}>
                        📝
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>Content Agent</Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <Avatar sx={{ 
                        bgcolor: 'success.main', 
                        width: 56, 
                        height: 56,
                        fontSize: '1.5rem'
                      }}>
                        🌐
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>Translation Agent</Typography>
                    </Box>
                  </Box>

                  {/* Communication Messages */}
                  <Box sx={{ mt: 4 }}>
                    {agentCommunications.map((comm, index) => (
                      <motion.div
                        key={comm.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                      >
                        <AgentMessageCard>
                          <Avatar sx={{ 
                            bgcolor: comm.status === 'active' ? 'primary.main' : 'success.main',
                            width: 40,
                            height: 40,
                            fontSize: '1.2rem'
                          }}>
                            {comm.avatar}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {comm.from} → {comm.to}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {comm.timestamp}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {comm.message}
                            </Typography>
                          </Box>
                        </AgentMessageCard>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </StyledCard>
            </motion.div>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 