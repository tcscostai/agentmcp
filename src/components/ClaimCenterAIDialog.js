import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  Tooltip,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Fade,
  Zoom,
  Grow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardMedia,
  Tabs,
  Tab,
  Avatar,
  Badge,
  Stack,
  Rating,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Assignment as AssignmentIcon,
  Policy as PolicyIcon,
  Help as HelpIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  VerifiedUser as VerifiedUserIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  AutoFixHigh as AutoFixHighIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  Sync as SyncIcon,
  Calculate as CalculateIcon,
  ExpandMore as ExpandMoreIcon,
  Gavel as GavelIcon,
  AccountBalance as AccountBalanceIcon,
  LocalHospital as LocalHospitalIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  CompareArrows as CompareArrowsIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
  Home as HomeIcon,
  Close as CloseIcon,
  Lightbulb as LightbulbIcon,
  Event as EventIcon,
  CalendarMonth as CalendarMonthIcon,
  SupportAgent as SupportAgentIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
  Timeline as TimelineIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  WarningAmber as WarningAmberIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  FilterAlt as FilterAltIcon,
  DateRange as DateRangeIcon,
  Group as GroupIcon,
  LocationOn as LocationOnIcon,
  Category as CategoryIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import ClaimsPolicyDialog from './ClaimsPolicyDialog';
import ClaimsAdjudicationsDialog from './ClaimsAdjudicationsDialog';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';

const MODULES = [
  {
    id: 'claim-pend-resolution',
    name: 'Claim PEND Resolution',
    icon: <AssignmentIcon fontSize="large" />,
    description: 'Resolve and process pending claims efficiently',
    color: '#1976d2'
  },
  {
    id: 'claims-policy',
    name: 'Claims Policy',
    icon: <PolicyIcon fontSize="large" />,
    description: 'Access and manage claims policies and guidelines',
    color: '#2e7d32'
  },
  {
    id: 'claim-adjudications',
    name: 'Claim Adjudications',
    icon: <GavelIcon fontSize="large" />,
    description: 'Review and process claim adjudications with AI assistance',
    color: '#6d4aff'
  },
  {
    id: 'contact-center-agents',
    name: 'Contact Center Agents',
    icon: <SupportAgentIcon fontSize="large" />,
    description: 'Get support and guidance for contact center operations',
    color: '#00bcd4'
  }
];

const PEND_CODES = {
  AUTH: {
    code: 'AUTH',
    description: 'Authorization Required',
    resolutionTypes: ['pre_service', 'post_service', 'retro_auth'],
    aiSuggestions: {
      pre_service: {
        steps: [
          'Verify if service requires pre-authorization',
          'Check authorization database for existing auth',
          'Contact provider for missing auth details',
          'Process retro authorization if applicable'
        ],
        requiredFields: ['authNumber', 'authDate', 'serviceType'],
        priority: 'High'
      },
      post_service: {
        steps: [
          'Verify service date against auth period',
          'Check for retro authorization eligibility',
          'Process retro authorization request',
          'Update claim with auth details'
        ],
        requiredFields: ['serviceDate', 'authNumber', 'retroEligible'],
        priority: 'Medium'
      },
      retro_auth: {
        steps: [
          'Verify retro authorization criteria',
          'Check member eligibility during service period',
          'Process retro authorization request',
          'Update claim with retro auth details'
        ],
        requiredFields: ['serviceDate', 'memberEligibility', 'retroCriteria'],
        priority: 'High'
      }
    }
  },
  PROV: {
    code: 'PROV',
    description: 'Provider Issues',
    resolutionTypes: ['tin_mismatch', 'npi_validation', 'enrollment'],
    aiSuggestions: {
      tin_mismatch: {
        steps: [
          'Verify correct TIN in provider database',
          'Check for recent TIN updates',
          'Update claim with correct TIN',
          'Validate provider enrollment status'
        ],
        requiredFields: ['correctTIN', 'providerStatus', 'enrollmentDate'],
        priority: 'Medium'
      },
      npi_validation: {
        steps: [
          'Validate NPI against NPPES database',
          'Check provider specialty match',
          'Verify provider credentials',
          'Update claim with validated NPI'
        ],
        requiredFields: ['npi', 'specialty', 'credentials'],
        priority: 'High'
      },
      enrollment: {
        steps: [
          'Check provider enrollment status',
          'Verify effective dates',
          'Process enrollment application if needed',
          'Update claim with enrollment details'
        ],
        requiredFields: ['enrollmentStatus', 'effectiveDate', 'applicationStatus'],
        priority: 'High'
      }
    }
  },
  PRIC: {
    code: 'PRIC',
    description: 'Pricing Issues',
    resolutionTypes: ['fee_schedule', 'contract_pricing', 'special_pricing'],
    aiSuggestions: {
      fee_schedule: {
        steps: [
          'Verify applicable fee schedule',
          'Check service code pricing',
          'Calculate allowed amount',
          'Apply fee schedule pricing'
        ],
        requiredFields: ['feeSchedule', 'serviceCode', 'allowedAmount'],
        priority: 'Medium'
      },
      contract_pricing: {
        steps: [
          'Verify provider contract details',
          'Check contract pricing rules',
          'Calculate contract rate',
          'Apply contract pricing'
        ],
        requiredFields: ['contractId', 'contractRate', 'effectiveDate'],
        priority: 'High'
      },
      special_pricing: {
        steps: [
          'Verify special pricing approval',
          'Check pricing override eligibility',
          'Process pricing exception',
          'Apply special pricing'
        ],
        requiredFields: ['approvalId', 'overrideReason', 'specialRate'],
        priority: 'High'
      }
    }
  }
};

const MOCK_CLAIMS = [
  {
    claimId: "CLM-2024-001",
    patientName: "John Smith",
    provider: "Dr. Sarah Johnson",
    serviceDate: "2024-03-15",
    amount: "$1,250.00",
    status: "PENDING",
    pendCode: "AUTH-001",
    pendReason: "Authorization Required",
    priority: "High",
    daysInPending: 3,
    providerDetails: {
      name: "Dr. Sarah Johnson",
      npi: "1234567890",
      tin: "987654321",
      specialty: "Cardiology",
      status: "Active"
    },
    authorizationDetails: {
      required: true,
      status: "Missing",
      type: "Pre-service",
      urgency: "High",
      resolutionType: "pre_service",
      vendorIntegration: {
        required: true,
        vendor: "AuthConnect",
        integrationType: "Real-time",
        endpoint: "auth-verify"
      }
    },
    pricingDetails: {
      billedAmount: "$1,250.00",
      allowedAmount: "$950.00",
      pricingRule: "Specialty-specific",
      overrideEligible: true
    }
  },
  {
    claimId: "CLM-2024-002",
    patientName: "Mary Johnson",
    provider: "Dr. Michael Brown",
    serviceDate: "2024-03-14",
    amount: "$850.00",
    status: "REJECTED",
    pendCode: "PROV-002",
    pendReason: "Invalid Provider TIN",
    priority: "Medium",
    daysInPending: 5,
    providerDetails: {
      name: "Dr. Michael Brown",
      npi: "0987654321",
      tin: "123456789",
      specialty: "Primary Care",
      status: "Inactive",
      resolutionType: "tin_mismatch",
      vendorIntegration: {
        required: true,
        vendor: "ProviderVerify",
        integrationType: "Batch",
        endpoint: "provider-validate"
      }
    }
  },
  {
    claimId: "CLM-2024-003",
    patientName: "Robert Wilson",
    provider: "Dr. Emily Davis",
    serviceDate: "2024-03-13",
    amount: "$2,100.00",
    status: "PENDING",
    pendCode: "PRIC-003",
    pendReason: "Pricing Discrepancy",
    priority: "Low",
    daysInPending: 2,
    pricingDetails: {
      billedAmount: "$2,100.00",
      allowedAmount: "$1,800.00",
      pricingRule: "Specialty-specific",
      overrideEligible: false,
      resolutionType: "fee_schedule",
      vendorIntegration: {
        required: true,
        vendor: "PriceMaster",
        integrationType: "Real-time",
        endpoint: "pricing-calculate"
      }
    }
  }
];

