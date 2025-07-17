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
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Grid,
} from '@mui/material';
import {
  BugReport as BugIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Lightbulb as InsightIcon,
  Analytics as AnalyticsIcon,
  Source as SourceIcon,
  Assessment as AssessmentIcon,
  BugReport as RallyIcon,
  Api as JiraIcon,
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ANALYSIS_TYPES = [
  {
    id: 'root-cause',
    name: 'Root Cause Analysis',
    description: 'Analyze test failures to identify underlying causes',
    icon: <BugIcon />,
  },
  {
    id: 'failure-patterns',
    name: 'Failure Pattern Analysis',
    description: 'Identify patterns in test failures over time',
    icon: <TimelineIcon />,
  },
  {
    id: 'performance',
    name: 'Performance Analysis',
    description: 'Analyze system performance bottlenecks',
    icon: <SpeedIcon />,
  }
];

const DATA_SOURCES = [
  {
    id: 'rally',
    name: 'Rally',
    icon: <RallyIcon />,
    description: 'Connect to Rally for test and defect data'
  },
  {
    id: 'jira',
    name: 'Jira',
    icon: <JiraIcon />,
    description: 'Connect to Jira for issue and test data'
  }
];

const SAMPLE_DATA = {
  'root-cause': {
    testFailures: [
      {
        id: 'TC-123',
        name: 'Login Authentication Test',
        failureCount: 5,
        lastFailure: '2024-03-10',
        error: 'Connection timeout',
        stackTrace: 'Error: Connection timeout at line 45...',
        component: 'Authentication',
        priority: 'High'
      },
      {
        id: 'TC-456',
        name: 'Payment Processing Test',
        failureCount: 3,
        lastFailure: '2024-03-09',
        error: 'Database deadlock',
        stackTrace: 'Error: Deadlock detected...',
        component: 'Payment',
        priority: 'Critical'
      },
      {
        id: 'TC-789',
        name: 'User Profile Update',
        failureCount: 2,
        lastFailure: '2024-03-08',
        error: 'Validation error',
        stackTrace: 'Error: Invalid data format...',
        component: 'Profile',
        priority: 'Medium'
      }
    ],
    failuresByComponent: [
      { name: 'Authentication', failures: 12, passed: 88 },
      { name: 'Payment', failures: 8, passed: 92 },
      { name: 'Profile', failures: 5, passed: 95 },
      { name: 'Search', failures: 3, passed: 97 },
      { name: 'Notifications', failures: 2, passed: 98 }
    ],
    trendsData: [
      { date: '03-05', failures: 2 },
      { date: '03-06', failures: 3 },
      { date: '03-07', failures: 5 },
      { date: '03-08', failures: 4 },
      { date: '03-09', failures: 6 },
      { date: '03-10', failures: 3 },
      { date: '03-11', failures: 2 }
    ],
    testCoverage: [
      { name: 'API Tests', value: 35, details: 'REST API endpoints' },
      { name: 'UI Tests', value: 25, details: 'Frontend components' },
      { name: 'Integration Tests', value: 15, details: 'System integration' },
      { name: 'Unit Tests', value: 15, details: 'Individual components' },
      { name: 'Uncovered', value: 10, details: 'Missing test areas' }
    ],
    patterns: {
      timeOfDay: 'Most failures occur during peak hours (2-4 PM)',
      environment: 'Production environment shows higher failure rate',
      frequency: 'Increasing trend over last 7 days',
      commonPatterns: [
        'Network timeouts during peak hours',
        'Database deadlocks in payment flow',
        'Validation errors in profile updates'
      ]
    }
  },
  'failure-patterns': {
    trends: [
      { period: 'Last 24h', totalTests: 150, failures: 8, pattern: 'Network timeouts' },
      { period: 'Last 48h', totalTests: 180, failures: 12, pattern: 'Database locks' },
      { period: '3 days ago', totalTests: 200, failures: 15, pattern: 'API errors' },
      { period: '4 days ago', totalTests: 160, failures: 10, pattern: 'Validation fails' },
      { period: '5 days ago', totalTests: 190, failures: 7, pattern: 'Cache misses' },
      { period: '6 days ago', totalTests: 210, failures: 9, pattern: 'Auth failures' },
      { period: '7 days ago', totalTests: 170, failures: 11, pattern: 'Timeout issues' }
    ],
    hotspots: [
      {
        component: 'Authentication Module',
        failureRate: '8.5',
        impact: 'High',
        recommendation: 'Review connection pooling configuration',
        testCases: [
          'Login Authentication Test',
          'Session Management Test',
          'Password Reset Flow',
          'OAuth Integration Test'
        ]
      },
      {
        component: 'Payment Gateway',
        failureRate: '6.2',
        impact: 'High',
        recommendation: 'Optimize transaction handling',
        testCases: [
          'Credit Card Processing Test',
          'Payment Validation Test',
          'Refund Processing Test',
          'Payment Gateway Integration'
        ]
      },
      {
        component: 'User Management',
        failureRate: '4.8',
        impact: 'Medium',
        recommendation: 'Enhance input validation',
        testCases: [
          'User Registration Test',
          'Profile Update Test',
          'User Deletion Flow',
          'Permission Management Test'
        ]
      },
      {
        component: 'Reporting Service',
        failureRate: '3.1',
        impact: 'Low',
        recommendation: 'Update caching strategy',
        testCases: [
          'Report Generation Test',
          'Data Export Test',
          'Analytics Dashboard Test',
          'Custom Report Builder Test'
        ]
      }
    ],
    predictiveAnalysis: {
      nextWeekPrediction: {
        estimatedFailures: 14,
        confidence: 85,
        riskAreas: [
          {
            component: 'Authentication',
            predictedFailures: 6,
            probability: 0.8,
            trend: 'increasing'
          },
          {
            component: 'Payment Gateway',
            predictedFailures: 4,
            probability: 0.7,
            trend: 'stable'
          },
          {
            component: 'User Management',
            predictedFailures: 4,
            probability: 0.6,
            trend: 'decreasing'
          }
        ],
        recommendations: [
          'Schedule preventive maintenance for Authentication module',
          'Increase monitoring frequency for Payment Gateway',
          'Review recent User Management changes'
        ]
      }
    },
    gapAnalysis: {
      testCoverageGaps: [
        {
          area: 'Error Handling',
          currentCoverage: 65,
          requiredCoverage: 90,
          priority: 'High',
          impact: 'Critical'
        },
        {
          area: 'Edge Cases',
          currentCoverage: 70,
          requiredCoverage: 85,
          priority: 'Medium',
          impact: 'High'
        },
        {
          area: 'Integration Points',
          currentCoverage: 75,
          requiredCoverage: 95,
          priority: 'High',
          impact: 'Critical'
        }
      ],
      missingScenarios: [
        'Concurrent user session handling',
        'Network timeout recovery',
        'Database failover scenarios',
        'Rate limiting tests'
      ]
    }
  },
  'performance': {
    metrics: [
      {
        endpoint: '/api/auth',
        avgResponseTime: '2.5s',
        p95: '4.2s',
        errorRate: '3%'
      },
      // ... more performance data
    ],
    bottlenecks: [
      {
        location: 'Database queries',
        impact: 'High',
        suggestion: 'Add index on frequently queried columns'
      }
    ]
  }
};

const TestFailureChart = ({ data }) => (
  <Box sx={{ height: 300, mb: 3 }}>
    <Typography variant="subtitle2" gutterBottom>
      Test Failures by Component
    </Typography>
    <ResponsiveContainer>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <RechartsTooltip />
        <Bar dataKey="failures" fill="#ff4444" name="Failures" />
        <Bar dataKey="passed" fill="#44ff44" name="Passed" />
      </BarChart>
    </ResponsiveContainer>
  </Box>
);

const TrendChart = ({ data }) => (
  <Box sx={{ height: 300, mb: 3 }}>
    <Typography variant="subtitle2" gutterBottom>
      Failure Trend (Last 7 Days)
    </Typography>
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <RechartsTooltip />
        <Line 
          type="monotone" 
          dataKey="failures" 
          stroke="#8884d8" 
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </Box>
);

const tooltipStyle = {
  bgcolor: 'background.paper', 
  p: 2, 
  border: '1px solid #ccc',
  borderRadius: 1,
  maxWidth: 300,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  position: 'relative',
  zIndex: 1000,
};

const CoverageChart = ({ data }) => {
  const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#FF0000'];
  
  return (
    <Box sx={{ height: 300, mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Test Coverage Analysis
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* Chart */}
        <Box sx={{ width: '70%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index, payload }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 20;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill={COLORS[index % COLORS.length]}
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      style={{ fontSize: '12px', fontWeight: 'bold' }}
                    >
                      {`${value}%`}
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <Box sx={{ 
                        ...tooltipStyle,
                        left: '-50px',
                      }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {data.name}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          Coverage: {data.value}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {data.details}
                        </Typography>
                      </Box>
                    );
                  }
                  return null;
                }}
                wrapperStyle={{ zIndex: 100 }}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend */}
        <Box sx={{ 
          width: '30%', 
          display: 'flex', 
          flexDirection: 'column',
          gap: 2,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1
        }}>
          {data.map((entry, index) => (
            <Box key={entry.name}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: COLORS[index % COLORS.length],
                    borderRadius: '50%'
                  }}
                />
                <Typography variant="subtitle2">
                  {entry.name}
                </Typography>
              </Box>
              <Box sx={{ pl: 3 }}>
                <Typography variant="caption" display="block" color="primary">
                  Coverage: {entry.value}%
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  {entry.details}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const FailurePatternChart = ({ data }) => (
  <Box sx={{ height: 300, mb: 3 }}>
    <Typography variant="subtitle2" gutterBottom>
      Test Failure Distribution
    </Typography>
    <ResponsiveContainer>
      <BarChart data={data.trends}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <RechartsTooltip />
        <Bar yAxisId="left" dataKey="totalTests" fill="#8884d8" name="Total Tests" />
        <Bar yAxisId="left" dataKey="failures" fill="#ff4444" name="Failures" />
      </BarChart>
    </ResponsiveContainer>
  </Box>
);

const FailureImpactChart = ({ data }) => {
  const COLORS = ['#ff4444', '#ffbb33', '#00C851', '#33b5e5'];
  
  const totalTestCases = data.hotspots.reduce((sum, spot) => sum + spot.testCases.length, 0);
  
  const impactData = data.hotspots.map(spot => ({
    name: spot.component,
    value: parseFloat(spot.failureRate),
    impact: spot.impact,
    details: spot.recommendation,
    failureType: spot.pattern || 'General failures',
    testCases: spot.testCases,
    testCasePercentage: ((spot.testCases.length / totalTestCases) * 100).toFixed(1)
  }));

  return (
    <Box sx={{ height: 300, mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Failure Impact by Component
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* Chart */}
        <Box sx={{ width: '70%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={impactData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index, payload }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 20;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill={COLORS[index % COLORS.length]}
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      style={{ fontSize: '12px', fontWeight: 'bold' }}
                    >
                      {`${value}% (${payload.testCasePercentage}%)`}
                    </text>
                  );
                }}
              >
                {impactData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <Box sx={{ 
                        ...tooltipStyle,
                        left: '-50px',
                      }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {data.name}
                        </Typography>
                        <Typography variant="body2" color="error">
                          Failure Rate: {data.value}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Impact: {data.impact}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Test Cases: {data.testCases.length} ({data.testCasePercentage}% of total)
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Failed Test Cases:
                        </Typography>
                        <Box component="ul" sx={{ mt: 0.5, pl: 2 }}>
                          {data.testCases.map((test, idx) => (
                            <li key={idx}>
                              <Typography variant="caption">
                                {test}
                              </Typography>
                            </li>
                          ))}
                        </Box>
                      </Box>
                    );
                  }
                  return null;
                }}
                wrapperStyle={{ zIndex: 100 }}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend */}
        <Box sx={{ 
          width: '30%', 
          display: 'flex', 
          flexDirection: 'column',
          gap: 2,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1
        }}>
          {impactData.map((entry, index) => (
            <Box key={entry.name}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: COLORS[index % COLORS.length],
                    borderRadius: '50%'
                  }}
                />
                <Typography variant="subtitle2">
                  {entry.name}
                </Typography>
              </Box>
              <Box sx={{ pl: 3 }}>
                <Typography variant="caption" display="block" color="error">
                  Failure Rate: {entry.value}%
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Test Cases: {entry.testCasePercentage}%
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const PredictiveChart = ({ data }) => {
  const riskData = data.riskAreas.map(area => ({
    name: area.component,
    value: area.predictedFailures,
    probability: area.probability * 100,
    trend: area.trend
  }));

  return (
    <Box sx={{ height: 300, mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Predicted Failures by Component
      </Typography>
      <ResponsiveContainer>
        <BarChart data={riskData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <RechartsTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <Box sx={{ bgcolor: 'background.paper', p: 1, border: '1px solid #ccc' }}>
                    <Typography variant="body2">{data.name}</Typography>
                    <Typography variant="body2">
                      Predicted Failures: {data.value}
                    </Typography>
                    <Typography variant="body2">
                      Probability: {data.probability}%
                    </Typography>
                    <Typography variant="body2">
                      Trend: {data.trend}
                    </Typography>
                  </Box>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" fill="#8884d8">
            {riskData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={entry.trend === 'increasing' ? '#ff4444' : 
                      entry.trend === 'stable' ? '#ffbb33' : '#00C851'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const GapAnalysisChart = ({ data }) => (
  <Box sx={{ height: 300, mb: 3 }}>
    <Typography variant="subtitle2" gutterBottom>
      Test Coverage Gaps
    </Typography>
    <ResponsiveContainer>
      <BarChart data={data.testCoverageGaps}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="area" />
        <YAxis />
        <RechartsTooltip />
        <Bar dataKey="currentCoverage" name="Current" fill="#ff4444" />
        <Bar dataKey="requiredCoverage" name="Required" fill="#00C851" />
      </BarChart>
    </ResponsiveContainer>
  </Box>
);

const exportToPDF = (data, analysisType) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Title
  doc.setFontSize(20);
  doc.text(`${analysisType} Report`, pageWidth/2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth/2, 30, { align: 'center' });

  let yPos = 50;

  if (analysisType === 'Root Cause Analysis') {
    // Test Failures Table
    doc.autoTable({
      startY: yPos,
      head: [['Test ID', 'Name', 'Component', 'Priority', 'Failure Count']],
      body: data.testFailures.map(failure => [
        failure.id,
        failure.name,
        failure.component,
        failure.priority,
        failure.failureCount
      ]),
    });

    yPos = doc.lastAutoTable.finalY + 20;

    // Coverage Summary
    doc.text('Test Coverage Summary:', 14, yPos);
    data.testCoverage.forEach((coverage, index) => {
      doc.text(`${coverage.name}: ${coverage.value}%`, 20, yPos + 7 + (index * 7));
    });

    yPos += data.testCoverage.length * 7 + 20;

    // Failure Patterns
    doc.text('Failure Patterns:', 14, yPos);
    yPos += 10;
    doc.text(`Time of Day: ${data.patterns.timeOfDay}`, 20, yPos);
    yPos += 7;
    doc.text(`Environment: ${data.patterns.environment}`, 20, yPos);
    yPos += 7;
    doc.text(`Frequency: ${data.patterns.frequency}`, 20, yPos);
    
    yPos += 20;
    
    // Recommendations
    doc.text('Recommendations:', 14, yPos);
    yPos += 10;
    data.patterns.commonPatterns.forEach((pattern, index) => {
      doc.text(`${index + 1}. ${pattern}`, 20, yPos);
      yPos += 7;
    });

  } else if (analysisType === 'Failure Pattern Analysis') {
    // Predictive Analysis
    doc.text('Predictive Analysis:', 14, yPos);
    doc.text(`Estimated Failures: ${data.predictiveAnalysis.nextWeekPrediction.estimatedFailures}`, 20, yPos + 10);
    doc.text(`Confidence: ${data.predictiveAnalysis.nextWeekPrediction.confidence}%`, 20, yPos + 20);

    yPos += 40;

    // Risk Areas
    doc.text('Risk Areas:', 14, yPos);
    yPos += 10;
    data.predictiveAnalysis.nextWeekPrediction.riskAreas.forEach(area => {
      doc.text(`${area.component}:`, 20, yPos);
      doc.text(`Predicted Failures: ${area.predictedFailures}`, 30, yPos + 7);
      doc.text(`Probability: ${(area.probability * 100).toFixed(1)}%`, 30, yPos + 14);
      doc.text(`Trend: ${area.trend}`, 30, yPos + 21);
      yPos += 35;
    });

    // Gap Analysis
    doc.text('Gap Analysis:', 14, yPos);
    yPos += 10;
    doc.autoTable({
      startY: yPos,
      head: [['Area', 'Current Coverage', 'Required Coverage', 'Priority']],
      body: data.gapAnalysis.testCoverageGaps.map(gap => [
        gap.area,
        `${gap.currentCoverage}%`,
        `${gap.requiredCoverage}%`,
        gap.priority
      ]),
    });

    yPos = doc.lastAutoTable.finalY + 20;

    // Missing Scenarios
    doc.text('Missing Test Scenarios:', 14, yPos);
    yPos += 10;
    data.gapAnalysis.missingScenarios.forEach((scenario, index) => {
      doc.text(`${index + 1}. ${scenario}`, 20, yPos);
      yPos += 7;
    });

    // Component Hotspots
    doc.addPage();
    yPos = 20;
    doc.text('Component Hotspots:', 14, yPos);
    yPos += 10;
    data.hotspots.forEach(hotspot => {
      doc.text(`${hotspot.component}:`, 20, yPos);
      doc.text(`Failure Rate: ${hotspot.failureRate}%`, 30, yPos + 7);
      doc.text(`Impact: ${hotspot.impact}`, 30, yPos + 14);
      doc.text(`Recommendation: ${hotspot.recommendation}`, 30, yPos + 21);
      doc.text('Failed Test Cases:', 30, yPos + 28);
      hotspot.testCases.forEach((test, index) => {
        doc.text(`- ${test}`, 40, yPos + 35 + (index * 7));
      });
      yPos += 70;
    });
  }

  // Save the PDF
  doc.save(`${analysisType.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString()}.pdf`);
};

function DataAnalyzerDialog({ open, onClose }) {
  const [analysisType, setAnalysisType] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError('');

      // Simulate API connection
      await new Promise(resolve => setTimeout(resolve, 1500));

      setConnected(true);
      // Load sample data based on selected source
      const sampleData = SAMPLE_DATA[analysisType];
      setResults({
        source: dataSource,
        type: analysisType,
        timestamp: new Date().toISOString(),
        data: sampleData,
        insights: generateInsights(sampleData, analysisType)
      });

    } catch (error) {
      setError(`Failed to connect to ${dataSource}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (data, type) => {
    switch (type) {
      case 'root-cause':
        // Analyze the test failures and patterns
        const topFailures = data.testFailures.sort((a, b) => b.failureCount - a.failureCount);
        const failurePatterns = data.patterns;
        
        return [
          {
            title: 'Critical Authentication Issues',
            description: 'Authentication module shows highest failure rate with connection timeouts being the dominant issue',
            severity: 'high',
            recommendations: [
              'Implement connection pooling to handle peak load',
              'Add retry mechanism with exponential backoff',
              'Set up monitoring alerts for authentication response times',
              'Review and optimize database connection settings'
            ]
          },
          {
            title: 'Payment Processing Bottlenecks',
            description: 'Database deadlocks occurring during payment transactions',
            severity: 'high',
            recommendations: [
              'Implement row-level locking strategy',
              'Review and optimize transaction isolation levels',
              'Add deadlock monitoring and automatic recovery',
              'Consider implementing queue-based processing for high-load scenarios'
            ]
          },
          {
            title: 'Peak Hour Performance',
            description: `Most failures occur during peak hours (${failurePatterns.timeOfDay})`,
            severity: 'medium',
            recommendations: [
              'Implement auto-scaling based on time-based patterns',
              'Review and optimize resource allocation during peak hours',
              'Consider implementing request throttling',
              'Set up performance testing specifically for peak hour scenarios'
            ]
          },
          {
            title: 'Environment-Specific Issues',
            description: failurePatterns.environment,
            severity: 'medium',
            recommendations: [
              'Review production environment configuration',
              'Implement environment parity checks',
              'Set up synthetic monitoring for production',
              'Enhance logging and monitoring in production'
            ]
          },
          {
            title: 'Validation and Data Quality',
            description: 'Recurring validation errors in profile updates indicate data quality issues',
            severity: 'medium',
            recommendations: [
              'Implement strict input validation on client side',
              'Add comprehensive server-side validation',
              'Create data quality monitoring dashboard',
              'Set up automated data consistency checks'
            ]
          },
          {
            title: 'Test Coverage Improvements',
            description: `Current test coverage is at ${data.testCoverage[0].value}%. Key areas need additional coverage.`,
            severity: 'medium',
            recommendations: [
              'Add integration tests for authentication flows',
              'Increase coverage for payment error scenarios',
              'Implement boundary value testing',
              'Add performance regression tests'
            ]
          }
        ];
      case 'failure-patterns':
        return [
          {
            title: 'Trending Issues',
            description: 'Network-related failures show increasing trend',
            severity: 'medium',
            recommendations: [
              'Monitor network latency',
              'Implement circuit breakers',
              'Review error handling'
            ]
          }
        ];
      case 'performance':
        return [
          {
            title: 'Performance Bottlenecks',
            description: 'Database queries showing high latency',
            severity: 'high',
            recommendations: [
              'Optimize database queries',
              'Add missing indexes',
              'Implement query caching'
            ]
          }
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AnalyticsIcon color="primary" />
          <Typography variant="h6">Data Analyzer</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          {/* Data Source Selection */}
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Select Data Source
            </Typography>
            <RadioGroup
              value={dataSource}
              onChange={(e) => {
                setDataSource(e.target.value);
                setConnected(false);
                setResults(null);
              }}
            >
              {DATA_SOURCES.map((source) => (
                <FormControlLabel
                  key={source.id}
                  value={source.id}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {source.icon}
                      <Box>
                        <Typography variant="subtitle2">{source.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {source.description}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Analysis Type Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Analysis Type</InputLabel>
            <Select
              value={analysisType}
              onChange={(e) => {
                setAnalysisType(e.target.value);
                setResults(null);
              }}
              label="Analysis Type"
              disabled={!dataSource}
            >
              {ANALYSIS_TYPES.map((type) => (
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

          {/* Time Range Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
              disabled={!dataSource || !analysisType}
            >
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>

          {/* Connect Button */}
          <Button
            variant="contained"
            onClick={handleConnect}
            disabled={!dataSource || !analysisType || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SourceIcon />}
            sx={{ mb: 2 }}
          >
            {loading ? 'Connecting...' : connected ? 'Refresh Data' : 'Connect & Analyze'}
          </Button>
        </Box>

        {/* Results Section */}
        {results && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>
            
            {/* Root Cause Analysis View */}
            {results.type === 'root-cause' && (
              <>
                <Box sx={{ mb: 8 }}>
                  <CoverageChart data={results.data.testCoverage} />
                </Box>

                <Typography variant="h6" gutterBottom sx={{ mt: 6, mb: 3 }}>
                  Recent Test Failures
                </Typography>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Test ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Component</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell align="right">Failure Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.data.testFailures.map((failure) => (
                        <TableRow key={failure.id}>
                          <TableCell>{failure.id}</TableCell>
                          <TableCell>{failure.name}</TableCell>
                          <TableCell>{failure.component}</TableCell>
                          <TableCell>
                            <Chip 
                              label={failure.priority}
                              color={failure.priority === 'High' ? 'error' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">{failure.failureCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>

                {/* Common Patterns */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Identified Patterns
                  </Typography>
                  <List dense>
                    {results.data.patterns.commonPatterns.map((pattern, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <TimelineIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={pattern} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </>
            )}

            {/* Failure Patterns Analysis View */}
            {results.type === 'failure-patterns' && (
              <>
                <Box sx={{ mb: 4 }}>
                  <FailurePatternChart data={results.data} />
                  <FailureImpactChart data={results.data} />
                </Box>

                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Trend Analysis
                  </Typography>
                  <Grid container spacing={2}>
                    {results.data.trends.map((trend, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Box sx={{ 
                          p: 2, 
                          border: '1px solid', 
                          borderColor: 'divider',
                          borderRadius: 1,
                          '&:hover': {
                            boxShadow: 1,
                            bgcolor: 'action.hover'
                          }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <TimelineIcon color="primary" />
                            <Typography variant="subtitle2">
                              {trend.period}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Total Tests: <strong>{trend.totalTests}</strong>
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color={trend.failures > 10 ? 'error' : 'warning'}
                            >
                              Failures: <strong>{trend.failures}</strong>
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            Pattern: {trend.pattern}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>

                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Critical Hotspots
                  </Typography>
                  <Grid container spacing={2}>
                    {results.data.hotspots.map((hotspot, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Box sx={{ 
                          p: 2, 
                          border: '1px solid', 
                          borderColor: hotspot.impact === 'High' ? 'error.main' : 'divider',
                          borderRadius: 1,
                          bgcolor: hotspot.impact === 'High' ? 'error.lighter' : 'background.paper'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <BugIcon color={hotspot.impact === 'High' ? 'error' : 'warning'} />
                            <Typography variant="subtitle2">
                              {hotspot.component}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" color="error">
                              Failure Rate: {hotspot.failureRate}%
                            </Typography>
                            <Chip 
                              label={hotspot.impact}
                              size="small"
                              color={hotspot.impact === 'High' ? 'error' : 'warning'}
                              sx={{ mt: 1 }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Recommendation: {hotspot.recommendation}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>

                {/* Predictive Analysis Section */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Predictive Analysis
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <PredictiveChart data={results.data.predictiveAnalysis.nextWeekPrediction} />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Next Week Prediction
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Estimated Failures
                        </Typography>
                        <Typography variant="h4" color="error">
                          {results.data.predictiveAnalysis.nextWeekPrediction.estimatedFailures}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Confidence
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {results.data.predictiveAnalysis.nextWeekPrediction.confidence}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Recommended Actions:
                    </Typography>
                    <List dense>
                      {results.data.predictiveAnalysis.nextWeekPrediction.recommendations.map((rec, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon>
                            <TimelineIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={rec} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Paper>

                {/* Gap Analysis Section */}
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Gap Analysis
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <GapAnalysisChart data={results.data.gapAnalysis} />
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Coverage Gaps
                      </Typography>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Area</TableCell>
                            <TableCell>Current</TableCell>
                            <TableCell>Required</TableCell>
                            <TableCell>Priority</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {results.data.gapAnalysis.testCoverageGaps.map((gap, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{gap.area}</TableCell>
                              <TableCell>
                                <Typography color={gap.currentCoverage < gap.requiredCoverage ? 'error' : 'success'}>
                                  {gap.currentCoverage}%
                                </Typography>
                              </TableCell>
                              <TableCell>{gap.requiredCoverage}%</TableCell>
                              <TableCell>
                                <Chip 
                                  label={gap.priority}
                                  size="small"
                                  color={gap.priority === 'High' ? 'error' : 'warning'}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Missing Test Scenarios
                      </Typography>
                      <List dense>
                        {results.data.gapAnalysis.missingScenarios.map((scenario, idx) => (
                          <ListItem key={idx}>
                            <ListItemIcon>
                              <BugIcon color="warning" />
                            </ListItemIcon>
                            <ListItemText primary={scenario} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </Paper>
              </>
            )}

            {/* Performance Analysis View */}
            {results.type === 'performance' && (
              <>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Endpoint</TableCell>
                        <TableCell>Avg Response Time</TableCell>
                        <TableCell>P95</TableCell>
                        <TableCell>Error Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.data.metrics.map((metric, index) => (
                        <TableRow key={index}>
                          <TableCell>{metric.endpoint}</TableCell>
                          <TableCell>{metric.avgResponseTime}</TableCell>
                          <TableCell>{metric.p95}</TableCell>
                          <TableCell>{metric.errorRate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>

                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Performance Bottlenecks
                  </Typography>
                  <List>
                    {results.data.bottlenecks.map((bottleneck, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <SpeedIcon color={bottleneck.impact === 'High' ? 'error' : 'warning'} />
                        </ListItemIcon>
                        <ListItemText
                          primary={bottleneck.location}
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                Impact: {bottleneck.impact}
                              </Typography>
                              <Typography variant="body2">
                                Suggestion: {bottleneck.suggestion}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </>
            )}

            {/* Insights Section - Common for all analysis types */}
            {results.insights?.map((insight, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InsightIcon color="primary" />
                    <Typography variant="subtitle1">
                      {insight.title}
                    </Typography>
                    <Chip
                      label={insight.severity}
                      size="small"
                      color={insight.severity === 'high' ? 'error' : 'warning'}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    {insight.description}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Recommendations:
                  </Typography>
                  <List dense>
                    {insight.recommendations.map((rec, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <AssessmentIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {results && (
          <>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => {
                const exportData = JSON.stringify(results, null, 2);
                const blob = new Blob([exportData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `analysis-${results.type}-${new Date().toISOString()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              Export JSON
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => exportToPDF(results.data, ANALYSIS_TYPES.find(t => t.id === results.type)?.name)}
            >
              Export PDF
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default DataAnalyzerDialog; 