// Dashboard Mock Data
const DASHBOARD_DATA = {
  kpis: {
    totalClaims: 1247,
    pendingClaims: 89,
    rejectedClaims: 156,
    approvedClaims: 1002,
    averageProcessingTime: 2.3,
    accuracyRate: 94.2,
    costSavings: 125000,
    efficiencyGain: 23.5
  },
  trends: {
    monthly: [
      { month: 'Jan', pending: 120, rejected: 180, approved: 950 },
      { month: 'Feb', pending: 95, rejected: 165, approved: 980 },
      { month: 'Mar', pending: 89, rejected: 156, approved: 1002 },
      { month: 'Apr', pending: 78, rejected: 142, approved: 1050 },
      { month: 'May', pending: 65, rejected: 128, approved: 1100 },
      { month: 'Jun', pending: 52, rejected: 115, approved: 1150 }
    ],
    weekly: [
      { week: 'W1', pending: 25, rejected: 35, approved: 240 },
      { week: 'W2', pending: 22, rejected: 32, approved: 245 },
      { week: 'W3', pending: 20, rejected: 28, approved: 250 },
      { week: 'W4', pending: 18, rejected: 25, approved: 255 }
    ]
  },
  pendCodeDistribution: [
    { code: 'AUTH', count: 45, percentage: 50.6, color: '#f44336' },
    { code: 'PROV', count: 28, percentage: 31.5, color: '#ff9800' },
    { code: 'PRIC', count: 16, percentage: 18.0, color: '#2196f3' }
  ],
  rootCauseAnalysis: [
    {
      cause: 'Missing Authorization',
      frequency: 45,
      impact: 'High',
      trend: 'decreasing',
      resolution: 'Pre-service auth required'
    },
    {
      cause: 'Invalid Provider TIN',
      frequency: 28,
      impact: 'Medium',
      trend: 'stable',
      resolution: 'Provider enrollment verification'
    },
    {
      cause: 'Pricing Discrepancy',
      frequency: 16,
      impact: 'Low',
      trend: 'decreasing',
      resolution: 'Fee schedule validation'
    }
  ],
  predictiveAnalytics: {
    nextWeekPrediction: {
      pendingClaims: 75,
      rejectedClaims: 140,
      approvedClaims: 1080,
      confidence: 87.5
    },
    riskFactors: [
      { factor: 'New Provider Enrollment', risk: 'High', probability: 0.85 },
      { factor: 'Complex Procedures', risk: 'Medium', probability: 0.65 },
      { factor: 'Out-of-Network Claims', risk: 'Medium', probability: 0.72 },
      { factor: 'High-Value Claims', risk: 'Low', probability: 0.45 }
    ],
    recommendations: [
      'Implement proactive provider verification',
      'Enhance pre-authorization workflows',
      'Optimize pricing validation rules',
      'Deploy AI-powered claim screening'
    ]
  },
  performanceMetrics: {
    processingTime: {
      current: 2.3,
      target: 1.8,
      improvement: 21.7
    },
    accuracy: {
      current: 94.2,
      target: 96.0,
      improvement: 1.8
    },
    costPerClaim: {
      current: 12.50,
      target: 10.00,
      improvement: 20.0
    },
    customerSatisfaction: {
      current: 4.2,
      target: 4.5,
      improvement: 7.1
    }
  },
  recentActivity: [
    {
      id: 1,
      type: 'claim_approved',
      message: 'Claim CLM-2024-045 approved automatically',
      timestamp: '2 minutes ago',
      icon: <CheckCircleIcon color="success" />,
      priority: 'low'
    },
    {
      id: 2,
      type: 'pend_resolved',
      message: 'Authorization issue resolved for CLM-2024-032',
      timestamp: '15 minutes ago',
      icon: <VerifiedUserIcon color="primary" />,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'claim_rejected',
      message: 'Claim CLM-2024-078 rejected due to invalid provider',
      timestamp: '1 hour ago',
      icon: <ErrorIcon color="error" />,
      priority: 'high'
    },
    {
      id: 4,
      type: 'system_alert',
      message: 'High volume of pending claims detected',
      timestamp: '2 hours ago',
      icon: <WarningIcon color="warning" />,
      priority: 'high'
    }
  ],
  topPerformers: [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      claimsProcessed: 156,
      accuracy: 98.7,
      avgProcessingTime: 1.2,
      rating: 4.8
    },
    {
      name: 'Dr. Michael Brown',
      specialty: 'Primary Care',
      claimsProcessed: 142,
      accuracy: 97.3,
      avgProcessingTime: 1.5,
      rating: 4.6
    },
    {
      name: 'Dr. Emily Davis',
      specialty: 'Orthopedics',
      claimsProcessed: 128,
      accuracy: 96.8,
      avgProcessingTime: 1.8,
      rating: 4.4
    }
  ],
  // NEW: Appeals Trending Analysis
  appealsTrending: {
    claimTypes: [
      { type: 'Cardiology Procedures', appeals: 45, trend: '+12%', successRate: 68, color: '#f44336' },
      { type: 'Orthopedic Surgery', appeals: 38, trend: '+8%', successRate: 72, color: '#ff9800' },
      { type: 'Mental Health Services', appeals: 32, trend: '+15%', successRate: 65, color: '#2196f3' },
      { type: 'Diagnostic Imaging', appeals: 28, trend: '+5%', successRate: 75, color: '#4caf50' },
      { type: 'Physical Therapy', appeals: 22, trend: '+3%', successRate: 78, color: '#9c27b0' }
    ],
    monthlyTrend: [
      { month: 'Jan', appeals: 85, overturned: 58 },
      { month: 'Feb', appeals: 92, overturned: 63 },
      { month: 'Mar', appeals: 78, overturned: 52 },
      { month: 'Apr', appeals: 105, overturned: 71 },
      { month: 'May', appeals: 98, overturned: 65 },
      { month: 'Jun', appeals: 112, overturned: 76 }
    ],
    topReasons: [
      'Medical Necessity Documentation',
      'Authorization Denials',
      'Coding Discrepancies',
      'Provider Network Issues',
      'Benefit Coverage Disputes'
    ]
  },
  // NEW: Policy Gap Analysis
  policyGaps: {
    pendReasons: [
      { 
        pendCode: 'AUTH-001', 
        reason: 'Pre-authorization Documentation Gap',
        frequency: 23,
        providersAffected: 45,
        reeducationRequired: true,
        impact: 'High',
        policySection: 'Section 3.2 - Pre-Service Authorization'
      },
      { 
        pendCode: 'PROV-002', 
        reason: 'Provider Enrollment Documentation',
        frequency: 18,
        providersAffected: 32,
        reeducationRequired: true,
        impact: 'Medium',
        policySection: 'Section 2.1 - Provider Enrollment'
      },
      { 
        pendCode: 'PRIC-003', 
        reason: 'Fee Schedule Application',
        frequency: 12,
        providersAffected: 28,
        reeducationRequired: false,
        impact: 'Low',
        policySection: 'Section 4.3 - Payment Methodology'
      },
      { 
        pendCode: 'AUTH-004', 
        reason: 'Retro Authorization Process',
        frequency: 15,
        providersAffected: 38,
        reeducationRequired: true,
        impact: 'Medium',
        policySection: 'Section 3.4 - Retro Authorization'
      }
    ],
    providerEducation: [
      {
        provider: 'Cardiology Associates',
        specialty: 'Cardiology',
        educationNeeded: ['Pre-auth requirements', 'Documentation standards'],
        lastEducation: '2024-01-15',
        nextScheduled: '2024-07-15',
        priority: 'High'
      },
      {
        provider: 'Orthopedic Specialists',
        specialty: 'Orthopedics',
        educationNeeded: ['Surgical authorization', 'Coding guidelines'],
        lastEducation: '2024-02-20',
        nextScheduled: '2024-08-20',
        priority: 'Medium'
      },
      {
        provider: 'Mental Health Partners',
        specialty: 'Psychiatry',
        educationNeeded: ['Session limits', 'Medical necessity'],
        lastEducation: '2024-03-10',
        nextScheduled: '2024-09-10',
        priority: 'High'
      }
    ]
  },
  // NEW: Auto-Adjudication Impact Analysis
  autoAdjudicationImpact: {
    currentRate: 82.5,
    projectedDrop: 15,
    newRate: 67.5,
    capacityImpact: {
      additionalStaffNeeded: 8,
      processingTimeIncrease: 2.1,
      costIncrease: 45000,
      backlogRisk: 'High'
    },
    mitigationStrategies: [
      'Implement AI-powered claim screening',
      'Enhance provider education programs',
      'Optimize workflow automation',
      'Deploy predictive analytics'
    ],
    monthlyProjection: [
      { month: 'Jul', autoRate: 82.5, manualClaims: 180, staffNeeded: 6 },
      { month: 'Aug', autoRate: 75.0, manualClaims: 220, staffNeeded: 7 },
      { month: 'Sep', autoRate: 67.5, manualClaims: 280, staffNeeded: 8 },
      { month: 'Oct', autoRate: 70.0, manualClaims: 250, staffNeeded: 7 },
      { month: 'Nov', autoRate: 72.5, manualClaims: 230, staffNeeded: 7 },
      { month: 'Dec', autoRate: 75.0, manualClaims: 220, staffNeeded: 7 }
    ]
  },
  // NEW: Days on Hand Analysis
  daysOnHand: {
    current: 2.3,
    target: 1.8,
    capacityUtilization: 87,
    backlogTrend: 'decreasing',
    capacityFactors: [
      { factor: 'Staff Availability', impact: 'Medium', trend: 'stable' },
      { factor: 'System Performance', impact: 'Low', trend: 'improving' },
      { factor: 'Volume Fluctuation', impact: 'High', trend: 'variable' },
      { factor: 'Complexity Increase', impact: 'Medium', trend: 'increasing' }
    ],
    weeklyCapacity: [
      { week: 'W1', claims: 1250, capacity: 1400, utilization: 89 },
      { week: 'W2', claims: 1180, capacity: 1400, utilization: 84 },
      { week: 'W3', claims: 1320, capacity: 1400, utilization: 94 },
      { week: 'W4', claims: 1150, capacity: 1400, utilization: 82 }
    ]
  },
  // NEW: Appeals Overturn Rate Metrics
  appealsOverturnRate: {
    overallRate: 68.5,
    trend: '+2.3%',
    bySpecialty: [
      { specialty: 'Cardiology', overturnRate: 72, volume: 45, trend: '+5%' },
      { specialty: 'Orthopedics', overturnRate: 68, volume: 38, trend: '+3%' },
      { specialty: 'Mental Health', overturnRate: 65, volume: 32, trend: '+8%' },
      { specialty: 'Diagnostic', overturnRate: 75, volume: 28, trend: '+1%' },
      { specialty: 'Physical Therapy', overturnRate: 78, volume: 22, trend: '+2%' }
    ],
    byReason: [
      { reason: 'Medical Necessity', overturnRate: 75, volume: 85 },
      { reason: 'Authorization Issues', overturnRate: 65, volume: 62 },
      { reason: 'Coding Errors', overturnRate: 82, volume: 45 },
      { reason: 'Network Issues', overturnRate: 58, volume: 28 },
      { reason: 'Benefit Disputes', overturnRate: 70, volume: 35 }
    ],
    financialImpact: {
      overturnedAmount: 1250000,
      processingCost: 85000,
      netImpact: 1165000,
      trend: '+12%'
    }
  },
  // NEW: STAR Rating Impact Metrics
  starRatingMetrics: {
    currentRating: 4.2,
    targetRating: 4.5,
    components: [
      {
        component: 'Speed',
        score: 4.1,
        weight: 30,
        impact: 'Medium',
        factors: ['Processing Time', 'Response Time', 'Resolution Speed']
      },
      {
        component: 'Timeliness',
        score: 4.3,
        weight: 25,
        impact: 'High',
        factors: ['Claim Turnaround', 'Appeal Processing', 'Provider Response']
      },
      {
        component: 'Accuracy',
        score: 4.4,
        weight: 25,
        impact: 'High',
        factors: ['First Pass Accuracy', 'Error Rate', 'Quality Score']
      },
      {
        component: 'Responsiveness',
        score: 4.0,
        weight: 20,
        impact: 'Medium',
        factors: ['Provider Communication', 'Issue Resolution', 'Support Quality']
      }
    ],
    improvementAreas: [
      {
        area: 'Processing Speed',
        current: 2.3,
        target: 1.8,
        impact: 'High',
        actions: ['Automate workflows', 'Optimize staffing', 'Enhance systems']
      },
      {
        area: 'Provider Communication',
        current: 3.8,
        target: 4.2,
        impact: 'Medium',
        actions: ['Improve notifications', 'Enhance portal', 'Better training']
      },
      {
        area: 'Error Reduction',
        current: 5.8,
        target: 4.0,
        impact: 'High',
        actions: ['AI validation', 'Quality checks', 'Staff training']
      }
    ],
    monthlyTrend: [
      { month: 'Jan', rating: 4.0, speed: 3.9, timeliness: 4.1, accuracy: 4.2, responsiveness: 3.8 },
      { month: 'Feb', rating: 4.1, speed: 4.0, timeliness: 4.2, accuracy: 4.3, responsiveness: 3.9 },
      { month: 'Mar', rating: 4.2, speed: 4.1, timeliness: 4.3, accuracy: 4.4, responsiveness: 4.0 },
      { month: 'Apr', rating: 4.1, speed: 4.0, timeliness: 4.2, accuracy: 4.3, responsiveness: 3.9 },
      { month: 'May', rating: 4.2, speed: 4.1, timeliness: 4.3, accuracy: 4.4, responsiveness: 4.0 },
      { month: 'Jun', rating: 4.2, speed: 4.1, timeliness: 4.3, accuracy: 4.4, responsiveness: 4.0 }
    ]
  }
};

const RESOLUTION_STEPS = {
  authorization: {
    pre_service: [
      { label: 'Verify Pre-auth Requirements', status: 'completed' },
      { label: 'Check Auth Database', status: 'completed' },
      { label: 'Contact Provider', status: 'active' },
      { label: 'Process Auth', status: 'pending' }
    ],
    post_service: [
      { label: 'Verify Service Date', status: 'completed' },
      { label: 'Check Retro Eligibility', status: 'completed' },
      { label: 'Process Retro Auth', status: 'active' },
      { label: 'Update Claim', status: 'pending' }
    ],
    retro_auth: [
      { label: 'Verify Retro Criteria', status: 'completed' },
      { label: 'Check Member Eligibility', status: 'completed' },
      { label: 'Process Retro Request', status: 'active' },
      { label: 'Update Auth Details', status: 'pending' }
    ]
  },
  provider: {
    tin_mismatch: [
      { label: 'Verify TIN in Database', status: 'completed' },
      { label: 'Check TIN Updates', status: 'completed' },
      { label: 'Update Claim TIN', status: 'active' },
      { label: 'Validate Enrollment', status: 'pending' }
    ],
    npi_validation: [
      { label: 'Validate NPI', status: 'completed' },
      { label: 'Check Specialty Match', status: 'completed' },
      { label: 'Verify Credentials', status: 'active' },
      { label: 'Update NPI', status: 'pending' }
    ],
    enrollment: [
      { label: 'Check Enrollment Status', status: 'completed' },
      { label: 'Verify Effective Dates', status: 'completed' },
      { label: 'Process Application', status: 'active' },
      { label: 'Update Enrollment', status: 'pending' }
    ]
  },
  pricing: {
    fee_schedule: [
      { label: 'Verify Fee Schedule', status: 'completed' },
      { label: 'Check Service Pricing', status: 'completed' },
      { label: 'Calculate Amount', status: 'active' },
      { label: 'Apply Pricing', status: 'pending' }
    ],
    contract_pricing: [
      { label: 'Verify Contract', status: 'completed' },
      { label: 'Check Pricing Rules', status: 'completed' },
      { label: 'Calculate Rate', status: 'active' },
      { label: 'Apply Contract Rate', status: 'pending' }
    ],
    special_pricing: [
      { label: 'Verify Approval', status: 'completed' },
      { label: 'Check Override', status: 'completed' },
      { label: 'Process Exception', status: 'active' },
      { label: 'Apply Special Rate', status: 'pending' }
    ]
  }
};

const RESOLUTION_COMPLETION_STEPS = {
  authorization: {
    pre_service: [
      {
        label: "Verify Pre-auth Details",
        icon: <VerifiedUserIcon />,
        description: "Validating pre-authorization requirements and details",
        duration: 2000
      },
      {
        label: "Update Claim Information",
        icon: <EditIcon />,
        description: "Adding pre-authorization details to claim",
        duration: 1500
      },
      {
        label: "Submit for Processing",
        icon: <SendIcon />,
        description: "Sending updated claim for processing",
        duration: 1000
      },
      {
        label: "Confirmation",
        icon: <CheckCircleIcon />,
        description: "Pre-authorization resolution completed",
        duration: 1000
      }
    ],
    post_service: [
      {
        label: "Verify Service Period",
        icon: <VerifiedUserIcon />,
        description: "Validating service date against authorization period",
        duration: 2000
      },
      {
        label: "Process Retro Auth",
        icon: <EditIcon />,
        description: "Processing retro authorization request",
        duration: 1500
      },
      {
        label: "Update Claim",
        icon: <SendIcon />,
        description: "Updating claim with retro authorization",
        duration: 1000
      },
      {
        label: "Confirmation",
        icon: <CheckCircleIcon />,
        description: "Post-service authorization completed",
        duration: 1000
      }
    ],
    retro_auth: [
      {
        label: "Verify Retro Criteria",
        icon: <VerifiedUserIcon />,
        description: "Validating retro authorization criteria",
        duration: 2000
      },
      {
        label: "Process Retro Request",
        icon: <EditIcon />,
        description: "Processing retro authorization request",
        duration: 1500
      },
      {
        label: "Update Auth Details",
        icon: <SendIcon />,
        description: "Updating claim with retro authorization",
        duration: 1000
      },
      {
        label: "Confirmation",
        icon: <CheckCircleIcon />,
        description: "Retro authorization completed",
        duration: 1000
      }
    ]
  },
  provider: {
    tin_mismatch: [
      {
        label: "Verify TIN Details",
        icon: <VerifiedUserIcon />,
        description: "Validating provider TIN information",
        duration: 2000
      },
      {
        label: "Update TIN Information",
        icon: <EditIcon />,
        description: "Updating claim with correct TIN",
        duration: 1500
      },
      {
        label: "Validate Enrollment",
        icon: <SendIcon />,
        description: "Validating provider enrollment status",
        duration: 1000
      },
      {
        label: "Confirmation",
        icon: <CheckCircleIcon />,
        description: "TIN mismatch resolution completed",
        duration: 1000
      }
    ],
    npi_validation: [
      {
        label: "Verify NPI Details",
        icon: <VerifiedUserIcon />,
        description: "Validating provider NPI information",
        duration: 2000
      },
      {
        label: "Update NPI Information",
        icon: <EditIcon />,
        description: "Updating claim with validated NPI",
        duration: 1500
      },
      {
        label: "Validate Credentials",
        icon: <SendIcon />,
        description: "Validating provider credentials",
        duration: 1000
      },
      {
        label: "Confirmation",
        icon: <CheckCircleIcon />,
        description: "NPI validation completed",
        duration: 1000
      }
    ],
    enrollment: [
      {
        label: "Verify Enrollment Status",
        icon: <VerifiedUserIcon />,
        description: "Validating provider enrollment status",
        duration: 2000
      },
      {
        label: "Process Enrollment",
        icon: <EditIcon />,
        description: "Processing provider enrollment application",
        duration: 1500
      },
      {
        label: "Update Enrollment",
        icon: <SendIcon />,
        description: "Updating claim with enrollment details",
        duration: 1000
      },
      {
        label: "Confirmation",
        icon: <CheckCircleIcon />,
        description: "Enrollment resolution completed",
        duration: 1000
      }
    ]
  },
  pricing: {
    fee_schedule: [
      {
        label: "Verify Fee Schedule",
        icon: <VerifiedUserIcon />,
        description: "Validating applicable fee schedule",
        duration: 2000
      },
      {
        label: "Calculate Amount",
        icon: <EditIcon />,
        description: "Calculating allowed amount",
        duration: 1500
      },
      {
        label: "Apply Pricing",
        icon: <SendIcon />,
        description: "Applying fee schedule pricing",
        duration: 1000
      },
      {
        label: "Confirmation",
        icon: <CheckCircleIcon />,
        description: "Fee schedule pricing completed",
        duration: 1000
      }
    ],
    contract_pricing: [
      {
        label: "Verify Contract",
        icon: <VerifiedUserIcon />,
        description: "Validating provider contract details",
        duration: 2000
      },
      {
        label: "Calculate Rate",
        icon: <EditIcon />,
        description: "Calculating contract rate",
        duration: 1500
      },
      {
        label: "Apply Contract Rate",
        icon: <SendIcon />,
        description: "Applying contract pricing",
        duration: 1000
      },
      {
        label: "Confirmation",
        icon: <CheckCircleIcon />,
        description: "Contract pricing completed",
        duration: 1000
      }
    ],
    special_pricing: [
      {
        label: "Verify Approval",
        icon: <VerifiedUserIcon />,
        description: "Validating special pricing approval",
        duration: 2000
      },
      {
        label: "Process Exception",
        icon: <EditIcon />,
        description: "Processing pricing exception",
        duration: 1500
      },
      {
        label: "Apply Special Rate",
        icon: <SendIcon />,
        description: "Applying special pricing",
        duration: 1000
      },
      {
        label: "Confirmation",
        icon: <CheckCircleIcon />,
        description: "Special pricing completed",
        duration: 1000
      }
    ]
  }
};

const AI_ANALYSIS_STEPS = [
  {
    label: 'Analyzing Claim Details',
    icon: <SearchIcon />,
    info: 'Reviewing claim data and extracting key information',
    duration: 1500,
  },
  {
    label: 'Checking Policy Guidelines',
    icon: <PolicyIcon />,
    info: 'Validating claim against policy rules and coverage',
    duration: 2000,
  },
  {
    label: 'Generating Resolution Options',
    icon: <LightbulbIcon />,
    info: 'AI is generating the best possible resolution paths',
    duration: 2500,
  },
  {
    label: 'Optimizing Solution',
    icon: <SpeedIcon />,
    info: 'Optimizing the selected solution for efficiency',
    duration: 1500,
  },
];

const POLICY_TYPES = {
  medicare: {
    name: "Medicare",
    icon: <LocalHospitalIcon />,
    color: "#1976d2",
    rules: [
      {
        id: "med-001",
        title: "Coverage Guidelines",
        description: "Medicare Part B coverage requirements for outpatient services",
        impact: "High",
        lastUpdated: "2024-03-01"
      },
      {
        id: "med-002",
        title: "Payment Rules",
        description: "Medicare payment methodologies and adjustments",
        impact: "High",
        lastUpdated: "2024-02-15"
      }
    ]
  },
  medicaid: {
    name: "Medicaid",
    icon: <AccountBalanceIcon />,
    color: "#2e7d32",
    rules: [
      {
        id: "med-001",
        title: "State-Specific Guidelines",
        description: "State Medicaid program requirements and limitations",
        impact: "High",
        lastUpdated: "2024-03-10"
      },
      {
        id: "med-002",
        title: "Eligibility Rules",
        description: "Medicaid eligibility and coverage criteria",
        impact: "Medium",
        lastUpdated: "2024-02-28"
      }
    ]
  },
  commercial: {
    name: "Commercial Plans",
    icon: <BusinessIcon />,
    color: "#ed6c02",
    rules: [
      {
        id: "com-001",
        title: "Plan Benefits",
        description: "Commercial insurance plan coverage and benefits",
        impact: "High",
        lastUpdated: "2024-03-05"
      },
      {
        id: "com-002",
        title: "Network Requirements",
        description: "In-network vs out-of-network coverage rules",
        impact: "Medium",
        lastUpdated: "2024-02-20"
      }
    ]
  }
};

const MOCK_POLICY_IMPACT = {
  claimId: "CLM-2024-001",
  policyType: "Medicare",
  impacts: [
    {
      type: "Coverage",
      description: "Service is covered under Medicare Part B",
      impact: "Positive",
      details: "Procedure code 99213 is covered for established patient office visit"
    },
    {
      type: "Payment",
      description: "Payment adjustment required",
      impact: "Neutral",
      details: "Standard Medicare payment rate applies"
    },
    {
      type: "Documentation",
      description: "Additional documentation needed",
      impact: "Negative",
      details: "Medical necessity documentation required"
    }
  ],
  timeline: [
    {
      date: "2024-03-15",
      event: "Claim Submitted",
      status: "Completed"
    },
    {
      date: "2024-03-16",
      event: "Policy Review",
      status: "Completed"
    },
    {
      date: "2024-03-17",
      event: "Payment Calculation",
      status: "In Progress"
    },
    {
      date: "2024-03-18",
      event: "Final Adjudication",
      status: "Pending"
    }
  ]
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: none; }
`;

const compactTableSx = {
  '& .MuiTableCell-root': { padding: '6px 8px', fontSize: 13 },
  '& .MuiTableHead-root .MuiTableCell-root': { fontWeight: 700, background: '#f5f6fa' },
  '& .MuiTableRow-root': { height: 36 },
};

// Compact styles for summary and AI analysis
const compactSummarySx = {
  p: 1.5,
  mb: 2,
  borderRadius: 2,
  boxShadow: 0,
  background: '#f8fafc',
};
const compactLabelSx = { fontSize: 13, color: 'text.secondary', fontWeight: 500, mb: 0.2 };
const compactValueSx = { fontSize: 14, fontWeight: 600, mb: 0.5 };
const compactTimelineSx = {
  '& .MuiTimelineItem-root': { minHeight: 36, mb: 0 },
  '& .MuiTimelineDot-root': { minWidth: 22, minHeight: 22, fontSize: 16 },
  '& .MuiTimelineContent-root': { py: 0.2, fontSize: 13 },
  '& .MuiTimelineOppositeContent-root': { fontSize: 12, pr: 1 },
  '& .MuiTypography-subtitle1': { fontSize: 13, fontWeight: 600 },
  '& .MuiTypography-body2': { fontSize: 12 },
};

// Utility to extract PEND code prefix
const getPendCodePrefix = (pendCode) => pendCode?.split('-')[0];

// Dynamic AI Analysis Steps based on PEND CODE
const getAIAnalysisSteps = (pendCode, resolutionType) => {
  const pendCodePrefix = getPendCodePrefix(pendCode);
  const pendDescription = PEND_CODES[pendCodePrefix]?.description || 'PEND CODE';
  return [
    {
      label: `Analyzing PEND CODE: ${pendDescription}`,
      icon: <SearchIcon />,
      info: `Reviewing ${pendDescription} requirements and context`,
      duration: 1200,
    },
    {
      label: 'Analyzing Claim Details',
      icon: <SearchIcon />,
      info: 'Reviewing claim data and extracting key information',
      duration: 1200,
    },
    {
      label: 'Checking Policy Guidelines',
      icon: <PolicyIcon />,
      info: 'Validating claim against policy rules and coverage',
      duration: 1200,
    },
    {
      label: `Generating Resolution Options for ${pendDescription}`,
      icon: <LightbulbIcon />,
      info: `AI is generating the best possible resolution paths for ${pendDescription}`,
      duration: 1500,
    },
    {
      label: 'Optimizing Solution',
      icon: <SpeedIcon />,
      info: 'Optimizing the selected solution for efficiency',
      duration: 1000,
    },
  ];
};

function ClaimCenterAIDialog({ open, onClose }) {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedResolution, setSelectedResolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState('in_progress');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isCompletingResolution, setIsCompletingResolution] = useState(false);
  const [currentCompletionStep, setCurrentCompletionStep] = useState(0);
  const [resolutionComplete, setResolutionComplete] = useState(false);
  const [selectedPolicyType, setSelectedPolicyType] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isAnalyzingPolicy, setIsAnalyzingPolicy] = useState(false);
  const [currentPolicyStep, setCurrentPolicyStep] = useState(0);
  const [showPolicyImpact, setShowPolicyImpact] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [postResolveStep, setPostResolveStep] = useState(null);
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const [showAdjudicationsDialog, setShowAdjudicationsDialog] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardTab, setDashboardTab] = useState(0);
  const [dashboardTimeRange, setDashboardTimeRange] = useState('monthly');
  const [showPredictiveInsights, setShowPredictiveInsights] = useState(false);
  const [showDashboardDialog, setShowDashboardDialog] = useState(false);

  const handleModuleSelect = (module) => {
    if (module.id === 'claims-policy') {
      setShowPolicyDialog(true);
    } else if (module.id === 'claim-adjudications') {
      setShowAdjudicationsDialog(true);
    } else {
      setSelectedModule(module);
    }
  };

  const handleBack = () => {
    if (selectedResolution) {
      setSelectedResolution(null);
    } else {
      setSelectedModule(null);
    }
  };

  const handleResolutionSelect = (type) => {
    setSelectedResolution(type);
    setPostResolveStep('resolution');
  };

  const handleClaimSelect = (claim) => {
    setSelectedClaim(claim);
    setPostResolveStep('summary');
    setSelectedResolution(null);
    setIsAnalyzing(false);
    setCurrentAnalysisStep(0);
    setShowSolution(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCompleteResolution = (type) => {
    setIsCompletingResolution(true);
    setCurrentCompletionStep(0);
    setResolutionComplete(false);
    setPostResolveStep('completing');

    const pendCodePrefix = getPendCodePrefix(selectedClaim.pendCode);
    const resolutionType = selectedClaim[`${type}Details`]?.resolutionType;
    
    if (pendCodePrefix && resolutionType) {
      const completionSteps = RESOLUTION_COMPLETION_STEPS[type]?.[resolutionType];
      if (completionSteps) {
        completionSteps.forEach((step, index) => {
          setTimeout(() => {
            setCurrentCompletionStep(index);
            if (index === completionSteps.length - 1) {
              setTimeout(() => {
                setResolutionComplete(true);
                setIsCompletingResolution(false);
              }, step.duration);
            }
          }, completionSteps.slice(0, index).reduce((acc, curr) => acc + curr.duration, 0));
        });
      }
    }
  };

  const handlePolicyTypeSelect = (type) => {
    setSelectedPolicyType(type);
    setIsAnalyzingPolicy(true);
    setCurrentPolicyStep(0);
    setShowPolicyImpact(false);
    
    // Simulate policy analysis
    setTimeout(() => {
      setIsAnalyzingPolicy(false);
      setShowPolicyImpact(true);
    }, 3000);
  };

  const handleRuleSelect = (rule) => {
    setSelectedRule(rule);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePolicyBack = () => {
    setSelectedPolicyType(null);
    setIsAnalyzingPolicy(false);
    setShowPolicyImpact(false);
    setActiveTab(0);
  };

  const handleHomeClick = () => {
    setSelectedModule(null);
    setSelectedPolicyType(null);
    setIsAnalyzingPolicy(false);
    setShowPolicyImpact(false);
    setActiveTab(0);
    setSelectedResolution(null);
    setCurrentCompletionStep(0);
    setResolutionComplete(false);
    setShowDashboard(false);
    setDashboardTab(0);
  };

  const handleDashboardOpen = () => {
    setShowDashboardDialog(true);
  };

  const handleDashboardClose = () => {
    setShowDashboardDialog(false);
    setDashboardTab(0);
    setDashboardTimeRange('monthly');
    setShowPredictiveInsights(false);
  };

  const handleDashboardTabChange = (event, newValue) => {
    setDashboardTab(newValue);
  };

  const handleTimeRangeChange = (event) => {
    setDashboardTimeRange(event.target.value);
  };

  const handleAnalyseClaims = () => {
    setPostResolveStep('analyzing');
    setIsAnalyzing(true);
    setCurrentAnalysisStep(0);
    setShowSolution(false);
    const pendCode = selectedClaim.pendCode;
    const aiAnalysisSteps = getAIAnalysisSteps(pendCode, null);
    aiAnalysisSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentAnalysisStep(index);
        if (index === aiAnalysisSteps.length - 1) {
          setTimeout(() => {
            setIsAnalyzing(false);
            setShowSolution(true);
            setPostResolveStep('options');
          }, step.duration);
        }
      }, aiAnalysisSteps.slice(0, index).reduce((acc, curr) => acc + curr.duration, 0));
    });
  };

  const handleBackFromOptions = () => {
    if (postResolveStep === 'options') {
      setPostResolveStep('summary');
      setSelectedResolution(null);
    } else if (postResolveStep === 'resolution') {
      setPostResolveStep('options');
      setSelectedResolution(null);
    }
  };

  const handleReturnToClaims = () => {
    setSelectedClaim(null);
    setPostResolveStep(null);
    setSelectedResolution(null);
    setIsAnalyzing(false);
    setCurrentAnalysisStep(0);
    setShowSolution(false);
  };

  const renderCompletionSteps = (type) => {
    // Get the resolutionType from the selected claim for the given type
    let resolutionType = null;
    if (type === 'authorization') {
      resolutionType = selectedClaim.authorizationDetails?.resolutionType;
    } else if (type === 'provider') {
      resolutionType = selectedClaim.providerDetails?.resolutionType;
    } else if (type === 'pricing') {
      resolutionType = selectedClaim.pricingDetails?.resolutionType;
    }
    const steps = RESOLUTION_COMPLETION_STEPS[type]?.[resolutionType] || [];

    return (
      <Box sx={{ mt: 2 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Completing Resolution
          </Typography>
          <Box sx={{ mt: 4, mb: 4 }}>
            {steps.length === 0 ? (
              <Typography color="text.secondary">No completion steps available.</Typography>
            ) : (
              steps.map((step, index) => (
                <Fade in={index <= currentCompletionStep} key={index}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ mr: 2 }}>
                        {step.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1">
                          {step.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {step.description}
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress 
                      variant={index === currentCompletionStep ? "indeterminate" : "determinate"}
                      value={index < currentCompletionStep ? 100 : 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Fade>
              ))
            )}
          </Box>
        </Paper>
      </Box>
    );
  };

  const renderResolutionComplete = () => (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Resolution Completed Successfully
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The claim has been updated and is ready for processing
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setSelectedClaim(null);
              setSelectedResolution(null);
              setResolutionComplete(false);
            }}
          >
            Return to Claims List
          </Button>
        </Box>
      </Paper>
    </Box>
  );

  const renderAuthorizationResolution = () => {
    const pendCodePrefix = getPendCodePrefix(selectedClaim.pendCode);
    const resolutionType = selectedClaim.authorizationDetails?.resolutionType;
    const aiSuggestions = pendCodePrefix && resolutionType ? PEND_CODES[pendCodePrefix]?.aiSuggestions[resolutionType] : null;
    const vendorIntegration = selectedClaim.authorizationDetails?.vendorIntegration;

    return (
      <Box sx={{ mt: 2 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Authorization Resolution
            </Typography>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setSelectedResolution(null)}
            >
              Back to Options
            </Button>
          </Box>
          <Stepper activeStep={2} alternativeLabel sx={{ mb: 3 }}>
            {RESOLUTION_STEPS.authorization[resolutionType]?.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Authorization Details
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${PEND_CODES[pendCodePrefix]?.description || 'Authorization Required'}`}
                        secondary={`Resolution Type: ${resolutionType?.replace('_', ' ').toUpperCase()}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Required Fields"
                        secondary={aiSuggestions?.requiredFields.join(', ')}
                      />
                    </ListItem>
                    {vendorIntegration && (
                      <ListItem>
                        <ListItemIcon>
                          <SyncIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Vendor Integration Required"
                          secondary={`${vendorIntegration.vendor} (${vendorIntegration.integrationType})`}
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    AI-Suggested Resolution Steps
                  </Typography>
                  <List>
                    {aiSuggestions?.steps.map((step, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AutoFixHighIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`Step ${index + 1}`}
                          secondary={step}
                        />
                      </ListItem>
                    ))}
                    {vendorIntegration && (
                      <>
                        <ListItem>
                          <ListItemIcon>
                            <SyncIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Vendor Integration Step"
                            secondary={`Connect to ${vendorIntegration.vendor} using ${vendorIntegration.integrationType} integration`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <VerifiedUserIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Verify Integration"
                            secondary={`Validate response from ${vendorIntegration.endpoint} endpoint`}
                          />
                        </ListItem>
                      </>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleCompleteResolution('authorization')}
              disabled={isCompletingResolution}
            >
              Apply Resolution
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  const renderProviderResolution = () => {
    const pendCodePrefix = getPendCodePrefix(selectedClaim.pendCode);
    const resolutionType = selectedClaim.providerDetails?.resolutionType;
    const aiSuggestions = pendCodePrefix && resolutionType ? PEND_CODES[pendCodePrefix]?.aiSuggestions[resolutionType] : null;
    const vendorIntegration = selectedClaim.providerDetails?.vendorIntegration;

    return (
      <Box sx={{ mt: 2 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Provider Resolution
            </Typography>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setSelectedResolution(null)}
            >
              Back to Options
            </Button>
          </Box>
          <Stepper activeStep={2} alternativeLabel sx={{ mb: 3 }}>
            {RESOLUTION_STEPS.provider[resolutionType]?.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Provider Details
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <ErrorIcon color="error" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${PEND_CODES[pendCodePrefix]?.description || 'Provider Issues'}`}
                        secondary={`Resolution Type: ${resolutionType?.replace('_', ' ').toUpperCase()}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Required Fields"
                        secondary={aiSuggestions?.requiredFields.join(', ')}
                      />
                    </ListItem>
                    {vendorIntegration && (
                      <ListItem>
                        <ListItemIcon>
                          <SyncIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Vendor Integration Required"
                          secondary={`${vendorIntegration.vendor} (${vendorIntegration.integrationType})`}
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    AI-Suggested Resolution Steps
                  </Typography>
                  <List>
                    {aiSuggestions?.steps.map((step, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AutoFixHighIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`Step ${index + 1}`}
                          secondary={step}
                        />
                      </ListItem>
                    ))}
                    {vendorIntegration && (
                      <>
                        <ListItem>
                          <ListItemIcon>
                            <SyncIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Vendor Integration Step"
                            secondary={`Connect to ${vendorIntegration.vendor} using ${vendorIntegration.integrationType} integration`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <VerifiedUserIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Verify Integration"
                            secondary={`Validate response from ${vendorIntegration.endpoint} endpoint`}
                          />
                        </ListItem>
                      </>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleCompleteResolution('provider')}
              disabled={isCompletingResolution}
            >
              Apply Resolution
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  const renderPricingResolution = () => {
    const pendCodePrefix = getPendCodePrefix(selectedClaim.pendCode);
    const resolutionType = selectedClaim.pricingDetails?.resolutionType;
    const aiSuggestions = pendCodePrefix && resolutionType ? PEND_CODES[pendCodePrefix]?.aiSuggestions[resolutionType] : null;
    const vendorIntegration = selectedClaim.pricingDetails?.vendorIntegration;

    return (
      <Box sx={{ mt: 2 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Pricing Resolution
            </Typography>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setSelectedResolution(null)}
            >
              Back to Options
            </Button>
          </Box>
          <Stepper activeStep={2} alternativeLabel sx={{ mb: 3 }}>
            {RESOLUTION_STEPS.pricing[resolutionType]?.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Pricing Details
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <AttachMoneyIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${PEND_CODES[pendCodePrefix]?.description || 'Pricing Issues'}`}
                        secondary={`Resolution Type: ${resolutionType?.replace('_', ' ').toUpperCase()}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <InfoIcon color="info" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Required Fields"
                        secondary={aiSuggestions?.requiredFields.join(', ')}
                      />
                    </ListItem>
                    {vendorIntegration && (
                      <ListItem>
                        <ListItemIcon>
                          <SyncIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Vendor Integration Required"
                          secondary={`${vendorIntegration.vendor} (${vendorIntegration.integrationType})`}
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    AI-Suggested Resolution Steps
                  </Typography>
                  <List>
                    {aiSuggestions?.steps.map((step, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AutoFixHighIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`Step ${index + 1}`}
                          secondary={step}
                        />
                      </ListItem>
                    ))}
                    {vendorIntegration && (
                      <>
                        <ListItem>
                          <ListItemIcon>
                            <SyncIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Vendor Integration Step"
                            secondary={`Connect to ${vendorIntegration.vendor} using ${vendorIntegration.integrationType} integration`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <VerifiedUserIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Verify Integration"
                            secondary={`Validate response from ${vendorIntegration.endpoint} endpoint`}
                          />
                        </ListItem>
                      </>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleCompleteResolution('pricing')}
              disabled={isCompletingResolution}
            >
              Apply Resolution
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  const renderClaimPendResolution = () => (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Claim Details
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Claim ID: {selectedClaim.claimId}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Patient: {selectedClaim.patientName}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Service Date: {selectedClaim.serviceDate}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Provider: {selectedClaim.provider}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Amount: {selectedClaim.amount}
            </Typography>
            <Chip 
              label={selectedClaim.status}
              color={selectedClaim.status === 'PENDING' ? 'warning' : 'error'}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          Resolution Options
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card 
              variant="outlined"
              sx={{ 
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 }
              }}
              onClick={() => handleResolutionSelect('authorization')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VerifiedUserIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Authorization Resolution
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Resolve missing authorization issues and suggest next steps
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              variant="outlined"
              sx={{ 
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 }
              }}
              onClick={() => handleResolutionSelect('provider')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Provider Edit Resolution
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Handle TIN/NPI mismatches and enrollment issues
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              variant="outlined"
              sx={{ 
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 }
              }}
              onClick={() => handleResolutionSelect('pricing')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    Pricing Edit Resolution
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Resolve pricing issues and suggest overrides
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );

  const renderClaimSelection = () => (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Pending & Rejected Claims
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DashboardIcon />}
              onClick={handleDashboardOpen}
              sx={{
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                }
              }}
            >
              View Claim Dashboard
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              startIcon={<SortIcon />}
            >
              Sort
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 0, borderRadius: 2, ...compactTableSx }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Claim ID</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>PEND CODE</TableCell>
                <TableCell>Pend Reason</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Days in Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MOCK_CLAIMS
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((claim) => (
                  <TableRow 
                    key={claim.claimId}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleClaimSelect(claim)}
                  >
                    <TableCell>{claim.claimId}</TableCell>
                    <TableCell>{claim.patientName}</TableCell>
                    <TableCell>{claim.provider}</TableCell>
                    <TableCell>{claim.amount}</TableCell>
                    <TableCell>
                      <Chip
                        label={claim.status}
                        color={claim.status === 'PENDING' ? 'warning' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={claim.pendCode}
                        color={
                          claim.pendCode?.startsWith('AUTH') ? 'error' :
                          claim.pendCode?.startsWith('PROV') ? 'warning' : 'info'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{claim.pendReason}</TableCell>
                    <TableCell>
                      <Chip
                        label={claim.priority}
                        color={
                          claim.priority === 'High' ? 'error' :
                          claim.priority === 'Medium' ? 'warning' : 'success'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{claim.daysInPending}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AutoAwesomeIcon />}
                        onClick={e => { e.stopPropagation(); handleClaimSelect(claim); }}
                      >
                        Resolve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={MOCK_CLAIMS.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );

  const renderAIAnalysis = () => {
    const pendCode = selectedClaim.pendCode;
    const resolutionType = selectedResolution && selectedClaim[`${selectedResolution}Details`]?.resolutionType;
    const aiAnalysisSteps = getAIAnalysisSteps(pendCode, resolutionType);
    const step = aiAnalysisSteps[currentAnalysisStep];
    return (
      <Box sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 220 }}>
        <Fade in={true} key={step.label} timeout={600}>
          <Box sx={{ textAlign: 'center', width: 360 }}>
            <Box sx={{ mb: 2 }}>{step.icon}</Box>
            <Typography variant="h6" gutterBottom>AI Analysis in Progress</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{step.label}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{step.info}</Typography>
            <LinearProgress color="primary" sx={{ height: 8, borderRadius: 4, mb: 2 }} />
          </Box>
        </Fade>
      </Box>
    );
  };

  const renderAIAnalysisReport = () => {
    const pendCode = selectedClaim.pendCode;
    const pendCodePrefix = getPendCodePrefix(pendCode);
    const pendMeta = PEND_CODES[pendCodePrefix] || {};
    const pendReason = selectedClaim.pendReason;
    const priority = selectedClaim.priority;
    const daysInPending = selectedClaim.daysInPending;
    const status = selectedClaim.status;
    const claimId = selectedClaim.claimId;
    const patientName = selectedClaim.patientName;
    const provider = selectedClaim.provider;
    const serviceDate = selectedClaim.serviceDate;
    const amount = selectedClaim.amount;

    // Find the most relevant details and required fields
    let requiredFields = [];
    let aiSteps = [];
    let resolutionType = null;
    let detailsSection = null;
    let sectionIcon = null;
    let sectionColor = null;
    if (pendCodePrefix === 'AUTH') {
      resolutionType = selectedClaim.authorizationDetails?.resolutionType;
      requiredFields = pendMeta.aiSuggestions?.[resolutionType]?.requiredFields || [];
      aiSteps = pendMeta.aiSuggestions?.[resolutionType]?.steps || [];
      detailsSection = (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <VerifiedUserIcon color="primary" />
          <Typography variant="subtitle2">Authorization Status: <b>{selectedClaim.authorizationDetails?.status}</b></Typography>
          <Chip label={selectedClaim.authorizationDetails?.urgency} color="error" size="small" sx={{ ml: 1 }} />
          <Chip label={selectedClaim.authorizationDetails?.type} color="info" size="small" sx={{ ml: 1 }} />
        </Box>
      );
      sectionIcon = <VerifiedUserIcon sx={{ color: '#1976d2', fontSize: 32 }} />;
      sectionColor = '#e3f2fd';
    } else if (pendCodePrefix === 'PROV') {
      resolutionType = selectedClaim.providerDetails?.resolutionType;
      requiredFields = pendMeta.aiSuggestions?.[resolutionType]?.requiredFields || [];
      aiSteps = pendMeta.aiSuggestions?.[resolutionType]?.steps || [];
      detailsSection = (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <PersonIcon color="warning" />
          <Typography variant="subtitle2">Provider: <b>{selectedClaim.providerDetails?.name}</b></Typography>
          <Chip label={selectedClaim.providerDetails?.status} color="success" size="small" sx={{ ml: 1 }} />
          <Chip label={selectedClaim.providerDetails?.specialty} color="info" size="small" sx={{ ml: 1 }} />
        </Box>
      );
      sectionIcon = <PersonIcon sx={{ color: '#ed6c02', fontSize: 32 }} />;
      sectionColor = '#fff3e0';
    } else if (pendCodePrefix === 'PRIC') {
      resolutionType = selectedClaim.pricingDetails?.resolutionType;
      requiredFields = pendMeta.aiSuggestions?.[resolutionType]?.requiredFields || [];
      aiSteps = pendMeta.aiSuggestions?.[resolutionType]?.steps || [];
      detailsSection = (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <AttachMoneyIcon color="success" />
          <Typography variant="subtitle2">Billed: <b>{selectedClaim.pricingDetails?.billedAmount}</b></Typography>
          <Chip label={selectedClaim.pricingDetails?.pricingRule} color="info" size="small" sx={{ ml: 1 }} />
          <Chip label={selectedClaim.pricingDetails?.overrideEligible ? 'Override Eligible' : 'No Override'} color={selectedClaim.pricingDetails?.overrideEligible ? 'success' : 'default'} size="small" sx={{ ml: 1 }} />
        </Box>
      );
      sectionIcon = <AttachMoneyIcon sx={{ color: '#2e7d32', fontSize: 32 }} />;
      sectionColor = '#e8f5e9';
    }

    return (
      <Box sx={{ mt: 2, mb: 4, width: '100%', px: { xs: 1, sm: 3, md: 5 }, borderRadius: 4, bgcolor: sectionColor, p: 3, boxShadow: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {sectionIcon}
          <Typography variant="h6" gutterBottom sx={{ flex: 1 }}>AI Analysis Report</Typography>
          <Chip label={status} color={status === 'PENDING' ? 'warning' : 'error'} size="small" />
          <Chip label={priority} color={priority === 'High' ? 'error' : priority === 'Medium' ? 'warning' : 'success'} size="small" />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <InfoIcon color="info" />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Why is this claim pending?
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mb: 2, ml: 4 }}>{pendReason ? pendReason : 'No reason provided.'}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <PolicyIcon color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>PEND CODE:</Typography>
          <Chip label={pendCode} color={pendCodePrefix === 'AUTH' ? 'error' : pendCodePrefix === 'PROV' ? 'warning' : 'info'} size="small" />
          <Typography variant="body2">{pendMeta.description}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <EventIcon color="secondary" />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Days in Status:</Typography>
          <Chip label={daysInPending} color="secondary" size="small" />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AssignmentIcon color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Claim:</Typography>
          <Typography variant="body2">{claimId}</Typography>
          <PersonIcon color="info" sx={{ ml: 2 }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Patient:</Typography>
          <Typography variant="body2">{patientName}</Typography>
          <LocalHospitalIcon color="success" sx={{ ml: 2 }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Provider:</Typography>
          <Typography variant="body2">{provider}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CalendarMonthIcon color="info" />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Service Date:</Typography>
          <Typography variant="body2">{serviceDate}</Typography>
          <AttachMoneyIcon color="success" sx={{ ml: 2 }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Amount:</Typography>
          <Typography variant="body2">{amount}</Typography>
        </Box>
        {detailsSection}
        {requiredFields.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 1 }}>
            <WarningIcon color="warning" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Missing/Required Information:</Typography>
            {requiredFields.map((field, idx) => (
              <Chip key={field} label={field} color="warning" size="small" sx={{ ml: 1 }} />
            ))}
          </Box>
        )}
        {aiSteps.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AutoFixHighIcon color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}><b>AI Recommended Next Steps:</b></Typography>
            </Box>
            <ol style={{ margin: 0, paddingLeft: 24 }}>
              {aiSteps.map((step, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>
                  <Typography variant="body2">{step}</Typography>
                </li>
              ))}
            </ol>
          </Box>
        )}
      </Box>
    );
  };

  const renderClaimSummary = () => (
    <Box sx={compactSummarySx}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography sx={compactLabelSx}>Claim ID</Typography>
          <Typography sx={compactValueSx}>{selectedClaim.claimId}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={compactLabelSx}>Patient</Typography>
          <Typography sx={compactValueSx}>{selectedClaim.patientName}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={compactLabelSx}>Service Date</Typography>
          <Typography sx={compactValueSx}>{selectedClaim.serviceDate}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={compactLabelSx}>Provider</Typography>
          <Typography sx={compactValueSx}>{selectedClaim.provider}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={compactLabelSx}>Amount</Typography>
          <Typography sx={compactValueSx}>{selectedClaim.amount}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={compactLabelSx}>Status</Typography>
          <Chip
            label={selectedClaim.status}
            color={selectedClaim.status === 'PENDING' ? 'warning' : 'error'}
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <Typography sx={compactLabelSx}>Pend Reason</Typography>
          <Typography sx={compactValueSx}>{selectedClaim.pendReason}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={compactLabelSx}>PEND CODE</Typography>
          <Chip
            label={selectedClaim.pendCode}
            color={
              selectedClaim.pendCode?.startsWith('AUTH') ? 'error' :
              selectedClaim.pendCode?.startsWith('PROV') ? 'warning' : 'info'
            }
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <Typography sx={compactLabelSx}>Priority</Typography>
          <Chip
            label={selectedClaim.priority}
            color={
              selectedClaim.priority === 'High' ? 'error' :
              selectedClaim.priority === 'Medium' ? 'warning' : 'success'
            }
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <Typography sx={compactLabelSx}>Days in Status</Typography>
          <Typography sx={compactValueSx}>{selectedClaim.daysInPending}</Typography>
        </Grid>
      </Grid>
    </Box>
  );

  const renderPolicyAnalysis = () => (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handlePolicyBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            Analyzing Policy Impact
          </Typography>
        </Box>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Timeline>
            <TimelineItem>
              <TimelineOppositeContent>
                <Typography variant="body2" color="text.secondary">
                  Step 1
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <SearchIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle1">
                  Identifying Applicable Policies
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Matching claim details with policy rules
                </Typography>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent>
                <Typography variant="body2" color="text.secondary">
                  Step 2
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <AssessmentIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle1">
                  Analyzing Policy Impact
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Evaluating policy effects on claim
                </Typography>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent>
                <Typography variant="body2" color="text.secondary">
                  Step 3
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <TrendingUpIcon />
                </TimelineDot>
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle1">
                  Generating Recommendations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Creating policy-based solutions
                </Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Box>
      </Paper>
    </Box>
  );

  const renderPolicyImpact = () => (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handlePolicyBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            Policy Impact Analysis
          </Typography>
        </Box>
        
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Impact Summary" />
          <Tab label="Policy Details" />
          <Tab label="Timeline" />
        </Tabs>

        {activeTab === 0 && (
          <Grid container spacing={3}>
            {MOCK_POLICY_IMPACT.impacts.map((impact, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        color: impact.impact === 'Positive' ? 'success.main' : 
                               impact.impact === 'Negative' ? 'error.main' : 'warning.main',
                        mr: 1
                      }}>
                        {impact.impact === 'Positive' ? <TrendingUpIcon /> :
                         impact.impact === 'Negative' ? <CompareArrowsIcon /> :
                         <AssessmentIcon />}
                      </Box>
                      <Typography variant="subtitle1">
                        {impact.type}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {impact.description}
                    </Typography>
                    <Typography variant="body2">
                      {impact.details}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 1 && (
          <Box>
            {POLICY_TYPES[selectedPolicyType.toLowerCase()].rules.map((rule) => (
              <Accordion key={rule.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ mr: 2 }}>
                      <GavelIcon color="primary" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1">
                        {rule.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated: {rule.lastUpdated}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" paragraph>
                    {rule.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label={`Impact: ${rule.impact}`}
                      color={
                        rule.impact === 'High' ? 'error' :
                        rule.impact === 'Medium' ? 'warning' : 'success'
                      }
                      size="small"
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        {activeTab === 2 && (
          <Timeline>
            {MOCK_POLICY_IMPACT.timeline.map((item, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent>
                  <Typography variant="body2" color="text.secondary">
                    {item.date}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={
                    item.status === 'Completed' ? 'success' :
                    item.status === 'In Progress' ? 'primary' : 'grey'
                  }>
                    {item.status === 'Completed' ? <CheckCircleIcon /> :
                     item.status === 'In Progress' ? <PendingIcon /> :
                     <HistoryIcon />}
                  </TimelineDot>
                  {index < MOCK_POLICY_IMPACT.timeline.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="subtitle1">
                    {item.event}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {item.status}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Paper>
    </Box>
  );

  const renderClaimsPolicy = () => (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => setSelectedModule(null)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            Policy Types
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {Object.entries(POLICY_TYPES).map(([key, policy]) => (
            <Grid item xs={12} md={4} key={key}>
              <Card 
                variant="outlined"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 3 }
                }}
                onClick={() => handlePolicyTypeSelect(policy.name)}
              >
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 2
                  }}>
                    <Box sx={{ 
                      color: policy.color,
                      mb: 2
                    }}>
                      {policy.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {policy.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {policy.rules.length} active rules
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );

  const renderPostResolveFlow = () => {
    if (!selectedClaim) return null;
    if (postResolveStep === 'summary') {
      return (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ p: 0, mb: 0, width: '100%', maxWidth: 600 }}>
            <Typography variant="h5" gutterBottom align="center">Claim Summary</Typography>
            {renderClaimSummary()}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleAnalyseClaims}
                sx={{ px: 6, py: 2, fontSize: 18, borderRadius: 3, boxShadow: 2 }}
                startIcon={<AutoAwesomeIcon />}
              >
                Analyse Claims
              </Button>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button variant="text" onClick={handleReturnToClaims}>Back to Claims List</Button>
            </Box>
          </Box>
        </Box>
      );
    }
    if (postResolveStep === 'analyzing') {
      return (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 320 }}>
          {renderAIAnalysis()}
        </Box>
      );
    }
    if (postResolveStep === 'options') {
      return (
        <Box sx={{ mt: 2, width: '100%', maxWidth: 700, mx: 'auto' }}>
          {renderAIAnalysisReport()}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 4 }}>
            <Typography variant="h6">Resolution Options</Typography>
            <Button startIcon={<ArrowBackIcon />} onClick={handleBackFromOptions}>Back</Button>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6, borderColor: 'primary.main' }, borderRadius: 3 }}
                onClick={() => handleResolutionSelect('authorization')}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <VerifiedUserIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">Authorization</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Resolve missing authorization issues</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6, borderColor: 'primary.main' }, borderRadius: 3 }}
                onClick={() => handleResolutionSelect('provider')}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">Provider Edit</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Handle TIN/NPI mismatches and enrollment</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                variant="outlined"
                sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6, borderColor: 'primary.main' }, borderRadius: 3 }}
                onClick={() => handleResolutionSelect('pricing')}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">Pricing Edit</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Resolve pricing issues and suggest overrides</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      );
    }
    if (postResolveStep === 'resolution') {
      return (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ p: 0, mb: 0, width: '100%', maxWidth: 800 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{selectedResolution} Resolution</Typography>
              <Button startIcon={<ArrowBackIcon />} onClick={handleBackFromOptions}>Back</Button>
            </Box>
            {selectedResolution === 'authorization' && renderAuthorizationResolution()}
            {selectedResolution === 'provider' && renderProviderResolution()}
            {selectedResolution === 'pricing' && renderPricingResolution()}
          </Box>
        </Box>
      );
    }
    if (postResolveStep === 'completing') {
      return (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {renderClaimSummary()}
          {renderCompletionSteps(selectedResolution)}
        </Box>
      );
    }
    if (postResolveStep === 'complete') {
      return (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {renderClaimSummary()}
          {renderResolutionComplete()}
        </Box>
      );
    }
    return null;
  };

  const renderModuleContent = () => {
    if (!selectedModule) return null;

    if (selectedModule.id === 'claim-pend-resolution') {
      if (!selectedClaim) {
        return renderClaimSelection();
      }

      if (isAnalyzing) {
        return (
          <>
            {renderClaimSummary()}
            {renderAIAnalysis()}
          </>
        );
      }

      if (isCompletingResolution) {
        return (
          <>
            {renderClaimSummary()}
            {renderCompletionSteps(selectedResolution)}
          </>
        );
      }

      if (resolutionComplete) {
        return (
          <>
            {renderClaimSummary()}
            {renderResolutionComplete()}
          </>
        );
      }

      if (showSolution) {
        if (selectedResolution === 'authorization') {
          return (
            <>
              {renderClaimSummary()}
              {renderAuthorizationResolution()}
            </>
          );
        } else if (selectedResolution === 'provider') {
          return (
            <>
              {renderClaimSummary()}
              {renderProviderResolution()}
            </>
          );
        } else if (selectedResolution === 'pricing') {
          return (
            <>
              {renderClaimSummary()}
              {renderPricingResolution()}
            </>
          );
        } else {
          return (
            <>
              {renderClaimSummary()}
              {renderClaimPendResolution()}
            </>
          );
        }
      }
    }

    if (selectedModule.id === 'claims-policy') {
      if (isAnalyzingPolicy) {
        return renderPolicyAnalysis();
      }

      if (showPolicyImpact) {
        return renderPolicyImpact();
      }

      return renderClaimsPolicy();
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            {selectedModule.name}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          {selectedModule.description}
        </Typography>
      </Box>
    );
  };

  const handleTileClick = (moduleId) => {
    if (moduleId === 'policy') {
      setShowPolicyDialog(true);
    } else {
      setSelectedModule(moduleId);
    }
  };

  const renderKPICards = () => {
    const { kpis } = DASHBOARD_DATA;
    const kpiData = [
      {
        title: 'Total Claims',
        value: kpis.totalClaims.toLocaleString(),
        icon: <AssignmentIcon />,
        color: '#1976d2',
        trend: '+12.5%',
        trendDirection: 'up'
      },
      {
        title: 'Pending Claims',
        value: kpis.pendingClaims,
        icon: <PendingIcon />,
        color: '#ff9800',
        trend: '-8.2%',
        trendDirection: 'down'
      },
      {
        title: 'Rejected Claims',
        value: kpis.rejectedClaims,
        icon: <ErrorIcon />,
        color: '#f44336',
        trend: '-15.3%',
        trendDirection: 'down'
      },
      {
        title: 'Approved Claims',
        value: kpis.approvedClaims.toLocaleString(),
        icon: <CheckCircleIcon />,
        color: '#4caf50',
        trend: '+18.7%',
        trendDirection: 'up'
      },
      {
        title: 'Avg Processing Time',
        value: `${kpis.averageProcessingTime} days`,
        icon: <SpeedIcon />,
        color: '#9c27b0',
        trend: '-21.7%',
        trendDirection: 'down'
      },
      {
        title: 'Accuracy Rate',
        value: `${kpis.accuracyRate}%`,
        icon: <VerifiedUserIcon />,
        color: '#00bcd4',
        trend: '+1.8%',
        trendDirection: 'up'
      }
    ];

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                p: 3, 
                background: `linear-gradient(135deg, ${kpi.color}15 0%, ${kpi.color}05 100%)`,
                border: `1px solid ${kpi.color}30`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${kpi.color}20`,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: kpi.color, mb: 1 }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {kpi.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {kpi.trendDirection === 'up' ? (
                      <KeyboardArrowUpIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                    ) : (
                      <KeyboardArrowDownIcon sx={{ color: '#f44336', fontSize: 20 }} />
                    )}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: kpi.trendDirection === 'up' ? '#4caf50' : '#f44336',
                        fontWeight: 600 
                      }}
                    >
                      {kpi.trend}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  background: `${kpi.color}15`,
                  color: kpi.color 
                }}>
                  {kpi.icon}
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderTrendChart = () => {
    const data = dashboardTimeRange === 'monthly' ? DASHBOARD_DATA.trends.monthly : DASHBOARD_DATA.trends.weekly;
    const xAxis = dashboardTimeRange === 'monthly' ? 'month' : 'week';
    const COLORS = { pending: '#ff9800', rejected: '#f44336', approved: '#4caf50' };

    // Calculate trend summary
    const pendingChange = data.length > 1 ? data[data.length-1].pending - data[0].pending : 0;
    const trendSummary = pendingChange < 0 ? 'Pending claims are decreasing over time.' : pendingChange > 0 ? 'Pending claims are increasing over time.' : 'Pending claims are stable.';

    // Highlights
    const bestMonth = data.reduce((a, b) => (a.approved > b.approved ? a : b));
    const worstMonth = data.reduce((a, b) => (a.rejected > b.rejected ? a : b));
    const lowestPending = data.reduce((a, b) => (a.pending < b.pending ? a : b));
    const aiHighlight = `March saw the sharpest drop in rejections, while ${bestMonth[xAxis]} had the highest approvals.`;

    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Claims Trend Analysis</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={dashboardTimeRange}
              onChange={handleTimeRangeChange}
              displayEmpty
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <ResponsiveContainer width="100%" height={280} minWidth={320}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey="pending" stroke={COLORS.pending} strokeWidth={3} dot={{ r: 5 }} name="Pending" />
            <Line type="monotone" dataKey="rejected" stroke={COLORS.rejected} strokeWidth={3} dot={{ r: 5 }} name="Rejected" />
            <Line type="monotone" dataKey="approved" stroke={COLORS.approved} strokeWidth={3} dot={{ r: 5 }} name="Approved" />
          </LineChart>
        </ResponsiveContainer>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{trendSummary}</Typography>
          <Typography variant="body2" color="text.secondary">
            This chart shows the monthly/weekly trend of pending, rejected, and approved claims. Use this to spot operational bottlenecks and improvement opportunities.
          </Typography>
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Card sx={{ p: 2, minWidth: 180, borderLeft: '5px solid #4caf50', boxShadow: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">Best Month</Typography>
            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700 }}>{bestMonth[xAxis]}</Typography>
            <Typography variant="body2">Approved: {bestMonth.approved}</Typography>
          </Card>
          <Card sx={{ p: 2, minWidth: 180, borderLeft: '5px solid #f44336', boxShadow: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">Most Rejected</Typography>
            <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 700 }}>{worstMonth[xAxis]}</Typography>
            <Typography variant="body2">Rejected: {worstMonth.rejected}</Typography>
          </Card>
          <Card sx={{ p: 2, minWidth: 180, borderLeft: '5px solid #ff9800', boxShadow: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">Lowest Pending</Typography>
            <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 700 }}>{lowestPending[xAxis]}</Typography>
            <Typography variant="body2">Pending: {lowestPending.pending}</Typography>
          </Card>
        </Box>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>AI Insight</Typography>
          <Typography variant="body2" color="text.secondary">{aiHighlight}</Typography>
        </Box>
      </Card>
    );
  };

  const renderPendCodeChart = () => {
    const { pendCodeDistribution } = DASHBOARD_DATA;
    const COLORS = ['#f44336', '#ff9800', '#2196f3'];
    const PEND_DESCRIPTIONS = {
      AUTH: 'Authorization Issues',
      PROV: 'Provider Issues',
      PRIC: 'Pricing Issues',
    };

    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>PEND Code Distribution</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Box sx={{ width: 480, maxWidth: '98vw', mb: 1 }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pendCodeDistribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="code" tick={{ fontWeight: 700 }} />
                <YAxis allowDecimals={false} />
                <RechartsTooltip formatter={(value, name, props) => [`${value} claims`, 'Count']} />
                <Bar dataKey="count">
                  {pendCodeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
            {pendCodeDistribution.map((item, idx) => (
              <Card key={item.code} sx={{ p: 2, minWidth: 140, textAlign: 'center', boxShadow: 1, borderRadius: 2, border: `2px solid ${COLORS[idx]}` }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: '50%', bgcolor: COLORS[idx],
                  mx: 'auto', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 18
                }}>{item.code}</Box>
                <Typography variant="h6" sx={{ color: COLORS[idx], fontWeight: 700 }}>{item.count}</Typography>
                <Typography variant="body2" color="text.secondary">{item.percentage}%</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>{PEND_DESCRIPTIONS[item.code]}</Typography>
              </Card>
            ))}
          </Box>
        </Box>
      </Card>
    );
  };

  const renderRootCauseAnalysis = () => {
    const { rootCauseAnalysis } = DASHBOARD_DATA;
    const mostCommon = rootCauseAnalysis[0];
    const aiSuggestions = [
      'Ensure pre-service authorization workflows are automated and provider-facing.',
      'Educate providers on common documentation gaps.',
      'Implement real-time eligibility and TIN/NPI validation.'
    ];
    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Root Cause Analysis</Typography>
        <Grid container spacing={3}>
          {rootCauseAnalysis.map((cause, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                variant="outlined" 
                sx={{ 
                  p: 2,
                  borderColor: cause.impact === 'High' ? '#f44336' : 
                               cause.impact === 'Medium' ? '#ff9800' : '#4caf50'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {cause.cause}
                  </Typography>
                  <Chip 
                    label={cause.impact} 
                    color={cause.impact === 'High' ? 'error' : 
                           cause.impact === 'Medium' ? 'warning' : 'success'}
                    size="small"
                  />
                </Box>
                <Typography variant="h4" sx={{ color: 'primary.main', mb: 1 }}>
                  {cause.frequency}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  occurrences
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {cause.trend === 'decreasing' ? (
                    <TrendingDownIcon sx={{ color: '#4caf50', fontSize: 20, mr: 1 }} />
                  ) : cause.trend === 'increasing' ? (
                    <TrendingUpIcon sx={{ color: '#f44336', fontSize: 20, mr: 1 }} />
                  ) : (
                    <CompareArrowsIcon sx={{ color: '#ff9800', fontSize: 20, mr: 1 }} />
                  )}
                  <Typography variant="body2" sx={{ 
                    color: cause.trend === 'decreasing' ? '#4caf50' : 
                           cause.trend === 'increasing' ? '#f44336' : '#ff9800'
                  }}>
                    {cause.trend} trend
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {cause.resolution}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Most Common Root Cause: <span style={{ color: '#f44336' }}>{mostCommon.cause}</span>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <b>AI Suggestion:</b> {mostCommon.resolution}. Addressing this can reduce high-priority pends by up to 30%.
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Top 3 Actionable Steps:</Typography>
          <ol style={{ margin: 0, paddingLeft: 24 }}>
            {aiSuggestions.map((s, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                <Typography variant="body2">{s}</Typography>
              </li>
            ))}
          </ol>
        </Box>
      </Card>
    );
  };

  const renderPredictiveAnalytics = () => {
    const { predictiveAnalytics, pendCodeDistribution } = DASHBOARD_DATA;
    // Example: Predict AUTH pends drop, PROV rise, PRIC stable
    const pendPredictions = [
      { code: 'AUTH', change: -10, text: 'Expected to drop 10% next month due to improved pre-auth workflows.' },
      { code: 'PROV', change: 8, text: 'Likely to rise 8% as new provider enrollments increase.' },
      { code: 'PRIC', change: 0, text: 'Stable, no significant change expected.' }
    ];
    const aiSummary = 'AI predicts a reduction in authorization pends, but provider issues may increase. Focus on provider onboarding and real-time validation to mitigate risk.';
    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Predictive Analytics</Typography>
          <Button
            variant="outlined"
            startIcon={<AutoAwesomeIcon />}
            onClick={() => setShowPredictiveInsights(!showPredictiveInsights)}
          >
            {showPredictiveInsights ? 'Hide Insights' : 'Show Insights'}
          </Button>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>PEND Code Prediction</Typography>
              <Grid container spacing={2}>
                {pendPredictions.map((p, idx) => (
                  <Grid item xs={12} sm={4} key={p.code}>
                    <Card sx={{ p: 1, textAlign: 'center', borderLeft: `5px solid ${pendCodeDistribution[idx].color}` }}>
                      <Typography variant="subtitle2" sx={{ color: pendCodeDistribution[idx].color, fontWeight: 700 }}>{p.code}</Typography>
                      <Typography variant="h6" sx={{ color: p.change < 0 ? '#4caf50' : p.change > 0 ? '#f44336' : '#2196f3', fontWeight: 700 }}>{p.change > 0 ? '+' : ''}{p.change}%</Typography>
                      <Typography variant="body2" color="text.secondary">{p.text}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Card>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Next Week Prediction</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Pending Claims:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {predictiveAnalytics.nextWeekPrediction.pendingClaims}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Rejected Claims:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {predictiveAnalytics.nextWeekPrediction.rejectedClaims}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Approved Claims:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {predictiveAnalytics.nextWeekPrediction.approvedClaims}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Confidence:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {predictiveAnalytics.nextWeekPrediction.confidence}%
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Risk Factors</Typography>
              {predictiveAnalytics.riskFactors.map((factor, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{factor.factor}:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={factor.risk} 
                      color={factor.risk === 'High' ? 'error' : 
                             factor.risk === 'Medium' ? 'warning' : 'success'}
                      size="small"
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {(factor.probability * 100).toFixed(0)}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Card>
          </Grid>
        </Grid>
        {showPredictiveInsights && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>AI Recommendations</Typography>
            <Grid container spacing={2}>
              {predictiveAnalytics.recommendations.map((rec, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ p: 2, background: '#f8f9fa' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LightbulbIcon color="primary" />
                      <Typography variant="body2">{rec}</Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>AI Summary</Typography>
              <Typography variant="body2" color="text.secondary">{aiSummary}</Typography>
            </Box>
          </Box>
        )}
      </Card>
    );
  };

  const renderPerformanceMetrics = () => {
    const { performanceMetrics } = DASHBOARD_DATA;

    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
        <Grid container spacing={3}>
          {Object.entries(performanceMetrics).map(([key, metric]) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: 'primary.main', mb: 1 }}>
                  {metric.current}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  {metric.improvement > 0 ? (
                    <KeyboardArrowUpIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                  ) : (
                    <KeyboardArrowDownIcon sx={{ color: '#f44336', fontSize: 20 }} />
                  )}
                  <Typography variant="body2" sx={{ 
                    color: metric.improvement > 0 ? '#4caf50' : '#f44336',
                    fontWeight: 600 
                  }}>
                    {Math.abs(metric.improvement)}%
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Target: {metric.target}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
    );
  };

  const renderRecentActivity = () => {
    const { recentActivity } = DASHBOARD_DATA;

    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Recent Activity</Typography>
        <List>
          {recentActivity.map((activity) => (
            <ListItem key={activity.id} sx={{ px: 0 }}>
              <ListItemIcon>
                {activity.icon}
              </ListItemIcon>
              <ListItemText
                primary={activity.message}
                secondary={activity.timestamp}
              />
              <Chip 
                label={activity.priority} 
                color={activity.priority === 'high' ? 'error' : 
                       activity.priority === 'medium' ? 'warning' : 'success'}
                size="small"
              />
            </ListItem>
          ))}
        </List>
      </Card>
    );
  };

  const renderTopPerformers = () => {
    const { topPerformers } = DASHBOARD_DATA;

    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Top Performing Providers</Typography>
        <Grid container spacing={3}>
          {topPerformers.map((performer, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {performer.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {performer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {performer.specialty}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Claims Processed:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {performer.claimsProcessed}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Accuracy:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {performer.accuracy}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Avg Time:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {performer.avgProcessingTime} days
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={performer.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {performer.rating}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
    );
  };

  // NEW: Appeals Trending Analysis
  const renderAppealsTrending = () => {
    const { appealsTrending } = DASHBOARD_DATA;
    
    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Appeals Trending Analysis</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Claim Types in Appeals</Typography>
            {appealsTrending.claimTypes.map((claimType, idx) => (
              <Card key={idx} sx={{ p: 2, mb: 2, borderLeft: `5px solid ${claimType.color}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{claimType.type}</Typography>
                  <Chip label={claimType.trend} color={claimType.trend.includes('+') ? 'error' : 'success'} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Appeals: {claimType.appeals}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>Success Rate: {claimType.successRate}%</Typography>
                </Box>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Monthly Appeals Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={appealsTrending.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="appeals" stroke="#f44336" strokeWidth={3} name="Total Appeals" />
                <Line type="monotone" dataKey="overturned" stroke="#4caf50" strokeWidth={3} name="Overturned" />
              </LineChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Top Appeal Reasons:</Typography>
              <List dense>
                {appealsTrending.topReasons.map((reason, idx) => (
                  <ListItem key={idx} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>{idx + 1}.</Typography>
                    </ListItemIcon>
                    <ListItemText primary={reason} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Card>
    );
  };

  // NEW: Policy Gap Analysis
  const renderPolicyGaps = () => {
    const { policyGaps } = DASHBOARD_DATA;
    
    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Policy Gap Analysis</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>PEND Reasons Requiring Provider Re-education</Typography>
            {policyGaps.pendReasons.map((pend, idx) => (
              <Card key={idx} sx={{ p: 2, mb: 2, borderLeft: `5px solid ${pend.impact === 'High' ? '#f44336' : pend.impact === 'Medium' ? '#ff9800' : '#4caf50'}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{pend.pendCode}</Typography>
                  <Chip label={pend.impact} color={pend.impact === 'High' ? 'error' : pend.impact === 'Medium' ? 'warning' : 'success'} size="small" />
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>{pend.reason}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Frequency: {pend.frequency}</Typography>
                  <Typography variant="body2" color="text.secondary">Providers: {pend.providersAffected}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">Policy Section: {pend.policySection}</Typography>
                {pend.reeducationRequired && (
                  <Chip label="Re-education Required" color="warning" size="small" sx={{ mt: 1 }} />
                )}
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Provider Education Schedule</Typography>
            {policyGaps.providerEducation.map((provider, idx) => (
              <Card key={idx} sx={{ p: 2, mb: 2, borderLeft: `5px solid ${provider.priority === 'High' ? '#f44336' : '#ff9800'}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{provider.provider}</Typography>
                  <Chip label={provider.priority} color={provider.priority === 'High' ? 'error' : 'warning'} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{provider.specialty}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Education Needed:</strong></Typography>
                <Box sx={{ mb: 1 }}>
                  {provider.educationNeeded.map((item, idx2) => (
                    <Chip key={idx2} label={item} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <Typography variant="body2" color="text.secondary">Last: {provider.lastEducation}</Typography>
                  <Typography variant="body2" color="text.secondary">Next: {provider.nextScheduled}</Typography>
                </Box>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Card>
    );
  };

  // NEW: Auto-Adjudication Impact Analysis
  const renderAutoAdjudicationImpact = () => {
    const { autoAdjudicationImpact } = DASHBOARD_DATA;
    
    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Auto-Adjudication Impact Analysis</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Current vs Projected Impact</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Current Auto Rate:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{autoAdjudicationImpact.currentRate}%</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Projected Drop:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#f44336' }}>-{autoAdjudicationImpact.projectedDrop}%</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">New Auto Rate:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800' }}>{autoAdjudicationImpact.newRate}%</Typography>
              </Box>
            </Card>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Capacity Impact</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Additional Staff Needed:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{autoAdjudicationImpact.capacityImpact.additionalStaffNeeded}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Processing Time Increase:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>+{autoAdjudicationImpact.capacityImpact.processingTimeIncrease} days</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Cost Increase:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>${autoAdjudicationImpact.capacityImpact.costIncrease.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Backlog Risk:</Typography>
                <Chip label={autoAdjudicationImpact.capacityImpact.backlogRisk} color="error" size="small" />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Monthly Projection</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={autoAdjudicationImpact.monthlyProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="autoRate" stroke="#4caf50" strokeWidth={3} name="Auto Rate %" />
                <Line type="monotone" dataKey="manualClaims" stroke="#f44336" strokeWidth={3} name="Manual Claims" />
                <Line type="monotone" dataKey="staffNeeded" stroke="#ff9800" strokeWidth={3} name="Staff Needed" />
              </LineChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Mitigation Strategies:</Typography>
              <List dense>
                {autoAdjudicationImpact.mitigationStrategies.map((strategy, idx) => (
                  <ListItem key={idx} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <LightbulbIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={strategy} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Card>
    );
  };

  // NEW: Days on Hand Analysis
  const renderDaysOnHand = () => {
    const { daysOnHand } = DASHBOARD_DATA;
    
    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Days on Hand Analysis</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Current Status</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Current Days on Hand:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff9800' }}>{daysOnHand.current} days</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Target:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{daysOnHand.target} days</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Capacity Utilization:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{daysOnHand.capacityUtilization}%</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Backlog Trend:</Typography>
                <Chip label={daysOnHand.backlogTrend} color={daysOnHand.backlogTrend === 'decreasing' ? 'success' : 'warning'} size="small" />
              </Box>
            </Card>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Capacity Factors</Typography>
              {daysOnHand.capacityFactors.map((factor, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{factor.factor}:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={factor.impact} color={factor.impact === 'High' ? 'error' : factor.impact === 'Medium' ? 'warning' : 'success'} size="small" />
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{factor.trend}</Typography>
                  </Box>
                </Box>
              ))}
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Weekly Capacity Utilization</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={daysOnHand.weeklyCapacity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="claims" fill="#1976d2" name="Claims" />
                <Bar dataKey="capacity" fill="#4caf50" name="Capacity" />
              </BarChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Utilization by Week:</Typography>
              <Grid container spacing={1}>
                {daysOnHand.weeklyCapacity.map((week, idx) => (
                  <Grid item xs={6} key={idx}>
                    <Card sx={{ p: 1, textAlign: 'center', borderLeft: `3px solid ${week.utilization > 90 ? '#f44336' : week.utilization > 80 ? '#ff9800' : '#4caf50'}` }}>
                      <Typography variant="subtitle2">{week.week}</Typography>
                      <Typography variant="h6" sx={{ color: week.utilization > 90 ? '#f44336' : week.utilization > 80 ? '#ff9800' : '#4caf50' }}>{week.utilization}%</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Card>
    );
  };

  // NEW: Appeals Overturn Rate Metrics
  const renderAppealsOverturnRate = () => {
    const { appealsOverturnRate } = DASHBOARD_DATA;
    
    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Appeals Overturn Rate Metrics</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', mb: 2 }}>
              <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 700 }}>{appealsOverturnRate.overallRate}%</Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Overall Overturn Rate</Typography>
              <Chip label={appealsOverturnRate.trend} color="success" size="small" />
            </Card>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Financial Impact</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Overturned Amount:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>${(appealsOverturnRate.financialImpact.overturnedAmount / 1000000).toFixed(1)}M</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Processing Cost:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>${(appealsOverturnRate.financialImpact.processingCost / 1000).toFixed(0)}K</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Net Impact:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>${(appealsOverturnRate.financialImpact.netImpact / 1000000).toFixed(1)}M</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Trend:</Typography>
                <Chip label={appealsOverturnRate.financialImpact.trend} color="success" size="small" />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>By Specialty</Typography>
            {appealsOverturnRate.bySpecialty.map((specialty, idx) => (
              <Card key={idx} sx={{ p: 2, mb: 2, borderLeft: `5px solid ${specialty.overturnRate > 75 ? '#4caf50' : specialty.overturnRate > 65 ? '#ff9800' : '#f44336'}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{specialty.specialty}</Typography>
                  <Chip label={specialty.trend} color={specialty.trend.includes('+') ? 'success' : 'error'} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>{specialty.overturnRate}%</Typography>
                  <Typography variant="body2" color="text.secondary">Volume: {specialty.volume}</Typography>
                </Box>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>By Reason</Typography>
            {appealsOverturnRate.byReason.map((reason, idx) => (
              <Card key={idx} sx={{ p: 2, mb: 2, borderLeft: `5px solid ${reason.overturnRate > 80 ? '#4caf50' : reason.overturnRate > 70 ? '#ff9800' : '#f44336'}` }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>{reason.reason}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>{reason.overturnRate}%</Typography>
                  <Typography variant="body2" color="text.secondary">Volume: {reason.volume}</Typography>
                </Box>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Card>
    );
  };

  // NEW: STAR Rating Impact Metrics
  const renderStartRatingMetrics = () => {
    const { starRatingMetrics } = DASHBOARD_DATA;
    
    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>STAR Rating Impact Metrics</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ p: 2, textAlign: 'center', mb: 2 }}>
              <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 700 }}>{starRatingMetrics.currentRating}</Typography>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Current STAR Rating</Typography>
              <Typography variant="body2" color="text.secondary">Target: {starRatingMetrics.targetRating}</Typography>
            </Card>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Rating Components</Typography>
              {starRatingMetrics.components.map((component, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{component.component}</Typography>
                    <Chip label={component.impact} color={component.impact === 'High' ? 'error' : 'warning'} size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>{component.score}</Typography>
                    <Typography variant="body2" color="text.secondary">Weight: {component.weight}%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {component.factors.map((factor, idx2) => (
                      <Chip key={idx2} label={factor} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              ))}
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Improvement Areas</Typography>
            {starRatingMetrics.improvementAreas.map((area, idx) => (
              <Card key={idx} sx={{ p: 2, mb: 2, borderLeft: `5px solid ${area.impact === 'High' ? '#f44336' : '#ff9800'}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{area.area}</Typography>
                  <Chip label={area.impact} color={area.impact === 'High' ? 'error' : 'warning'} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">Current: {area.current}</Typography>
                  <Typography variant="body2">Target: {area.target}</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Actions:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {area.actions.map((action, idx2) => (
                    <Chip key={idx2} label={action} size="small" variant="outlined" />
                  ))}
                </Box>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Monthly Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={starRatingMetrics.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[3.5, 4.5]} />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="rating" stroke="#1976d2" strokeWidth={3} name="Overall Rating" />
                <Line type="monotone" dataKey="speed" stroke="#f44336" strokeWidth={2} name="Speed" />
                <Line type="monotone" dataKey="timeliness" stroke="#ff9800" strokeWidth={2} name="Timeliness" />
                <Line type="monotone" dataKey="accuracy" stroke="#4caf50" strokeWidth={2} name="Accuracy" />
                <Line type="monotone" dataKey="responsiveness" stroke="#9c27b0" strokeWidth={2} name="Responsiveness" />
              </LineChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Key Insights:</Typography>
              <List dense>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <TrendingUpIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Accuracy component is strongest at 4.4" />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <TrendingDownIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Responsiveness needs improvement" />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <LightbulbIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Focus on processing speed and provider communication" />
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>
      </Card>
    );
  };

  const renderDashboard = () => (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Claims Operational Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-Powered Analytics & Predictive Insights
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
            >
              Refresh
            </Button>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleDashboardClose}
            >
              Back
            </Button>
          </Box>
        </Box>

        <Tabs value={dashboardTab} onChange={handleDashboardTabChange} sx={{ mb: 3 }}>
          <Tab label="Overview" />
          <Tab label="Trends" />
          <Tab label="Root Cause" />
          <Tab label="Predictive" />
          <Tab label="Performance" />
          <Tab label="Activity" />
        </Tabs>

        {dashboardTab === 0 && (
          <Box>
            {renderKPICards()}
            {renderPendCodeChart()}
            {renderTopPerformers()}
            {renderAppealsTrending()}
            {renderPolicyGaps()}
            {renderAutoAdjudicationImpact()}
            {renderClaimProcessingEfficiency()}
            {renderProviderPerformanceAnalysis()}
            {renderCostAnalysis()}
            {renderAppealsOverturnRate()}
            {renderStartRatingMetrics()}
          </Box>
        )}

        {dashboardTab === 1 && (
          <Box>
            {renderTrendChart()}
          </Box>
        )}

        {dashboardTab === 2 && (
          <Box>
            {renderRootCauseAnalysis()}
          </Box>
        )}

        {dashboardTab === 3 && (
          <Box>
            {renderPredictiveAnalytics()}
          </Box>
        )}

        {dashboardTab === 4 && (
          <Box>
            {renderKPIMetrics()}
            {renderAutoAdjudicationImpact()}
            {renderStartRatingMetrics()}
          </Box>
        )}

        {dashboardTab === 5 && (
          <Box>
            {renderRecentActivity()}
          </Box>
        )}
      </Paper>
    </Box>
  );

  // Add mock KPI metrics
  const KPI_METRICS = [
    { name: 'First Pass Accuracy Rate (FPAR)', value: '96.2%', trend: '+1.2%', trendDir: 'up', color: '#4caf50', comment: 'Excellent! Industry leading.' },
    { name: 'Auto-Adjudication Rate', value: '82.5%', trend: '+2.1%', trendDir: 'up', color: '#1976d2', comment: 'Automation is improving.' },
    { name: 'Claim Rework Rate', value: '3.8%', trend: '-0.5%', trendDir: 'down', color: '#f44336', comment: 'Low rework, keep it up.' },
    { name: 'Turnaround Time (TAT)', value: '1.9 days', trend: '-0.3d', trendDir: 'down', color: '#ff9800', comment: 'Fast processing.' },
    { name: 'Claim Pend Rate', value: '7.1%', trend: '-0.8%', trendDir: 'down', color: '#00bcd4', comment: 'Pends are reducing.' },
    { name: 'Overpayment Rate', value: '0.7%', trend: '-0.1%', trendDir: 'down', color: '#9c27b0', comment: 'Minimal overpayments.' },
    { name: 'Underpayment Rate', value: '1.2%', trend: '+0.2%', trendDir: 'up', color: '#f44336', comment: 'Monitor underpayments.' },
    { name: 'Policy Adherence Rate', value: '98.4%', trend: '+0.6%', trendDir: 'up', color: '#4caf50', comment: 'Strong compliance.' },
    { name: 'Denial Rate (Post-Adjudication)', value: '4.5%', trend: '-0.3%', trendDir: 'down', color: '#1976d2', comment: 'Denials are dropping.' },
    { name: 'Dispute/Reconsideration Rate', value: '1.1%', trend: '-0.2%', trendDir: 'down', color: '#00bcd4', comment: 'Few disputes.' },
    { name: 'Audit Accuracy Score', value: '99.1%', trend: '+0.4%', trendDir: 'up', color: '#4caf50', comment: 'Outstanding audit results.' },
  ];

  const renderKPIMetrics = () => (
    <Card sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>KPI Metrics for Accurate Claim Adjudication</Typography>
      <Grid container spacing={3}>
        {KPI_METRICS.map((kpi, idx) => (
          <Grid item xs={12} sm={6} md={4} key={kpi.name}>
            <Card sx={{ p: 2, borderLeft: `6px solid ${kpi.color}`, boxShadow: 2, borderRadius: 3, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: kpi.color }}>{kpi.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: kpi.color, mr: 1 }}>{kpi.value}</Typography>
                {kpi.trendDir === 'up' ? (
                  <KeyboardArrowUpIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                ) : (
                  <KeyboardArrowDownIcon sx={{ color: '#f44336', fontSize: 28 }} />
                )}
                <Typography variant="body2" sx={{ color: kpi.trendDir === 'up' ? '#4caf50' : '#f44336', fontWeight: 600, ml: 0.5 }}>{kpi.trend}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">{kpi.comment}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Card>
  );

  // NEW: Claim Processing Efficiency Metrics
  const renderClaimProcessingEfficiency = () => {
    const efficiencyData = {
      firstPassAccuracy: 96.2,
      autoAdjudicationRate: 82.5,
      manualReviewRate: 17.5,
      averageProcessingTime: 2.3,
      claimsPerHour: 45,
      errorRate: 3.8,
      reworkRate: 2.1,
      qualityScore: 94.7
    };

    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Claim Processing Efficiency</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Processing Metrics</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card sx={{ p: 2, textAlign: 'center', borderLeft: '5px solid #4caf50' }}>
                  <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>{efficiencyData.firstPassAccuracy}%</Typography>
                  <Typography variant="body2" color="text.secondary">First Pass Accuracy</Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ p: 2, textAlign: 'center', borderLeft: '5px solid #1976d2' }}>
                  <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700 }}>{efficiencyData.autoAdjudicationRate}%</Typography>
                  <Typography variant="body2" color="text.secondary">Auto-Adjudication Rate</Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ p: 2, textAlign: 'center', borderLeft: '5px solid #ff9800' }}>
                  <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 700 }}>{efficiencyData.claimsPerHour}</Typography>
                  <Typography variant="body2" color="text.secondary">Claims/Hour</Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ p: 2, textAlign: 'center', borderLeft: '5px solid #9c27b0' }}>
                  <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 700 }}>{efficiencyData.qualityScore}%</Typography>
                  <Typography variant="body2" color="text.secondary">Quality Score</Typography>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Performance Indicators</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="body2">Manual Review Rate:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{efficiencyData.manualReviewRate}%</Typography>
                  <Chip label="Decreasing" color="success" size="small" />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="body2">Error Rate:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{efficiencyData.errorRate}%</Typography>
                  <Chip label="Low" color="success" size="small" />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="body2">Rework Rate:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{efficiencyData.reworkRate}%</Typography>
                  <Chip label="Acceptable" color="warning" size="small" />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="body2">Avg Processing Time:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{efficiencyData.averageProcessingTime} days</Typography>
                  <Chip label="On Target" color="success" size="small" />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    );
  };

  // NEW: Provider Performance Analysis
  const renderProviderPerformanceAnalysis = () => {
    const providerMetrics = {
      topPerformers: [
        { name: 'Cardiology Associates', specialty: 'Cardiology', accuracy: 98.7, volume: 156, trend: '+2.1%' },
        { name: 'Orthopedic Specialists', specialty: 'Orthopedics', accuracy: 97.3, volume: 142, trend: '+1.8%' },
        { name: 'Primary Care Network', specialty: 'Primary Care', accuracy: 96.8, volume: 128, trend: '+1.5%' }
      ],
      improvementNeeded: [
        { name: 'Mental Health Partners', specialty: 'Psychiatry', accuracy: 89.2, volume: 85, issues: ['Documentation', 'Authorization'] },
        { name: 'Diagnostic Imaging Co', specialty: 'Radiology', accuracy: 91.5, volume: 92, issues: ['Coding', 'Medical Necessity'] }
      ],
      specialtyPerformance: [
        { specialty: 'Cardiology', accuracy: 97.8, volume: 245, trend: '+3.2%' },
        { specialty: 'Orthopedics', accuracy: 96.5, volume: 198, trend: '+2.1%' },
        { specialty: 'Primary Care', accuracy: 95.2, volume: 312, trend: '+1.8%' },
        { specialty: 'Psychiatry', accuracy: 89.8, volume: 156, trend: '-1.2%' },
        { specialty: 'Radiology', accuracy: 92.1, volume: 187, trend: '+0.8%' }
      ]
    };

    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Provider Performance Analysis</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Top Performing Providers</Typography>
            {providerMetrics.topPerformers.map((provider, idx) => (
              <Card key={idx} sx={{ p: 2, mb: 2, borderLeft: '5px solid #4caf50' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{provider.name}</Typography>
                  <Chip label={provider.trend} color="success" size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{provider.specialty}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700 }}>{provider.accuracy}%</Typography>
                  <Typography variant="body2" color="text.secondary">Volume: {provider.volume}</Typography>
                </Box>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Providers Needing Improvement</Typography>
            {providerMetrics.improvementNeeded.map((provider, idx) => (
              <Card key={idx} sx={{ p: 2, mb: 2, borderLeft: '5px solid #f44336' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{provider.name}</Typography>
                  <Chip label="Needs Attention" color="error" size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{provider.specialty}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 700 }}>{provider.accuracy}%</Typography>
                  <Typography variant="body2" color="text.secondary">Volume: {provider.volume}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {provider.issues.map((issue, idx2) => (
                    <Chip key={idx2} label={issue} size="small" variant="outlined" color="warning" />
                  ))}
                </Box>
              </Card>
            ))}
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Specialty Performance Overview</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={providerMetrics.specialtyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="specialty" />
              <YAxis domain={[85, 100]} />
              <RechartsTooltip />
              <Bar dataKey="accuracy" fill="#1976d2" name="Accuracy %" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    );
  };

  // NEW: Cost Analysis & Financial Impact
  const renderCostAnalysis = () => {
    const costData = {
      processingCosts: {
        total: 125000,
        perClaim: 12.50,
        staffCosts: 85000,
        systemCosts: 25000,
        overhead: 15000
      },
      savings: {
        automationSavings: 45000,
        errorReduction: 28000,
        efficiencyGains: 32000,
        totalSavings: 105000
      },
      roi: {
        investment: 75000,
        return: 180000,
        roiPercentage: 140,
        paybackPeriod: '8 months'
      },
      monthlyTrend: [
        { month: 'Jan', cost: 135000, savings: 95000, net: -40000 },
        { month: 'Feb', cost: 128000, savings: 98000, net: -30000 },
        { month: 'Mar', cost: 125000, savings: 105000, net: -20000 },
        { month: 'Apr', cost: 122000, savings: 110000, net: -12000 },
        { month: 'May', cost: 120000, savings: 115000, net: -5000 },
        { month: 'Jun', cost: 118000, savings: 120000, net: 2000 }
      ]
    };

    return (
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Cost Analysis & Financial Impact</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Processing Costs</Typography>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Total Monthly Cost:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>${costData.processingCosts.total.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Cost per Claim:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>${costData.processingCosts.perClaim}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Staff Costs:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>${costData.processingCosts.staffCosts.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">System Costs:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>${costData.processingCosts.systemCosts.toLocaleString()}</Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Savings & ROI</Typography>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Total Savings:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>${costData.savings.totalSavings.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">ROI:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>{costData.roi.roiPercentage}%</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Payback Period:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{costData.roi.paybackPeriod}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Net Impact:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#4caf50' }}>${(costData.savings.totalSavings - costData.processingCosts.total).toLocaleString()}</Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Savings Breakdown</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="body2">Automation:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>${costData.savings.automationSavings.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="body2">Error Reduction:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>${costData.savings.errorReduction.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <Typography variant="body2">Efficiency Gains:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>${costData.savings.efficiencyGains.toLocaleString()}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Monthly Cost vs Savings Trend</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={costData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
              <Legend />
              <Line type="monotone" dataKey="cost" stroke="#f44336" strokeWidth={3} name="Processing Cost" />
              <Line type="monotone" dataKey="savings" stroke="#4caf50" strokeWidth={3} name="Savings" />
              <Line type="monotone" dataKey="net" stroke="#ff9800" strokeWidth={3} name="Net Impact" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    );
  };

  // FloatingChatbot component
  function FloatingChatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
      { from: 'bot', text: 'Hi! Ask me about claim trends, root causes, or pend solutions.' }
    ]);
    const [input, setInput] = useState('');
    const [thinking, setThinking] = useState(false);

    // Mock data for last five rejected claims
    const lastFiveRejected = [
      { id: 'CLM-2024-078', reason: 'Invalid Provider TIN', date: '2024-05-20', pend: 'PROV' },
      { id: 'CLM-2024-065', reason: 'Missing Authorization', date: '2024-05-19', pend: 'AUTH' },
      { id: 'CLM-2024-059', reason: 'Pricing Discrepancy', date: '2024-05-18', pend: 'PRIC' },
      { id: 'CLM-2024-054', reason: 'Invalid Provider NPI', date: '2024-05-17', pend: 'PROV' },
      { id: 'CLM-2024-050', reason: 'Authorization Expired', date: '2024-05-16', pend: 'AUTH' },
    ];

    // Rich AI response logic
    const getAIResponse = (msg) => {
      if (/most common.*rejection|top.*rejection|common.*pend/i.test(msg)) {
        return (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f44336', mb: 1 }}>Most Common Claim Rejection</Typography>
            <Card sx={{ p: 2, mb: 1, borderLeft: '5px solid #f44336', background: '#fff3f3' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>Reason: Missing Authorization</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>PEND Code: <b>AUTH</b></Typography>
              <Typography variant="body2" color="text.secondary">AI Suggestion: Automate pre-service authorization and educate providers on documentation requirements.</Typography>
            </Card>
          </Box>
        );
      }
      if (/last.*five.*reject|recent.*reject|last.*5.*reject/i.test(msg)) {
        return (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f44336', mb: 1 }}>Last 5 Claims Rejected</Typography>
            <Table size="small" sx={{ background: '#fff', borderRadius: 2, boxShadow: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Claim ID</TableCell>
                  <TableCell>PEND</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lastFiveRejected.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell><Chip label={c.pend} color={c.pend === 'AUTH' ? 'error' : c.pend === 'PROV' ? 'warning' : 'info'} size="small" /></TableCell>
                    <TableCell>{c.reason}</TableCell>
                    <TableCell>{c.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        );
      }
      if (/trend/i.test(msg)) return 'Trends show pending claims are decreasing and approvals are up!';
      if (/root cause/i.test(msg)) return 'Most common root cause: Missing Authorization. Suggestion: Automate pre-auth workflows.';
      if (/auth|prov|pric|pend reason/i.test(msg)) return 'For this PEND code, check the required documentation and follow the AI-suggested steps.';
      if (/solution|fix/i.test(msg)) return 'AI recommends: 1. Review claim details, 2. Check policy, 3. Apply suggested resolution.';
      return 'I can help with trends, root causes, pend reasons, and solutions. Try asking about any of these!';
    };

    const handleSend = () => {
      if (!input.trim()) return;
      setMessages([...messages, { from: 'user', text: input }]);
      setThinking(true);
      setTimeout(() => {
        setThinking(false);
        setMessages((msgs) => [...msgs, { from: 'bot', text: getAIResponse(input), rich: true }]);
      }, 1200);
      setInput('');
    };

    return (
      <Box sx={{ position: 'fixed', zIndex: 2000, bottom: 32, right: 32 }}>
        {open ? (
          <Paper elevation={8} sx={{ width: 340, height: 420, borderRadius: 3, boxShadow: 6, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)', color: 'white', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Claims Chatbot</Typography>
              <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
            </Box>
            <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: '#f8fafc' }}>
              {messages.map((msg, idx) => (
                <Box key={idx} sx={{ mb: 1, textAlign: msg.from === 'bot' ? 'left' : 'right' }}>
                  {msg.from === 'bot' && msg.rich && typeof msg.text !== 'string' ? (
                    msg.text
                  ) : (
                    <Box sx={{ display: 'inline-block', px: 2, py: 1, borderRadius: 2, bgcolor: msg.from === 'bot' ? '#e3f2fd' : '#1976d2', color: msg.from === 'bot' ? 'black' : 'white', fontSize: 15 }}>
                      {msg.text}
                    </Box>
                  )}
                </Box>
              ))}
              {thinking && (
                <Box sx={{ mb: 1, textAlign: 'left' }}>
                  <Box sx={{ display: 'inline-block', px: 2, py: 1, borderRadius: 2, bgcolor: '#e3f2fd', color: 'black', fontSize: 15 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={18} color="primary" thickness={5} />
                      <span>Thinking...</span>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', bgcolor: '#f5f7fa' }}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Ask about trends, root cause, pends..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                sx={{ flex: 1, mr: 1 }}
              />
              <Button variant="contained" color="primary" onClick={handleSend} disabled={!input.trim() || thinking} sx={{ minWidth: 0, px: 2 }}>Send</Button>
            </Box>
          </Paper>
        ) : (
          <Tooltip title="Ask Claims AI">
            <IconButton onClick={() => setOpen(true)} sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)', color: 'white', width: 56, height: 56, boxShadow: 6, '&:hover': { background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)' } }}>
              <SupportAgentIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '60vh',
            maxHeight: '80vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)',
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h5" component="div">
                Claim Center AI Agent
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                Your intelligent assistant for all things claims
              </Typography>
            </Box>
            <Box>
              <Tooltip title="Return to Module Selection">
                <IconButton onClick={handleHomeClick} sx={{ mr: 1 }}>
                  <HomeIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Close">
                <IconButton onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '40vh',
          background: 'transparent',
          p: 0,
        }}>
          {!selectedModule ? (
            <Box sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              py: 2,
            }}>
              <Grid container spacing={3} justifyContent="center" alignItems="stretch" sx={{ mt: 2 }}>
                {MODULES.map((module) => (
                  <Grid item xs={12} sm={6} md={3} key={module.id} sx={{ display: 'flex' }}>
                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: 4,
                        boxShadow: 0,
                        border: '1.5px solid #e0e0e0',
                        transition: 'box-shadow 0.18s, border-color 0.18s, transform 0.18s',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: 3,
                          borderColor: module.color,
                          transform: 'translateY(-2px) scale(1.025)',
                        },
                        minHeight: 220,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: '#fcfcfc',
                      }}
                      onClick={() => handleModuleSelect(module)}
                    >
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 0, width: '100%' }}>
                        <Box sx={{ color: module.color, mb: 1, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {module.icon}
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, fontSize: 17, textAlign: 'center' }}>
                          {module.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: 13, lineHeight: 1.4 }}>
                          {module.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            selectedClaim && postResolveStep ? renderPostResolveFlow() : renderClaimSelection()
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <ClaimsPolicyDialog
        open={showPolicyDialog}
        onClose={() => setShowPolicyDialog(false)}
      />
      <ClaimsAdjudicationsDialog
        open={showAdjudicationsDialog}
        onClose={() => setShowAdjudicationsDialog(false)}
      />

      {/* Dashboard Dialog */}
      <Dialog
        open={showDashboardDialog}
        onClose={handleDashboardClose}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            width: '95vw',
            height: '95vh',
            maxWidth: 'none',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)',
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          color: 'white',
          p: 3
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                Claims Operational Dashboard
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.9 }}>
                AI-Powered Analytics & Predictive Insights
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.1)' } }}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.1)' } }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<CloseIcon />}
                onClick={handleDashboardClose}
                sx={{ background: 'rgba(255,255,255,0.2)', '&:hover': { background: 'rgba(255,255,255,0.3)' } }}
              >
                Close
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ 
          p: 0, 
          overflow: 'hidden',
          background: 'transparent'
        }}>
          <Box sx={{ height: '100%', overflow: 'auto' }}>
            <Box sx={{ p: 3 }}>
              <Tabs 
                value={dashboardTab} 
                onChange={handleDashboardTabChange} 
                sx={{ 
                  mb: 3,
                  '& .MuiTab-root': {
                    fontSize: '1rem',
                    fontWeight: 600,
                    minHeight: 48
                  }
                }}
              >
                <Tab label="Overview" />
                <Tab label="Trends" />
                <Tab label="Root Cause" />
                <Tab label="Predictive" />
                <Tab label="Performance" />
                <Tab label="Activity" />
              </Tabs>

              {dashboardTab === 0 && (
                <Box>
                  {renderKPICards()}
                  {renderPendCodeChart()}
                  {renderTopPerformers()}
                  {renderAppealsTrending()}
                  {renderPolicyGaps()}
                  {renderAutoAdjudicationImpact()}
                  {renderClaimProcessingEfficiency()}
                  {renderProviderPerformanceAnalysis()}
                  {renderCostAnalysis()}
                  {renderAppealsOverturnRate()}
                  {renderStartRatingMetrics()}
                </Box>
              )}

              {dashboardTab === 1 && (
                <Box>
                  {renderTrendChart()}
                </Box>
              )}

              {dashboardTab === 2 && (
                <Box>
                  {renderRootCauseAnalysis()}
                </Box>
              )}

              {dashboardTab === 3 && (
                <Box>
                  {renderPredictiveAnalytics()}
                </Box>
              )}

              {dashboardTab === 4 && (
                <Box>
                  {renderKPIMetrics()}
                  {renderAutoAdjudicationImpact()}
                  {renderStartRatingMetrics()}
                </Box>
              )}

              {dashboardTab === 5 && (
                <Box>
                  {renderRecentActivity()}
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <FloatingChatbot />
      </Dialog>
    </>
  );
}

export default ClaimCenterAIDialog; 