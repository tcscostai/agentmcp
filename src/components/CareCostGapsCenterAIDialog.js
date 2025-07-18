import React, { useState } from 'react';
import { keyframes } from '@emotion/react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
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
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, AreaChart, Area
} from 'recharts';
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
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  MonetizationOn as MonetizationOnIcon,
  Savings as SavingsIcon,
  TrendingFlat as TrendingFlatIcon,
  AssessmentOutlined as AssessmentOutlinedIcon,
  Insights as InsightsIcon,
  AnalyticsOutlined as AnalyticsOutlinedIcon,
  Compare as CompareIcon,
  TimelineOutlined as TimelineOutlinedIcon,
  PieChartOutlined as PieChartOutlinedIcon,
  BarChartOutlined as BarChartOutlinedIcon,
  ShowChartOutlined as ShowChartOutlinedIcon,
  Medication as MedicationIcon,
  PlayArrow as PlayArrowIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';

// Custom animations for timeline
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0,-8px,0); }
  70% { transform: translate3d(0,-4px,0); }
  90% { transform: translate3d(0,-2px,0); }
`;

const slideInRight = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const aiPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(33,150,243,0.7); }
  70% { box-shadow: 0 0 0 20px rgba(33,150,243,0); }
  100% { box-shadow: 0 0 0 0 rgba(33,150,243,0); }
`;

const fadeInUp = keyframes`
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Mock data for cost gaps analysis
const COST_GAPS_DATA = {
  summary: {
    totalSavings: 2847500,
    potentialSavings: 1250000,
    analyzedClaims: 15420,
    costGaps: 847,
    averageGap: 1475,
    topGapCategory: 'Provider Pricing',
    savingsRate: 12.8
  },
  // Module 1: Cost of Care - Diabetes Focus
  costOfCare: {
    topDrgCodes: [
      { code: 'E11.9', description: 'Type 2 diabetes without complications', volume: 1247, avgCost: 8500, totalCost: 10599500, riskLevel: 'High' },
      { code: 'E11.22', description: 'Type 2 diabetes with diabetic chronic kidney disease', volume: 892, avgCost: 15600, totalCost: 13915200, riskLevel: 'Critical' },
      { code: 'E11.65', description: 'Type 2 diabetes with hyperglycemia', volume: 634, avgCost: 7200, totalCost: 4564800, riskLevel: 'Medium' },
      { code: 'E11.21', description: 'Type 2 diabetes with diabetic nephropathy', volume: 445, avgCost: 18900, totalCost: 8410500, riskLevel: 'Critical' },
      { code: 'E11.8', description: 'Type 2 diabetes with unspecified complications', volume: 567, avgCost: 9800, totalCost: 5556600, riskLevel: 'High' }
    ],
    topHcpcsCodes: [
      { code: 'A9270', description: 'Continuous glucose monitoring system', volume: 2156, avgCost: 3200, totalCost: 6899200, intervention: 'RPM Program' },
      { code: 'G0108', description: 'Diabetes self-management training', volume: 892, avgCost: 1800, totalCost: 1605600, intervention: 'Education Program' },
      { code: 'G0109', description: 'Diabetes self-management training follow-up', volume: 445, avgCost: 1200, totalCost: 534000, intervention: 'Follow-up Care' },
      { code: 'G0270', description: 'Medical nutrition therapy', volume: 678, avgCost: 950, totalCost: 644100, intervention: 'Nutrition Counseling' },
      { code: 'G0447', description: 'Face-to-face behavioral counseling', volume: 1234, avgCost: 750, totalCost: 925500, intervention: 'Behavioral Health' }
    ],
    valueBasedInterventions: [
      {
        id: 'VBI-001',
        title: 'Remote Patient Monitoring (RPM) Program',
        targetDrg: 'E11.9',
        currentCost: 8500,
        projectedCost: 5200,
        savings: 3300,
        implementation: '3 months',
        roi: 245,
        description: 'Implement continuous glucose monitoring with AI-driven alerts'
      },
      {
        id: 'VBI-002',
        title: 'Preventive Care Coordination',
        targetDrg: 'E11.22',
        currentCost: 15600,
        projectedCost: 9800,
        savings: 5800,
        implementation: '6 months',
        roi: 312,
        description: 'Proactive kidney function monitoring and early intervention'
      },
      {
        id: 'VBI-003',
        title: 'Medication Adherence Program',
        targetDrg: 'E11.65',
        currentCost: 7200,
        projectedCost: 4800,
        savings: 2400,
        implementation: '4 months',
        roi: 180,
        description: 'Smart medication reminders and adherence tracking'
      }
    ]
  },
  // Module 2: Gaps in Care - Diabetes Patient Scenario
  gapsInCare: {
    patientScenario: {
      name: 'Sarah Johnson',
      age: 58,
      diagnosis: 'Type 2 Diabetes',
      riskFactors: ['Hypertension', 'Obesity', 'Family History'],
      lastVisit: '2024-02-15',
      nextVisit: '2024-05-15',
      currentMedications: ['Metformin', 'Glipizide', 'Lisinopril'],
      a1cLevel: 8.2,
      targetA1c: 7.0
    },
    identifiedGaps: [
      {
        id: 'GAP-001',
        category: 'Preventive Care',
        description: 'Missing annual eye exam (diabetic retinopathy screening)',
        riskLevel: 'High',
        impact: 'Potential vision loss and increased treatment costs',
        lastDue: '2024-01-15',
        daysOverdue: 90,
        intervention: 'Schedule ophthalmology appointment',
        estimatedCost: 250,
        potentialSavings: 8500
      },
      {
        id: 'GAP-002',
        category: 'Medication Management',
        description: 'A1C levels above target (8.2 vs 7.0 target)',
        riskLevel: 'Critical',
        impact: 'Increased risk of complications and hospitalizations',
        lastCheck: '2024-02-15',
        daysSinceCheck: 45,
        intervention: 'Medication adjustment and RPM implementation',
        estimatedCost: 1200,
        potentialSavings: 15600
      },
      {
        id: 'GAP-003',
        category: 'Foot Care',
        description: 'Missing diabetic foot exam',
        riskLevel: 'Medium',
        impact: 'Risk of foot ulcers and amputations',
        lastDue: '2024-03-01',
        daysOverdue: 30,
        intervention: 'Podiatry consultation',
        estimatedCost: 180,
        potentialSavings: 12000
      },
      {
        id: 'GAP-004',
        category: 'Nutrition Counseling',
        description: 'No recent nutrition therapy session',
        riskLevel: 'Medium',
        impact: 'Poor glycemic control and weight management',
        lastDue: '2024-01-01',
        daysOverdue: 105,
        intervention: 'Registered dietitian consultation',
        estimatedCost: 150,
        potentialSavings: 3200
      },
      {
        id: 'GAP-005',
        category: 'Kidney Function',
        description: 'Missing microalbuminuria screening',
        riskLevel: 'High',
        impact: 'Risk of diabetic nephropathy progression',
        lastDue: '2024-02-01',
        daysOverdue: 60,
        intervention: 'Urine microalbumin test',
        estimatedCost: 85,
        potentialSavings: 18900
      }
    ],
    aiRecommendations: [
      {
        id: 'AI-REC-001',
        priority: 'Critical',
        title: 'Immediate A1C Management',
        description: 'Patient A1C at 8.2% requires immediate intervention to prevent complications',
        actions: [
          'Schedule medication review with endocrinologist',
          'Implement continuous glucose monitoring',
          'Enhance patient education on glycemic control',
          'Set up weekly follow-up calls'
        ],
        expectedOutcome: 'A1C reduction to 7.5% within 3 months',
        costSavings: 15600
      },
      {
        id: 'AI-REC-002',
        priority: 'High',
        title: 'Comprehensive Preventive Care Package',
        description: 'Bundle multiple preventive services to address care gaps efficiently',
        actions: [
          'Schedule ophthalmology exam within 2 weeks',
          'Arrange podiatry consultation',
          'Book nutrition counseling session',
          'Order microalbuminuria screening'
        ],
        expectedOutcome: 'Complete preventive care compliance within 30 days',
        costSavings: 38600
      },
      {
        id: 'AI-REC-003',
        priority: 'Medium',
        title: 'Remote Patient Monitoring Implementation',
        description: 'Deploy RPM to improve medication adherence and glycemic control',
        actions: [
          'Install continuous glucose monitoring device',
          'Set up medication reminder system',
          'Configure AI-driven alert thresholds',
          'Establish care team communication protocol'
        ],
        expectedOutcome: 'Improved medication adherence and reduced A1C levels',
        costSavings: 8500
      }
    ]
  },
  categories: [
    { name: 'Provider Pricing', value: 45, savings: 562500, color: '#8884d8' },
    { name: 'Service Utilization', value: 28, savings: 350000, color: '#82ca9d' },
    { name: 'Authorization Gaps', value: 15, savings: 187500, color: '#ffc658' },
    { name: 'Coding Errors', value: 12, savings: 150000, color: '#ff7300' }
  ],
  trends: [
    { month: 'Jan', actual: 1200000, projected: 1100000, savings: 100000 },
    { month: 'Feb', actual: 1180000, projected: 1080000, savings: 100000 },
    { month: 'Mar', actual: 1250000, projected: 1120000, savings: 130000 },
    { month: 'Apr', actual: 1220000, projected: 1110000, savings: 110000 },
    { month: 'May', actual: 1280000, projected: 1130000, savings: 150000 },
    { month: 'Jun', actual: 1240000, projected: 1140000, savings: 100000 }
  ],
  topGaps: [
    {
      id: 'GAP-001',
      category: 'Provider Pricing',
      description: 'Cardiology services billed at specialty rates instead of primary care',
      impact: 45000,
      frequency: 23,
      status: 'Identified',
      priority: 'High'
    },
    {
      id: 'GAP-002',
      category: 'Service Utilization',
      description: 'Unnecessary diagnostic tests ordered during routine visits',
      impact: 32000,
      frequency: 18,
      status: 'In Review',
      priority: 'Medium'
    },
    {
      id: 'GAP-003',
      category: 'Authorization Gaps',
      description: 'Services performed without required pre-authorization',
      impact: 28000,
      frequency: 15,
      status: 'Identified',
      priority: 'High'
    },
    {
      id: 'GAP-004',
      category: 'Coding Errors',
      description: 'Incorrect CPT codes leading to higher reimbursement',
      impact: 22000,
      frequency: 12,
      status: 'Resolved',
      priority: 'Medium'
    },
    {
      id: 'GAP-005',
      category: 'Provider Pricing',
      description: 'Out-of-network providers billed at in-network rates',
      impact: 18000,
      frequency: 8,
      status: 'In Review',
      priority: 'High'
    }
  ],
  recommendations: [
    {
      id: 'REC-001',
      title: 'Implement Provider Rate Validation',
      description: 'Automated validation of provider rates against contracted rates',
      impact: 'High',
      effort: 'Medium',
      savings: 250000,
      timeline: '3 months'
    },
    {
      id: 'REC-002',
      title: 'Enhanced Authorization Workflow',
      description: 'Real-time authorization checking during claim processing',
      impact: 'High',
      effort: 'High',
      savings: 180000,
      timeline: '6 months'
    },
    {
      id: 'REC-003',
      title: 'Utilization Review Program',
      description: 'AI-powered review of service utilization patterns',
      impact: 'Medium',
      effort: 'Medium',
      savings: 120000,
      timeline: '4 months'
    },
    {
      id: 'REC-004',
      title: 'Coding Accuracy Training',
      description: 'Provider education program for accurate coding',
      impact: 'Medium',
      effort: 'Low',
      savings: 80000,
      timeline: '2 months'
    }
  ]
};

// Mock patients for dropdown selection
const MOCK_PATIENTS = [
  {
    id: 'george-thompson',
    name: 'George Thompson',
    age: 67,
    diagnosis: 'Type 2 Diabetes',
    riskLevel: 'High',
    phases: [
      { phase: 'Prevention', withoutAI: 'Missed BP follow-up → Stroke', withAI: 'RPM alert → Prevented' },
      { phase: 'Acute', withoutAI: 'ER to regular hospital', withAI: 'Smart routing to stroke center' },
      { phase: 'Recovery', withoutAI: 'Sent to SNF', withAI: 'AI recommends IRF' },
      { phase: 'Post-discharge', withoutAI: 'No monitoring', withAI: 'Home monitoring + caregiver alerts' },
    ],
    readmit: { before: 0.28, after: 0.12 },
    timeline: [
      { date: '2024-01-10', event: 'BP follow-up missed - patient didn\'t show up', ai: false, impact: 'Missed opportunity for early intervention' },
      { date: '2024-01-15', event: 'Routine visit - A1C measured at 8.7%', ai: false, impact: 'Poor glycemic control identified' },
      { date: '2024-02-05', event: 'Stroke event - admitted to ER', ai: false, impact: 'Acute care required' },
      { date: '2024-02-06', event: 'Transferred to regular hospital ward', ai: false, impact: 'Standard care pathway' },
      { date: '2024-02-15', event: 'Discharged to SNF for rehabilitation', ai: false, impact: 'Suboptimal rehabilitation setting' },
      { date: '2024-03-01', event: 'No post-discharge monitoring initiated', ai: false, impact: 'Increased readmission risk' },
      { date: '2024-03-15', event: 'Readmitted due to complications', ai: false, impact: 'Preventable readmission' },
      { date: '2024-01-10', event: 'RPM alert triggers intervention - BP elevated', ai: true, impact: 'Early detection and intervention' },
      { date: '2024-01-12', event: 'Care team contacts patient - medication adjustment', ai: true, impact: 'Proactive care management' },
      { date: '2024-01-15', event: 'Enhanced visit with care gap closure', ai: true, impact: 'Comprehensive care delivery' },
      { date: '2024-02-05', event: 'No stroke event - prevented through early intervention', ai: true, impact: 'Primary prevention successful' },
      { date: '2024-02-06', event: 'Smart routing to specialized diabetes center', ai: true, impact: 'Optimal care pathway' },
      { date: '2024-02-15', event: 'Discharged to IRF with enhanced protocols', ai: true, impact: 'Better rehabilitation outcomes' },
      { date: '2024-03-01', event: 'Home monitoring + caregiver alerts activated', ai: true, impact: 'Continuous care support' },
      { date: '2024-03-15', event: 'No readmission - stable condition maintained', ai: true, impact: 'Successful care transition' }
    ]
  },
  {
    id: 'sarah-johnson',
    name: 'Sarah Johnson',
    age: 58,
    diagnosis: 'Type 2 Diabetes',
    riskLevel: 'Medium',
    phases: [
      { phase: 'Prevention', withoutAI: 'Missed eye exam → Vision loss', withAI: 'Automated screening → Early detection' },
      { phase: 'Acute', withoutAI: 'Delayed foot ulcer treatment', withAI: 'Immediate podiatry referral' },
      { phase: 'Recovery', withoutAI: 'Standard wound care', withAI: 'Specialized diabetic wound care' },
      { phase: 'Post-discharge', withoutAI: 'Inconsistent follow-up', withAI: 'Structured care coordination' },
    ],
    readmit: { before: 0.22, after: 0.08 },
    timeline: [
      { date: '2024-01-05', event: 'Annual eye exam overdue by 3 months', ai: false, impact: 'Risk of diabetic retinopathy' },
      { date: '2024-01-20', event: 'Foot ulcer discovered during routine visit', ai: false, impact: 'Delayed intervention' },
      { date: '2024-02-01', event: 'Wound infection requiring hospitalization', ai: false, impact: 'Complication escalation' },
      { date: '2024-02-10', event: 'Standard wound care initiated', ai: false, impact: 'Suboptimal treatment' },
      { date: '2024-02-25', event: 'Discharged with basic instructions', ai: false, impact: 'Inadequate follow-up plan' },
      { date: '2024-03-10', event: 'Wound deterioration - readmission', ai: false, impact: 'Preventable complication' },
      { date: '2024-01-05', event: 'AI flags overdue eye exam - automated reminder sent', ai: true, impact: 'Proactive screening' },
      { date: '2024-01-15', event: 'Eye exam completed - early retinopathy detected', ai: true, impact: 'Early intervention' },
      { date: '2024-01-20', event: 'Foot ulcer detected - immediate podiatry referral', ai: true, impact: 'Timely specialist care' },
      { date: '2024-02-01', event: 'Specialized diabetic wound care initiated', ai: true, impact: 'Optimal treatment protocol' },
      { date: '2024-02-10', event: 'Wound healing progressing well', ai: true, impact: 'Successful treatment' },
      { date: '2024-02-25', event: 'Structured follow-up plan with care coordinator', ai: true, impact: 'Comprehensive care' },
      { date: '2024-03-10', event: 'Wound fully healed - no complications', ai: true, impact: 'Complete recovery' }
    ]
  },
  {
    id: 'michael-chen',
    name: 'Michael Chen',
    age: 78,
    diagnosis: 'COPD',
    riskLevel: 'Critical',
    phases: [
      { phase: 'Prevention', withoutAI: 'Missed spirometry → Respiratory failure', withAI: 'Early detection → Prevention' },
      { phase: 'Acute', withoutAI: 'COPD exacerbation emergency', withAI: 'Controlled progression' },
      { phase: 'Recovery', withoutAI: 'Respiratory complications', withAI: 'Lung function preservation' },
      { phase: 'Post-discharge', withoutAI: 'Frequent ER visits', withAI: 'Home monitoring + medication' },
    ],
    readmit: { before: 0.45, after: 0.15 },
    timeline: [
      { date: '2024-01-01', event: 'Spirometry screening overdue by 6 months', ai: false, impact: 'Critical care gap' },
      { date: '2024-01-15', event: 'Routine check shows decreased lung function', ai: false, impact: 'Late detection' },
      { date: '2024-02-01', event: 'COPD exacerbation - emergency visit required', ai: false, impact: 'Acute crisis' },
      { date: '2024-02-15', event: 'Respiratory complications established', ai: false, impact: 'Chronic condition' },
      { date: '2024-03-01', event: 'Frequent ER visits - uncontrolled symptoms', ai: false, impact: 'High care burden' },
      { date: '2024-03-15', event: 'Respiratory failure - readmission', ai: false, impact: 'Complication' },
      { date: '2024-01-01', event: 'AI flags spirometry gap - urgent intervention', ai: true, impact: 'Early detection' },
      { date: '2024-01-10', event: 'Spirometry completed - early COPD detected', ai: true, impact: 'Timely diagnosis' },
      { date: '2024-01-20', event: 'Medication adjustment - bronchodilator optimization', ai: true, impact: 'Preventive treatment' },
      { date: '2024-02-01', event: 'Lung function stabilized - no crisis needed', ai: true, impact: 'Crisis averted' },
      { date: '2024-02-15', event: 'Home monitoring system installed', ai: true, impact: 'Continuous care' },
      { date: '2024-03-01', event: 'Lung function improving - medication effective', ai: true, impact: 'Positive outcome' },
      { date: '2024-03-15', event: 'Stable condition - no complications', ai: true, impact: 'Successful management' }
    ]
  },
  {
    id: 'emma-rodriguez',
    name: 'Emma Rodriguez',
    age: 64,
    diagnosis: 'Type 2 Diabetes',
    riskLevel: 'High',
    phases: [
      { phase: 'Prevention', withoutAI: 'Missed medication adherence → Complications', withAI: 'Provider outreach → Adherence restored' },
      { phase: 'Acute', withoutAI: 'Uncontrolled diabetes → Hospitalization', withAI: 'Timely intervention → Avoided crisis' },
      { phase: 'Recovery', withoutAI: 'Extended hospital stay', withAI: 'Quick recovery with support' },
      { phase: 'Post-discharge', withoutAI: 'No follow-up → Readmission', withAI: 'Structured care coordination' },
    ],
    readmit: { before: 0.35, after: 0.08 },
    timeline: [
      { date: '2024-01-05', event: 'RPM alert - BP elevated to 175/105', ai: false, impact: 'Risk of complications' },
      { date: '2024-01-08', event: 'Care team call attempt - patient unavailable', ai: false, impact: 'Failed intervention' },
      { date: '2024-01-10', event: 'Second call attempt - voicemail only', ai: false, impact: 'No response' },
      { date: '2024-01-15', event: 'BP remains elevated - no medication adjustment', ai: false, impact: 'Risk escalation' },
      { date: '2024-02-01', event: 'Diabetes complications - emergency visit', ai: false, impact: 'Acute care needed' },
      { date: '2024-02-15', event: 'Hospitalization for uncontrolled diabetes', ai: false, impact: 'Serious complication' },
      { date: '2024-01-05', event: 'RPM alert - BP elevated to 175/105', ai: true, impact: 'Early detection' },
      { date: '2024-01-08', event: 'Care team call attempt - patient unavailable', ai: true, impact: 'Escalation triggered' },
      { date: '2024-01-10', event: 'AI flags failed intervention - provider outreach needed', ai: true, impact: 'Smart escalation' },
      { date: '2024-01-12', event: 'Provider outreach workflow activated', ai: true, impact: 'Alternative intervention' },
      { date: '2024-01-15', event: 'Provider call successful - medication adjusted', ai: true, impact: 'Crisis averted' },
      { date: '2024-02-01', event: 'BP stabilized - no complications', ai: true, impact: 'Successful intervention' },
      { date: '2024-02-15', event: 'Stable condition maintained', ai: true, impact: 'Positive outcome' }
    ],
    // Dynamic timeline that changes based on workflow completion
    getTimeline: function(workflowCompleted) {
      if (workflowCompleted) {
        // Show successful timeline after workflow completion
        return [
          { date: '2024-01-05', event: 'RPM alert - BP elevated to 175/105', ai: true, impact: 'Early detection' },
          { date: '2024-01-08', event: 'Care team call attempt - patient unavailable', ai: true, impact: 'Escalation triggered' },
          { date: '2024-01-10', event: 'AI flags failed intervention - provider outreach needed', ai: true, impact: 'Smart escalation' },
          { date: '2024-01-12', event: 'Provider outreach workflow activated', ai: true, impact: 'Alternative intervention' },
          { date: '2024-01-15', event: 'Provider call successful - medication adjusted', ai: true, impact: 'Crisis averted' },
          { date: '2024-02-01', event: 'BP stabilized - no complications', ai: true, impact: 'Successful intervention' },
          { date: '2024-02-15', event: 'Stable condition maintained', ai: true, impact: 'Positive outcome' }
        ];
      } else {
        // Show original timeline with failed intervention
        return this.timeline;
      }
    }
  }
];

function CareCostGapsCenterAIDialog({ open, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedGap, setSelectedGap] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('george-thompson');
  const [timelineAnimation, setTimelineAnimation] = useState(false);
  const [proofPopupOpen, setProofPopupOpen] = useState(false);
  const [selectedProof, setSelectedProof] = useState(null);
  const [providerOutreachActive, setProviderOutreachActive] = useState(false);
  const [outreachStep, setOutreachStep] = useState(0);
  const [callActive, setCallActive] = useState(false);
  const [callTranscript, setCallTranscript] = useState([]);
  const [careTeamContactPassed, setCareTeamContactPassed] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const [workflowCompleted, setWorkflowCompleted] = useState(false);
  const [gapsAnalysisDialogOpen, setGapsAnalysisDialogOpen] = useState(false);
  const [selectedPatientGaps, setSelectedPatientGaps] = useState(null);
  const [gapsDetailDialogOpen, setGapsDetailDialogOpen] = useState(false);
  const [selectedCardDetails, setSelectedCardDetails] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [agentStatus, setAgentStatus] = useState({});
  const [agentTasks, setAgentTasks] = useState({});
  const [showLiveAgents, setShowLiveAgents] = useState(false);
  const [costGuardAnalysis, setCostGuardAnalysis] = useState({
    isAnalyzing: false,
    analysisComplete: false,
    selectedDriver: null,
    recommendations: {},
    projectedSavings: 0,
    patientData: null,
    claimsData: null,
    providerData: null
  });
  const [showCostGuardAnalysis, setShowCostGuardAnalysis] = useState(false);
  const [selectedCostDriver, setSelectedCostDriver] = useState(null);
  const [showExecutiveSummary, setShowExecutiveSummary] = useState(false);
  const [agentInterventions, setAgentInterventions] = useState([]);
  const [interventionIndex, setInterventionIndex] = useState(0);
  
  // New state for detailed timeline dialog
  const [showDetailedTimeline, setShowDetailedTimeline] = useState(false);
  const [timelineData, setTimelineData] = useState([]);
  const [selectedTimelineDriver, setSelectedTimelineDriver] = useState(null);
  const [selectedTimelinePatient, setSelectedTimelinePatient] = useState(null);
  const [timelineView, setTimelineView] = useState('overview'); // 'overview', 'patient-detail'
  const [showProofDialog, setShowProofDialog] = useState(false);

  // Cost Driver Definitions with Enhanced Metrics
  const COST_DRIVERS = {
    chronicDisease: {
      id: 'chronicDisease',
      name: 'Chronic Disease Burden',
      icon: '🫀',
      description: 'AI-powered chronic disease management with RPM monitoring, medication optimization, and preventive care interventions. Identifies high-risk patients and automates care coordination to reduce readmissions and improve outcomes.',
      metrics: ['Patient Count', 'Risk Score', 'Intervention Gaps', 'Projected Savings'],
      color: '#e91e63',
      detailedMetrics: {
        patientCount: 2847,
        highRiskPatients: 892,
        careGaps: 1245,
        projectedSavings: 1250000,
        interventions: [
          { type: 'RPM Implementation', savings: 450000, patients: 450 },
          { type: 'Medication Optimization', savings: 320000, patients: 320 },
          { type: 'Care Gap Closure', savings: 280000, patients: 280 },
          { type: 'Preventive Care', savings: 200000, patients: 200 }
        ],
        illnessAnalysis: {
          diabetes: { patients: 1247, avgCost: 8500, projectedSavings: 425000, gaps: ['Missing A1C', 'No Eye Exam', 'Foot Care'] },
          hypertension: { patients: 892, avgCost: 6200, projectedSavings: 280000, gaps: ['BP Monitoring', 'Medication Review', 'Lifestyle Counseling'] },
          heartFailure: { patients: 445, avgCost: 15600, projectedSavings: 320000, gaps: ['Weight Monitoring', 'Sodium Restriction', 'Medication Adherence'] },
          copd: { patients: 267, avgCost: 9800, projectedSavings: 225000, gaps: ['Spirometry', 'Smoking Cessation', 'Pulmonary Rehab'] }
        },
        aiSuccessMetrics: {
          readmissionProbability: { before: 0.28, after: 0.12, reduction: 57.1 },
          impactRiskReduction: { high: 234, medium: 445, low: 156, total: 835 },
          riskLevelDistribution: { critical: 156, high: 445, medium: 890, low: 1356 },
          preventionPostDischarge: { 
            followUpRate: { before: 0.45, after: 0.78, improvement: 73.3 },
            medicationAdherence: { before: 0.62, after: 0.89, improvement: 43.5 },
            carePlanCompliance: { before: 0.38, after: 0.82, improvement: 115.8 }
          },
          predictiveAccuracy: 0.89,
          interventionSuccessRate: 0.76,
          costAvoidance: 2340000
        }
      }
    },
    drugCosts: {
      id: 'drugCosts',
      name: 'Drug Costs',
      icon: '💊',
      description: 'High-cost drug prescriptions and medication adherence issues',
      metrics: ['High-Cost Scripts', 'Biosimilar Opportunities', 'Adherence Rate', 'Drug Savings'],
      color: '#ff9800',
      detailedMetrics: {
        highCostScripts: 156,
        biosimilarOpportunities: 89,
        adherenceRate: 67,
        projectedSavings: 850000,
        interventions: [
          { type: 'Biosimilar Switch', savings: 320000, patients: 89 },
          { type: 'Generic Substitution', savings: 180000, patients: 156 },
          { type: 'Adherence Monitoring', savings: 220000, patients: 445 },
          { type: 'Therapeutic Alternatives', savings: 130000, patients: 78 }
        ],
        illnessAnalysis: {
          rheumatoidArthritis: { 
            patients: 234, 
            avgDrugCost: 4200, 
            alternatives: ['Biosimilar Adalimumab', 'Generic Methotrexate'],
            projectedSavings: 280000 
          },
          multipleSclerosis: { 
            patients: 89, 
            avgDrugCost: 8500, 
            alternatives: ['Biosimilar Interferon', 'Generic Glatiramer'],
            projectedSavings: 180000 
          },
          cancer: { 
            patients: 156, 
            avgDrugCost: 12000, 
            alternatives: ['Biosimilar Pembrolizumab', 'Generic Chemotherapy'],
            projectedSavings: 320000 
          },
          psoriasis: { 
            patients: 123, 
            avgDrugCost: 6800, 
            alternatives: ['Biosimilar Ustekinumab', 'Generic Topicals'],
            projectedSavings: 150000 
          }
        },
        aiSuccessMetrics: {
          readmissionProbability: { before: 0.22, after: 0.08, reduction: 63.6 },
          impactRiskReduction: { high: 189, medium: 234, low: 123, total: 546 },
          riskLevelDistribution: { critical: 89, high: 234, medium: 445, low: 890 },
          preventionPostDischarge: { 
            followUpRate: { before: 0.52, after: 0.85, improvement: 63.5 },
            medicationAdherence: { before: 0.67, after: 0.92, improvement: 37.3 },
            carePlanCompliance: { before: 0.41, after: 0.88, improvement: 114.6 }
          },
          predictiveAccuracy: 0.92,
          interventionSuccessRate: 0.84,
          costAvoidance: 1560000
        }
      }
    },
    hospitalServices: {
      id: 'hospitalServices',
      name: 'Hospital & Provider Services',
      icon: '🏥',
      description: 'Avoidable hospitalizations and length of stay optimization',
      metrics: ['Avoidable Admissions', 'Avg LOS', 'Post-Discharge Gaps', 'Hospital Savings'],
      color: '#f44336',
      detailedMetrics: {
        avoidableAdmissions: 234,
        avgLengthOfStay: 4.2,
        postDischargeGaps: 445,
        projectedSavings: 2100000,
        interventions: [
          { type: 'Avoidable Admission Prevention', savings: 850000, patients: 234 },
          { type: 'LOS Optimization', savings: 620000, patients: 445 },
          { type: 'Post-Discharge Coordination', savings: 380000, patients: 234 },
          { type: 'Readmission Prevention', savings: 250000, patients: 156 }
        ],
        illnessAnalysis: {
          heartFailure: { 
            admissions: 89, 
            avgLOS: 4.8, 
            avgCost: 45000, 
            projectedSavings: 320000,
            avoidableReasons: ['Medication Non-adherence', 'Diet Non-compliance', 'Missed Follow-up']
          },
          pneumonia: { 
            admissions: 67, 
            avgLOS: 3.2, 
            avgCost: 28000, 
            projectedSavings: 180000,
            avoidableReasons: ['Vaccination Gaps', 'Smoking', 'Poor Hygiene']
          },
          copd: { 
            admissions: 45, 
            avgLOS: 3.8, 
            avgCost: 32000, 
            projectedSavings: 140000,
            avoidableReasons: ['Smoking Continuation', 'No Pulmonary Rehab', 'Medication Issues']
          },
          diabetes: { 
            admissions: 33, 
            avgLOS: 2.5, 
            avgCost: 18000, 
            projectedSavings: 60000,
            avoidableReasons: ['Poor Glycemic Control', 'Foot Care Neglect', 'Diet Non-compliance']
          }
        },
        aiSuccessMetrics: {
          readmissionProbability: { before: 0.31, after: 0.14, reduction: 54.8 },
          impactRiskReduction: { high: 267, medium: 334, low: 178, total: 779 },
          riskLevelDistribution: { critical: 234, high: 445, medium: 667, low: 890 },
          preventionPostDischarge: { 
            followUpRate: { before: 0.38, after: 0.82, improvement: 115.8 },
            medicationAdherence: { before: 0.58, after: 0.91, improvement: 56.9 },
            carePlanCompliance: { before: 0.32, after: 0.85, improvement: 165.6 }
          },
          predictiveAccuracy: 0.94,
          interventionSuccessRate: 0.89,
          costAvoidance: 3450000
        }
      }
    },
    utilization: {
      id: 'utilization',
      name: 'Utilization Increases',
      icon: '📊',
      description: 'Excessive diagnostics and non-guideline-based procedures',
      metrics: ['Excessive Tests', 'Defensive Medicine', 'Guideline Compliance', 'Utilization Savings'],
      color: '#9c27b0',
      detailedMetrics: {
        excessiveTests: 445,
        defensiveMedicine: 234,
        guidelineCompliance: 78,
        projectedSavings: 680000,
        interventions: [
          { type: 'Guideline Compliance', savings: 280000, patients: 445 },
          { type: 'Defensive Medicine Reduction', savings: 180000, patients: 234 },
          { type: 'Test Optimization', savings: 150000, patients: 156 },
          { type: 'Procedure Review', savings: 70000, patients: 89 }
        ],
        illnessAnalysis: {
          backPain: { 
            patients: 234, 
            excessiveTests: 156, 
            avgCost: 2800, 
            projectedSavings: 180000,
            unnecessaryTests: ['Routine MRI', 'Multiple X-rays', 'EMG Studies']
          },
          chestPain: { 
            patients: 156, 
            excessiveTests: 89, 
            avgCost: 4200, 
            projectedSavings: 140000,
            unnecessaryTests: ['Cardiac CT', 'Stress Tests', 'Multiple EKGs']
          },
          headache: { 
            patients: 123, 
            excessiveTests: 67, 
            avgCost: 1800, 
            projectedSavings: 80000,
            unnecessaryTests: ['Brain MRI', 'CT Scans', 'EEG Studies']
          },
          abdominalPain: { 
            patients: 89, 
            excessiveTests: 45, 
            avgCost: 3200, 
            projectedSavings: 60000,
            unnecessaryTests: ['Abdominal CT', 'Multiple Ultrasounds', 'Endoscopy']
          }
        },
        aiSuccessMetrics: {
          readmissionProbability: { before: 0.19, after: 0.09, reduction: 52.6 },
          impactRiskReduction: { high: 156, medium: 234, low: 123, total: 513 },
          riskLevelDistribution: { critical: 89, high: 234, medium: 445, low: 667 },
          preventionPostDischarge: { 
            followUpRate: { before: 0.48, after: 0.79, improvement: 64.6 },
            medicationAdherence: { before: 0.64, after: 0.88, improvement: 37.5 },
            carePlanCompliance: { before: 0.35, after: 0.81, improvement: 131.4 }
          },
          predictiveAccuracy: 0.91,
          interventionSuccessRate: 0.82,
          costAvoidance: 1230000
        }
      }
    },
    socialDeterminants: {
      id: 'socialDeterminants',
      name: 'Social Determinants of Health',
      icon: '🏠',
      description: 'External risk factors and community support needs',
      metrics: ['SDoH Risk Factors', 'Community Needs', 'Outreach Opportunities', 'SDoH Savings'],
      color: '#607d8b',
      detailedMetrics: {
        sdohRiskFactors: 567,
        communityNeeds: 234,
        outreachOpportunities: 445,
        projectedSavings: 420000,
        interventions: [
          { type: 'Transportation Assistance', savings: 180000, patients: 234 },
          { type: 'Food Security Program', savings: 120000, patients: 156 },
          { type: 'Housing Support', savings: 80000, patients: 89 },
          { type: 'Community Outreach', savings: 40000, patients: 67 }
        ],
        illnessAnalysis: {
          depression: { 
            patients: 234, 
            sdohFactors: 156, 
            avgCost: 8500, 
            projectedSavings: 180000,
            socialFactors: ['Transportation Issues', 'Food Insecurity', 'Social Isolation']
          },
          substanceAbuse: { 
            patients: 123, 
            sdohFactors: 89, 
            avgCost: 12000, 
            projectedSavings: 140000,
            socialFactors: ['Housing Instability', 'Employment Issues', 'Legal Problems']
          },
          homelessness: { 
            patients: 67, 
            sdohFactors: 45, 
            avgCost: 15000, 
            projectedSavings: 100000,
            socialFactors: ['No Permanent Housing', 'Limited Access to Care', 'Basic Needs Unmet']
          }
        },
        aiSuccessMetrics: {
          readmissionProbability: { before: 0.25, after: 0.11, reduction: 56.0 },
          impactRiskReduction: { high: 198, medium: 267, low: 145, total: 510 },
          riskLevelDistribution: { critical: 123, high: 234, medium: 445, low: 667 },
          preventionPostDischarge: { 
            followUpRate: { before: 0.42, after: 0.76, improvement: 81.0 },
            medicationAdherence: { before: 0.59, after: 0.87, improvement: 37.5 },
            carePlanCompliance: { before: 0.31, after: 0.78, improvement: 151.6 }
          },
          predictiveAccuracy: 0.87,
          interventionSuccessRate: 0.79,
          costAvoidance: 890000
        }
      }
    },
    fraudWaste: {
      id: 'fraudWaste',
      name: 'Fraud, Waste & Abuse',
      icon: '🚨',
      description: 'Patterns of upcoding, duplicate billing, and unnecessary services',
      metrics: ['FWA Cases', 'Suspicious Claims', 'Blocked Payments', 'FWA Savings'],
      color: '#ff5722',
      detailedMetrics: {
        fwaCases: 89,
        suspiciousClaims: 234,
        blockedPayments: 156,
        projectedSavings: 380000,
        interventions: [
          { type: 'Duplicate Claim Detection', savings: 120000, patients: 89 },
          { type: 'Upcoding Prevention', savings: 100000, patients: 67 },
          { type: 'Unnecessary Service Block', savings: 80000, patients: 45 },
          { type: 'Pattern Analysis', savings: 80000, patients: 34 }
        ],
        illnessAnalysis: {
          upcoding: { 
            cases: 45, 
            avgOvercharge: 2500, 
            projectedSavings: 112500,
            patterns: ['E&M Level Inflation', 'Procedure Upcoding', 'Modifier Abuse']
          },
          duplicateBilling: { 
            cases: 34, 
            avgDuplicate: 1800, 
            projectedSavings: 61200,
            patterns: ['Same Day Services', 'Split Billing', 'Duplicate Claims']
          },
          unnecessaryServices: { 
            cases: 23, 
            avgUnnecessary: 3200, 
            projectedSavings: 73600,
            patterns: ['Unbundling', 'Unnecessary Procedures', 'Excessive Testing']
          }
        },
        aiSuccessMetrics: {
          readmissionProbability: { before: 0.16, after: 0.07, reduction: 56.3 },
          impactRiskReduction: { high: 145, medium: 189, low: 98, total: 432 },
          riskLevelDistribution: { critical: 67, high: 156, medium: 234, low: 445 },
          preventionPostDischarge: { 
            followUpRate: { before: 0.51, after: 0.83, improvement: 62.7 },
            medicationAdherence: { before: 0.68, after: 0.90, improvement: 32.4 },
            carePlanCompliance: { before: 0.39, after: 0.84, improvement: 115.4 }
          },
          predictiveAccuracy: 0.96,
          interventionSuccessRate: 0.91,
          costAvoidance: 670000
        }
      }
    },
    administrative: {
      id: 'administrative',
      name: 'Administrative Costs',
      icon: '📋',
      description: 'High admin burdens from claims reviews and prior auths',
      metrics: ['Prior Auths', 'Claims Reviews', 'Automation Opportunities', 'Admin Savings'],
      color: '#795548',
      detailedMetrics: {
        priorAuths: 1234,
        claimsReviews: 567,
        automationOpportunities: 890,
        projectedSavings: 520000,
        interventions: [
          { type: 'Prior Auth Automation', savings: 200000, patients: 1234 },
          { type: 'Claims Review Automation', savings: 150000, patients: 567 },
          { type: 'Documentation Optimization', savings: 120000, patients: 445 },
          { type: 'Workflow Automation', savings: 50000, patients: 234 }
        ],
        illnessAnalysis: {
          mri: { 
            priorAuths: 234, 
            avgTime: '3.2 days', 
            automation: 'AI Pre-auth', 
            projectedSavings: 46800,
            adminBurdens: ['Manual Review', 'Provider Calls', 'Documentation Requests']
          },
          specialistVisit: { 
            priorAuths: 156, 
            avgTime: '1.8 days', 
            automation: 'Auto-approval', 
            projectedSavings: 31200,
            adminBurdens: ['Network Verification', 'Referral Processing', 'Appointment Scheduling']
          },
          surgery: { 
            priorAuths: 89, 
            avgTime: '5.4 days', 
            automation: 'ML Review', 
            projectedSavings: 35600,
            adminBurdens: ['Surgical Clearance', 'Pre-op Testing', 'Insurance Verification']
          }
        },
        aiSuccessMetrics: {
          readmissionProbability: { before: 0.18, after: 0.08, reduction: 55.6 },
          impactRiskReduction: { high: 167, medium: 223, low: 134, total: 524 },
          riskLevelDistribution: { critical: 78, high: 189, medium: 334, low: 567 },
          preventionPostDischarge: { 
            followUpRate: { before: 0.45, after: 0.81, improvement: 80.0 },
            medicationAdherence: { before: 0.61, after: 0.89, improvement: 45.9 },
            carePlanCompliance: { before: 0.33, after: 0.79, improvement: 139.4 }
          },
          predictiveAccuracy: 0.93,
          interventionSuccessRate: 0.86,
          costAvoidance: 980000
        }
      }
    },
    clinicalGuidance: {
      id: 'clinicalGuidance',
      name: 'Clinical Cost Guidance',
      icon: '🎯',
      description: 'Cost-effective care alternatives and clinical reasoning',
      metrics: ['Treatment Paths', 'Cost Alternatives', 'Clinical Decisions', 'Clinical Savings'],
      color: '#4caf50',
      detailedMetrics: {
        treatmentPaths: 445,
        costAlternatives: 234,
        clinicalDecisions: 567,
        projectedSavings: 680000,
        interventions: [
          { type: 'Treatment Path Optimization', savings: 250000, patients: 445 },
          { type: 'Cost-Effective Alternatives', savings: 180000, patients: 234 },
          { type: 'Clinical Decision Support', savings: 150000, patients: 156 },
          { type: 'Preventive Care Recommendation', savings: 100000, patients: 123 }
        ],
        illnessAnalysis: {
          type2Diabetes: { 
            patients: 234, 
            currentPath: 'Brand Name Drugs', 
            alternative: 'Generic + Lifestyle', 
            projectedSavings: 150000,
            clinicalAlternatives: ['Metformin + Diet', 'Sulfonylureas', 'DPP-4 Inhibitors']
          },
          hypertension: { 
            patients: 156, 
            currentPath: 'Multiple Medications', 
            alternative: 'Single Pill Combination', 
            projectedSavings: 80000,
            clinicalAlternatives: ['ACE + Diuretic', 'ARB + CCB', 'Beta Blocker + Diuretic']
          },
          depression: { 
            patients: 123, 
            currentPath: 'Brand Antidepressant', 
            alternative: 'Generic + Therapy', 
            projectedSavings: 120000,
            clinicalAlternatives: ['SSRI + CBT', 'SNRI + Group Therapy', 'Bupropion + Exercise']
          }
        },
        aiSuccessMetrics: {
          readmissionProbability: { before: 0.24, after: 0.10, reduction: 58.3 },
          impactRiskReduction: { high: 212, medium: 289, low: 156, total: 657 },
          riskLevelDistribution: { critical: 134, high: 267, medium: 445, low: 623 },
          preventionPostDischarge: { 
            followUpRate: { before: 0.47, after: 0.84, improvement: 78.7 },
            medicationAdherence: { before: 0.65, after: 0.93, improvement: 43.1 },
            carePlanCompliance: { before: 0.36, after: 0.87, improvement: 141.7 }
          },
          predictiveAccuracy: 0.95,
          interventionSuccessRate: 0.88,
          costAvoidance: 1450000
        }
      }
    }
  };

  // Generate detailed timeline data for 30+ patients
  const generateDetailedTimelineData = (driverId) => {
    const patients = [];
    const driverColors = {
      chronicDisease: '#e91e63',
      drugCosts: '#ff9800', 
      hospitalServices: '#f44336',
      utilization: '#9c27b0',
      socialDeterminants: '#607d8b',
      fraudWaste: '#ff5722',
      administrative: '#795548',
      clinicalGuidance: '#4caf50'
    };
    
    const driverNames = {
      chronicDisease: 'Chronic Disease Burden',
      drugCosts: 'Drug Costs',
      hospitalServices: 'Hospital & Provider Services', 
      utilization: 'Utilization Increases',
      socialDeterminants: 'Social Determinants of Health',
      fraudWaste: 'Fraud, Waste & Abuse',
      administrative: 'Administrative Costs',
      clinicalGuidance: 'Clinical Cost Guidance'
    };

      // Real patient names for more realistic data
  const realNames = [
    'Sarah Johnson', 'Michael Chen', 'Lisa Rodriguez', 'David Thompson', 'Jennifer Williams',
    'Robert Davis', 'Maria Garcia', 'James Wilson', 'Patricia Brown', 'John Martinez',
    'Linda Anderson', 'Christopher Taylor', 'Barbara Moore', 'Daniel Jackson', 'Elizabeth White',
    'Matthew Harris', 'Susan Martin', 'Anthony Clark', 'Jessica Lewis', 'Kevin Lee',
    'Nancy Hall', 'Steven Allen', 'Karen Young', 'Brian King', 'Betty Wright',
    'Timothy Green', 'Helen Baker', 'Ronald Adams', 'Donna Nelson', 'Jason Carter',
    'Carol Mitchell', 'Eric Perez', 'Deborah Roberts', 'Mark Turner', 'Ruth Phillips'
  ];

  // Generate 35 patients with detailed timelines
  for (let i = 1; i <= 35; i++) {
    const patientId = `MRN-2024-${String(i).padStart(6, '0')}`;
    const patientName = realNames[i - 1];
    
    // Special cases for specific patients
    let age, diagnosis;
    if (patientName === 'Lisa Rodriguez') {
      age = 72;
      diagnosis = 'COPD';
    } else if (patientName === 'Michael Chen') {
      age = 78;
      diagnosis = 'COPD';
    } else {
      age = 45 + (i % 35);
      diagnosis = null; // Will be generated by generatePatientDetailedData
    }
    
    const riskScore = 60 + (i % 40);
    
    // Generate timeline events based on driver type
    const timelineEvents = generatePatientTimelineEvents(driverId, i);
    
    // Generate additional patient data
    const patientData = generatePatientDetailedData(driverId, i, patientName);
    
    // Special totalSavings for Michael Chen
    let totalSavings = timelineEvents.filter(e => e.ai).reduce((sum, e) => sum + (e.costSaved || 0), 0);
    if (patientName === 'Michael Chen') {
      totalSavings = 25000; // Set to $25,000 as specified
    }

    patients.push({
      id: patientId,
      name: patientName,
      age: age,
      riskScore: riskScore,
      driverId: driverId,
      driverName: driverNames[driverId],
      driverColor: driverColors[driverId],
      timeline: timelineEvents,
      totalSavings: totalSavings,
      interventions: timelineEvents.filter(e => e.ai).length,
      status: i % 3 === 0 ? 'Critical' : i % 3 === 1 ? 'High' : 'Medium',
      // Additional detailed data
      aiRecommendations: patientData.aiRecommendations,
      costBreakdown: patientData.costBreakdown,
      insights: patientData.insights,
      futureSteps: patientData.futureSteps,
      diagnosis: diagnosis || patientData.diagnosis,
      medications: patientData.medications,
      providers: patientData.providers
    });
  }
    
    return patients;
  };

  const generatePatientTimelineEvents = (driverId, patientIndex) => {
    const events = [];
    const baseDate = new Date('2024-01-01');
    
    // Generate 8-12 events per patient
    const numEvents = 8 + (patientIndex % 5);
    
    for (let i = 0; i < numEvents; i++) {
      const eventDate = new Date(baseDate);
      eventDate.setDate(baseDate.getDate() + (i * 3) + (patientIndex % 7));
      
      const isAIEvent = i % 2 === 0; // Alternate between AI and non-AI events
      const event = generateTimelineEvent(driverId, i, patientIndex, isAIEvent, eventDate);
      events.push(event);
    }
    
    return events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const generatePatientDetailedData = (driverId, patientIndex, patientName) => {
    const diagnosisTemplates = {
      chronicDisease: ['COPD', 'Type 2 Diabetes', 'Hypertension', 'Heart Failure', 'Chronic Kidney Disease'],
      drugCosts: ['Rheumatoid Arthritis', 'Multiple Sclerosis', 'Cancer', 'Psoriasis', 'Inflammatory Bowel Disease'],
      hospitalServices: ['Pneumonia', 'Heart Failure', 'Sepsis', 'Stroke', 'Trauma'],
      utilization: ['Back Pain', 'Chest Pain', 'Abdominal Pain', 'Headache', 'Fatigue'],
      socialDeterminants: ['Depression', 'Anxiety', 'Substance Abuse', 'Homelessness', 'Food Insecurity'],
      fraudWaste: ['Upcoding', 'Duplicate Billing', 'Unnecessary Services', 'Kickbacks', 'Identity Theft'],
      administrative: ['Prior Authorization', 'Claims Processing', 'Documentation', 'Coding', 'Billing'],
      clinicalGuidance: ['Treatment Optimization', 'Medication Management', 'Care Coordination', 'Preventive Care', 'Specialist Referral']
    };

    const medicationTemplates = {
      chronicDisease: ['Metformin', 'Lisinopril', 'Amlodipine', 'Atorvastatin', 'Aspirin'],
      drugCosts: ['Humira', 'Keytruda', 'Eliquis', 'Xarelto', 'Ocrevus'],
      hospitalServices: ['Antibiotics', 'Diuretics', 'Blood Thinners', 'Pain Meds', 'Anti-nausea'],
      utilization: ['Ibuprofen', 'Acetaminophen', 'Muscle Relaxants', 'Anti-inflammatories', 'Topical Creams'],
      socialDeterminants: ['Antidepressants', 'Anti-anxiety', 'Mood Stabilizers', 'Sleep Aids', 'Pain Management'],
      fraudWaste: ['Generic Alternatives', 'Biosimilars', 'Cost-effective Options', 'Formulary Drugs', 'Prior Auth Meds'],
      administrative: ['E-prescriptions', 'Automated Refills', 'Medication Reconciliation', 'Drug Interactions', 'Adherence Monitoring'],
      clinicalGuidance: ['Evidence-based Meds', 'Guideline-compliant', 'Cost-effective Alternatives', 'Generic Substitutions', 'Therapeutic Equivalents']
    };

    const providerTemplates = {
      chronicDisease: ['Dr. Sarah Johnson, PCP', 'Dr. Michael Chen, Endocrinologist', 'Dr. Lisa Rodriguez, Cardiologist'],
      drugCosts: ['Dr. David Thompson, Rheumatologist', 'Dr. Jennifer Williams, Oncologist', 'Dr. Robert Davis, Neurologist'],
      hospitalServices: ['Dr. Maria Garcia, Hospitalist', 'Dr. James Wilson, Intensivist', 'Dr. Patricia Brown, Surgeon'],
      utilization: ['Dr. John Martinez, Orthopedist', 'Dr. Linda Anderson, Neurologist', 'Dr. Christopher Taylor, Radiologist'],
      socialDeterminants: ['Dr. Barbara Moore, Psychiatrist', 'Dr. Daniel Jackson, Social Worker', 'Dr. Elizabeth White, Case Manager'],
      fraudWaste: ['Dr. Matthew Harris, Medical Director', 'Dr. Susan Martin, Compliance Officer', 'Dr. Anthony Clark, Auditor'],
      administrative: ['Dr. Jessica Lewis, Medical Director', 'Dr. Kevin Lee, Quality Manager', 'Dr. Nancy Hall, Process Improvement'],
      clinicalGuidance: ['Dr. Steven Allen, Medical Director', 'Dr. Karen Young, Clinical Pharmacist', 'Dr. Brian King, Care Coordinator']
    };

    const diagnosis = diagnosisTemplates[driverId][patientIndex % diagnosisTemplates[driverId].length];
    const medications = medicationTemplates[driverId].slice(0, 3 + (patientIndex % 3));
    const providers = providerTemplates[driverId].slice(0, 2 + (patientIndex % 2));

    // Generate AI recommendations based on driver type
    const aiRecommendations = generateAIRecommendations(driverId, patientIndex, diagnosis);
    
    // Generate cost breakdown
    const costBreakdown = generateCostBreakdown(driverId, patientIndex);
    
    // Generate insights
    const insights = generateInsights(driverId, patientIndex, diagnosis);
    
    // Generate future steps
    const futureSteps = generateFutureSteps(driverId, patientIndex, diagnosis);

    return {
      diagnosis,
      medications,
      providers,
      aiRecommendations,
      costBreakdown,
      insights,
      futureSteps
    };
  };

  const generateAIRecommendations = (driverId, patientIndex, diagnosis) => {
    // Special recommendations for Michael Chen (COPD patient)
    if (driverId === 'chronicDisease' && diagnosis === 'COPD') {
      return [
        { priority: 'Critical', title: 'COPD Exacerbation Prevention System', description: 'AI-powered environmental monitoring and early intervention for respiratory distress', impact: 'Prevent $25,000 in ER costs per exacerbation' },
        { priority: 'High', title: 'Rescue Inhaler Management', description: 'AI-driven medication delivery and adherence monitoring for COPD medications', impact: 'Reduce hospitalizations by 70%' },
        { priority: 'Medium', title: 'Environmental Risk Assessment', description: 'AI monitoring of heat waves, air quality, and SDoH factors affecting COPD', impact: 'Prevent 80% of weather-related exacerbations' },
        { priority: 'Medium', title: 'Telemedicine Integration', description: 'AI-powered virtual care coordination for rural COPD patients', impact: 'Improve access to care by 90%' }
      ];
    }

    const recommendations = {
      chronicDisease: [
        { priority: 'Critical', title: 'COPD Medication Adherence Program', description: 'AI-powered monitoring and intervention for inhaler compliance', impact: 'Reduce exacerbations by 65%' },
        { priority: 'High', title: 'Medication Adherence', description: 'AI-driven medication adjustment based on trends', impact: 'Improve adherence by 60%' },
        { priority: 'Medium', title: 'Oxygen Therapy Optimization', description: 'Smart titration and monitoring of oxygen requirements', impact: 'Prevent hospitalizations' }
      ],
      drugCosts: [
        { priority: 'Critical', title: 'Biosimilar Switch', description: 'Transition to cost-effective biosimilar alternatives', impact: 'Save $25,000 annually' },
        { priority: 'High', title: 'Adherence Monitoring', description: 'AI-powered medication adherence tracking', impact: 'Improve outcomes by 50%' },
        { priority: 'Medium', title: 'Cost Analysis', description: 'Real-time cost comparison and optimization', impact: 'Reduce drug costs by 30%' }
      ],
      hospitalServices: [
        { priority: 'Critical', title: 'Avoidable Admission Prevention', description: 'AI routing to appropriate care settings', impact: 'Prevent $45,000 in costs' },
        { priority: 'High', title: 'Length of Stay Optimization', description: 'AI-driven discharge planning', impact: 'Reduce LOS by 2 days' },
        { priority: 'Medium', title: 'Post-Discharge Coordination', description: 'Automated follow-up scheduling', impact: 'Reduce readmissions by 35%' }
      ],
      utilization: [
        { priority: 'Critical', title: 'Guideline Compliance', description: 'AI ensures evidence-based care delivery', impact: 'Reduce unnecessary procedures by 40%' },
        { priority: 'High', title: 'Defensive Medicine Reduction', description: 'AI eliminates unnecessary diagnostic tests', impact: 'Save $18,000 per case' },
        { priority: 'Medium', title: 'Test Optimization', description: 'AI-driven diagnostic test selection', impact: 'Improve diagnostic accuracy' }
      ],
      socialDeterminants: [
        { priority: 'Critical', title: 'Transportation Assistance', description: 'AI arranges reliable transportation services', impact: 'Improve appointment attendance by 70%' },
        { priority: 'High', title: 'Food Security Program', description: 'AI connects patients to food assistance', impact: 'Improve medication adherence' },
        { priority: 'Medium', title: 'Housing Support', description: 'AI provides housing resources and support', impact: 'Reduce emergency visits by 45%' }
      ],
      fraudWaste: [
        { priority: 'Critical', title: 'Duplicate Claim Detection', description: 'AI identifies and prevents duplicate billing', impact: 'Save $8,000 per case' },
        { priority: 'High', title: 'Upcoding Prevention', description: 'AI ensures accurate coding and billing', impact: 'Prevent $15,000 in overpayments' },
        { priority: 'Medium', title: 'Pattern Analysis', description: 'AI detects suspicious billing patterns', impact: 'Reduce fraud by 60%' }
      ],
      administrative: [
        { priority: 'Critical', title: 'Prior Auth Automation', description: 'AI streamlines authorization processes', impact: 'Reduce processing time by 80%' },
        { priority: 'High', title: 'Claims Review Automation', description: 'AI automates claims review and processing', impact: 'Improve accuracy by 90%' },
        { priority: 'Medium', title: 'Documentation Optimization', description: 'AI enhances medical documentation', impact: 'Reduce administrative burden' }
      ],
      clinicalGuidance: [
        { priority: 'Critical', title: 'Treatment Path Optimization', description: 'AI recommends optimal treatment pathways', impact: 'Improve outcomes by 40%' },
        { priority: 'High', title: 'Cost-Effective Alternatives', description: 'AI suggests cost-effective treatment options', impact: 'Reduce costs by 25%' },
        { priority: 'Medium', title: 'Clinical Decision Support', description: 'AI provides evidence-based guidance', impact: 'Improve clinical decisions' }
      ]
    };

    return recommendations[driverId] || [];
  };

  const generateCostBreakdown = (driverId, patientIndex) => {
    const baseCosts = {
      chronicDisease: { before: 25000, after: 15000, savings: 10000 },
      drugCosts: { before: 85000, after: 60000, savings: 25000 },
      hospitalServices: { before: 120000, after: 75000, savings: 45000 },
      utilization: { before: 45000, after: 27000, savings: 18000 },
      socialDeterminants: { before: 35000, after: 25000, savings: 10000 },
      fraudWaste: { before: 28000, after: 20000, savings: 8000 },
      administrative: { before: 15000, after: 10000, savings: 5000 },
      clinicalGuidance: { before: 40000, after: 28000, savings: 12000 }
    };

    const base = baseCosts[driverId];
    const multiplier = 0.8 + (patientIndex % 5) * 0.2; // Vary costs by patient

    return {
      beforeAI: Math.round(base.before * multiplier),
      afterAI: Math.round(base.after * multiplier),
      savings: Math.round(base.savings * multiplier),
      breakdown: [
        { category: 'Medications', before: Math.round(base.before * 0.3 * multiplier), after: Math.round(base.after * 0.25 * multiplier) },
        { category: 'Hospitalizations', before: Math.round(base.before * 0.4 * multiplier), after: Math.round(base.after * 0.2 * multiplier) },
        { category: 'Procedures', before: Math.round(base.before * 0.2 * multiplier), after: Math.round(base.after * 0.3 * multiplier) },
        { category: 'Administrative', before: Math.round(base.before * 0.1 * multiplier), after: Math.round(base.after * 0.25 * multiplier) }
      ]
    };
  };

  const generateInsights = (driverId, patientIndex, diagnosis) => {
    // Special insights for Michael Chen (COPD patient)
    if (driverId === 'chronicDisease' && diagnosis === 'COPD') {
      return [
        'Patient has severe COPD with annual ER visits during heat waves and respiratory seasons',
        'Lives in rural area (zip 34476) with poor access to care and transportation barriers',
        'Missing rescue inhaler identified during virtual PCP visit - critical care gap',
        'Environmental factors (heat waves) correlate with 80% of exacerbations',
        'AI intervention prevented $25,000 ER visit through proactive medication delivery',
        'Telemedicine integration essential for rural COPD patient care coordination'
      ];
    }

    const insights = {
      chronicDisease: [
        'Patient has severe COPD with frequent exacerbations requiring hospitalization',
        'Poor inhaler technique and medication adherence contributing to disease progression',
        'Oxygen saturation frequently drops below 90% during daily activities',
        'Pulmonary rehabilitation could improve quality of life and reduce hospital visits'
      ],
      drugCosts: [
        'High-cost medications represent 60% of total drug spend',
        'Biosimilar alternatives available for 3 current medications',
        'Medication adherence patterns indicate need for intervention',
        'Cost savings potential through therapeutic substitutions'
      ],
      hospitalServices: [
        'Patient has 3 avoidable admissions in past 12 months',
        'Average length of stay 2.5 days longer than benchmark',
        'Post-discharge care coordination gaps identified',
        'AI routing could prevent 80% of avoidable admissions'
      ],
      utilization: [
        '30% of diagnostic tests ordered are non-guideline compliant',
        'Defensive medicine practices driving up costs',
        'AI could optimize 45% of current utilization patterns',
        'Evidence-based care could reduce costs by 40%'
      ],
      socialDeterminants: [
        'Transportation barriers affecting 70% of appointments',
        'Food insecurity impacting medication adherence',
        'Housing instability contributing to health outcomes',
        'Community resources underutilized by 60%'
      ],
      fraudWaste: [
        'Suspicious billing patterns detected in 3 claims',
        'Duplicate services identified in recent claims',
        'Upcoding suspected in 2 provider encounters',
        'AI detection prevented $12,000 in improper payments'
      ],
      administrative: [
        'Prior authorization delays averaging 5.2 days',
        'Claims processing errors affecting 15% of submissions',
        'Documentation gaps in 25% of encounters',
        'Automation could reduce administrative costs by 50%'
      ],
      clinicalGuidance: [
        'Treatment plan not aligned with latest guidelines',
        'Cost-effective alternatives available for current regimen',
        'Care coordination gaps affecting outcomes',
        'AI guidance could improve outcomes by 35%'
      ]
    };

    return insights[driverId] || [];
  };

  const generateFutureSteps = (driverId, patientIndex, diagnosis) => {
    // Special future steps for Michael Chen (COPD patient)
    if (driverId === 'chronicDisease' && diagnosis === 'COPD') {
      return [
        { step: 'Deploy environmental monitoring system for heat wave alerts', timeline: 'Immediate', priority: 'Critical' },
        { step: 'Establish telemedicine care coordination for rural access', timeline: '1 week', priority: 'Critical' },
        { step: 'Implement rescue inhaler delivery and monitoring system', timeline: '2 weeks', priority: 'High' },
        { step: 'Set up transportation assistance for specialist appointments', timeline: '1 month', priority: 'High' },
        { step: 'Monitor exacerbation patterns during weather events', timeline: 'Ongoing', priority: 'Medium' },
        { step: 'Track medication adherence through pharmacy integration', timeline: 'Ongoing', priority: 'Medium' }
      ];
    }

    const steps = {
      chronicDisease: [
        { step: 'Initiate COPD medication adherence program', timeline: 'Immediate', priority: 'Critical' },
        { step: 'Schedule pulmonary rehabilitation assessment', timeline: '1 week', priority: 'High' },
        { step: 'Implement oxygen therapy monitoring', timeline: '2 weeks', priority: 'Medium' },
        { step: 'Track exacerbation frequency monthly', timeline: 'Ongoing', priority: 'Low' }
      ],
      drugCosts: [
        { step: 'Initiate biosimilar transition protocol', timeline: '2 weeks', priority: 'Critical' },
        { step: 'Implement adherence monitoring system', timeline: '1 week', priority: 'High' },
        { step: 'Review therapeutic alternatives', timeline: '1 month', priority: 'Medium' },
        { step: 'Evaluate cost savings quarterly', timeline: 'Ongoing', priority: 'Low' }
      ],
      hospitalServices: [
        { step: 'Deploy AI routing system', timeline: 'Immediate', priority: 'Critical' },
        { step: 'Optimize discharge planning process', timeline: '1 week', priority: 'High' },
        { step: 'Establish post-discharge monitoring', timeline: '2 weeks', priority: 'Medium' },
        { step: 'Track readmission rates monthly', timeline: 'Ongoing', priority: 'Low' }
      ],
      utilization: [
        { step: 'Implement guideline compliance system', timeline: 'Immediate', priority: 'Critical' },
        { step: 'Reduce defensive medicine practices', timeline: '1 month', priority: 'High' },
        { step: 'Optimize diagnostic test ordering', timeline: '2 weeks', priority: 'Medium' },
        { step: 'Monitor utilization patterns', timeline: 'Ongoing', priority: 'Low' }
      ],
      socialDeterminants: [
        { step: 'Arrange transportation services', timeline: 'Immediate', priority: 'Critical' },
        { step: 'Connect to food assistance programs', timeline: '1 week', priority: 'High' },
        { step: 'Provide housing support resources', timeline: '2 weeks', priority: 'Medium' },
        { step: 'Monitor social needs quarterly', timeline: 'Ongoing', priority: 'Low' }
      ],
      fraudWaste: [
        { step: 'Deploy AI fraud detection system', timeline: 'Immediate', priority: 'Critical' },
        { step: 'Review suspicious claims manually', timeline: '1 week', priority: 'High' },
        { step: 'Implement preventive measures', timeline: '1 month', priority: 'Medium' },
        { step: 'Monitor fraud patterns continuously', timeline: 'Ongoing', priority: 'Low' }
      ],
      administrative: [
        { step: 'Automate prior authorization process', timeline: 'Immediate', priority: 'Critical' },
        { step: 'Implement claims review automation', timeline: '1 week', priority: 'High' },
        { step: 'Optimize documentation workflows', timeline: '2 weeks', priority: 'Medium' },
        { step: 'Track efficiency metrics monthly', timeline: 'Ongoing', priority: 'Low' }
      ],
      clinicalGuidance: [
        { step: 'Implement AI clinical decision support', timeline: 'Immediate', priority: 'Critical' },
        { step: 'Review treatment plan alignment', timeline: '1 week', priority: 'High' },
        { step: 'Optimize care coordination', timeline: '2 weeks', priority: 'Medium' },
        { step: 'Monitor clinical outcomes', timeline: 'Ongoing', priority: 'Low' }
      ]
    };

    return steps[driverId] || [];
  };

  const generateProofData = (patientName, eventType, agent) => {
    const proofTemplates = {
      'Michael Chen': {
        'AI Model Alert': {
          systemLog: {
            timestamp: '2024-03-14T08:30:00Z',
            event: 'AI Model Alert Generated',
            model: 'Trend-Agent-001',
            alertType: 'Annual ER Trend Analysis',
            patientId: 'MRN-2024-000002',
            analysis: 'Patient shows annual ER visits during respiratory seasons (Fall/Winter)',
            riskScore: '85/100',
            confidence: '92%',
            dataSource: 'Claims History, ER Records',
            status: 'Active Alert'
          },
          trendAnalysis: {
            historicalData: {
              '2021': '2 ER visits (respiratory)',
              '2022': '3 ER visits (respiratory)',
              '2023': '2 ER visits (respiratory)',
              '2024': '1 ER visit (respiratory) - YTD'
            },
            seasonalPattern: 'Peak visits during heat waves and flu season',
            correlation: '80% correlation with environmental factors',
            prediction: 'High risk for next exacerbation within 30 days'
          }
        },
        'Agentic AI Review': {
          patientHistory: {
            timestamp: '2024-03-14T08:35:00Z',
            agent: 'Review-Agent-002',
            reviewType: 'Comprehensive Patient History Analysis',
            keyFindings: [
              'COPD diagnosis confirmed 2019',
              'Annual ER visits during heat waves',
              'Rural location (zip 34476) with limited care access',
              'Previous exacerbations: 2 in 2023, 1 in 2024',
              'Medication adherence: 60% (below target)'
            ],
            riskFactors: [
              'Environmental triggers (heat, humidity)',
              'Geographic isolation',
              'Transportation barriers',
              'Limited specialist access'
            ],
            seasonalRisk: 'High risk during summer heat waves',
            recommendedAction: 'Proactive intervention before next heat wave'
          },
          environmentalData: {
            location: 'Rural Florida (zip 34476)',
            climateZone: 'Humid subtropical',
            heatWaveFrequency: '3-4 per year',
            airQualityIndex: 'Moderate to Poor during heat waves',
            healthcareAccess: 'Limited - 45 minutes to nearest specialist'
          }
        },
        'Proactive Alert': {
          alertSystem: {
            timestamp: '2024-03-14T08:40:00Z',
            agent: 'Alert-Agent-003',
            alertId: 'ALERT-2024-000002-001',
            severity: 'High',
            category: 'Environmental Risk',
            description: 'COPD patient at risk during upcoming heat wave',
            assignedTo: 'Case Management Team',
            priority: 'Immediate',
            escalationTriggers: ['Heat wave forecast', 'Previous exacerbations', 'Rural location']
          },
          caseManagerNotification: {
            recipient: 'Maria Rodriguez, Case Manager',
            method: 'SMS + Email + Dashboard Alert',
            message: 'Michael Chen (COPD) at high risk during upcoming heat wave. Previous exacerbations correlate with environmental factors. Immediate intervention recommended.',
            responseRequired: 'Yes',
            deadline: '2 hours'
          }
        },
        'Environmental Analysis': {
          environmentalCorrelation: {
            timestamp: '2024-03-14T08:45:00Z',
            agent: 'Env-Agent-004',
            analysis: 'Environmental & SDoH AI correlates zip code 34476 with ER influx due to heat and COPD',
            dataPoints: [
              'Heat index >95°F correlates with 80% of exacerbations',
              'Air quality index >100 during heat waves',
              'Rural location limits access to immediate care',
              'Transportation barriers during extreme weather'
            ],
            correlationStrength: '85%',
            predictiveAccuracy: '78%',
            riskAssessment: 'Critical during heat waves'
          },
          weatherIntegration: {
            weatherService: 'National Weather Service API',
            forecast: 'Heat wave expected in 7 days',
            temperature: 'High 98°F, Low 78°F',
            humidity: '85%',
            airQuality: 'Moderate to Poor',
            duration: '5 days',
            riskLevel: 'High'
          }
        },
        'Risk Elevation': {
          riskAssessment: {
            timestamp: '2024-03-14T08:50:00Z',
            agent: 'Risk-Agent-005',
            riskFactors: [
              'Poor access to care (45 min to specialist)',
              'Transportation barriers during heat waves',
              'Limited emergency response in rural area',
              'Previous exacerbations during similar conditions'
            ],
            riskScore: '92/100',
            probabilityOfExacerbation: '85%',
            estimatedCostIfHospitalized: '$25,000',
            timeToIntervention: 'Critical - 24-48 hours'
          },
          escalationMatrix: {
            currentLevel: 'Medium Risk',
            elevatedTo: 'High Risk',
            triggers: ['Heat wave forecast', 'Previous exacerbation pattern', 'Rural location'],
            immediateActions: ['Proactive medication delivery', 'Telemedicine consultation', 'Transportation assistance']
          }
        },
        'Communication Planning': {
          communicationAnalysis: {
            timestamp: '2024-03-14T08:55:00Z',
            agent: 'Comm-Agent-006',
            patientPreferences: {
              preferredMethod: 'Phone',
              preferredTime: '10:00 AM - 2:00 PM',
              language: 'English',
              accessibility: 'Landline phone user',
              responseRate: '75% for phone calls'
            },
            communicationHistory: [
              { method: 'Phone', successRate: '75%', responseTime: '15 minutes' },
              { method: 'SMS', successRate: '40%', responseTime: '2 hours' },
              { method: 'Email', successRate: '20%', responseTime: '24 hours' }
            ],
            recommendedApproach: 'Phone call during preferred hours with follow-up SMS'
          },
          engagementStrategy: {
            approach: 'Empathetic outreach with clear action plan',
            tone: 'Supportive and informative',
            keyMessages: [
              'Proactive care during upcoming weather',
              'Medication availability and delivery options',
              'Emergency contact information',
              'Transportation assistance if needed'
            ]
          }
        },
        'Case Assignment': {
          caseAssignment: {
            timestamp: '2024-03-14T09:00:00Z',
            agent: 'Assign-Agent-007',
            caseId: 'CASE-2024-000002-001',
            patient: 'Michael Chen',
            assignedTo: 'Maria Rodriguez, Case Manager',
            priority: 'High',
            reason: 'COPD patient at risk during upcoming heat wave',
            estimatedResolution: '48 hours',
            interventionType: 'Proactive care coordination',
            riskLevel: 'High'
          },
          caseManagerProfile: {
            name: 'Maria Rodriguez',
            experience: '5 years COPD case management',
            specializations: ['Respiratory conditions', 'Rural health', 'Environmental health'],
            successRate: '85%',
            patientSatisfaction: '4.8/5.0'
          }
        },
        'Member Contact': {
          callRecord: {
            timestamp: '2024-03-14T09:15:00Z',
            caller: 'Maria Rodriguez, Case Manager',
            recipient: 'Michael Chen',
            duration: '12 minutes',
            outcome: 'Successful contact',
            keyTopics: [
              'Upcoming heat wave awareness',
              'Current medication status',
              'Access to care concerns',
              'Emergency plan development'
            ]
          },
          patientResponse: {
            concerns: [
              'Worsening cough over past week',
              'Delayed PCP appointment (3 weeks wait)',
              'Difficulty accessing specialist care',
              'Transportation challenges during heat'
            ],
            cooperation: 'High - patient acknowledges risks and willing to engage',
            immediateNeeds: 'Rescue inhaler refill, earlier appointment'
          }
        },
        'Symptom Report': {
          symptomAssessment: {
            timestamp: '2024-03-14T09:20:00Z',
            reportedSymptoms: [
              'Worsening cough (7 days duration)',
              'Increased shortness of breath',
              'Fatigue during daily activities',
              'Difficulty sleeping due to breathing'
            ],
            severity: 'Moderate',
            trend: 'Gradually worsening over past week',
            triggers: 'Heat, humidity, physical activity',
            impact: 'Reduced daily activities, poor sleep quality'
          },
          clinicalAssessment: {
            riskLevel: 'Elevated',
            recommendedAction: 'Immediate telemedicine consultation',
            urgency: 'High - symptoms progressing',
            followUp: 'Within 24 hours'
          }
        },
        'Escalation Trigger': {
          escalationDecision: {
            timestamp: '2024-03-14T09:25:00Z',
            agent: 'Escalate-Agent-008',
            trigger: 'Lack of near-term care access',
            factors: [
              'PCP appointment 3 weeks away',
              'Worsening symptoms',
              'Upcoming heat wave',
              'Rural location with limited access'
            ],
            escalationLevel: 'Immediate',
            recommendedAction: 'Telemedicine consultation within 24 hours',
            costImplication: 'Prevent $25,000 ER visit'
          },
          careAccessAnalysis: {
            nearestPCP: '45 minutes away',
            nearestSpecialist: '90 minutes away',
            emergencyCare: '60 minutes away',
            telemedicineAvailability: 'Immediate',
            transportationOptions: 'Limited during heat waves'
          }
        },
        'Care Navigation': {
          navigationPlan: {
            timestamp: '2024-03-14T09:30:00Z',
            agent: 'Navigate-Agent-009',
            recommendedCare: 'Telemedicine consultation',
            rationale: 'Immediate access, no transportation needed, specialist available',
            alternatives: [
              'Urgent care (60 min drive)',
              'Emergency room (90 min drive)',
              'Home health visit (3 days wait)'
            ],
            selectedOption: 'Telemedicine - immediate access with respiratory specialist'
          },
          resourceMapping: {
            telemedicineProviders: [
              'Virtual Respiratory Clinic',
              'Telehealth Specialists Network',
              'Rural Health Telemedicine Program'
            ],
            availability: 'Immediate (within 2 hours)',
            cost: '$0 copay (covered by insurance)',
            quality: 'Board-certified respiratory specialists'
          }
        },
        'Tele-Visit Scheduling': {
          appointmentScheduling: {
            timestamp: '2024-03-14T09:35:00Z',
            agent: 'Schedule-Agent-010',
            appointmentId: 'TELE-2024-000002-001',
            provider: 'Dr. Jennifer Smith, Respiratory Specialist',
            patient: 'Michael Chen',
            scheduledTime: '2024-03-14T14:00:00Z',
            duration: '30 minutes',
            platform: 'Secure video platform',
            preparation: 'Symptom checklist, medication list, recent test results'
          },
          confirmationSystem: {
            confirmationSent: 'SMS + Email',
            reminderSchedule: [
              '24 hours before: SMS reminder',
              '2 hours before: SMS + call reminder',
              '15 minutes before: SMS reminder'
            ],
            technicalSupport: 'Available 30 minutes before appointment',
            backupPlan: 'Phone consultation if video fails'
          }
        },
        'Virtual Assessment': {
          virtualConsultation: {
            timestamp: '2024-03-14T14:00:00Z',
            provider: 'Dr. Jennifer Smith, Respiratory Specialist',
            patient: 'Michael Chen',
            duration: '28 minutes',
            platform: 'Secure video platform',
            connectionQuality: 'Good',
            assessmentComplete: 'Yes'
          },
          clinicalFindings: {
            symptoms: 'Worsening cough, increased shortness of breath',
            duration: '7 days',
            triggers: 'Heat, humidity, physical activity',
            currentMedications: 'Albuterol inhaler (expired 2 months ago)',
            missingMedication: 'Rescue inhaler not available',
            riskAssessment: 'High risk for exacerbation'
          },
          criticalGap: {
            issue: 'Absence of rescue inhaler',
            lastFill: '2 months ago',
            importance: 'Critical for COPD management',
            risk: 'High risk for exacerbation and hospitalization',
            immediateAction: 'Prescription and delivery required'
          }
        },
        'EHR Integration': {
          ehrPrompt: {
            timestamp: '2024-03-14T14:05:00Z',
            agent: 'EHR-Agent-011',
            system: 'Epic EHR',
            promptType: 'Medication Prescription',
            medication: 'Albuterol Inhaler 90mcg',
            dosage: '2 puffs every 4-6 hours as needed',
            quantity: '1 inhaler',
            refills: '3',
            instructions: 'Use for shortness of breath. Shake well before use.',
            status: 'Prescribed and sent to pharmacy'
          },
          prescriptionRecord: {
            prescriptionId: 'RX-2024-000002-001',
            provider: 'Dr. Jennifer Smith',
            patient: 'Michael Chen',
            medication: 'Albuterol Inhaler 90mcg',
            pharmacy: 'Rural Pharmacy Network',
            deliveryOption: 'Home delivery available',
            cost: '$15 copay',
            insurance: 'Covered by plan'
          }
        },
        'Medication Fulfillment': {
          pharmacyIntegration: {
            timestamp: '2024-03-14T14:10:00Z',
            agent: 'Pharmacy-Agent-012',
            pharmacy: 'Rural Pharmacy Network',
            medication: 'Albuterol Inhaler 90mcg',
            availability: 'In stock',
            deliveryOptions: [
              'Same-day delivery (rural area)',
              'Next-day pickup',
              'Mail-order (3-5 days)'
            ],
            selectedOption: 'Same-day delivery',
            cost: '$15 copay',
            insuranceCoverage: '100% covered'
          },
          deliveryArrangement: {
            deliveryTime: 'Same day (within 4 hours)',
            deliveryMethod: 'Pharmacy courier',
            tracking: 'Real-time GPS tracking',
            confirmation: 'Signature required',
            backupPlan: 'Local pickup if delivery fails'
          }
        },
        'Delivery Confirmation': {
          deliveryRecord: {
            timestamp: '2024-03-14T18:30:00Z',
            deliveryMethod: 'Pharmacy courier',
            recipient: 'Michael Chen',
            signature: 'Confirmed',
            medication: 'Albuterol Inhaler 90mcg',
            quantity: '1 inhaler',
            status: 'Delivered successfully'
          },
          patientConfirmation: {
            method: 'Phone call',
            timestamp: '2024-03-14T18:35:00Z',
            confirmation: 'Medication received and instructions understood',
            followUp: 'Scheduled for 24 hours',
            adherencePlan: 'Medication reminder system activated'
          }
        },
        'Heat Wave Monitoring': {
          environmentalMonitoring: {
            timestamp: '2024-03-15T10:00:00Z',
            agent: 'Monitor-Agent-014',
            weatherConditions: {
              temperature: '98°F',
              humidity: '85%',
              heatIndex: '105°F',
              airQuality: 'Moderate',
              duration: 'Day 2 of 5-day heat wave'
            },
            riskAssessment: 'High risk for COPD exacerbation',
            monitoringFrequency: 'Twice daily during heat wave'
          },
          patientCheck: {
            method: 'Automated SMS + Case manager call',
            message: 'Hi Michael! It\'s day 2 of the heat wave. How are you feeling? Any breathing difficulties? Remember to use your rescue inhaler if needed. Stay cool! 🌡️',
            response: 'Feeling okay, using inhaler as needed, staying indoors',
            status: 'Stable - no exacerbation'
          }
        },
        'Status Confirmation': {
          finalAssessment: {
            timestamp: '2024-03-19T16:00:00Z',
            agent: 'Confirm-Agent-015',
            heatWaveEnd: 'Yes - 5-day heat wave completed',
            patientStatus: 'Stable - no exacerbation',
            medicationUse: 'Used rescue inhaler 3 times during heat wave',
            outcome: 'ER visit avoided - $25,000 saved',
            followUp: 'Scheduled PCP appointment in 2 weeks'
          },
          costSavings: {
            avoidedERVisit: '$25,000',
            avoidedHospitalization: '$45,000',
            totalSavings: '$25,000',
            interventionCost: '$15 (medication copay)',
            roi: '166,567%',
            preventionSuccess: '100%'
          }
        }
      },
      'Lisa Rodriguez': {
        'Prescription': {
          systemLog: {
            timestamp: '2024-03-14T14:30:00Z',
            event: 'Prescription Created',
            provider: 'Dr. Sarah Johnson, PCP',
            medication: 'Albuterol Inhaler (COPD)',
            dosage: '2 puffs every 4-6 hours as needed',
            pharmacy: 'CVS Pharmacy - Downtown',
            status: 'Sent to Pharmacy',
            notes: 'Patient diagnosed with COPD exacerbation. Prescription sent to preferred pharmacy.'
          },
          emrRecord: {
            patientId: 'MRN-2024-003456',
            date: '2024-03-14',
            provider: 'Dr. Sarah Johnson',
            diagnosis: 'COPD Exacerbation',
            prescription: 'Albuterol Inhaler 90mcg',
            quantity: '1 inhaler',
            refills: '2',
            instructions: '2 puffs every 4-6 hours as needed for shortness of breath',
            status: 'Active'
          }
        },
        'No Fill Detection': {
          pharmacyAlert: {
            timestamp: '2024-03-16T10:15:00Z',
            alertType: 'Medication Not Picked Up',
            medication: 'Albuterol Inhaler',
            prescriptionDate: '2024-03-14',
            daysSincePrescribed: '2',
            pharmacy: 'CVS Pharmacy - Downtown',
            status: 'Unfilled',
            riskLevel: 'High'
          },
          claimsData: {
            patientId: 'MRN-2024-003456',
            claimType: 'Pharmacy Claim',
            medication: 'Albuterol Inhaler',
            prescriptionDate: '2024-03-14',
            fillStatus: 'Not Filled',
            daysElapsed: '2',
            copay: '$15.00',
            insurance: 'Blue Cross Blue Shield'
          },
          aiAnalysis: {
            timestamp: '2024-03-16T10:20:00Z',
            agent: 'Chronic-Agent-001',
            analysis: 'Patient has COPD diagnosis. Albuterol is critical medication for breathing. Non-fill poses significant risk of exacerbation and potential hospitalization.',
            riskScore: '85/100',
            recommendedAction: 'Immediate intervention required'
          }
        },
        'Risk Flag Generation': {
          riskAssessment: {
            timestamp: '2024-03-16T10:25:00Z',
            agent: 'Risk-Agent-002',
            patientRiskFactors: [
              'COPD diagnosis',
              'Previous exacerbations (2 in past year)',
              'Critical medication non-adherence',
              'History of hospitalizations for breathing issues'
            ],
            riskScore: '92/100',
            probabilityOfExacerbation: '78%',
            estimatedCostIfHospitalized: '$45,000',
            recommendedIntervention: 'Immediate outreach and case management'
          },
          alertSystem: {
            alertId: 'ALERT-2024-003456-001',
            severity: 'Critical',
            category: 'Medication Adherence',
            description: 'COPD patient failed to pick up critical medication',
            assignedTo: 'Case Management Team',
            priority: 'Immediate'
          }
        },
        'Communication Detection': {
          preferenceAnalysis: {
            timestamp: '2024-03-16T10:30:00Z',
            agent: 'Comm-Agent-003',
            communicationHistory: [
              { method: 'SMS', successRate: '85%', responseTime: '2.3 minutes' },
              { method: 'Phone', successRate: '60%', responseTime: '15 minutes' },
              { method: 'Email', successRate: '40%', responseTime: '4 hours' }
            ],
            preferredMethod: 'SMS',
            preferredTime: '10:00 AM - 2:00 PM',
            language: 'English',
            accessibility: 'Mobile device user'
          },
          patientProfile: {
            age: '58',
            technologyComfort: 'High',
            mobileDevice: 'iPhone 12',
            appUsage: 'Frequent',
            communicationStyle: 'Direct and concise'
          }
        },
        'Digital Outreach': {
          smsMessage: {
            from: 'HealthAI',
            to: 'Lisa Rodriguez',
            timestamp: '2024-03-16T10:35:00Z',
            message: 'Hi Lisa! 👋 I noticed your albuterol inhaler prescription from Dr. Johnson hasn\'t been picked up yet. This medication is important for your breathing. Can you let me know why you haven\'t picked it up? Cost, transportation, or other concerns? I\'m here to help! 💙',
            status: 'Delivered',
            responseReceived: 'Yes',
            responseTime: '3 minutes'
          },
          followUpMessage: {
            from: 'HealthAI',
            to: 'Lisa Rodriguez',
            timestamp: '2024-03-16T10:38:00Z',
            message: 'Thanks for responding! I understand the copay is a concern. Let me connect you with our assistance program. I\'ll have someone call you within 30 minutes to help with the cost. Stay well! 🌟',
            status: 'Delivered'
          }
        },
        'Response Interpretation': {
          patientResponse: {
            timestamp: '2024-03-16T10:38:00Z',
            method: 'SMS',
            message: 'Hi, thanks for checking. The copay is $15 and I\'m a bit tight on money this month. I know I need it for my breathing but I\'m trying to make ends meet.',
            sentiment: 'Concerned but cooperative',
            keyIssues: ['Cost barrier', 'Financial constraints'],
            urgency: 'Medium'
          },
          aiAnalysis: {
            agent: 'Analysis-Agent-005',
            timestamp: '2024-03-16T10:40:00Z',
            interpretation: 'Patient acknowledges medication importance but cites cost as barrier. Cooperative attitude indicates high likelihood of intervention success.',
            recommendedAction: 'Financial assistance program enrollment',
            estimatedInterventionCost: '$15 (copay coverage)',
            potentialSavings: '$45,000 (avoided hospitalization)'
          }
        },
        'Case Creation': {
          caseRecord: {
            caseId: 'CASE-2024-003456-001',
            timestamp: '2024-03-16T10:45:00Z',
            agent: 'Case-Agent-006',
            patient: 'Lisa Rodriguez',
            issue: 'Medication non-adherence due to cost barrier',
            priority: 'High',
            assignedTo: 'Sarah Martinez, Case Manager',
            estimatedResolution: '24 hours',
            interventionType: 'Financial assistance + home visit',
            riskLevel: 'Critical',
            escalationTriggers: ['COPD exacerbation risk', 'Previous hospitalizations', 'Critical medication non-adherence']
          },
          schedulingSystem: {
            appointmentId: 'APT-2024-003456-001',
            caseManager: 'Sarah Martinez',
            patient: 'Lisa Rodriguez',
            scheduledTime: '2024-03-16T14:00:00Z',
            location: 'Patient Home',
            duration: '60 minutes',
            purpose: 'Medication assistance and comprehensive assessment',
            status: 'Scheduled',
            systemIntegration: {
              crmSystem: 'Salesforce Health Cloud',
              caseId: 'SF-CASE-2024-003456',
              workflowStatus: 'Active',
              nextSteps: ['Home visit scheduled', 'Financial assistance application initiated', 'Medication delivery arranged']
            }
          },
          caseManagementSystem: {
            systemName: 'CareConnect Case Management',
            caseId: 'CC-CASE-2024-003456-001',
            createdBy: 'Case-Agent-006',
            assignedTo: 'Sarah Martinez',
            priority: 'High',
            category: 'Medication Adherence',
            subcategory: 'Financial Barrier',
            status: 'Active',
            estimatedResolution: '24 hours',
            interventionPlan: [
              'Schedule home visit within 4 hours',
              'Apply for medication assistance program',
              'Arrange medication delivery service',
              'Set up follow-up monitoring'
            ],
            riskFactors: [
              'COPD diagnosis with frequent exacerbations',
              'Previous hospitalizations (2 in past year)',
              'Critical medication non-adherence',
              'Financial constraints'
            ],
            escalationPath: {
              level1: 'Case Manager (Sarah Martinez)',
              level2: 'Clinical Supervisor (Dr. Michael Chen)',
              level3: 'Medical Director (Dr. Sarah Johnson)',
              escalationTime: '4 hours if no resolution'
            }
          },
          notificationSystem: {
            smsAlert: {
              to: 'Sarah Martinez',
              message: 'New high-priority case assigned: Lisa Rodriguez - COPD medication non-adherence. Home visit scheduled for 2:00 PM today.',
              timestamp: '2024-03-16T10:46:00Z',
              status: 'Delivered'
            },
            emailNotification: {
              to: 'sarah.martinez@healthcare.org',
              subject: 'High Priority Case Assignment - Lisa Rodriguez',
              body: `New case assigned to you:
              
Patient: Lisa Rodriguez
Case ID: CASE-2024-003456-001
Issue: Medication non-adherence due to cost barrier
Priority: High
Scheduled Visit: Today 2:00 PM
Location: Patient Home

Please review case details in CareConnect system and prepare for home visit.`,
              timestamp: '2024-03-16T10:47:00Z',
              status: 'Sent'
            }
          }
        },
        'Home Assessment': {
          visitReport: {
            visitId: 'VISIT-2024-003456-001',
            caseManager: 'Sarah Martinez',
            patient: 'Lisa Rodriguez',
            visitDate: '2024-03-16T14:00:00Z',
            duration: '75 minutes',
            location: 'Patient Home',
            findings: [
              'Patient lives alone in 1-bedroom apartment',
              'Limited financial resources - fixed income',
              'Medication storage adequate',
              'Understanding of COPD management good',
              'Support system limited'
            ],
            barriers: [
              'Cost of medications',
              'Transportation to pharmacy',
              'Limited social support'
            ]
          },
          assessmentNotes: {
            timestamp: '2024-03-16T15:15:00Z',
            caseManager: 'Sarah Martinez',
            notes: `Patient is cooperative and understands the importance of her medications. 
            Financial constraints are the primary barrier. Patient has good medication 
            management skills but needs assistance with cost and transportation. 
            Will enroll in financial assistance program and arrange medication delivery.`
          }
        },
        'Solution Exploration': {
          financialAssistance: {
            program: 'Medication Assistance Program',
            enrollmentDate: '2024-03-16T15:30:00Z',
            caseManager: 'Sarah Martinez',
            benefits: [
              'Copay coverage for all medications',
              'Free medication delivery',
              'Prescription refill reminders',
              '24/7 nurse hotline'
            ],
            estimatedSavings: '$180/month',
            status: 'Enrolled'
          },
          providerCommunication: {
            timestamp: '2024-03-16T15:45:00Z',
            from: 'Sarah Martinez',
            to: 'Dr. Sarah Johnson',
            subject: 'Patient Lisa Rodriguez - Medication Assistance',
            message: `Dr. Johnson,

I visited Lisa Rodriguez today regarding her unfilled albuterol prescription. 
The issue was cost-related ($15 copay). I've enrolled her in our medication 
assistance program which will cover all copays and provide free delivery.

She understands the importance of the medication and is willing to take it as prescribed.

Please let me know if you'd like any adjustments to her treatment plan.

Best regards,
Sarah Martinez, Case Manager`
          }
        },
        'Resolution Confirmation': {
          resolutionRecord: {
            timestamp: '2024-03-16T16:00:00Z',
            agent: 'Resolution-Agent-007',
            caseId: 'CASE-2024-003456-001',
            status: 'Resolved',
            resolution: 'Patient enrolled in medication assistance program',
            medicationDelivered: 'Yes',
            patientCompliant: 'Yes',
            followUpScheduled: 'Yes (1 week)'
          },
          systemUpdate: {
            timestamp: '2024-03-16T16:05:00Z',
            action: 'Case Closed',
            caseId: 'CASE-2024-003456-001',
            resolution: 'Medication adherence restored',
            costSavings: '$45,000 (avoided hospitalization)',
            nextSteps: 'Monitor adherence for 30 days'
          }
        },
        'Record Update': {
          emrUpdate: {
            timestamp: '2024-03-16T16:10:00Z',
            agent: 'Record-Agent-008',
            patientId: 'MRN-2024-003456',
            updates: [
              'Medication assistance program enrollment',
              'Home visit assessment completed',
              'Barriers identified and addressed',
              'Follow-up plan established'
            ],
            carePlan: 'Updated with medication adherence support',
            nextReview: '2024-04-16'
          },
          careCoordination: {
            timestamp: '2024-03-16T16:15:00Z',
            teamMembers: [
              'Dr. Sarah Johnson (PCP)',
              'Sarah Martinez (Case Manager)',
              'Pharmacy Team',
              'Care Coordination Team'
            ],
            communication: 'All team members notified of resolution',
            carePlan: 'Medication adherence monitoring for 30 days'
          }
        },
        'Cost Analytics': {
          savingsReport: {
            timestamp: '2024-03-16T16:20:00Z',
            agent: 'Analytics-Agent-009',
            intervention: 'Medication Adherence Restoration',
            patient: 'Lisa Rodriguez',
            costs: {
              interventionCost: '$180 (assistance program)',
              avoidedHospitalization: '$45,000',
              avoidedERVisit: '$2,500',
              avoidedComplications: '$15,000'
            },
            totalSavings: '$62,320',
            roi: '34,511%',
            timeframe: 'Annual projection'
          },
          metricsLog: {
            timestamp: '2024-03-16T16:25:00Z',
            metrics: {
              medicationAdherenceRate: '95% (up from 0%)',
              riskScore: '15/100 (down from 92/100)',
              hospitalizationsAvoided: '1',
              qualityOfLifeScore: '85/100 (up from 45/100)'
            },
            status: 'Logged to Cost of Care Analytics'
          }
        }
      },
      'Jennifer Williams': {
        'Biosimilar Switch': {
          textMessage: {
            from: 'DrugAI',
            to: 'Jennifer Williams',
            timestamp: '2024-03-14T14:20:00Z',
            message: 'Jennifer! 💊 Great news! I found a more affordable alternative to your current medication. The biosimilar version costs 60% less and works just as well. Your doctor has approved the switch. You\'ll save $2,500 annually! 🎉',
            status: 'Delivered'
          },
          email: {
            from: 'pharmacy@costguardai.com',
            to: 'jennifer.williams@email.com',
            subject: 'Medication Cost Savings Opportunity',
            timestamp: '2024-03-14T14:25:00Z',
            body: `Dear Jennifer Williams,

Our AI medication optimization system has identified a significant cost savings opportunity for your treatment.

Current Medication: Humira (adalimumab) - $4,200/month
Recommended Alternative: Amjevita (adalimumab-atto) - $1,680/month

Annual Savings: $30,240

This biosimilar medication has the same active ingredient and efficacy as your current medication, but at a significantly lower cost.

Your rheumatologist, Dr. Thompson, has reviewed and approved this switch.

Next Steps:
1. Your prescription will be updated automatically
2. Your pharmacy will contact you within 24 hours
3. No changes to your dosing schedule

Questions? Contact your care team at 1-800-HEALTH-AI

Best regards,
DrugAI Optimization Team`
          },
          voiceCall: {
            from: 'DrugAI',
            to: 'Jennifer Williams',
            timestamp: '2024-03-14T15:30:00Z',
            duration: '6:45',
            transcript: `[AI]: Hello Jennifer, this is your AI medication assistant calling about the cost savings opportunity we identified.

[Jennifer]: I'm concerned about switching medications that are working well.

[AI]: I understand your concern. Biosimilars are FDA-approved and have the same active ingredient as Humira. Many patients make this switch successfully. Dr. Thompson has reviewed your case and approved the change.

[Jennifer]: What if it doesn't work as well?

[AI]: We'll monitor your response closely. If you experience any issues, we can switch back immediately. The savings are substantial, and the risk is minimal.

[Jennifer]: Okay, I trust Dr. Thompson's recommendation.

[AI]: Excellent! Your pharmacy will contact you tomorrow to arrange the switch. I'll follow up in two weeks to check how you're doing.`,
            status: 'Completed'
          }
        },
        'Adherence Alert': {
          textMessage: {
            from: 'AdherenceAI',
            to: 'Jennifer Williams',
            timestamp: '2024-03-15T10:15:00Z',
            message: 'Jennifer! 📊 I noticed you missed your medication dose yesterday. Consistent dosing is crucial for your rheumatoid arthritis treatment. Please take today\'s dose and let me know if you need any support! 💪',
            status: 'Delivered'
          },
          email: {
            from: 'adherence@costguardai.com',
            to: 'jennifer.williams@email.com',
            subject: 'Medication Adherence Alert',
            timestamp: '2024-03-15T10:20:00Z',
            body: `Dear Jennifer Williams,

Our AI adherence monitoring system detected a missed medication dose on March 14th.

Medication: Amjevita (adalimumab-atto)
Missed Dose: March 14th, 2024

Importance of Adherence:
• Consistent dosing maintains therapeutic levels
• Reduces risk of disease flare-ups
• Prevents costly hospitalizations

Please take today's scheduled dose and continue with your regular schedule.

If you're experiencing any side effects or have concerns, please contact your care team immediately.

Best regards,
AdherenceAI Monitoring Team`
          },
          voiceCall: {
            from: 'AdherenceAI',
            to: 'Jennifer Williams',
            timestamp: '2024-03-15T11:00:00Z',
            duration: '3:52',
            transcript: `[AI]: Hi Jennifer, this is your adherence monitoring assistant calling.

[Jennifer]: No, I just forgot. I'll take today's dose right away.

[AI]: Perfect. Remember, consistent dosing is key for managing your rheumatoid arthritis. I'll continue monitoring and send reminders if needed.

[Jennifer]: Thank you for the reminder.

[AI]: You're welcome! Take care and don't hesitate to reach out if you need anything.`,
            status: 'Completed'
          }
        }
      }
    };

    return proofTemplates[patientName]?.[eventType] || null;
  };

  const generateTimelineEvent = (driverId, eventIndex, patientIndex, isAI, date) => {
    // Special timeline for Lisa Rodriguez and Chronic Disease Burden
    const patientNames = [
      'Sarah Johnson', 'Michael Chen', 'Lisa Rodriguez', 'David Thompson', 'Jennifer Williams',
      'Robert Davis', 'Maria Garcia', 'James Wilson', 'Patricia Brown', 'John Martinez',
      'Linda Anderson', 'Christopher Taylor', 'Barbara Moore', 'Daniel Jackson', 'Elizabeth White',
      'Matthew Harris', 'Susan Martin', 'Anthony Clark', 'Jessica Lewis', 'Kevin Lee',
      'Nancy Hall', 'Steven Allen', 'Karen Young', 'Brian King', 'Betty Wright',
      'Timothy Green', 'Helen Baker', 'Ronald Adams', 'Donna Nelson', 'Jason Carter',
      'Carol Mitchell', 'Eric Perez', 'Deborah Roberts', 'Mark Turner', 'Ruth Phillips'
    ];
    
    const currentPatientName = patientNames[patientIndex - 1];
    
    // Special timeline for Lisa Rodriguez and Chronic Disease Burden
    if (driverId === 'chronicDisease' && currentPatientName === 'Lisa Rodriguez') {
      const lisaTimeline = [
        { type: 'Prescription', description: 'Primary Care Provider (PCP) prescribes a medication for a chronic condition (e.g., COPD)', ai: false, costSaved: 0, agent: null },
        { type: 'No Fill Detection', description: 'Patient does not fill the prescription. This is identified from PBM records', ai: true, costSaved: 2500, agent: 'Chronic-Agent-001' },
        { type: 'Risk Flag Generation', description: 'AI flags this as a risk based on chronic condition and medication importance. It correlates to risk of deterioration or hospitalization', ai: true, costSaved: 2000, agent: 'Risk-Agent-002' },
        { type: 'Communication Detection', description: 'AI checks patient\'s historical preference for communication (e.g., digital via SMS or in-person)', ai: true, costSaved: 1500, agent: 'Comm-Agent-003' },
        { type: 'Digital Outreach', description: 'If digital engagement is preferred, AI sends message asking patient to confirm why medication was not picked up (cost, transport, etc.)', ai: true, costSaved: 2000, agent: 'Outreach-Agent-004' },
        { type: 'Response Interpretation', description: 'Patient responds, citing cost/copay as the issue', ai: true, costSaved: 1500, agent: 'Analysis-Agent-005' },
        { type: 'Case Creation', description: 'AI creates a case and schedules a human case manager to intervene based on patient response', ai: true, costSaved: 2000, agent: 'Case-Agent-006' },
        { type: 'Home Assessment', description: 'Case manager visits patient\'s home to conduct full assessment, ensure medication management, and understand barriers', ai: false, costSaved: 0, agent: null },
        { type: 'Solution Exploration', description: 'Case manager explores solutions: sends medication coupon or contacts PCP to request a cheaper/generic alternative', ai: false, costSaved: 0, agent: null },
        { type: 'Resolution Confirmation', description: 'Case manager confirms resolution: coupon applied or new prescription provided. Ticket is closed in the system', ai: true, costSaved: 2500, agent: 'Resolution-Agent-007' },
        { type: 'Record Update', description: 'Patient longitudinal health record is updated with this event resolution', ai: true, costSaved: 1000, agent: 'Record-Agent-008' },
        { type: 'Cost Analytics', description: 'Cost savings metrics logged (e.g., avoided hospitalization due to medication adherence restoration)', ai: true, costSaved: 2500, agent: 'Analytics-Agent-009' }
      ];
      
             if (eventIndex < lisaTimeline.length) {
         const event = lisaTimeline[eventIndex];
         const proofData = event.ai ? generateProofData(currentPatientName, event.type, event.agent) : null;
        
        return {
          id: `event-${patientIndex}-${eventIndex}`,
          type: event.type,
          description: event.description,
          timestamp: date.toISOString(),
          date: date.toLocaleDateString(),
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ai: event.ai,
          costSaved: event.costSaved || 0,
          agent: event.agent || null,
          status: event.ai ? 'Completed' : 'Standard',
          icon: event.ai ? '🤖' : '📋',
          color: event.ai ? '#4caf50' : '#757575',
          proofData: proofData
        };
      }
    }

    // Special timeline for Michael Chen and Chronic Disease Burden (COPD)
    if (driverId === 'chronicDisease' && currentPatientName === 'Michael Chen') {
      const michaelTimeline = [
        { type: 'ADT Trend Alerts', description: 'Population increase in avoidable respiratory related ER visits for the zip code 34476', ai: true, costSaved: 5000, agent: 'Trend-Agent-001' },
        { type: 'Environmental Correlation', description: 'AI correlates zip code 34476 with ER influx due to heat and COPD exacerbations', ai: true, costSaved: 6000, agent: 'Env-Agent-004' },
        { type: 'Access To Care Risk', description: 'AI flags increased risk due to poor access to care and transportation barriers', ai: true, costSaved: 3500, agent: 'Risk-Agent-005' },
        { type: 'Patient History Review', description: 'Patient history of seasonal COPD exacerbations', ai: true, costSaved: 3000, agent: 'Review-Agent-002' },
        { type: 'Risk Alert', description: 'Patient with COPD + zip code 34476 (rural area with access to care and transportation issues) + Heat wave month of August + Population with Influx of ER visits due to respiratory related illnesses', ai: true, costSaved: 4000, agent: 'Alert-Agent-003' },
        { type: 'Communication Preference', description: 'AI selects preferred contact mode (phone) over text, based on patient history', ai: true, costSaved: 2500, agent: 'Comm-Agent-006' },
        { type: 'Case Manager Assignment', description: 'AI assigns experienced case manager to initiate contact for rural COPD patient', ai: true, costSaved: 2000, agent: 'Assign-Agent-007' },
        { type: 'Member Contact', description: 'Member contacted by phone - case manager initiates empathetic outreach', ai: false, costSaved: 0, agent: null },
        { type: 'Symptom Report', description: 'Member reports worsening cough and delayed PCP appointment', ai: false, costSaved: 0, agent: null },
        { type: 'Access Risk Resolution', description: 'AI agent intervenes to resolve access barriers identified in risk assessment - coordinates telemedicine and transportation solutions', ai: true, costSaved: 8000, agent: 'Access-Agent-008' },
        { type: 'Telemedicine Recommendation', description: 'AI suggests telemedicine consultation based on rural location and care access', ai: true, costSaved: 4500, agent: 'Navigate-Agent-009' },
        { type: 'Virtual Visit Scheduling', description: 'Tele-visit scheduled promptly for immediate care access with respiratory specialist', ai: true, costSaved: 3000, agent: 'Schedule-Agent-010' },
        { type: 'Virtual Assessment', description: 'Virtual PCP notices absence of rescue inhaler during visit', ai: false, costSaved: 0, agent: null },
        { type: 'Rescue Inhaler Prescription', description: 'EHR-integrated AI prompts prescription for rescue inhaler during virtual visit', ai: true, costSaved: 5000, agent: 'EHR-Agent-011' },
        { type: 'Rural Pharmacy Coordination', description: 'AI confirms pharmacy access and arranges delivery mode for rural constraints', ai: true, costSaved: 4000, agent: 'Pharmacy-Agent-012' },
        { type: 'Medication Delivery', description: 'Rescue inhaler delivered to patient home - medication adherence ensured', ai: true, costSaved: 3500, agent: 'Delivery-Agent-013' },
        { type: 'Heat Wave Monitoring', description: 'AI sends alert to case manager to check member status during heat wave peak', ai: true, costSaved: 6000, agent: 'Monitor-Agent-014' },
        { type: 'Exacerbation Prevention', description: 'Member confirms stabilized symptoms - ER visit avoided through proactive intervention', ai: true, costSaved: 25000, agent: 'Confirm-Agent-015' }
      ];
      
      if (eventIndex < michaelTimeline.length) {
        const event = michaelTimeline[eventIndex];
        const proofData = event.ai ? generateProofData(currentPatientName, event.type, event.agent) : null;
       
       return {
         id: `event-${patientIndex}-${eventIndex}`,
         type: event.type,
         description: event.description,
         timestamp: date.toISOString(),
         date: date.toLocaleDateString(),
         time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
         ai: event.ai,
         costSaved: event.costSaved || 0,
         agent: event.agent || null,
         status: event.ai ? 'Completed' : 'Standard',
         icon: event.ai ? '🤖' : '📋',
         color: event.ai ? '#4caf50' : '#757575',
         proofData: proofData
       };
     }
   }
    
    const eventTemplates = {
      chronicDisease: {
        ai: [
          { type: 'RPM Alert', description: 'Blood pressure elevated - AI intervention triggered', costSaved: 15000, agent: 'Chronic-Agent-001' },
          { type: 'Medication Adjustment', description: 'AI recommended medication change based on trends', costSaved: 8000, agent: 'Med-Agent-002' },
          { type: 'Care Gap Closure', description: 'AI identified and closed care gap', costSaved: 12000, agent: 'Gap-Agent-003' },
          { type: 'Risk Assessment', description: 'AI calculated updated risk score', costSaved: 5000, agent: 'Risk-Agent-004' }
        ],
        nonAI: [
          { type: 'Routine Visit', description: 'Standard check-up appointment' },
          { type: 'Lab Results', description: 'Blood work completed' },
          { type: 'Medication Refill', description: 'Prescription renewed' },
          { type: 'Follow-up Call', description: 'Care team follow-up' }
        ]
      },
      drugCosts: {
        ai: [
          { type: 'Biosimilar Switch', description: 'AI recommended biosimilar alternative', costSaved: 25000, agent: 'Drug-Agent-001' },
          { type: 'Adherence Alert', description: 'AI detected medication non-adherence', costSaved: 18000, agent: 'Adherence-Agent-002' },
          { type: 'Cost Analysis', description: 'AI identified cost-saving opportunities', costSaved: 15000, agent: 'Cost-Agent-003' },
          { type: 'Generic Switch', description: 'AI recommended generic alternative', costSaved: 12000, agent: 'Generic-Agent-004' }
        ],
        nonAI: [
          { type: 'Prescription', description: 'New medication prescribed' },
          { type: 'Pharmacy Pickup', description: 'Medication picked up' },
          { type: 'Side Effect', description: 'Patient reported side effect' },
          { type: 'Dosage Change', description: 'Medication dosage adjusted' }
        ]
      },
      hospitalServices: {
        ai: [
          { type: 'Avoidable Admission Prevention', description: 'AI routed patient to outpatient care', costSaved: 45000, agent: 'Hospital-Agent-001' },
          { type: 'LOS Optimization', description: 'AI optimized length of stay', costSaved: 32000, agent: 'LOS-Agent-002' },
          { type: 'Post-Discharge Coordination', description: 'AI scheduled follow-up appointments', costSaved: 28000, agent: 'PostDC-Agent-003' },
          { type: 'Readmission Prevention', description: 'AI implemented monitoring protocol', costSaved: 35000, agent: 'Readmit-Agent-004' }
        ],
        nonAI: [
          { type: 'Hospital Admission', description: 'Patient admitted to hospital' },
          { type: 'Discharge', description: 'Patient discharged' },
          { type: 'Transfer', description: 'Patient transferred to different unit' },
          { type: 'Consultation', description: 'Specialist consultation' }
        ]
      },
      utilization: {
        ai: [
          { type: 'Guideline Compliance', description: 'AI ensured guideline-based care', costSaved: 22000, agent: 'Util-Agent-001' },
          { type: 'Defensive Medicine Reduction', description: 'AI reduced unnecessary tests', costSaved: 18000, agent: 'Defense-Agent-002' },
          { type: 'Test Optimization', description: 'AI optimized diagnostic testing', costSaved: 15000, agent: 'Test-Agent-003' },
          { type: 'Procedure Review', description: 'AI reviewed procedure necessity', costSaved: 25000, agent: 'Proc-Agent-004' }
        ],
        nonAI: [
          { type: 'Diagnostic Test', description: 'Laboratory test ordered' },
          { type: 'Imaging Study', description: 'Radiology study completed' },
          { type: 'Procedure', description: 'Medical procedure performed' },
          { type: 'Consultation', description: 'Specialist evaluation' }
        ]
      },
      socialDeterminants: {
        ai: [
          { type: 'Transportation Assistance', description: 'AI arranged transportation services', costSaved: 12000, agent: 'SDoH-Agent-001' },
          { type: 'Food Security Program', description: 'AI connected patient to food assistance', costSaved: 8000, agent: 'Food-Agent-002' },
          { type: 'Housing Support', description: 'AI provided housing resources', costSaved: 15000, agent: 'Housing-Agent-003' },
          { type: 'Community Outreach', description: 'AI initiated community support', costSaved: 10000, agent: 'Community-Agent-004' }
        ],
        nonAI: [
          { type: 'Social Assessment', description: 'Social determinants screening' },
          { type: 'Resource Referral', description: 'Community resource referral' },
          { type: 'Support Group', description: 'Patient joined support group' },
          { type: 'Case Management', description: 'Case manager assigned' }
        ]
      },
      fraudWaste: {
        ai: [
          { type: 'Duplicate Claim Detection', description: 'AI identified duplicate billing', costSaved: 8000, agent: 'FWA-Agent-001' },
          { type: 'Upcoding Prevention', description: 'AI prevented upcoding', costSaved: 15000, agent: 'Upcode-Agent-002' },
          { type: 'Unnecessary Service Block', description: 'AI blocked unnecessary service', costSaved: 20000, agent: 'Block-Agent-003' },
          { type: 'Pattern Analysis', description: 'AI detected suspicious patterns', costSaved: 12000, agent: 'Pattern-Agent-004' }
        ],
        nonAI: [
          { type: 'Claim Submission', description: 'Insurance claim submitted' },
          { type: 'Payment Processing', description: 'Payment processed' },
          { type: 'Audit Review', description: 'Claim audit completed' },
          { type: 'Appeal Filed', description: 'Claim appeal submitted' }
        ]
      },
      administrative: {
        ai: [
          { type: 'Prior Auth Automation', description: 'AI automated prior authorization', costSaved: 5000, agent: 'Admin-Agent-001' },
          { type: 'Claims Review Automation', description: 'AI automated claims review', costSaved: 8000, agent: 'Claims-Agent-002' },
          { type: 'Documentation Optimization', description: 'AI optimized documentation', costSaved: 6000, agent: 'Doc-Agent-003' },
          { type: 'Workflow Automation', description: 'AI automated administrative workflow', costSaved: 10000, agent: 'Workflow-Agent-004' }
        ],
        nonAI: [
          { type: 'Prior Authorization', description: 'Prior authorization submitted' },
          { type: 'Claims Review', description: 'Claims review completed' },
          { type: 'Documentation', description: 'Medical documentation updated' },
          { type: 'Administrative Task', description: 'Administrative task completed' }
        ]
      },
      clinicalGuidance: {
        ai: [
          { type: 'Treatment Path Optimization', description: 'AI recommended optimal treatment path', costSaved: 15000, agent: 'Clinical-Agent-001' },
          { type: 'Cost-Effective Alternative', description: 'AI suggested cost-effective alternative', costSaved: 12000, agent: 'Cost-Agent-002' },
          { type: 'Clinical Decision Support', description: 'AI provided clinical guidance', costSaved: 18000, agent: 'Decision-Agent-003' },
          { type: 'Preventive Care Recommendation', description: 'AI recommended preventive care', costSaved: 10000, agent: 'Preventive-Agent-004' }
        ],
        nonAI: [
          { type: 'Treatment Plan', description: 'Treatment plan developed' },
          { type: 'Clinical Decision', description: 'Clinical decision made' },
          { type: 'Care Coordination', description: 'Care coordination completed' },
          { type: 'Follow-up Plan', description: 'Follow-up plan established' }
        ]
      }
    };

    const templates = eventTemplates[driverId];
    const template = isAI ? templates.ai[eventIndex % templates.ai.length] : templates.nonAI[eventIndex % templates.nonAI.length];
    
    const proofData = isAI ? generateProofData(currentPatientName, template.type, template.agent) : null;

    return {
      id: `event-${patientIndex}-${eventIndex}`,
      type: template.type,
      description: template.description,
      timestamp: date.toISOString(),
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ai: isAI,
      costSaved: template.costSaved || 0,
      agent: template.agent || null,
      status: isAI ? 'Completed' : 'Standard',
      icon: isAI ? '🤖' : '📋',
      color: isAI ? '#4caf50' : '#757575',
      proofData: proofData
    };
  };

  // Agent intervention data
  const INTERVENTION_DATA = {
    hospitalServices: [
      {
        id: 1,
        agent: 'Hospital-Agent-001',
        driver: 'Hospital & Provider Services',
        patient: 'MRN-2024-001234',
        intervention: 'Avoidable Admission Prevention',
        timestamp: '2:15 AM',
        status: 'Active',
        costSaved: 45000,
        details: 'Patient with CHF symptoms routed to outpatient care instead of ER',
        icon: '🏥',
        color: '#f44336'
      },
      {
        id: 2,
        agent: 'LOS-Agent-002',
        driver: 'Hospital & Provider Services',
        patient: 'MRN-2024-005678',
        intervention: 'Length of Stay Optimization',
        timestamp: '1:30 AM',
        status: 'Completed',
        costSaved: 32000,
        details: 'Early discharge with home monitoring for pneumonia patient',
        icon: '⏱️',
        color: '#f44336'
      },
      {
        id: 3,
        agent: 'PostDC-Agent-003',
        driver: 'Hospital & Provider Services',
        patient: 'MRN-2024-009876',
        intervention: 'Post-Discharge Care Coordination',
        timestamp: '12:45 AM',
        status: 'Active',
        costSaved: 28000,
        details: 'Scheduled follow-up appointments to prevent readmission',
        icon: '📋',
        color: '#f44336'
      }
    ],
    chronicDisease: [
      {
        id: 4,
        agent: 'RPM-Agent-004',
        driver: 'Chronic Disease Burden',
        patient: 'MRN-2024-003456',
        intervention: 'Remote Patient Monitoring Alert',
        timestamp: '2:30 AM',
        status: 'Active',
        costSaved: 15000,
        details: 'BP spike detected, care team notified immediately',
        icon: '🫀',
        color: '#e91e63'
      },
      {
        id: 5,
        agent: 'CareCoach-Agent-005',
        driver: 'Chronic Disease Burden',
        patient: 'MRN-2024-007890',
        intervention: 'Care Coaching Program',
        timestamp: '1:15 AM',
        status: 'Completed',
        costSaved: 22000,
        details: 'Diabetes management coaching reduced A1C levels',
        icon: '👨‍⚕️',
        color: '#e91e63'
      }
    ],
    drugCosts: [
      {
        id: 6,
        agent: 'Pharm-Agent-006',
        driver: 'Drug Costs',
        patient: 'MRN-2024-002345',
        intervention: 'Biosimilar Substitution',
        timestamp: '2:00 AM',
        status: 'Active',
        costSaved: 25000,
        details: 'Humira replaced with biosimilar, maintaining efficacy',
        icon: '💊',
        color: '#ff9800'
      },
      {
        id: 7,
        agent: 'Adherence-Agent-007',
        driver: 'Drug Costs',
        patient: 'MRN-2024-006789',
        intervention: 'Medication Adherence Program',
        timestamp: '12:30 AM',
        status: 'Completed',
        costSaved: 18000,
        details: 'SMS reminders improved adherence from 65% to 92%',
        icon: '📱',
        color: '#ff9800'
      }
    ],
    utilization: [
      {
        id: 8,
        agent: 'Util-Agent-008',
        driver: 'Utilization Increases',
        patient: 'MRN-2024-001111',
        intervention: 'Unnecessary Test Prevention',
        timestamp: '1:45 AM',
        status: 'Active',
        costSaved: 8500,
        details: 'Blocked unnecessary MRI for low back pain',
        icon: '📊',
        color: '#9c27b0'
      }
    ],
    socialDeterminants: [
      {
        id: 9,
        agent: 'SDoH-Agent-009',
        driver: 'Social Determinants of Health',
        patient: 'MRN-2024-004567',
        intervention: 'Transportation Assistance',
        timestamp: '2:20 AM',
        status: 'Active',
        costSaved: 12000,
        details: 'Provided ride service to prevent missed appointments',
        icon: '🏠',
        color: '#607d8b'
      }
    ],
    fraudWaste: [
      {
        id: 10,
        agent: 'FWA-Agent-010',
        driver: 'Fraud, Waste & Abuse',
        patient: 'MRN-2024-008901',
        intervention: 'Duplicate Claim Detection',
        timestamp: '1:00 AM',
        status: 'Completed',
        costSaved: 3500,
        details: 'Blocked duplicate service billing',
        icon: '🚨',
        color: '#ff5722'
      }
    ],
    administrative: [
      {
        id: 11,
        agent: 'Admin-Agent-011',
        driver: 'Administrative Costs',
        patient: 'MRN-2024-002222',
        intervention: 'AI Pre-Authorization',
        timestamp: '2:10 AM',
        status: 'Active',
        costSaved: 8000,
        details: 'Automated approval reduced processing time by 80%',
        icon: '📋',
        color: '#795548'
      }
    ],
    clinicalGuidance: [
      {
        id: 12,
        agent: 'Clinical-Agent-012',
        driver: 'Clinical Cost Guidance',
        patient: 'MRN-2024-003333',
        intervention: 'Treatment Path Optimization',
        timestamp: '1:20 AM',
        status: 'Completed',
        costSaved: 15000,
        details: 'Recommended generic alternative with same efficacy',
        icon: '🎯',
        color: '#4caf50'
      }
    ]
  };

  // Start agent intervention simulation
  React.useEffect(() => {
    if (activeTab === 4) { // Cost of Care Simulation tab
      const allInterventions = Object.values(INTERVENTION_DATA).flat();
      setAgentInterventions(allInterventions);
      
      // Simulate real-time interventions
      const interval = setInterval(() => {
        setInterventionIndex(prev => {
          if (prev < allInterventions.length - 1) {
            return prev + 1;
          } else {
            return 0; // Restart
          }
        });
      }, 3000); // New intervention every 3 seconds

      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Start timeline animation when Gaps in Care Simulation tab is selected
    if (newValue === 1) {
      setTimeout(() => setTimelineAnimation(true), 500);
    } else {
      setTimelineAnimation(false);
    }
  };

  const handleGapSelect = (gap) => {
    setSelectedGap(gap);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const handlePatientChange = (patientId) => {
    setSelectedPatient(patientId);
    setTimelineAnimation(false);
    // Start animation after a short delay
    setTimeout(() => setTimelineAnimation(true), 500);
  };

  const [gapsAnalysisActive, setGapsAnalysisActive] = useState(false);
  const [gapsAnalysisComplete, setGapsAnalysisComplete] = useState(false);
  const [gapsAnalysisData, setGapsAnalysisData] = useState(null);

  const handleGapsAnalysis = () => {
    setGapsAnalysisDialogOpen(true);
    setGapsAnalysisActive(true);
    setGapsAnalysisComplete(false);
    setGapsAnalysisData(null);
    
    // Simulate AI analysis process
    setTimeout(() => {
      const mockData = generateMockGapsAnalysisData();
      setGapsAnalysisData(mockData);
      setGapsAnalysisComplete(true);
      setGapsAnalysisActive(false);
    }, 4000);
  };

  const handleViewGaps = (patient) => {
    setSelectedPatientGaps(patient);
    setGapsDetailDialogOpen(true);
  };

  const handleCardDetails = (card) => {
    setSelectedCardDetails(card);
    setShowCardDetails(true);
  };

  const handleLiveAgents = () => {
    setShowLiveAgents(true);
    // Start simulating live agent activity
    startAgentSimulation();
  };

  const startAgentSimulation = () => {
    const agents = {
      'Utilization Management': {
        name: 'UM-Agent-001',
        status: 'active',
        tasks: [
          { id: 1, type: 'PA Review', patient: 'MRN-2024-001234', status: 'processing', progress: 65 },
          { id: 2, type: 'Denial Prediction', patient: 'MRN-2024-005678', status: 'queued', progress: 0 },
          { id: 3, type: 'Risk Assessment', patient: 'MRN-2024-009876', status: 'completed', progress: 100 }
        ]
      },
      'Site of Care Optimization': {
        name: 'SOC-Agent-002',
        status: 'active',
        tasks: [
          { id: 4, type: 'Site Analysis', patient: 'MRN-2024-003456', status: 'processing', progress: 42 },
          { id: 5, type: 'Telehealth Recommendation', patient: 'MRN-2024-007890', status: 'processing', progress: 78 }
        ]
      },
      'Contract Optimization / VBC': {
        name: 'VBC-Agent-003',
        status: 'idle',
        tasks: [
          { id: 6, type: 'Contract Analysis', provider: 'Memorial Hospital', status: 'completed', progress: 100 }
        ]
      },
      'Pharmacy Utilization (pmpm)': {
        name: 'PHARM-Agent-004',
        status: 'active',
        tasks: [
          { id: 7, type: 'Generic Substitution', patient: 'MRN-2024-002345', status: 'processing', progress: 23 },
          { id: 8, type: 'Drug Utilization Review', patient: 'MRN-2024-006789', status: 'queued', progress: 0 }
        ]
      }
    };

    setAgentStatus(agents);
    setAgentTasks(agents);
  };

  // Real-time agent simulation effect
  React.useEffect(() => {
    if (!showLiveAgents) return;

    const interval = setInterval(() => {
      setAgentTasks(prevTasks => {
        const updated = { ...prevTasks };
        Object.keys(updated).forEach(agentKey => {
          updated[agentKey].tasks.forEach(task => {
            if (task.status === 'processing' && task.progress < 100) {
              task.progress += Math.floor(Math.random() * 15) + 5;
              if (task.progress >= 100) {
                task.status = 'completed';
                task.progress = 100;
              }
            } else if (task.status === 'queued' && Math.random() > 0.7) {
              task.status = 'processing';
            }
          });
        });
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [showLiveAgents]);

  const generateMockPatientData = (cardTitle) => {
    const names = [
      'Sarah Johnson', 'Michael Chen', 'Emma Rodriguez', 'David Thompson', 'Lisa Anderson',
      'Robert Wilson', 'Jennifer Davis', 'Christopher Brown', 'Amanda Garcia', 'James Miller'
    ];
    
    // Realistic patient IDs with different formats
    const patientIds = [
      'MRN-2024-001234', 'MRN-2024-005678', 'MRN-2024-009876', 'MRN-2024-003456', 'MRN-2024-007890',
      'MRN-2024-002345', 'MRN-2024-006789', 'MRN-2024-001111', 'MRN-2024-004567', 'MRN-2024-008901'
    ];
    
    return names.map((name, idx) => ({
      id: patientIds[idx],
      name,
      age: Math.floor(Math.random() * 50) + 30,
      riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      impact: Math.floor(Math.random() * 50000) + 5000
    }));
  };

  const generateMockAIRecommendations = (cardTitle) => {
    const recommendations = {
      'Utilization Management': [
        {
          title: 'Automated PA Processing',
          description: 'Implement AI-driven prior authorization system to reduce manual review time by 60%',
          impact: 45,
          savings: 125000
        },
        {
          title: 'Predictive Denial Prevention',
          description: 'Use ML models to identify high-risk claims and prevent denials proactively',
          impact: 23,
          savings: 89000
        }
      ],
      'Site of Care Optimization': [
        {
          title: 'Outpatient Conversion Program',
          description: 'Redirect appropriate inpatient procedures to outpatient settings',
          impact: 67,
          savings: 234000
        },
        {
          title: 'Telehealth Integration',
          description: 'Expand virtual care options for routine follow-ups and consultations',
          impact: 89,
          savings: 156000
        }
      ],
      'Contract Optimization / VBC': [
        {
          title: 'Bundled Payment Implementation',
          description: 'Negotiate bundled payment arrangements for high-volume procedures',
          impact: 34,
          savings: 567000
        },
        {
          title: 'Value-Based Contracting',
          description: 'Transition fee-for-service contracts to value-based arrangements',
          impact: 12,
          savings: 890000
        }
      ],
      'Pharmacy Utilization (pmpm)': [
        {
          title: 'Generic Substitution Program',
          description: 'Implement automated generic substitution for brand-name medications',
          impact: 156,
          savings: 89000
        },
        {
          title: 'Prior Authorization for High-Cost Drugs',
          description: 'Require PA for specialty medications to ensure appropriate use',
          impact: 23,
          savings: 234000
        }
      ]
    };
    
    return recommendations[cardTitle] || recommendations['Utilization Management'];
  };

  const generateMockActionItems = (cardTitle) => {
    const actionItems = {
      'Utilization Management': [
        {
          title: 'Deploy AI PA System',
          description: 'Implement automated prior authorization processing within 30 days',
          priority: 'High'
        },
        {
          title: 'Train Staff on New Workflows',
          description: 'Conduct training sessions for utilization management team',
          priority: 'Medium'
        },
        {
          title: 'Monitor Performance Metrics',
          description: 'Set up real-time dashboards for PA processing metrics',
          priority: 'Medium'
        }
      ],
      'Site of Care Optimization': [
        {
          title: 'Audit Current Site Distribution',
          description: 'Analyze current inpatient vs outpatient procedure distribution',
          priority: 'High'
        },
        {
          title: 'Develop Conversion Criteria',
          description: 'Create clinical criteria for outpatient conversion eligibility',
          priority: 'High'
        },
        {
          title: 'Implement Telehealth Platform',
          description: 'Deploy virtual care solution for routine consultations',
          priority: 'Medium'
        }
      ],
      'Contract Optimization / VBC': [
        {
          title: 'Contract Performance Review',
          description: 'Analyze current contract performance and identify optimization opportunities',
          priority: 'High'
        },
        {
          title: 'VBC Readiness Assessment',
          description: 'Evaluate provider network readiness for value-based arrangements',
          priority: 'Medium'
        },
        {
          title: 'Negotiate New Terms',
          description: 'Begin contract renegotiation with high-impact providers',
          priority: 'High'
        }
      ],
      'Pharmacy Utilization (pmpm)': [
        {
          title: 'Implement Generic Mandate',
          description: 'Require generic substitution for all eligible medications',
          priority: 'High'
        },
        {
          title: 'Specialty Drug PA Process',
          description: 'Establish prior authorization requirements for high-cost specialty drugs',
          priority: 'High'
        },
        {
          title: 'Pharmacy Network Optimization',
          description: 'Review and optimize pharmacy network for cost efficiency',
          priority: 'Medium'
        }
      ]
    };
    
    return actionItems[cardTitle] || actionItems['Utilization Management'];
  };

  const generateActivityFeed = () => {
    const activities = [
      {
        timestamp: '14:32:15',
        agent: 'UM-Agent-001',
        message: 'Completed PA review for patient MRN-2024-009876 - Approved with conditions',
        type: 'success'
      },
      {
        timestamp: '14:31:42',
        agent: 'SOC-Agent-002',
        message: 'Processing site analysis for patient MRN-2024-003456 - 42% complete',
        type: 'info'
      },
      {
        timestamp: '14:31:18',
        agent: 'PHARM-Agent-004',
        message: 'Identified generic substitution opportunity for patient MRN-2024-002345',
        type: 'success'
      },
      {
        timestamp: '14:30:55',
        agent: 'VBC-Agent-003',
        message: 'Completed contract analysis for Memorial Hospital',
        type: 'success'
      },
      {
        timestamp: '14:30:23',
        agent: 'UM-Agent-001',
        message: 'Started denial prediction for patient MRN-2024-005678',
        type: 'info'
      },
      {
        timestamp: '14:29:47',
        agent: 'SOC-Agent-002',
        message: 'Generated telehealth recommendation for patient MRN-2024-007890',
        type: 'success'
      },
      {
        timestamp: '14:29:12',
        agent: 'PHARM-Agent-004',
        message: 'Queued drug utilization review for patient MRN-2024-006789',
        type: 'warning'
      },
      {
        timestamp: '14:28:38',
        agent: 'UM-Agent-001',
        message: 'Risk assessment flagged patient MRN-2024-009876 for follow-up',
        type: 'warning'
      }
    ];
    
    return activities;
  };

  const generateMockGapsAnalysisData = () => {
    const patients = [];
    const gapTypes = ['Medication Adherence', 'Preventive Care', 'Follow-up Appointments', 'Lab Tests', 'Specialist Referrals', 'Vaccinations', 'Mental Health', 'Nutrition Counseling'];
    const riskLevels = ['Low', 'Medium', 'High', 'Critical'];
    const realisticNames = [
      'Sarah Johnson', 'Michael Chen', 'Emma Rodriguez', 'David Thompson', 'Lisa Anderson',
      'Robert Wilson', 'Jennifer Davis', 'Christopher Brown', 'Amanda Garcia', 'James Miller',
      'Maria Martinez', 'John Taylor', 'Patricia White', 'William Lee', 'Elizabeth Clark',
      'Richard Hall', 'Susan Young', 'Joseph Allen', 'Nancy King', 'Thomas Wright',
      'Barbara Green', 'Daniel Baker', 'Margaret Adams', 'Steven Nelson', 'Dorothy Carter',
      'Kevin Mitchell', 'Helen Perez', 'Brian Roberts', 'Deborah Turner', 'Ronald Phillips'
    ];
    
    for (let i = 0; i < 30; i++) {
      const diagnosis = ['Type 2 Diabetes', 'Hypertension', 'Heart Disease', 'COPD', 'Depression', 'Obesity'][Math.floor(Math.random() * 6)];
      const patient = {
        id: `patient-${i}`,
        name: realisticNames[i],
        age: Math.floor(Math.random() * 50) + 30,
        diagnosis: diagnosis,
        riskLevel: riskLevels[Math.floor(Math.random() * 4)],
        gaps: gapTypes.slice(0, Math.floor(Math.random() * 4) + 2).map(gap => ({
          type: gap,
          severity: Math.floor(Math.random() * 10) + 1,
          daysOverdue: Math.floor(Math.random() * 365) + 30,
          impact: Math.floor(Math.random() * 10000) + 1000,
          description: getGapDescription(gap, diagnosis),
          recommendation: getGapRecommendation(gap, diagnosis)
        })),
        totalGaps: Math.floor(Math.random() * 4) + 2,
        riskScore: Math.floor(Math.random() * 100) + 1,
        lastVisit: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      patients.push(patient);
    }

    return {
      patients,
      summary: {
        totalPatients: 30,
        totalGaps: patients.reduce((sum, p) => sum + p.totalGaps, 0),
        averageRiskScore: Math.round(patients.reduce((sum, p) => sum + p.riskScore, 0) / patients.length),
        criticalGaps: patients.filter(p => p.riskLevel === 'Critical').length,
        highRiskPatients: patients.filter(p => p.riskScore > 70).length
      },
      gapAnalysis: {
        byType: gapTypes.map(type => ({
          type,
          count: patients.filter(p => p.gaps.some(g => g.type === type)).length,
          averageSeverity: Math.round(patients.filter(p => p.gaps.some(g => g.type === type))
            .reduce((sum, p) => sum + p.gaps.find(g => g.type === type).severity, 0) / 
            patients.filter(p => p.gaps.some(g => g.type === type)).length)
        })),
        byRiskLevel: riskLevels.map(level => ({
          level,
          count: patients.filter(p => p.riskLevel === level).length,
          averageGaps: Math.round(patients.filter(p => p.riskLevel === level)
            .reduce((sum, p) => sum + p.totalGaps, 0) / patients.filter(p => p.riskLevel === level).length)
        }))
      }
    };
  };

  const getGapDescription = (gapType, diagnosis) => {
    const diseaseSpecificDescriptions = {
      'Type 2 Diabetes': {
        'Medication Adherence': 'Patient has missed 3+ doses of diabetes medication in the last 30 days, putting them at risk for hyperglycemia and complications.',
        'Preventive Care': 'Annual diabetes wellness visit is overdue by 6+ months, missing critical A1C monitoring and foot exams.',
        'Follow-up Appointments': 'Endocrinologist follow-up appointment was missed, delaying diabetes treatment optimization.',
        'Lab Tests': 'Required A1C and glucose monitoring blood work is overdue, preventing proper diabetes management.',
        'Specialist Referrals': 'Referral to endocrinologist was made but appointment not scheduled within recommended timeframe.',
        'Vaccinations': 'Annual flu shot and pneumonia vaccine are overdue, increasing infection risk for diabetic patients.',
        'Mental Health': 'Mental health screening is overdue, affecting diabetes self-management and stress levels.',
        'Nutrition Counseling': 'Diabetes nutrition consultation is overdue, impacting blood sugar control and weight management.'
      },
      'Hypertension': {
        'Medication Adherence': 'Patient has missed 3+ doses of blood pressure medication, putting them at risk for hypertensive crisis.',
        'Preventive Care': 'Annual hypertension wellness visit is overdue, missing critical BP monitoring and cardiovascular risk assessment.',
        'Follow-up Appointments': 'Cardiologist follow-up appointment was missed, delaying hypertension treatment optimization.',
        'Lab Tests': 'Required kidney function and electrolyte blood work is overdue, preventing proper hypertension monitoring.',
        'Specialist Referrals': 'Referral to cardiologist was made but appointment not scheduled within recommended timeframe.',
        'Vaccinations': 'Annual flu shot is overdue, increasing cardiovascular risk for hypertensive patients.',
        'Mental Health': 'Stress management counseling is overdue, affecting blood pressure control.',
        'Nutrition Counseling': 'Low-sodium diet consultation is overdue, impacting blood pressure management.'
      },
      'Heart Disease': {
        'Medication Adherence': 'Patient has missed 3+ doses of cardiac medication, putting them at risk for cardiac events.',
        'Preventive Care': 'Annual cardiac wellness visit is overdue, missing critical heart function monitoring.',
        'Follow-up Appointments': 'Cardiologist follow-up appointment was missed, delaying cardiac treatment optimization.',
        'Lab Tests': 'Required cardiac enzyme and lipid panel blood work is overdue, preventing proper heart disease monitoring.',
        'Specialist Referrals': 'Referral to cardiologist was made but appointment not scheduled within recommended timeframe.',
        'Vaccinations': 'Annual flu shot is critical for heart disease patients and is overdue.',
        'Mental Health': 'Cardiac rehabilitation counseling is overdue, affecting recovery and stress management.',
        'Nutrition Counseling': 'Heart-healthy diet consultation is overdue, impacting cardiovascular health.'
      },
      'COPD': {
        'Medication Adherence': 'Patient has missed 3+ doses of inhaler medication, putting them at risk for exacerbations.',
        'Preventive Care': 'Annual COPD wellness visit is overdue, missing critical lung function monitoring.',
        'Follow-up Appointments': 'Pulmonologist follow-up appointment was missed, delaying COPD treatment optimization.',
        'Lab Tests': 'Required pulmonary function tests are overdue, preventing proper COPD monitoring.',
        'Specialist Referrals': 'Referral to pulmonologist was made but appointment not scheduled within recommended timeframe.',
        'Vaccinations': 'Annual flu shot and pneumonia vaccine are critical for COPD patients and are overdue.',
        'Mental Health': 'COPD-related anxiety and depression screening is overdue, affecting quality of life.',
        'Nutrition Counseling': 'COPD nutrition consultation is overdue, impacting energy levels and weight management.'
      },
      'Depression': {
        'Medication Adherence': 'Patient has missed 3+ doses of antidepressant medication, putting them at risk for relapse.',
        'Preventive Care': 'Annual mental health wellness visit is overdue, missing critical mood monitoring.',
        'Follow-up Appointments': 'Psychiatrist follow-up appointment was missed, delaying depression treatment optimization.',
        'Lab Tests': 'Required medication level monitoring blood work is overdue, preventing proper antidepressant management.',
        'Specialist Referrals': 'Referral to psychiatrist was made but appointment not scheduled within recommended timeframe.',
        'Vaccinations': 'Annual flu shot is overdue, as depression can affect immune function.',
        'Mental Health': 'Depression screening and therapy sessions are overdue, affecting overall mental health.',
        'Nutrition Counseling': 'Depression-related nutrition consultation is overdue, impacting energy and mood.'
      },
      'Obesity': {
        'Medication Adherence': 'Patient has missed 3+ doses of weight management medication, putting them at risk for weight regain.',
        'Preventive Care': 'Annual obesity wellness visit is overdue, missing critical weight and metabolic monitoring.',
        'Follow-up Appointments': 'Bariatric specialist follow-up appointment was missed, delaying weight management optimization.',
        'Lab Tests': 'Required metabolic panel blood work is overdue, preventing proper obesity-related health monitoring.',
        'Specialist Referrals': 'Referral to bariatric specialist was made but appointment not scheduled within recommended timeframe.',
        'Vaccinations': 'Annual flu shot is overdue, as obesity can affect immune function.',
        'Mental Health': 'Obesity-related mental health screening is overdue, affecting weight management motivation.',
        'Nutrition Counseling': 'Weight management nutrition consultation is overdue, impacting weight loss progress.'
      }
    };

    return diseaseSpecificDescriptions[diagnosis]?.[gapType] || 
           `Patient has a gap in ${gapType.toLowerCase()} care that requires attention.`;
  };

  const getGapRecommendation = (gapType, diagnosis) => {
    const diseaseSpecificRecommendations = {
      'Type 2 Diabetes': {
        'Medication Adherence': 'Schedule diabetes medication review call, implement glucose monitoring reminders, consider insulin pen training.',
        'Preventive Care': 'Schedule diabetes wellness visit, order A1C and foot exam, update diabetes care plan.',
        'Follow-up Appointments': 'Reschedule endocrinologist appointment, coordinate with diabetes care team.',
        'Lab Tests': 'Order A1C, glucose, and kidney function tests, schedule lab visit, review results promptly.',
        'Specialist Referrals': 'Contact endocrinologist office, schedule appointment, ensure diabetes referral is active.',
        'Vaccinations': 'Schedule flu and pneumonia vaccines, provide diabetes-specific vaccine information.',
        'Mental Health': 'Schedule diabetes-related stress management, refer to behavioral health specialist if needed.',
        'Nutrition Counseling': 'Schedule diabetes nutrition consultation, provide carb counting guidelines, monitor blood sugar impact.'
      },
      'Hypertension': {
        'Medication Adherence': 'Schedule BP medication review call, implement blood pressure monitoring reminders, consider combination therapy.',
        'Preventive Care': 'Schedule hypertension wellness visit, order cardiovascular risk assessment, update BP care plan.',
        'Follow-up Appointments': 'Reschedule cardiologist appointment, coordinate with cardiovascular care team.',
        'Lab Tests': 'Order kidney function, electrolyte, and lipid panel tests, schedule lab visit, review results promptly.',
        'Specialist Referrals': 'Contact cardiologist office, schedule appointment, ensure cardiovascular referral is active.',
        'Vaccinations': 'Schedule flu vaccine, provide cardiovascular-specific vaccine information.',
        'Mental Health': 'Schedule stress management counseling, refer to behavioral health specialist if needed.',
        'Nutrition Counseling': 'Schedule low-sodium diet consultation, provide DASH diet guidelines, monitor BP impact.'
      },
      'Heart Disease': {
        'Medication Adherence': 'Schedule cardiac medication review call, implement heart monitoring reminders, consider cardiac rehabilitation.',
        'Preventive Care': 'Schedule cardiac wellness visit, order heart function monitoring, update cardiac care plan.',
        'Follow-up Appointments': 'Reschedule cardiologist appointment, coordinate with cardiac care team.',
        'Lab Tests': 'Order cardiac enzymes, lipid panel, and EKG, schedule lab visit, review results promptly.',
        'Specialist Referrals': 'Contact cardiologist office, schedule appointment, ensure cardiac referral is active.',
        'Vaccinations': 'Schedule flu vaccine, provide cardiac-specific vaccine information.',
        'Mental Health': 'Schedule cardiac rehabilitation counseling, refer to behavioral health specialist if needed.',
        'Nutrition Counseling': 'Schedule heart-healthy diet consultation, provide cardiac diet guidelines, monitor heart health impact.'
      },
      'COPD': {
        'Medication Adherence': 'Schedule inhaler medication review call, implement breathing monitoring reminders, consider pulmonary rehabilitation.',
        'Preventive Care': 'Schedule COPD wellness visit, order lung function tests, update pulmonary care plan.',
        'Follow-up Appointments': 'Reschedule pulmonologist appointment, coordinate with pulmonary care team.',
        'Lab Tests': 'Order pulmonary function tests, schedule lab visit, review results promptly.',
        'Specialist Referrals': 'Contact pulmonologist office, schedule appointment, ensure pulmonary referral is active.',
        'Vaccinations': 'Schedule flu and pneumonia vaccines, provide COPD-specific vaccine information.',
        'Mental Health': 'Schedule COPD-related anxiety management, refer to behavioral health specialist if needed.',
        'Nutrition Counseling': 'Schedule COPD nutrition consultation, provide energy-conserving diet guidelines, monitor breathing impact.'
      },
      'Depression': {
        'Medication Adherence': 'Schedule antidepressant medication review call, implement mood monitoring reminders, consider therapy sessions.',
        'Preventive Care': 'Schedule mental health wellness visit, order mood monitoring, update mental health care plan.',
        'Follow-up Appointments': 'Reschedule psychiatrist appointment, coordinate with mental health care team.',
        'Lab Tests': 'Order medication level monitoring, schedule lab visit, review results promptly.',
        'Specialist Referrals': 'Contact psychiatrist office, schedule appointment, ensure mental health referral is active.',
        'Vaccinations': 'Schedule flu vaccine, provide mental health-specific vaccine information.',
        'Mental Health': 'Schedule depression screening and therapy, refer to behavioral health specialist if needed.',
        'Nutrition Counseling': 'Schedule depression-related nutrition consultation, provide mood-boosting diet guidelines, monitor mental health impact.'
      },
      'Obesity': {
        'Medication Adherence': 'Schedule weight management medication review call, implement weight monitoring reminders, consider bariatric consultation.',
        'Preventive Care': 'Schedule obesity wellness visit, order metabolic monitoring, update weight management care plan.',
        'Follow-up Appointments': 'Reschedule bariatric specialist appointment, coordinate with weight management care team.',
        'Lab Tests': 'Order metabolic panel tests, schedule lab visit, review results promptly.',
        'Specialist Referrals': 'Contact bariatric specialist office, schedule appointment, ensure weight management referral is active.',
        'Vaccinations': 'Schedule flu vaccine, provide obesity-specific vaccine information.',
        'Mental Health': 'Schedule obesity-related mental health screening, refer to behavioral health specialist if needed.',
        'Nutrition Counseling': 'Schedule weight management nutrition consultation, provide calorie-controlled diet guidelines, monitor weight impact.'
      }
    };

    return diseaseSpecificRecommendations[diagnosis]?.[gapType] || 
           `Implement appropriate intervention for ${gapType.toLowerCase()} based on patient condition.`;
  };

  const handleProofClick = (proofData) => {
    setSelectedProof(proofData);
    setProofPopupOpen(true);
  };

  const handleProviderOutreach = () => {
    setProviderOutreachActive(true);
    setOutreachStep(0);
    setCallActive(false);
    setCallTranscript([]);
    setCareTeamContactPassed(false);
    setWorkflowCompleted(false);
    
    // Simulate the outreach workflow steps
    const steps = [
      'Initiating provider outreach workflow...',
      'Contacting primary care physician...',
      'Provider reviewing patient case...',
      'Provider calling patient...',
      'Medication adjustment completed...',
      'Follow-up scheduled...',
      'Provider outreach successful!'
    ];
    
    // Calculate timing for each step
    const stepDelays = [1500, 1500, 1500, 1500]; // First 4 steps with 1.5s delay
    
    // Step 4 (call start) - wait for call completion before proceeding
    setTimeout(() => {
      setOutreachStep(4); // Provider calling patient
      setCallActive(true);
      const callDuration = simulateCall();
      
      // Wait for call to complete, then proceed with remaining steps
      setTimeout(() => {
        setCallActive(false);
        setTimeout(() => {
          setCareTeamContactPassed(true);
          
          // Continue with remaining workflow steps
          setTimeout(() => {
            setOutreachStep(5); // Medication adjustment completed
            setTimeout(() => {
              setOutreachStep(6); // Follow-up scheduled
              setTimeout(() => {
                setOutreachStep(7); // Provider outreach successful
                                 setTimeout(() => {
                   setProviderOutreachActive(false);
                   setOutreachStep(0);
                   setCallActive(false);
                   setCallTranscript([]);
                   setCareTeamContactPassed(false);
                   setWorkflowCompleted(true); // Mark workflow as completed successfully
                 }, 3000);
              }, 1500);
            }, 1500);
          }, 2000);
        }, 1000);
      }, callDuration + 2000); // Wait for full call duration + buffer
    }, stepDelays.reduce((a, b) => a + b, 0)); // Wait for first 4 steps
    
    // Handle first 3 steps normally
    stepDelays.forEach((delay, index) => {
      if (index < 3) { // Only first 3 steps
        setTimeout(() => {
          setOutreachStep(index + 1);
        }, stepDelays.slice(0, index + 1).reduce((a, b) => a + b, 0));
      }
    });
  };

  const speakText = (text, voiceType = 'provider') => {
    if ('speechSynthesis' in window && !audioMuted) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice characteristics based on speaker
      if (voiceType === 'provider') {
        utterance.rate = 0.9; // Slightly slower for professional tone
        utterance.pitch = 1.1; // Slightly higher pitch for female provider
        utterance.volume = 1.0;
      } else {
        utterance.rate = 0.95; // Normal rate for patient
        utterance.pitch = 0.9; // Slightly lower pitch for patient
        utterance.volume = 1.0;
      }
      
      // Try to get appropriate voices
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voiceType === 'provider' 
          ? voice.name.includes('female') || voice.name.includes('Samantha') || voice.name.includes('Victoria')
          : voice.name.includes('male') || voice.name.includes('Alex') || voice.name.includes('Daniel')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onstart = () => {
        setAudioPlaying(true);
      };
      
      utterance.onend = () => {
        setAudioPlaying(false);
        setCurrentAudioIndex(prev => prev + 1);
      };
      
      utterance.onerror = () => {
        setAudioPlaying(false);
        setCurrentAudioIndex(prev => prev + 1);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const simulateCall = () => {
    const transcript = [
      { speaker: 'Provider', message: 'Hello, this is Dr. Maria Rodriguez calling for Emma Rodriguez. Is this Emma?', time: '14:32:15' },
      { speaker: 'Patient', message: 'Yes, this is Emma. Hello Dr. Rodriguez.', time: '14:32:25' },
      { speaker: 'Provider', message: 'Emma, I\'m calling because our monitoring system detected elevated blood pressure readings. Your BP was 175/105 this morning.', time: '14:32:35' },
      { speaker: 'Patient', message: 'Oh, I see. I\'ve been feeling a bit stressed lately and haven\'t been taking my medication regularly.', time: '14:32:50' },
      { speaker: 'Provider', message: 'I understand. That\'s exactly why I\'m calling. We need to get your blood pressure under control to prevent complications.', time: '14:33:05' },
      { speaker: 'Provider', message: 'I\'d like to adjust your Lisinopril dosage from 10mg to 20mg daily. This should help bring your BP down.', time: '14:33:20' },
      { speaker: 'Patient', message: 'That sounds good. I\'ll make sure to take it regularly from now on.', time: '14:33:35' },
      { speaker: 'Provider', message: 'Excellent. I\'ve also scheduled a follow-up call in 48 hours to check your progress. Any questions?', time: '14:33:50' },
      { speaker: 'Patient', message: 'No questions. Thank you for calling, Dr. Rodriguez.', time: '14:34:00' },
      { speaker: 'Provider', message: 'You\'re welcome, Emma. Take care and remember to take your medication. Goodbye.', time: '14:34:10' },
      { speaker: 'Patient', message: 'Goodbye, Dr. Rodriguez.', time: '14:34:15' }
    ];

    // Calculate total call duration: 11 messages * 3 seconds each = 33 seconds
    const totalCallDuration = transcript.length * 3000; // 33 seconds total

    transcript.forEach((entry, index) => {
      setTimeout(() => {
        setCallTranscript(prev => [...prev, entry]);
        // Speak the message with appropriate voice
        speakText(entry.message, entry.speaker === 'Provider' ? 'provider' : 'patient');
      }, index * 3000); // 3 seconds between each message
    });

    // Return the total duration so workflow can wait for it
    return totalCallDuration;
  };

  const exportExecutiveSummaryToPDF = () => {
    const doc = new jsPDF();
    
    // Set up the document
    doc.setFontSize(20);
    doc.setTextColor(33, 150, 243);
    doc.text('📊 Executive Summary Dashboard', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('CostGuardAI Performance Metrics & ROI Analysis', 20, 40);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50);
    
    // Executive Summary Header
    doc.setFontSize(16);
    doc.setTextColor(33, 150, 243);
    doc.text('💰 Total Annual Savings: $8.2M', 20, 70);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Based on AI-driven interventions across all 8 cost drivers', 20, 80);
    
    // Key Metrics Table
    const keyMetrics = [
      ['Metric', 'Value', 'Description'],
      ['Total Patients Impacted', '12,847', 'Patients affected by AI interventions'],
      ['High-Risk Patients Identified', '2,456', 'Patients flagged for immediate attention'],
      ['AI Predictive Accuracy', '89.4%', 'Accuracy of AI predictions'],
      ['Readmission Reduction', '54.8%', 'Reduction in readmission rates']
    ];
    
    doc.autoTable({
      startY: 90,
      head: [keyMetrics[0]],
      body: keyMetrics.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [33, 150, 243] },
      styles: { fontSize: 10 }
    });
    
    // Cost Driver Performance
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(33, 150, 243);
    doc.text('Cost Driver Performance Analysis', 20, 30);
    
    let yPosition = 50;
    Object.values(COST_DRIVERS).forEach((driver, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${driver.icon} ${driver.name}`, 20, yPosition);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Projected Annual Savings: $${driver.detailedMetrics.projectedSavings.toLocaleString()}`, 20, yPosition + 8);
      doc.text(`Patients: ${driver.detailedMetrics.patientCount || driver.detailedMetrics.highCostScripts || driver.detailedMetrics.avoidableAdmissions || driver.detailedMetrics.excessiveTests || driver.detailedMetrics.sdohRiskFactors || driver.detailedMetrics.fwaCases || driver.detailedMetrics.priorAuths || driver.detailedMetrics.treatmentPaths}`, 20, yPosition + 16);
      
      // Key metrics
      const riskReduction = driver.detailedMetrics.aiSuccessMetrics?.readmissionProbability.reduction || 0;
      const aiAccuracy = (driver.detailedMetrics.aiSuccessMetrics?.predictiveAccuracy * 100) || 0;
      const successRate = (driver.detailedMetrics.aiSuccessMetrics?.interventionSuccessRate * 100) || 0;
      
      doc.text(`Risk Reduction: ${riskReduction}% | AI Accuracy: ${aiAccuracy.toFixed(1)}% | Success Rate: ${successRate.toFixed(1)}%`, 20, yPosition + 24);
      
      yPosition += 40;
    });
    
    // Risk Level Distribution
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(33, 150, 243);
    doc.text('🎯 Risk Level Distribution', 20, 30);
    
    const riskData = Object.values(COST_DRIVERS).map(driver => [
      driver.name,
      driver.detailedMetrics.aiSuccessMetrics?.riskLevelDistribution.critical || 0,
      driver.detailedMetrics.aiSuccessMetrics?.riskLevelDistribution.high || 0,
      (driver.detailedMetrics.aiSuccessMetrics?.riskLevelDistribution.medium || 0) + (driver.detailedMetrics.aiSuccessMetrics?.riskLevelDistribution.low || 0)
    ]);
    
    doc.autoTable({
      startY: 50,
      head: [['Cost Driver', 'Critical', 'High', 'Medium/Low']],
      body: riskData,
      theme: 'grid',
      headStyles: { fillColor: [33, 150, 243] },
      styles: { fontSize: 10 }
    });
    
    // Savings by Driver
    doc.setFontSize(16);
    doc.setTextColor(76, 175, 80);
    doc.text('📈 Savings by Driver', 20, 150);
    
    const savingsData = Object.values(COST_DRIVERS)
      .sort((a, b) => b.detailedMetrics.projectedSavings - a.detailedMetrics.projectedSavings)
      .map(driver => [
        driver.name,
        `$${driver.detailedMetrics.projectedSavings.toLocaleString()}`,
        `${driver.detailedMetrics.interventions?.length || 0} interventions`,
        `${driver.detailedMetrics.aiSuccessMetrics?.impactRiskReduction.total || 0} patients`
      ]);
    
    doc.autoTable({
      startY: 170,
      head: [['Driver', 'Projected Savings', 'Interventions', 'Patients Impacted']],
      body: savingsData,
      theme: 'grid',
      headStyles: { fillColor: [76, 175, 80] },
      styles: { fontSize: 10 }
    });
    
    // ROI Analysis
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(76, 175, 80);
    doc.text('💰 ROI Analysis', 20, 30);
    
    const roiData = [
      ['Metric', 'Value', 'Impact'],
      ['Total Investment', '$2.1M', 'AI infrastructure and implementation'],
      ['Annual Savings', '$8.2M', 'Projected cost reductions'],
      ['Net Annual Benefit', '$6.1M', 'Savings minus investment'],
      ['ROI', '290%', 'Return on investment'],
      ['Payback Period', '3.1 months', 'Time to recover investment']
    ];
    
    doc.autoTable({
      startY: 50,
      head: [roiData[0]],
      body: roiData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [76, 175, 80] },
      styles: { fontSize: 10 }
    });
    
    // Chronic Disease Management Impact
    doc.setFontSize(16);
    doc.setTextColor(255, 152, 0);
    doc.text('🏥 Chronic Disease Management Impact', 20, 150);
    
    const chronicData = [
      ['Disease Category', 'Patients', 'Cost Reduction', 'Quality Improvement'],
      ['Diabetes', '3,247', '32%', 'HbA1c control improved'],
      ['Hypertension', '2,891', '28%', 'BP control enhanced'],
      ['COPD', '1,856', '41%', 'Exacerbation reduction'],
      ['Heart Failure', '1,234', '35%', 'Readmission decrease']
    ];
    
    doc.autoTable({
      startY: 170,
      head: [chronicData[0]],
      body: chronicData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [255, 152, 0] },
      styles: { fontSize: 10 }
    });
    
    // AI Intervention Categories
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(156, 39, 176);
    doc.text('🤖 AI Intervention Categories', 20, 30);
    
    const interventionData = [
      ['Category', 'Interventions', 'Patients', 'Savings'],
      ['Medication Optimization', '1,247', '8,234', '$2.1M'],
      ['Care Coordination', '892', '6,156', '$1.8M'],
      ['Risk Stratification', '1,034', '12,847', '$1.5M'],
      ['Preventive Care', '756', '9,432', '$1.2M'],
      ['Fraud Detection', '234', '2,891', '$0.8M'],
      ['Prior Authorization', '445', '4,567', '$0.6M'],
      ['Treatment Optimization', '678', '5,234', '$0.2M']
    ];
    
    doc.autoTable({
      startY: 50,
      head: [interventionData[0]],
      body: interventionData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [156, 39, 176] },
      styles: { fontSize: 10 }
    });
    
    // Save the PDF
    doc.save(`executive-summary-dashboard-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const renderSummaryCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #4caf5015 0%, #4caf5005 100%)',
          border: '1px solid #4caf5030',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px #4caf5020',
          }
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50', mb: 1 }}>
                ${(COST_GAPS_DATA.summary.totalSavings / 1000000).toFixed(1)}M
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total Savings Identified
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <KeyboardArrowUpIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                  +{COST_GAPS_DATA.summary.savingsRate}%
                </Typography>
              </Box>
            </Box>
            <MonetizationOnIcon sx={{ color: '#4caf50', fontSize: 40 }} />
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #ff980015 0%, #ff980005 100%)',
          border: '1px solid #ff980030',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px #ff980020',
          }
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800', mb: 1 }}>
                ${(COST_GAPS_DATA.summary.potentialSavings / 1000000).toFixed(1)}M
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Potential Additional Savings
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 600 }}>
                  +8.5%
                </Typography>
              </Box>
            </Box>
            <SavingsIcon sx={{ color: '#ff9800', fontSize: 40 }} />
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{
          p: 3, 
          background: 'linear-gradient(135deg, #2196f315 0%, #2196f305 100%)',
          border: '1px solid #2196f330',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px #2196f320',
          }
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3', mb: 1 }}>
                {COST_GAPS_DATA.summary.costGaps}
                  </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Cost Gaps Identified
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssessmentIcon sx={{ color: '#2196f3', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#2196f3', fontWeight: 600 }}>
                  Active Analysis
                </Typography>
              </Box>
            </Box>
            <AssessmentOutlinedIcon sx={{ color: '#2196f3', fontSize: 40 }} />
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #9c27b015 0%, #9c27b005 100%)',
          border: '1px solid #9c27b030',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px #9c27b020',
          }
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#9c27b0', mb: 1 }}>
                ${COST_GAPS_DATA.summary.averageGap.toLocaleString()}
                        </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Average Gap Value
                        </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingDownIcon sx={{ color: '#9c27b0', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#9c27b0', fontWeight: 600 }}>
                  -12.3%
                        </Typography>
                      </Box>
                    </Box>
            <AnalyticsOutlinedIcon sx={{ color: '#9c27b0', fontSize: 40 }} />
          </Box>
                </Card>
              </Grid>
        </Grid>
    );

  const renderCostGapsChart = () => (
    <Card sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Cost Gaps by Category
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={COST_GAPS_DATA.categories}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {COST_GAPS_DATA.categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip 
              formatter={(value, name) => [`$${(value * COST_GAPS_DATA.summary.totalSavings / 100).toLocaleString()}`, name]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );

  const renderSavingsTrendChart = () => (
    <Card sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Savings Trend Analysis
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={COST_GAPS_DATA.trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip 
              formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stackId="1" 
              stroke="#8884d8" 
              fill="#8884d8" 
              name="Actual Costs"
            />
            <Area 
              type="monotone" 
              dataKey="projected" 
              stackId="1" 
              stroke="#82ca9d" 
              fill="#82ca9d" 
              name="Projected Costs"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );

  const renderTopGapsTable = () => (
    <Card sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Top Cost Gaps Identified
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Gap ID</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Impact</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {COST_GAPS_DATA.topGaps.map((gap) => (
              <TableRow key={gap.id} hover>
                <TableCell>{gap.id}</TableCell>
                <TableCell>
                  <Chip 
                    label={gap.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{gap.description}</TableCell>
                <TableCell>${gap.impact.toLocaleString()}</TableCell>
                <TableCell>{gap.frequency}</TableCell>
                <TableCell>
                  <Chip 
                    label={gap.status} 
                    size="small" 
                    color={gap.status === 'Resolved' ? 'success' : gap.status === 'In Review' ? 'warning' : 'info'}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={gap.priority} 
                    size="small" 
                    color={gap.priority === 'High' ? 'error' : 'warning'}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleGapSelect(gap)}
                  >
                    Analyze
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  const renderCostOfCare = () => (
    <Box>
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Top DRG Codes - Diabetes Focus
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>DRG Code</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Volume</TableCell>
                <TableCell>Avg Cost</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {COST_GAPS_DATA.costOfCare.topDrgCodes.map((drg) => (
                <TableRow key={drg.code} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{drg.code}</TableCell>
                  <TableCell>{drg.description}</TableCell>
                  <TableCell>{drg.volume.toLocaleString()}</TableCell>
                  <TableCell>${drg.avgCost.toLocaleString()}</TableCell>
                  <TableCell>${drg.totalCost.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={drg.riskLevel} 
                      size="small" 
                      color={drg.riskLevel === 'Critical' ? 'error' : drg.riskLevel === 'High' ? 'warning' : 'info'}
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined">
                      Analyze
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Top HCPCS Codes - Interventions
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>HCPCS Code</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Volume</TableCell>
                <TableCell>Avg Cost</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Intervention</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {COST_GAPS_DATA.costOfCare.topHcpcsCodes.map((hcpcs) => (
                <TableRow key={hcpcs.code} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{hcpcs.code}</TableCell>
                  <TableCell>{hcpcs.description}</TableCell>
                  <TableCell>{hcpcs.volume.toLocaleString()}</TableCell>
                  <TableCell>${hcpcs.avgCost.toLocaleString()}</TableCell>
                  <TableCell>${hcpcs.totalCost.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={hcpcs.intervention} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined">
                      Optimize
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Value-Based Care Interventions
        </Typography>
        <Grid container spacing={3}>
          {COST_GAPS_DATA.costOfCare.valueBasedInterventions.map((vbi) => (
            <Grid item xs={12} md={4} key={vbi.id}>
              <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {vbi.title}
                  </Typography>
                  <Chip 
                    label={`${vbi.roi}% ROI`} 
                    size="small" 
                    color="success"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {vbi.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Target DRG: <strong>{vbi.targetDrg}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Cost: <strong>${vbi.currentCost.toLocaleString()}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Projected Cost: <strong>${vbi.projectedCost.toLocaleString()}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Potential Savings: <strong style={{ color: '#4caf50' }}>${vbi.savings.toLocaleString()}</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Implementation: <strong>{vbi.implementation}</strong>
                  </Typography>
                  <Button size="small" variant="contained">
                    Deploy
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );

  const renderGapsInCare = () => (
    <Box>
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Identified Care Gaps - Diabetes Management
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Gap ID</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Days Overdue</TableCell>
                <TableCell>Impact</TableCell>
                <TableCell>Intervention</TableCell>
                <TableCell>Cost/Savings</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {COST_GAPS_DATA.gapsInCare.identifiedGaps.map((gap) => (
                <TableRow key={gap.id} hover>
                  <TableCell>{gap.id}</TableCell>
                  <TableCell>
                    <Chip 
                      label={gap.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{gap.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={gap.riskLevel} 
                      size="small" 
                      color={gap.riskLevel === 'Critical' ? 'error' : gap.riskLevel === 'High' ? 'warning' : 'info'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={gap.daysOverdue > 60 ? 'error' : 'warning'}>
                      {gap.daysOverdue} days
                    </Typography>
                  </TableCell>
                  <TableCell>{gap.impact}</TableCell>
                  <TableCell>{gap.intervention}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Cost: ${gap.estimatedCost}
                      </Typography>
                      <Typography variant="body2" color="success.main" fontWeight={600}>
                        Savings: ${gap.potentialSavings.toLocaleString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="primary">
                      Address
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );

  const renderPatientScenario = () => (
    <Box>
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Patient Scenario: Sarah Johnson - Type 2 Diabetes
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Patient Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Name:</Typography>
                  <Typography variant="body2" fontWeight={600}>{COST_GAPS_DATA.gapsInCare.patientScenario.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Age:</Typography>
                  <Typography variant="body2" fontWeight={600}>{COST_GAPS_DATA.gapsInCare.patientScenario.age}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Diagnosis:</Typography>
                  <Typography variant="body2" fontWeight={600}>{COST_GAPS_DATA.gapsInCare.patientScenario.diagnosis}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">A1C Level:</Typography>
                  <Typography variant="body2" fontWeight={600} color="error.main">
                    {COST_GAPS_DATA.gapsInCare.patientScenario.a1cLevel}% (Target: {COST_GAPS_DATA.gapsInCare.patientScenario.targetA1c}%)
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Risk Factors & Medications
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Risk Factors:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {COST_GAPS_DATA.gapsInCare.patientScenario.riskFactors.map((factor) => (
                    <Chip key={factor} label={factor} size="small" color="warning" variant="outlined" />
                  ))}
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Current Medications:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {COST_GAPS_DATA.gapsInCare.patientScenario.currentMedications.map((med) => (
                    <Chip key={med} label={med} size="small" color="info" variant="outlined" />
                  ))}
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Care Timeline & Next Steps
        </Typography>
        <Timeline>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="error" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="subtitle2" fontWeight={600}>
                Last Visit: {COST_GAPS_DATA.gapsInCare.patientScenario.lastVisit}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A1C measured at 8.2% - Above target range
              </Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="warning" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="subtitle2" fontWeight={600}>
                Current Status: Care Gaps Identified
              </Typography>
              <Typography variant="body2" color="text.secondary">
                5 critical care gaps requiring immediate attention
              </Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="subtitle2" fontWeight={600}>
                AI Intervention: Immediate Action Required
              </Typography>
              <Typography variant="body2" color="text.secondary">
                RPM implementation and medication adjustment recommended
              </Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="success" />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="subtitle2" fontWeight={600}>
                Next Visit: {COST_GAPS_DATA.gapsInCare.patientScenario.nextVisit}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expected A1C improvement with interventions
              </Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Card>
    </Box>
  );

  const renderAIRecommendations = () => (
    <Card sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        AI-Powered Recommendations
      </Typography>
      <Grid container spacing={3}>
        {COST_GAPS_DATA.gapsInCare.aiRecommendations.map((rec) => (
          <Grid item xs={12} md={4} key={rec.id}>
            <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {rec.title}
                </Typography>
                <Chip 
                  label={rec.priority} 
                  size="small" 
                  color={rec.priority === 'Critical' ? 'error' : rec.priority === 'High' ? 'warning' : 'info'}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {rec.description}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Actions:
                </Typography>
                <List dense>
                  {rec.actions.map((action, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={action} 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Expected Outcome: <strong>{rec.expectedOutcome}</strong>
                </Typography>
                <Typography variant="body2" color="success.main" fontWeight={600}>
                  Cost Savings: ${rec.costSavings.toLocaleString()}
                </Typography>
              </Box>
              <Button size="small" variant="contained" fullWidth>
                Implement Recommendation
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Card>
  );

  const renderRecommendations = () => (
    <Card sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        AI Recommendations
      </Typography>
      <Grid container spacing={3}>
        {COST_GAPS_DATA.recommendations.map((rec) => (
          <Grid item xs={12} md={6} key={rec.id}>
            <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {rec.title}
                </Typography>
                <Chip 
                  label={rec.impact} 
                  size="small" 
                  color={rec.impact === 'High' ? 'error' : 'warning'}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {rec.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Potential Savings: <strong>${rec.savings.toLocaleString()}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Timeline: <strong>{rec.timeline}</strong>
                  </Typography>
                </Box>
                <Button size="small" variant="contained">
                  Implement
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Card>
  );

  const renderAnalysisWorkflow = () => (
    <Card sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        AI Analysis Workflow
      </Typography>
      <Stepper activeStep={isAnalyzing ? 1 : analysisComplete ? 4 : 0} orientation="vertical">
        <Step>
          <StepLabel>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Data Collection
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gathering claims data and provider information
            </Typography>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Pattern Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI analyzing cost patterns and identifying gaps
            </Typography>
            {isAnalyzing && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress />
              </Box>
            )}
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Gap Identification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Identifying specific cost gaps and their impact
            </Typography>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Recommendations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generating actionable recommendations for cost optimization
            </Typography>
          </StepLabel>
        </Step>
      </Stepper>
      
      {!isAnalyzing && !analysisComplete && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AutoAwesomeIcon />}
            onClick={handleAnalyze}
            sx={{ 
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              color: 'white',
              px: 4,
              py: 1.5
            }}
          >
            Start AI Analysis
          </Button>
        </Box>
      )}
    </Card>
  );

  const FUNCTION_AREAS = [
    {
      icon: <BarChartIcon color="primary" />, title: 'Claims Analytics',
      capability: 'Analyze DRG/APC/HCPCS cost & utilization trends from CMS and internal claims data',
      impact: 'Identifies high-cost services and cost anomalies',
      getInsight: (rows) => {
        if (!rows?.length) return '';
        const top = [...rows].sort((a, b) => b.spend - a.spend)[0];
        return `Top spend: ${top.drg} ($${top.spend.toLocaleString()}, ${top.volume} cases)`;
      }
    },
    {
      icon: <FilterListIcon color="secondary" />, title: 'Cost Driver Prioritization',
      capability: 'Ranks services by spend + preventability + volume',
      impact: 'Helps focus intervention efforts for max ROI',
      getInsight: (rows) => {
        if (!rows?.length) return '';
        const preventable = rows.filter(r => r.preventable === 'Yes');
        if (!preventable.length) return 'No fully preventable DRGs';
        const top = preventable.sort((a, b) => b.spend - a.spend)[0];
        return `Most preventable: ${top.drg} ($${top.spend.toLocaleString()})`;
      }
    },
    {
      icon: <PsychologyIcon color="error" />, title: 'LLM-Based Recommendations',
      capability: 'Maps top cost drivers to VBC-aligned interventions (e.g., remote PT, early discharge)',
      impact: 'Reduces cost by proposing smart, personalized alternatives',
      getInsight: (rows) => {
        if (!rows?.length) return '';
        const top = [...rows].sort((a, b) => b.spend - a.spend)[0];
        return `For ${top.drg}, recommend early discharge and remote PT.`;
      }
    },
    {
      icon: <SearchIcon color="action" />, title: 'Preventability Insights',
      capability: 'Flags potentially avoidable admissions (e.g., Sepsis due to UTI)',
      impact: 'Enables upstream interventions',
      getInsight: (rows) => {
        if (!rows?.length) return '';
        const preventable = rows.filter(r => r.preventable === 'Yes').length;
        return `${preventable} of ${rows.length} DRGs flagged as preventable.`;
      }
    },
    {
      icon: <ShowChartIcon color="success" />, title: 'Simulation Modeling',
      capability: 'Models cost reduction if certain interventions are implemented',
      impact: 'Justifies investment in VBC strategies',
      getInsight: (rows) => {
        if (!rows?.length) return '';
        const preventable = rows.filter(r => r.preventable === 'Yes');
        const savings = preventable.reduce((sum, r) => sum + r.spend, 0);
        return `Potential savings if all preventable DRGs addressed: $${savings.toLocaleString()}`;
      }
    },
    {
      icon: <TrendingUpIcon color="primary" />, title: 'Trend Monitoring',
      capability: 'Tracks YoY or QoQ changes in cost buckets',
      impact: 'Provides real-time visibility for leadership and strategy',
      getInsight: (rows) => 'No trend data in sample, but could show YoY/quarterly if available.'
    }
  ];



  

  const renderGapsInCareSim = () => {
    const currentPatient = MOCK_PATIENTS.find(p => p.id === selectedPatient) || MOCK_PATIENTS[0];
    
    return (
      <Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <InputLabel>Select Patient</InputLabel>
            <Select 
              value={selectedPatient} 
              label="Select Patient" 
              onChange={(e) => handlePatientChange(e.target.value)}
            >
              {MOCK_PATIENTS.map(patient => (
                <MenuItem key={patient.id} value={patient.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {patient.name} ({patient.age})
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {patient.diagnosis} • Risk: {patient.riskLevel}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button 
            variant="contained" 
            size="small"
            onClick={handleGapsAnalysis}
            startIcon={<AnalyticsIcon />}
            disabled={gapsAnalysisActive}
            sx={{
              background: 'linear-gradient(45deg, #2196f3 30%, #4caf50 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976d2 30%, #388e3c 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)'
              }
            }}
          >
            {gapsAnalysisActive ? 'AI Analyzing...' : 'Gaps in Care Analysis'}
          </Button>
        </Box>

        {/* Patient Info Card */}
        <Card sx={{ p: 2, mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {currentPatient.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Age: {currentPatient.age} • {currentPatient.diagnosis} • Risk Level: {currentPatient.riskLevel}
              </Typography>
            </Box>
            <Chip 
              label={`${Math.round((currentPatient.readmit.before - currentPatient.readmit.after) * 100)}% Risk Reduction`}
              color="success"
              variant="filled"
            />
          </Box>
        </Card>

                {/* AI Agent Journey Overview */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          🤖 AI Agent Journey Overview
        </Typography>
        
        {/* AI Intervention Flow */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            {(currentPatient.getTimeline ? currentPatient.getTimeline(workflowCompleted) : currentPatient.timeline)
              .filter(ev => ev.ai).slice(0, 6).map((ev, idx) => (
              <Grid item xs={12} md={6} lg={4} key={`ai-intervention-${idx}`}>
                <Fade in={timelineAnimation} timeout={1000 + idx * 300}>
                  <Card sx={{ 
                    p: 2, 
                    height: '100%',
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                    border: '2px solid #2196f3',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: 'linear-gradient(90deg, #2196f3, #4caf50, #ff9800)',
                      animation: timelineAnimation ? 'shimmer 2s ease-in-out' : 'none',
                      animationDelay: `${idx * 0.5}s`
                    }
                  }}>
                    {/* Animated Icon */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      mb: 2,
                      animation: timelineAnimation ? `${bounce} 1s ease-in-out` : 'none',
                      animationDelay: `${idx * 0.3}s`
                    }}>
                      <Box sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #2196f3, #4caf50)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 24,
                        boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                        animation: timelineAnimation ? 'pulse 2s ease-in-out infinite' : 'none',
                        animationDelay: `${idx * 0.3}s`
                      }}>
                        {idx === 0 && '📱'}
                        {idx === 1 && '👨‍⚕️'}
                        {idx === 2 && '🏥'}
                        {idx === 3 && '✅'}
                        {idx === 4 && '🏠'}
                        {idx === 5 && '📊'}
                      </Box>
                    </Box>

                    {/* Event Details */}
                    <Typography variant="body2" fontWeight={600} color="primary.main" sx={{ mb: 1, textAlign: 'center' }}>
                      {ev.date}
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ mb: 2, textAlign: 'center', fontSize: '0.875rem' }}>
                      {ev.event}
                    </Typography>

                    {/* Proof/Transcript Section */}
                    <Box sx={{ 
                      mt: 'auto',
                      p: 1.5, 
                      bgcolor: 'rgba(33, 150, 243, 0.1)', 
                      borderRadius: 1,
                      border: '1px solid rgba(33, 150, 243, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(33, 150, 243, 0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                      }
                    }}
                    onClick={() => handleProofClick({
                      event: ev.event,
                      date: ev.date,
                      index: idx,
                      patient: currentPatient.name
                    })}>
                      <Typography variant="caption" fontWeight={600} color="primary.main" sx={{ mb: 1, display: 'block' }}>
                        📋 Proof Attached: (Click to View)
                      </Typography>
                      
                      {/* Dynamic proof content based on event */}
                      {idx === 0 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            • RPM Alert Log: BP 180/110 detected at 2:15 AM
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            • AI Risk Score: 8.7/10 (Critical)
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            • Auto-notification sent to care team
                          </Typography>
                        </Box>
                      )}
                      
                      {idx === 1 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            • Call Transcript: 15-min consultation
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            • Medication adjusted: Lisinopril 10mg → 20mg
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            • Follow-up scheduled: 48 hours
                          </Typography>
                        </Box>
                      )}
                      
                      {idx === 2 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            • Care Gap Analysis: 5 gaps identified
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            • Appointments scheduled: Eye, Foot, Nutrition
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            • RPM device activated
                          </Typography>
                        </Box>
                      )}
                      
                      {idx === 3 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            • BP Monitoring: Stable at 140/85
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            • A1C Improvement: 8.7% → 7.8%
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            • Stroke Risk: Reduced by 67%
                          </Typography>
                        </Box>
                      )}
                      
                      {idx === 4 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            • Smart Routing: Direct to diabetes center
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            • Care Plan: Personalized treatment protocol
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            • Length of Stay: Reduced by 40%
                          </Typography>
                        </Box>
                      )}
                      
                      {idx === 5 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            • Home Monitoring: 24/7 glucose tracking
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            • Caregiver Alerts: 3 family members notified
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            • Readmission Risk: 0% (vs 28% baseline)
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Provider Outreach Workflow Trigger */}
        {currentPatient.id === 'emma-rodriguez' && !workflowCompleted && (
          <Box sx={{ mb: 3 }}>
            <Card sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%)',
              border: '2px solid #ff9800',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#e65100', display: 'flex', alignItems: 'center', gap: 1 }}>
                ⚠️ Care Team Contact Failed - Provider Outreach Available
              </Typography>
              {/* Only show the warning and trigger button if workflow is not active */}
              {!providerOutreachActive ? (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Patient Emma Rodriguez is not responding to care team calls. AI recommends provider outreach workflow.
                    </Typography>
                    <Typography variant="body2" color="error.main" fontWeight={600}>
                      Risk Level: High • BP: 175/105 • Medication adjustment needed
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleProviderOutreach}
                    startIcon={<SupportAgentIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)',
                      color: 'white',
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #f57c00 30%, #ef6c00 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)'
                      }
                    }}
                  >
                    Trigger Provider Outreach
                  </Button>
                </Box>
              ) : null}
            </Card>
          </Box>
        )}

        {/* Provider Outreach Workflow Progress UI - only show when active and not completed */}
        {currentPatient.id === 'emma-rodriguez' && providerOutreachActive && !workflowCompleted && (
          <Box sx={{ mb: 3 }}>
            <Card sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, #fffde7 0%, #fff8e1 100%)',
              border: '2px solid #ff9800',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Typography variant="body2" color="success.main" fontWeight={600} sx={{ mb: 2 }}>
                🚀 Provider Outreach Workflow in Progress...
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={(outreachStep / 7) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 152, 0, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(45deg, #ff9800, #f57c00)',
                      borderRadius: 4
                    }
                  }}
                />
              </Box>

              {/* Workflow Steps */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                  Workflow Steps:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    'Initiating provider outreach workflow...',
                    'Contacting primary care physician...',
                    'Provider reviewing patient case...',
                    'Provider calling patient...',
                    'Medication adjustment completed...',
                    'Follow-up scheduled...',
                    'Provider outreach successful!'
                  ].map((step, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: index < outreachStep ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                        border: '1px solid',
                        borderColor: index < outreachStep ? 'success.main' : 'warning.main'
                      }}
                    >
                      {index < outreachStep ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                      ) : (
                        <PendingIcon color="warning" fontSize="small" />
                      )}
                      <Typography 
                        variant="body2" 
                        color={index < outreachStep ? 'success.main' : 'text.secondary'}
                        fontWeight={index < outreachStep ? 600 : 400}
                      >
                        {step}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Real-time Call Display */}
              {callActive && (
                <Card sx={{ 
                  p: 2, 
                  mb: 2, 
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                  border: '2px solid #4caf50',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                    animation: `${shimmer} 2s ease-in-out infinite`
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 20,
                      animation: `${pulse} 2s ease-in-out infinite`
                    }}>
                      📞
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} color="success.main">
                        Live Call in Progress
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Dr. Maria Rodriguez → Emma Rodriguez
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {audioPlaying && (
                        <Box sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: 'linear-gradient(45deg, #ff5722, #f44336)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          animation: `${pulse} 1s ease-in-out infinite`
                        }}>
                          <Box sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'white'
                          }} />
                        </Box>
                      )}
                      <Typography variant="caption" color="success.main" fontWeight={600}>
                        🔊 Live Audio
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => setAudioMuted(!audioMuted)}
                        sx={{
                          color: audioMuted ? '#f44336' : '#4caf50',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.2)'
                          }
                        }}
                      >
                        {audioMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    maxHeight: 300, 
                    overflowY: 'auto',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    p: 2,
                    border: '1px solid rgba(76, 175, 80, 0.3)'
                  }}>
                    {callTranscript.map((entry, index) => (
                      <Fade in={true} timeout={500} key={index}>
                        <Box sx={{ 
                          mb: 2, 
                          display: 'flex', 
                          flexDirection: 'column',
                          animation: `${slideInRight} 0.5s ease-out`
                        }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 0.5
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" fontWeight={600} color="primary.main">
                                {entry.speaker}
                              </Typography>
                              {audioPlaying && currentAudioIndex === index && (
                                <Box sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(45deg, #ff5722, #f44336)',
                                  animation: `${pulse} 1s ease-in-out infinite`
                                }} />
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {entry.time}
                            </Typography>
                          </Box>
                          <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: entry.speaker === 'Provider' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                            border: '2px solid',
                            borderColor: audioPlaying && currentAudioIndex === index 
                              ? '#ff5722' 
                              : entry.speaker === 'Provider' ? 'primary.main' : 'success.main',
                            position: 'relative',
                            transform: audioPlaying && currentAudioIndex === index ? 'scale(1.02)' : 'scale(1)',
                            transition: 'all 0.3s ease',
                            boxShadow: audioPlaying && currentAudioIndex === index 
                              ? '0 4px 12px rgba(255, 87, 34, 0.3)' 
                              : 'none',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              left: -8,
                              top: 12,
                              width: 0,
                              height: 0,
                              borderTop: '8px solid transparent',
                              borderBottom: '8px solid transparent',
                              borderRight: audioPlaying && currentAudioIndex === index 
                                ? '#ff5722 solid 8px'
                                : entry.speaker === 'Provider' ? '8px solid #2196f3' : '8px solid #4caf50'
                            }
                          }}>
                            <Typography variant="body2" color="text.primary">
                              {entry.message}
                            </Typography>
                            {audioPlaying && currentAudioIndex === index && (
                              <Box sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                display: 'flex',
                                gap: 0.5
                              }}>
                                {[0, 1, 2].map((i) => (
                                  <Box
                                    key={i}
                                    sx={{
                                      width: 3,
                                      height: 12,
                                      bgcolor: '#ff5722',
                                      borderRadius: 1,
                                      animation: `${bounce} 1s ease-in-out infinite`,
                                      animationDelay: `${i * 0.2}s`
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Fade>
                    ))}
                    
                    {callTranscript.length > 0 && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        p: 1,
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                        borderRadius: 1,
                        border: '1px solid rgba(76, 175, 80, 0.3)'
                      }}>
                        <Box sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#4caf50',
                          animation: `${pulse} 1s ease-in-out infinite`
                        }} />
                        <Typography variant="caption" color="success.main" fontWeight={600}>
                          Call in progress...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Card>
              )}

              {/* Enhanced Call Transcript Display */}
              {!callActive && callTranscript.length > 0 && (
                <Card sx={{ 
                  p: 3, 
                  mb: 2, 
                  background: 'linear-gradient(135deg,rgb(235, 232, 232) 0%, #f3e5f5 100%)',
                  border: '2px solid #2196f3',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: 'linear-gradient(90deg, #2196f3, #4caf50, #ff9800)',
                    animation: `${shimmer} 3s ease-in-out infinite`
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #2196f3, #4caf50)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 24
                    }}>
                      📋
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600} color="success.main">
                        Call Completed Successfully
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📋 Transcript recorded and saved to patient record
                      </Typography>
                    </Box>
                  </Box>

                  {/* Call Summary Stats */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Card sx={{ 
                      p: 1.5, 
                      bgcolor: 'rgba(76, 175, 80, 0.1)', 
                      border: '1px solid #4caf50',
                      minWidth: 120
                    }}>
                      <Typography variant="caption" color="success.main" fontWeight={600}>
                        Duration: 2:00 min
                      </Typography>
                    </Card>
                    <Card sx={{ 
                      p: 1.5, 
                      bgcolor: 'rgba(33, 150, 243, 0.1)', 
                      border: '1px solid #2196f3',
                      minWidth: 120
                    }}>
                      <Typography variant="caption" color="primary.main" fontWeight={600}>
                        Messages: {callTranscript.length}
                      </Typography>
                    </Card>
                    <Card sx={{ 
                      p: 1.5, 
                      bgcolor: 'rgba(255, 152, 0, 0.1)', 
                      border: '1px solid #ff9800',
                      minWidth: 120
                    }}>
                      <Typography variant="caption" color="#e65100" fontWeight={600}>
                        Status: Completed
                      </Typography>
                    </Card>
                  </Box>

                  {/* Complete Transcript */}
                  <Typography variant="subtitle1" fontWeight={600} color="primary.main" sx={{ mb: 2 }}>
                    📄 Complete Call Transcript
                  </Typography>
                  <Box sx={{ 
                    maxHeight: 400, 
                    overflowY: 'auto',
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 2,
                    p: 2,
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    '&::-webkit-scrollbar': {
                      width: 8,
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(33, 150, 243, 0.1)',
                      borderRadius: 4,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'linear-gradient(45deg, #2196f3, #4caf50)',
                      borderRadius: 4,
                    }
                  }}>
                    {callTranscript.map((entry, index) => (
                      <Fade in={true} timeout={500 + index * 100} key={index}>
                        <Box sx={{ 
                          mb: 2, 
                          display: 'flex', 
                          flexDirection: 'column',
                          animation: `${slideInRight} 0.5s ease-out`,
                          animationDelay: `${index * 0.1}s`
                        }}>
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            mb: 0.5
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" fontWeight={600} color="primary.main">
                                {entry.speaker}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {entry.time}
                            </Typography>
                          </Box>
                          <Box sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: entry.speaker === 'Provider' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                            border: '2px solid',
                            borderColor: entry.speaker === 'Provider' ? 'primary.main' : 'success.main',
                            position: 'relative',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              left: -8,
                              top: 12,
                              width: 0,
                              height: 0,
                              borderTop: '8px solid transparent',
                              borderBottom: '8px solid transparent',
                              borderRight: entry.speaker === 'Provider' ? '8px solid #2196f3' : '8px solid #4caf50'
                            }
                          }}>
                            <Typography variant="body2" color="text.primary">
                              {entry.message}
                            </Typography>
                          </Box>
                        </Box>
                      </Fade>
                    ))}
                  </Box>
                </Card>
              )}
            </Card>
          </Box>
        )}

        {/* Success Message After Workflow Completion */}
        {currentPatient.id === 'emma-rodriguez' && workflowCompleted && (
          <Box sx={{ mb: 3 }}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg,rgb(251, 251, 251) 0%, #f1f8e9 100%)',
              border: '2px solid #4caf50',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                animation: `${shimmer} 3s ease-in-out infinite`
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 28,
                  animation: `${bounce} 2s ease-in-out infinite`
                }}>
                  🎉
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={700} color="success.main">
                    Provider Outreach Successfully Completed!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Emma Rodriguez's care has been successfully managed through provider outreach
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Card sx={{ 
                  p: 1.5, 
                  bgcolor: 'rgba(255, 255, 255, 0.8)', 
                  border: '1px solid #4caf50',
                  minWidth: 150
                }}>
                  <Typography variant="body2" color="success.main" fontWeight={600}>
                    ✅ Medication Adjusted
                  </Typography>
                </Card>
                <Card sx={{ 
                  p: 1.5, 
                  bgcolor: 'rgba(255, 255, 255, 0.8)', 
                  border: '1px solid #4caf50',
                  minWidth: 150
                }}>
                  <Typography variant="body2" color="success.main" fontWeight={600}>
                    ✅ Patient Engaged
                  </Typography>
                </Card>
                <Card sx={{ 
                  p: 1.5, 
                  bgcolor: 'rgba(255, 255, 255, 0.8)', 
                  border: '1px solid #4caf50',
                  minWidth: 150
                }}>
                  <Typography variant="body2" color="success.main" fontWeight={600}>
                    ✅ Risk Mitigated
                  </Typography>
                </Card>
              </Box>
            </Card>
          </Box>
        )}

        {/* AI Success Metrics */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            🎯 AI Success Metrics
          </Typography>
          <Grid container spacing={2}>
            {currentPatient.phases.map((phase, idx) => (
              <Grid item xs={12} sm={6} md={3} key={phase.phase}>
                <Fade in={timelineAnimation} timeout={1000 + idx * 300}>
                  <Card sx={{ 
                    p: 2, 
                    height: '100%',
                    background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                    border: '2px solid #4caf50',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                      animation: timelineAnimation ? `${shimmer} 2s ease-in-out` : 'none',
                      animationDelay: `${idx * 0.5}s`
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 12
                      }}>
                        {idx + 1}
                      </Box>
                      <Typography variant="subtitle2" fontWeight={600} color="success.main">
                        {phase.phase}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="error.main" fontWeight={600}>
                        Without AI: {phase.withoutAI}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="success.main" fontWeight={600}>
                        With AI: {phase.withAI}
                      </Typography>
                    </Box>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Readmission Probability Impact */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            📈 Readmission Probability Impact
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Risk Reduction Timeline
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { day: 1, beforeAI: Math.round(currentPatient.readmit.before * 100), withAI: Math.round(currentPatient.readmit.after * 100), intervention: 'Initial Assessment' },
                    { day: 3, beforeAI: Math.round(currentPatient.readmit.before * 100) + 2, withAI: Math.round(currentPatient.readmit.after * 100) - 1, intervention: 'RPM Activated' },
                    { day: 7, beforeAI: Math.round(currentPatient.readmit.before * 100) + 5, withAI: Math.round(currentPatient.readmit.after * 100) - 3, intervention: 'Medication Adjustment' },
                    { day: 14, beforeAI: Math.round(currentPatient.readmit.before * 100) + 8, withAI: Math.round(currentPatient.readmit.after * 100) - 5, intervention: 'Care Gap Closure' },
                    { day: 21, beforeAI: Math.round(currentPatient.readmit.before * 100) + 12, withAI: Math.round(currentPatient.readmit.after * 100) - 8, intervention: 'Home Monitoring' },
                    { day: 30, beforeAI: Math.round(currentPatient.readmit.before * 100) + 15, withAI: Math.round(currentPatient.readmit.after * 100) - 10, intervention: 'Final Assessment' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 12, fill: '#666' }}
                      axisLine={{ stroke: '#ccc' }}
                      tickLine={{ stroke: '#ccc' }}
                    />
                    <YAxis 
                      unit="%" 
                      tick={{ fontSize: 12, fill: '#666' }}
                      axisLine={{ stroke: '#ccc' }}
                      tickLine={{ stroke: '#ccc' }}
                      domain={[0, Math.round(currentPatient.readmit.before * 100) + 20]}
                    />
                    <RechartsTooltip 
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #ccc',
                        borderRadius: 8
                      }}
                      formatter={(value, name) => [`${value}%`, name]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="beforeAI" 
                      stroke="#f44336" 
                      strokeWidth={3}
                      name="Without AI"
                      dot={{ fill: '#f44336', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="withAI" 
                      stroke="#4caf50" 
                      strokeWidth={3}
                      name="With AI"
                      dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Overall Risk Reduction */}
                <Card sx={{ 
                  p: 2, 
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                  border: '2px solid #4caf50',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 1,
                    animation: timelineAnimation ? `${bounce} 1s ease-in-out` : 'none'
                  }}>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 24,
                      fontWeight: 700,
                      boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                    }}>
                      {Math.round((currentPatient.readmit.before - currentPatient.readmit.after) * 100)}%
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 700, color: 'success.main', mb: 1 }}>
                    Risk Reduction
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    AI interventions reduced readmission risk by {Math.round((currentPatient.readmit.before - currentPatient.readmit.after) * 100)}%
                  </Typography>
                </Card>

                {/* Before vs After Comparison */}
                <Card sx={{ 
                  p: 2, 
                  background: 'linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%)',
                  border: '2px solid #ff9800'
                }}>
                  <Typography variant="subtitle2" fontWeight={600} color="#e65100" sx={{ mb: 1 }}>
                    Before AI Intervention
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="error.main" sx={{ mb: 1 }}>
                    {Math.round(currentPatient.readmit.before * 100)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High readmission risk due to care gaps and missed interventions
                  </Typography>
                </Card>

                <Card sx={{ 
                  p: 2, 
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                  border: '2px solid #4caf50'
                }}>
                  <Typography variant="subtitle2" fontWeight={600} color="success.main" sx={{ mb: 1 }}>
                    After AI Intervention
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main" sx={{ mb: 1 }}>
                    {Math.round(currentPatient.readmit.after * 100)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Optimized care delivery with proactive interventions and monitoring
                  </Typography>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* AI Intervention Timeline */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            📅 AI Intervention Timeline
          </Typography>
          <Card sx={{ p: 3 }}>
            <Box sx={{ position: 'relative' }}>
              {/* Timeline Line */}
              <Box sx={{
                position: 'absolute',
                left: 20,
                top: 0,
                bottom: 0,
                width: 2,
                background: 'linear-gradient(180deg, #2196f3, #4caf50)',
                borderRadius: 1
              }} />
              {(currentPatient.getTimeline ? currentPatient.getTimeline(workflowCompleted) : currentPatient.timeline)
                .filter(ev => ev.ai).map((event, index) => (
                <Fade in={timelineAnimation} timeout={1000 + index * 300} key={index}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    mb: 3,
                    position: 'relative'
                  }}>
                    {/* Timeline Dot */}
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #2196f3, #4caf50)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 600,
                      zIndex: 2,
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                      animation: timelineAnimation ? `${bounce} 1s ease-in-out` : 'none',
                      animationDelay: `${index * 0.2}s`
                    }}>
                      🤖
                    </Box>
                    {/* Event Card */}
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Card sx={{ 
                        p: 2,
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                        border: '2px solid #2196f3',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: 'linear-gradient(90deg, #2196f3, #4caf50, #ff9800)',
                          animation: timelineAnimation ? `${shimmer} 2s ease-in-out` : 'none',
                          animationDelay: `${index * 0.5}s`
                        }
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                            {event.date}
                          </Typography>
                          <Chip 
                            label="AI Intervention" 
                            size="small" 
                            color="primary" 
                            variant="filled"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        </Box>
                        <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                          {event.event}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.impact}
                        </Typography>
                      </Card>
                    </Box>
                  </Box>
                </Fade>
              ))}
            </Box>
          </Card>
        </Box>



        {/* Cost Savings Analysis */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            💰 Cost Savings Analysis
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%)',
                border: '2px solid #ff9800',
                textAlign: 'center'
              }}>
                <Typography variant="h4" fontWeight={700} color="#e65100" sx={{ mb: 1 }}>
                  ${Math.round((currentPatient.readmit.before - currentPatient.readmit.after) * 50000).toLocaleString()}
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} color="#e65100">
                  Potential Savings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Per patient per year
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                border: '2px solid #4caf50',
                textAlign: 'center'
              }}>
                <Typography variant="h4" fontWeight={700} color="success.main" sx={{ mb: 1 }}>
                  {Math.round((currentPatient.readmit.before - currentPatient.readmit.after) * 100)}%
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} color="success.main">
                  Risk Reduction
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Readmission probability
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                border: '2px solid #2196f3',
                textAlign: 'center'
              }}>
                <Typography variant="h4" fontWeight={700} color="primary.main" sx={{ mb: 1 }}>
                  {Math.round((currentPatient.readmit.before - currentPatient.readmit.after) * 365)} days
                </Typography>
                <Typography variant="subtitle1" fontWeight={600} color="primary.main">
                  Quality Life Years
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Additional healthy days
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Gaps in Care Analysis Results */}
        {gapsAnalysisComplete && gapsAnalysisData && (
          <Box sx={{ mb: 3 }}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
              border: '2px solid #2196f3',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'linear-gradient(90deg, #2196f3, #4caf50, #ff9800)',
                animation: `${shimmer} 3s ease-in-out infinite`
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #2196f3, #4caf50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 28,
                  animation: `${bounce} 2s ease-in-out infinite`
                }}>
                  🤖
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    AI Gaps in Care Analysis Complete
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Comprehensive analysis of 30 patients using EHR, QI Models, and Qualtrics data
                  </Typography>
                </Box>
              </Box>

              {/* Summary Metrics */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  📊 Analysis Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      p: 2, 
                      background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                      border: '2px solid #4caf50',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h3" fontWeight={700} color="success.main">
                        {gapsAnalysisData.summary.totalPatients}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} color="success.main">
                        Patients Analyzed
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      p: 2, 
                      background: 'linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%)',
                      border: '2px solid #ff9800',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h3" fontWeight={700} color="#e65100">
                        {gapsAnalysisData.summary.totalGaps}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} color="#e65100">
                        Total Care Gaps
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      p: 2, 
                      background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
                      border: '2px solid #e91e63',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h3" fontWeight={700} color="error.main">
                        {gapsAnalysisData.summary.criticalGaps}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} color="error.main">
                        Critical Gaps
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      p: 2, 
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                      border: '2px solid #2196f3',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h3" fontWeight={700} color="primary.main">
                        {gapsAnalysisData.summary.averageRiskScore}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} color="primary.main">
                        Avg Risk Score
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              {/* Gap Analysis Charts */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  📈 Gap Analysis by Type
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={6}>
                    <Card sx={{ p: 3, height: 400 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                        Gap Distribution by Type
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={gapsAnalysisData.gapAnalysis.byType}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis 
                            dataKey="type" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <RechartsTooltip 
                            contentStyle={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #ccc',
                              borderRadius: 8
                            }}
                          />
                          <Bar dataKey="count" fill="#2196f3" name="Patient Count" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Card sx={{ p: 3, height: 400 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                        Average Severity by Gap Type
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={gapsAnalysisData.gapAnalysis.byType}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis 
                            dataKey="type" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <RechartsTooltip 
                            contentStyle={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #ccc',
                              borderRadius: 8
                            }}
                          />
                          <Bar dataKey="averageSeverity" fill="#ff9800" name="Average Severity" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              {/* Risk Level Analysis */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  🎯 Risk Level Distribution
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={6}>
                    <Card sx={{ p: 3, height: 400 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                        Patients by Risk Level
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={gapsAnalysisData.gapAnalysis.byRiskLevel}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ level, percent }) => `${level} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {gapsAnalysisData.gapAnalysis.byRiskLevel.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#4caf50', '#ff9800', '#f44336', '#9c27b0'][index]} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #ccc',
                              borderRadius: 8
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Card sx={{ p: 3, height: 400 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                        Average Gaps by Risk Level
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={gapsAnalysisData.gapAnalysis.byRiskLevel}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis dataKey="level" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <RechartsTooltip 
                            contentStyle={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #ccc',
                              borderRadius: 8
                            }}
                          />
                          <Bar dataKey="averageGaps" fill="#e91e63" name="Average Gaps" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              {/* Patient Details Table */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  👥 Patient Details
                </Typography>
                <Card sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>Patient</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>Age</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>Diagnosis</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>Risk Level</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>Risk Score</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>Total Gaps</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>Last Visit</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {gapsAnalysisData.patients.map((patient) => (
                          <TableRow key={patient.id} hover>
                            <TableCell>{patient.name}</TableCell>
                            <TableCell>{patient.age}</TableCell>
                            <TableCell>{patient.diagnosis}</TableCell>
                            <TableCell>
                              <Chip 
                                label={patient.riskLevel} 
                                size="small"
                                color={
                                  patient.riskLevel === 'Critical' ? 'error' :
                                  patient.riskLevel === 'High' ? 'warning' :
                                  patient.riskLevel === 'Medium' ? 'info' : 'success'
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ 
                                width: 60, 
                                height: 8, 
                                bgcolor: '#e0e0e0', 
                                borderRadius: 4,
                                overflow: 'hidden'
                              }}>
                                <Box sx={{ 
                                  width: `${patient.riskScore}%`, 
                                  height: '100%', 
                                  bgcolor: patient.riskScore > 70 ? '#f44336' : patient.riskScore > 50 ? '#ff9800' : '#4caf50'
                                }} />
                              </Box>
                              <Typography variant="caption">{patient.riskScore}</Typography>
                            </TableCell>
                            <TableCell>{patient.totalGaps}</TableCell>
                            <TableCell>{patient.lastVisit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Box>

              {/* AI Recommendations */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  🤖 AI Recommendations
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ 
                      p: 2, 
                      background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                      border: '2px solid #4caf50'
                    }}>
                      <Typography variant="subtitle1" fontWeight={600} color="success.main" sx={{ mb: 1 }}>
                        🚨 Immediate Actions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Contact {gapsAnalysisData.summary.criticalGaps} patients with critical gaps<br/>
                        • Schedule urgent follow-ups for high-risk patients<br/>
                        • Implement medication adherence programs
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ 
                      p: 2, 
                      background: 'linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%)',
                      border: '2px solid #ff9800'
                    }}>
                      <Typography variant="subtitle1" fontWeight={600} color="#e65100" sx={{ mb: 1 }}>
                        📊 Process Improvements
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Enhance EHR alerts for care gaps<br/>
                        • Implement automated patient outreach<br/>
                        • Develop preventive care protocols
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ 
                      p: 2, 
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                      border: '2px solid #2196f3'
                    }}>
                      <Typography variant="subtitle1" fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
                        📈 Long-term Strategy
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Establish continuous monitoring system<br/>
                        • Train care teams on gap identification<br/>
                        • Implement predictive analytics
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Box>
        )}

        {/* Gaps Analysis Loading */}
        {gapsAnalysisActive && (
          <Box sx={{ mb: 3 }}>
            <Card sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%)',
              border: '2px solid #ff9800'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #ff9800, #f57c00)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 20,
                  animation: `${pulse} 2s ease-in-out infinite`
                }}>
                  🤖
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600} color="#e65100">
                    AI Agent Analyzing Care Gaps
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Processing EHR data, QI models, and Qualtrics surveys for 30 patients...
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(255, 152, 0, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(45deg, #ff9800, #f57c00)',
                    borderRadius: 4
                  }
                }}
              />
            </Card>
          </Box>
        )}
      </Box>
    );
  };

  const renderAgentInterventions = () => (
    <Box sx={{ mb: 4 }}>
      <Card sx={{ 
        p: 4, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)', // Light Apple-like background
        border: '2px solid #4ECDC4',
        borderRadius: 3,
        overflow: 'hidden',
        color: '#222'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            animation: 'pulse 2s infinite'
          }}>
            <Typography variant="h3">🤖</Typography>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} color="#222" sx={{ mb: 1 }}>
              Live Agent Interventions
            </Typography>
            <Typography variant="body1" color="green">
              Real-time AI agent activities across all cost drivers
            </Typography>
          </Box>
        </Box>

        {/* Current Active Intervention */}
        {agentInterventions[interventionIndex] && (
          <Card sx={{
            p: 3,
            mb: 3,
            background: `linear-gradient(135deg, ${agentInterventions[interventionIndex].color}20 0%, ${agentInterventions[interventionIndex].color}10 100%)`,
            border: `2px solid ${agentInterventions[interventionIndex].color}`,
            borderRadius: 3,
            animation: 'slideInRight 0.5s ease-out',
            color: '#37383b'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h2">{agentInterventions[interventionIndex].icon}</Typography>
                <Box>
                  <Typography variant="h6" fontWeight={700} color={agentInterventions[interventionIndex].color}>
                    {agentInterventions[interventionIndex].agent}
                  </Typography>
                  <Typography variant="body2" color="#37383b">
                    {agentInterventions[interventionIndex].driver}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  ${agentInterventions[interventionIndex].costSaved.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="success.main">
                  Cost Saved
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#37383b' }}>
                {agentInterventions[interventionIndex].intervention}
              </Typography>
              <Typography variant="body2" color="#37383b">
                {agentInterventions[interventionIndex].details}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip 
                  label={agentInterventions[interventionIndex].status} 
                  color={agentInterventions[interventionIndex].status === 'Active' ? 'primary' : 'success'}
                  size="small"
                />
                <Typography variant="body2" color="#37383b">
                  Patient: {agentInterventions[interventionIndex].patient}
                </Typography>
              </Box>
              <Typography variant="body2" color="#37383b">
                {agentInterventions[interventionIndex].timestamp}
              </Typography>
            </Box>
          </Card>
        )}

        {/* Intervention Summary */}
        <Grid container spacing={2}>
          {Object.entries(INTERVENTION_DATA).map(([driverKey, interventions]) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={driverKey}>
              <Card sx={{
                p: 2,
                background: 'rgba(85, 77, 77, 0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                color: '#f5f6fa'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h4" sx={{ mr: 1 }}>
                    {interventions[0]?.icon}
                  </Typography>
                  <Typography variant="subtitle2" color="blue" fontWeight={600}>
                    {interventions[0]?.driver}
                  </Typography>
                </Box>
                <Typography variant="body2" color="#37383b" sx={{ mb: 1 }}>
                  {interventions.length} active interventions
                </Typography>
                <Typography variant="h6" color="success.main" fontWeight={700}>
                  ${interventions.reduce((sum, i) => sum + i.costSaved, 0).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="#37383b">
                  Total savings
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );

  const renderCostOfCareSim = () => {
    // Outcome Metrics for AI Interventions
    const renderOutcomeMetrics = () => {
      // Get current patient and driver context
      const currentPatient = timelineData.find(p => p.name === 'Lisa Rodriguez') || timelineData[0];
      const currentDriver = selectedTimelineDriver?.id || 'chronicDisease';
      
      // Define interventions based on patient and driver
      const getInterventions = (patientName, driverId) => {
        if (patientName === 'Lisa Rodriguez' && driverId === 'chronicDisease') {
          return [
            {
              title: 'Home Assessment',
              description: 'Case manager visits patient\'s home to conduct full assessment',
              savings: 15000,
              impact: 'Prevents hospitalization charges',
              icon: '🏠',
              color: '#4caf50'
            },
            {
              title: 'Medication Management',
              description: 'AI-driven medication adherence restoration',
              savings: 10000,
              impact: 'Avoids medication-related complications',
              icon: '💊',
              color: '#2196f3'
            },
            {
              title: 'Digital Outreach',
              description: 'AI-powered patient communication and engagement',
              savings: 8000,
              impact: 'Improves patient compliance',
              icon: '📱',
              color: '#ff9800'
            }
          ];
        } else if (driverId === 'drugCosts') {
          return [
            {
              title: 'Biosimilar Switch',
              description: 'AI recommended biosimilar alternative',
              savings: 25000,
              impact: 'Reduces drug costs by 60%',
              icon: '💊',
              color: '#e91e63'
            },
            {
              title: 'Adherence Monitoring',
              description: 'AI-powered medication adherence tracking',
              savings: 18000,
              impact: 'Improves outcomes by 50%',
              icon: '📊',
              color: '#9c27b0'
            },
            {
              title: 'Cost Analysis',
              description: 'Real-time cost comparison and optimization',
              savings: 15000,
              impact: 'Reduces drug costs by 30%',
              icon: '💰',
              color: '#ff5722'
            }
          ];
        } else if (driverId === 'hospitalServices') {
          return [
            {
              title: 'Avoidable Admission Prevention',
              description: 'AI routing to appropriate care settings',
              savings: 45000,
              impact: 'Prevents $45,000 in costs',
              icon: '🏥',
              color: '#f44336'
            },
            {
              title: 'Length of Stay Optimization',
              description: 'AI-driven discharge planning',
              savings: 32000,
              impact: 'Reduces LOS by 2 days',
              icon: '⏱️',
              color: '#ff9800'
            },
            {
              title: 'Post-Discharge Coordination',
              description: 'Automated follow-up scheduling',
              savings: 28000,
              impact: 'Reduces readmissions by 35%',
              icon: '📅',
              color: '#4caf50'
            }
          ];
        } else if (driverId === 'utilization') {
          return [
            {
              title: 'Guideline Compliance',
              description: 'AI ensures evidence-based care delivery',
              savings: 22000,
              impact: 'Reduce unnecessary procedures by 40%',
              icon: '📋',
              color: '#2196f3'
            },
            {
              title: 'Defensive Medicine Reduction',
              description: 'AI eliminates unnecessary diagnostic tests',
              savings: 18000,
              impact: 'Save $18,000 per case',
              icon: '🛡️',
              color: '#ff5722'
            },
            {
              title: 'Test Optimization',
              description: 'AI-driven diagnostic test selection',
              savings: 15000,
              impact: 'Improve diagnostic accuracy',
              icon: '🔬',
              color: '#9c27b0'
            }
          ];
        } else if (driverId === 'socialDeterminants') {
          return [
            {
              title: 'Transportation Assistance',
              description: 'AI arranges reliable transportation services',
              savings: 12000,
              impact: 'Improve appointment attendance by 70%',
              icon: '🚗',
              color: '#4caf50'
            },
            {
              title: 'Food Security Program',
              description: 'AI connects patients to food assistance',
              savings: 8000,
              impact: 'Improve medication adherence',
              icon: '🍎',
              color: '#ff9800'
            },
            {
              title: 'Housing Support',
              description: 'AI provides housing resources and support',
              savings: 15000,
              impact: 'Reduce emergency visits by 45%',
              icon: '🏠',
              color: '#607d8b'
            }
          ];
        } else {
          // Default interventions
          return [
            {
              title: 'AI Intervention 1',
              description: 'AI-powered intervention for cost optimization',
              savings: 15000,
              impact: 'Significant cost savings',
              icon: '🤖',
              color: '#4caf50'
            },
            {
              title: 'AI Intervention 2',
              description: 'Automated process optimization',
              savings: 10000,
              impact: 'Improved efficiency',
              icon: '⚡',
              color: '#2196f3'
            },
            {
              title: 'AI Intervention 3',
              description: 'Predictive analytics implementation',
              savings: 8000,
              impact: 'Better outcomes',
              icon: '📈',
              color: '#ff9800'
            }
          ];
        }
      };

      const interventions = getInterventions(currentPatient?.name, currentDriver);

      return (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            🚀 Outcome Metrics for {currentPatient?.name || 'Patient'}
          </Typography>
          <Grid container spacing={2}>
            {interventions.map((intervention, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card sx={{ 
                  p: 2, 
                  bgcolor: '#e3f2fd', 
                  border: '1px solid #2196f3',
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: 'linear-gradient(90deg, #2196f3, #4caf50, #ff9800)',
                    animation: `${shimmer} 2s ease-in-out infinite`
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: intervention.color, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <Typography variant="h6" color="white" fontWeight={700}>
                        {intervention.icon}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600} color="#1a237e">
                      {intervention.title}
                    </Typography>
                  </Box>
                  <Typography variant="h5" color="success.main" fontWeight={700} sx={{ mb: 1 }}>
                    ${intervention.savings.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="#37383b" sx={{ mb: 1 }}>
                    {intervention.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: '#4caf50' 
                    }} />
                    <Typography variant="caption" color="#37383b">
                      {intervention.impact}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    };    // CostGuardAI Agent State - using top-level costGuardAnalysis and setCostGuardAnalysis


    // Mock Data Generation
    const generateCostDriverData = (driverId) => {
      const driver = COST_DRIVERS[driverId];
      const detailedMetrics = driver.detailedMetrics;
      
      const baseData = {
        chronicDisease: {
          patients: [
            { id: 'P001', name: 'Sarah Johnson', age: 67, conditions: ['Diabetes', 'Hypertension'], riskScore: 85, lastVisit: '2024-01-15', gaps: ['Missing A1C', 'No Eye Exam'] },
            { id: 'P002', name: 'Michael Chen', age: 78, conditions: ['COPD'], riskScore: 92, lastVisit: '2024-01-10', gaps: ['Missing Rescue Inhaler', 'No Spirometry'] },
            { id: 'P003', name: 'Lisa Rodriguez', age: 58, conditions: ['Depression', 'Anxiety'], riskScore: 78, lastVisit: '2024-01-20', gaps: ['No Therapy Sessions', 'Missing Medication Review'] }
          ],
          recommendations: [
            'Implement remote monitoring for high-risk diabetic patients',
            'Establish care coaching program for CHF patients',
            'Deploy mental health outreach for depression patients'
          ],
          projectedSavings: 125000
        },
        drugCosts: {
          highCostScripts: [
            { drug: 'Humira', cost: 85000, alternatives: ['Biosimilar Adalimumab'], savings: 25000 },
            { drug: 'Keytruda', cost: 120000, alternatives: ['Generic Pembrolizumab'], savings: 40000 },
            { drug: 'Eliquis', cost: 4500, alternatives: ['Warfarin'], savings: 3000 }
          ],
          adherenceIssues: [
            { patient: 'P001', medication: 'Metformin', adherence: 65, intervention: 'SMS Reminders' },
            { patient: 'P002', medication: 'Lisinopril', adherence: 72, intervention: 'Care Coaching' }
          ],
          projectedSavings: 68000
        },
        hospitalServices: {
          avoidableAdmissions: [
            { drg: '291', description: 'Heart Failure', count: 12, avgLOS: 4.2, savings: 180000 },
            { drg: '193', description: 'Simple Pneumonia', count: 8, avgLOS: 3.8, savings: 96000 },
            { drg: '871', description: 'Septicemia', count: 5, avgLOS: 5.1, savings: 75000 }
          ],
          postDischargeGaps: [
            { patient: 'P001', gap: 'No Follow-up Appointment', risk: 'High' },
            { patient: 'P002', gap: 'Missing Medication Reconciliation', risk: 'Medium' }
          ],
          projectedSavings: 351000
        },
        utilization: {
          excessiveTests: [
            { test: 'MRI Lower Back', count: 45, guideline: 'Only after 6 weeks', savings: 67500 },
            { test: 'Cardiac Stress Test', count: 32, guideline: 'Only with symptoms', savings: 48000 },
            { test: 'CT Chest', count: 28, guideline: 'Only for trauma', savings: 42000 }
          ],
          defensiveMedicine: [
            { procedure: 'Unnecessary EKGs', count: 156, savings: 46800 },
            { procedure: 'Routine Blood Work', count: 89, savings: 26700 }
          ],
          projectedSavings: 231000
        },
        socialDeterminants: {
          riskFactors: [
            { patient: 'P001', factor: 'Transportation Issues', impact: 'Missed Appointments', intervention: 'Ride Service' },
            { patient: 'P002', factor: 'Food Insecurity', impact: 'Medication Non-adherence', intervention: 'Food Bank Referral' },
            { patient: 'P003', factor: 'Housing Instability', impact: 'Mental Health Decline', intervention: 'Housing Support' }
          ],
          communityPrograms: [
            { program: 'Transportation Assistance', patients: 23, cost: 15000, savings: 45000 },
            { program: 'Food Security Program', patients: 18, cost: 12000, savings: 36000 }
          ],
          projectedSavings: 81000
        },
        fraudWaste: {
          suspiciousPatterns: [
            { provider: 'Dr. Smith', pattern: 'Upcoding E&M Visits', claims: 45, savings: 22500 },
            { provider: 'Dr. Johnson', pattern: 'Duplicate Billing', claims: 12, savings: 6000 },
            { provider: 'Dr. Williams', pattern: 'Unnecessary Procedures', claims: 8, savings: 16000 }
          ],
          blockedPayments: [
            { claim: 'C001', amount: 2500, reason: 'Duplicate Service', status: 'Blocked' },
            { claim: 'C002', amount: 1800, reason: 'Unbundling', status: 'Under Review' }
          ],
          projectedSavings: 44500
        },
        administrative: {
          priorAuths: [
            { service: 'MRI', count: 156, avgTime: '3.2 days', automation: 'AI Pre-auth', savings: 31200 },
            { service: 'Specialist Visit', count: 89, avgTime: '1.8 days', automation: 'Auto-approval', savings: 17800 }
          ],
          claimsReviews: [
            { type: 'High-Cost Claims', count: 234, automation: 'ML Review', savings: 46800 },
            { type: 'Duplicate Detection', count: 67, automation: 'Real-time Check', savings: 13400 }
          ],
          projectedSavings: 109200
        },
        clinicalGuidance: {
          treatmentPaths: [
            { condition: 'Type 2 Diabetes', currentPath: 'Brand Name Drugs', alternative: 'Generic + Lifestyle', savings: 15000 },
            { condition: 'Hypertension', currentPath: 'Multiple Medications', alternative: 'Single Pill Combination', savings: 8000 },
            { condition: 'Depression', currentPath: 'Brand Antidepressant', alternative: 'Generic + Therapy', savings: 12000 }
          ],
          clinicalDecisions: [
            { decision: 'Preventive Care', impact: 'Early Detection', savings: 25000 },
            { decision: 'Care Coordination', impact: 'Reduced Duplication', savings: 18000 }
          ],
          projectedSavings: 78000
        }
      };

      const baseResult = baseData[driverId] || {};
      
      return {
        ...baseResult,
        detailedMetrics: detailedMetrics,
        illnessAnalysis: detailedMetrics.illnessAnalysis,
        aiSuccessMetrics: detailedMetrics.aiSuccessMetrics,
        summary: {
          totalSavings: detailedMetrics.projectedSavings,
          patients: detailedMetrics.patientCount || detailedMetrics.highCostScripts || detailedMetrics.avoidableAdmissions || detailedMetrics.excessiveTests || detailedMetrics.sdohRiskFactors || detailedMetrics.fwaCases || detailedMetrics.priorAuths || detailedMetrics.treatmentPaths,
          interventions: detailedMetrics.interventions.length,
          roi: Math.round((detailedMetrics.projectedSavings / 100000) * 100)
        }
      };
    };

    // CostGuardAI Analysis Engine
    const runCostGuardAnalysis = async (driverId) => {
      setCostGuardAnalysis(prev => ({ ...prev, isAnalyzing: true, selectedDriver: driverId }));

      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      const driverData = generateCostDriverData(driverId);
      
      setCostGuardAnalysis(prev => ({
        ...prev,
        isAnalyzing: false,
        analysisComplete: true,
        recommendations: driverData,
        projectedSavings: driverData.projectedSavings || 0
      }));

      // Generate detailed timeline data for this driver
      const timelineData = generateDetailedTimelineData(driverId);
      setTimelineData(timelineData);
      setSelectedTimelineDriver(COST_DRIVERS[driverId]);
      
      // Show detailed timeline dialog
      setShowDetailedTimeline(true);
    };

    // Render Cost Driver Card
    const renderCostDriverCard = (driver) => (
      <Card 
        key={driver.id}
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${driver.color}20 0%, ${driver.color}10 100%)`,
          border: `2px solid ${driver.color}`,
          borderRadius: 3,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px ${driver.color}40`
          }
        }}
        onClick={() => runCostGuardAnalysis(driver.id)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" sx={{ mr: 2 }}>{driver.icon}</Typography>
          <Box>
            <Typography variant="h6" fontWeight={700} color={driver.color}>
              {driver.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {driver.description}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 2, flex: 1 }}>
          {driver.metrics.map((metric, index) => (
            <Chip 
              key={index}
              label={metric}
              size="small"
              sx={{ 
                mr: 1, 
                mb: 1,
                bgcolor: `${driver.color}20`,
                color: driver.color,
                fontWeight: 600
              }}
            />
          ))}
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: driver.color,
            mt: 'auto',
            '&:hover': { bgcolor: driver.color, opacity: 0.9 }
          }}
        >
          {costGuardAnalysis.selectedDriver === driver.id && costGuardAnalysis.isAnalyzing 
            ? '🤖 Analyzing...' 
            : '🔍 Analyze Cost Driver'}
        </Button>
      </Card>
    );

    // Render Analysis Results
    const renderAnalysisResults = () => {
      if (!costGuardAnalysis.analysisComplete || !costGuardAnalysis.selectedDriver) return null;

      const driver = COST_DRIVERS[costGuardAnalysis.selectedDriver];
      const data = costGuardAnalysis.recommendations;

      return (
        <Card sx={{ p: 4, mt: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h3" sx={{ mr: 2 }}>{driver.icon}</Typography>
            <Box>
              <Typography variant="h4" fontWeight={700} color={driver.color}>
                CostGuardAI Analysis: {driver.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                AI-powered cost optimization recommendations
              </Typography>
            </Box>
          </Box>

          {/* Projected Savings Summary */}
          <Card sx={{ p: 3, mb: 3, background: `linear-gradient(135deg, ${driver.color}20 0%, ${driver.color}10 100%)` }}>
            <Typography variant="h5" fontWeight={700} color={driver.color} sx={{ mb: 2 }}>
              💰 Projected Annual Savings
            </Typography>
            <Typography variant="h3" fontWeight={700} color={driver.color}>
              ${costGuardAnalysis.projectedSavings.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Based on AI analysis of current patterns and recommended interventions
            </Typography>
          </Card>

          {/* Detailed Analysis */}
          <Grid container spacing={3}>
            {/* Key Findings */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  🔍 Key Findings
                </Typography>
                {Object.entries(data).map(([key, value]) => {
                  if (Array.isArray(value) && value.length > 0) {
                    return (
                      <Box key={key} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {value.length} items identified
                        </Typography>
                      </Box>
                    );
                  }
                  return null;
                })}
              </Card>
            </Grid>

            {/* AI Recommendations */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  �� AI Recommendations
                </Typography>
                {data.recommendations && data.recommendations.map((rec, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      • {rec}
                    </Typography>
                  </Box>
                ))}
              </Card>
            </Grid>
          </Grid>

          {/* Action Items */}
          <Card sx={{ p: 3, mt: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              ⚡ Immediate Action Items
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Button variant="contained" fullWidth sx={{ bgcolor: '#4caf50' }}>
                  📊 Generate Detailed Report
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button variant="contained" fullWidth sx={{ bgcolor: '#2196f3' }}>
                  📧 Send to Care Team
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button variant="contained" fullWidth sx={{ bgcolor: '#ff9800' }}>
                  🔄 Schedule Follow-up
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Card>
      );
    };

    return (
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
            🤖 CostGuardAI Simulation
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            AI-powered cost optimization for healthcare payers
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analyze 8 key drivers of medical costs and receive AI-generated recommendations with projected savings
          </Typography>
        </Box>

        {/* Live Agent Interventions Display */}
        {renderAgentInterventions()}

        {/* Cost Driver Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.values(COST_DRIVERS).map(driver => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={driver.id}>
              {renderCostDriverCard(driver)}
            </Grid>
          ))}
        </Grid>

        {/* Loading Overlay */}
        {costGuardAnalysis.isAnalyzing && (
          <Box sx={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            bgcolor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}>
            <Card sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
              <Box sx={{
                width: 80, height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #2196f3, #4caf50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                animation: 'pulse 2s infinite'
              }}>
                <Typography variant="h3">🤖</Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                CostGuardAI Analyzing...
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Processing claims data, patient history, and provider patterns
              </Typography>
            </Card>
          </Box>
        )}

        {/* CostGuardAI Analysis Results Dialog */}
        <Dialog
          open={showCostGuardAnalysis}
          onClose={() => setShowCostGuardAnalysis(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxHeight: '90vh',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              overflow: 'hidden'
            }
          }}
        >
          {selectedCostDriver && costGuardAnalysis.analysisComplete && (
            <>
              <DialogTitle sx={{
                background: `linear-gradient(45deg, ${selectedCostDriver.color} 30%, ${selectedCostDriver.color}80 90%)`,
                color: 'white',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Typography variant="h3">{selectedCostDriver.icon}</Typography>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    CostGuardAI Analysis: {selectedCostDriver.name}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.9 }}>
                    AI-powered cost optimization recommendations
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setShowCostGuardAnalysis(false)}
                  sx={{ color: 'white', ml: 'auto' }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent sx={{ p: 0 }}>
                <Box sx={{ p: 4 }}>
                  {/* Projected Savings Summary */}
                  <Card sx={{ p: 4, mb: 4, background: `linear-gradient(135deg, ${selectedCostDriver.color}20 0%, ${selectedCostDriver.color}10 100%)`, border: `2px solid ${selectedCostDriver.color}` }}>
                    <Typography variant="h4" fontWeight={700} color={selectedCostDriver.color} sx={{ mb: 2 }}>
                      💰 Projected Annual Savings
                    </Typography>
                    <Typography variant="h2" fontWeight={700} color={selectedCostDriver.color}>
                      ${costGuardAnalysis.projectedSavings.toLocaleString()}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                      Based on AI analysis of current patterns and recommended interventions
                    </Typography>
                  </Card>

                  {/* Chronic Disease Management Narrative - Only for Chronic Disease Burden */}
                  {selectedCostDriver.id === 'chronicDisease' && (
                    <Card sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', border: '2px solid #2196f3' }}>
                      <Typography variant="h4" fontWeight={700} color="primary.main" sx={{ mb: 3 }}>
                        🫀 Chronic Disease Management
                      </Typography>
                      
                      {/* Context Section */}
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight={600} color="error.main" sx={{ mb: 2 }}>
                          📊 National Impact
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                          90% of the nation's $4.5T in annual healthcare costs are for people with chronic or mental health conditions. - CDC
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" fontWeight={600} color="warning.main">
                              • 68.4% of US population has 2 or more chronic conditions
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" fontWeight={600} color="warning.main">
                              • 36.4% of US population has 4 or more chronic conditions
                            </Typography>
                          </Grid>
                        </Grid>
                        <Typography variant="body2" color="text.secondary">
                          Chronic disease management is exacerbated by care fragmentation, poor engagement and lack of scale in care models.
                        </Typography>
                      </Box>

                      {/* AI Interventions Grid */}
                      <Grid container spacing={3}>
                        {/* Augmented Treatment */}
                        <Grid item xs={12} md={6}>
                          <Card sx={{ p: 3, bgcolor: '#e8f5e9', border: '1px solid #4caf50' }}>
                            <Typography variant="h6" fontWeight={600} color="success.main" sx={{ mb: 2 }}>
                              🏥 Augmented Treatment
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Services:</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                • Annual Physical, Immunization, Flu-shot reminders
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                • Annual wellness visit assistants
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                • Preventive screening reminders
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                • Virtual screenings
                              </Typography>
                            </Box>
                            <Typography variant="body2" fontWeight={600} color="error.main">
                              $555 billion/year in costs due to missed prevention
                            </Typography>
                          </Card>
                        </Grid>

                        {/* Faster Diagnosis */}
                        <Grid item xs={12} md={6}>
                          <Card sx={{ p: 3, bgcolor: '#fff3e0', border: '1px solid #ff9800' }}>
                            <Typography variant="h6" fontWeight={600} color="#e65100" sx={{ mb: 2 }}>
                              🔬 Faster, More Accurate Diagnosis
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              AI-assisted medical imaging and diagnostic tools
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="success.main">
                              Around 50% reduction in treatment costs due to early intervention, lesser misdiagnosis and better survival rates
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Source - Harvard School of Public Health
                            </Typography>
                          </Card>
                        </Grid>

                        {/* Delaying Onset */}
                        <Grid item xs={12} md={6}>
                          <Card sx={{ p: 3, bgcolor: '#f3e5f5', border: '1px solid #9c27b0' }}>
                            <Typography variant="h6" fontWeight={600} color="primary.main" sx={{ mb: 2 }}>
                              🎯 Delaying Onset by Influencing Healthy Behaviors
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                • Diet, weight loss apps
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                • Fitness apps to start/increase/maintain physical activity
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                • Smoking cessation apps
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                • Substance use & addiction apps
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                • Stress management apps
                              </Typography>
                            </Box>
                            <Typography variant="body2" fontWeight={600} color="success.main">
                              Duplicate test avoidance with interoperability
                            </Typography>
                          </Card>
                        </Grid>

                        {/* Care Management */}
                        <Grid item xs={12} md={6}>
                          <Card sx={{ p: 3, bgcolor: '#e1f5fe', border: '1px solid #03a9f4' }}>
                            <Typography variant="h6" fontWeight={600} color="info.main" sx={{ mb: 2 }}>
                              👨‍⚕️ Care Management Services
                            </Typography>
                            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                              AI-assisted care management:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              • Medication adherence
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              • Wellness tracking
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="success.main" sx={{ mb: 1 }}>
                              $90-$140 billion savings potential via AI-assisted clinical documentation
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Source - AHIMA article, $100 billion cost due to administrative burden - USDOI
                            </Typography>
                          </Card>
                        </Grid>

                        {/* Care Coordination */}
                        <Grid item xs={12} md={6}>
                          <Card sx={{ p: 3, bgcolor: '#fce4ec', border: '1px solid #e91e63' }}>
                            <Typography variant="h6" fontWeight={600} color="#c2185b" sx={{ mb: 2 }}>
                              🔄 Care Coordination
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                • Assisted discharge summary
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                • Assisted transition of care
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                • Patient education apps
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                • Optimized VBC contracts
                              </Typography>
                            </Box>
                            <Typography variant="body2" fontWeight={600} color="success.main">
                              2-5% savings from total cost of care due to slower progression of disease, reduced readmissions - McKinsey
                            </Typography>
                          </Card>
                        </Grid>

                        {/* Remote Monitoring */}
                        <Grid item xs={12} md={6}>
                          <Card sx={{ p: 3, bgcolor: '#e8f5e9', border: '1px solid #4caf50' }}>
                            <Typography variant="h6" fontWeight={600} color="success.main" sx={{ mb: 2 }}>
                              📱 Remote Monitoring
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              AI-assisted remote patient monitoring
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="success.main" sx={{ mb: 1 }}>
                              $10,000 per patient for heart failure patients due to avoidance of admission/readmission/ER visits
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="success.main">
                              $107-$300 savings due to medication adherence
                            </Typography>
                          </Card>
                        </Grid>
                      </Grid>
                    </Card>
                  )}

                  {/* Detailed Analysis */}
                  <Grid container spacing={4}>
                    {/* Key Findings */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ p: 3, height: '100%', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'primary.main' }}>
                          🔍 Key Findings
                        </Typography>
                        {Object.entries(costGuardAnalysis.recommendations).map(([key, value]) => {
                          if (Array.isArray(value) && value.length > 0) {
                            return (
                              <Box key={key} sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: selectedCostDriver.color }}>
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {value.length} items identified
                                </Typography>
                                <Chip 
                                  label={`${value.length} items`} 
                                  size="small" 
                                  sx={{ mt: 1, bgcolor: selectedCostDriver.color, color: 'white' }}
                                />
                              </Box>
                            );
                          }
                          return null;
                        })}
                      </Card>
                    </Grid>

                    {/* AI Recommendations */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ p: 3, height: '100%', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'success.main' }}>
                          🤖 AI Recommendations
                        </Typography>
                        {costGuardAnalysis.recommendations.recommendations && costGuardAnalysis.recommendations.recommendations.map((rec, index) => (
                          <Box key={index} sx={{ mb: 3, p: 3, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2, border: '1px solid #4caf50' }}>
                            <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                              Recommendation {index + 1}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {rec}
                            </Typography>
                          </Box>
                        ))}
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Detailed Metrics & Illness Analysis */}
                  {costGuardAnalysis.recommendations.detailedMetrics && (
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                      {/* Detailed Metrics */}
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, height: '100%', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'warning.main' }}>
                            📈 Detailed Metrics
                          </Typography>
                          {costGuardAnalysis.recommendations.detailedMetrics.interventions?.map((intervention, index) => (
                            <Box key={index} sx={{ mb: 3, p: 3, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 2, border: '1px solid #ff9800' }}>
                              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#ff9800' }}>
                                {intervention.type}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Patients: {intervention.patients} • Savings: ${intervention.savings.toLocaleString()}
                              </Typography>
                              <Chip 
                                label={`$${intervention.savings.toLocaleString()} savings`} 
                                size="small" 
                                sx={{ bgcolor: '#ff9800', color: 'white', fontWeight: 600 }}
                              />
                            </Box>
                          ))}
                        </Card>
                      </Grid>

                      {/* Illness Analysis */}
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, height: '100%', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'error.main' }}>
                            🏥 Illness-Based Analysis
                          </Typography>
                          {costGuardAnalysis.recommendations.illnessAnalysis && Object.entries(costGuardAnalysis.recommendations.illnessAnalysis).map(([illness, data]) => (
                            <Box key={illness} sx={{ mb: 3, p: 3, bgcolor: 'rgba(244, 67, 54, 0.1)', borderRadius: 2, border: '1px solid #f44336' }}>
                              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#f44336', textTransform: 'capitalize' }}>
                                {illness.replace(/([A-Z])/g, ' $1').trim()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Patients: {data.patients || data.admissions || data.cases} • 
                                {data.avgCost && `Avg Cost: $${data.avgCost.toLocaleString()}`}
                                {data.avgDrugCost && `Avg Drug Cost: $${data.avgDrugCost.toLocaleString()}`}
                                {data.avgLOS && `Avg LOS: ${data.avgLOS} days`}
                                {data.avgOvercharge && `Avg Overcharge: $${data.avgOvercharge.toLocaleString()}`}
                                {data.avgDuplicate && `Avg Duplicate: $${data.avgDuplicate.toLocaleString()}`}
                                {data.avgTime && `Avg Time: ${data.avgTime}`}
                              </Typography>
                              <Typography variant="body2" color="success.main" fontWeight={600} sx={{ mb: 1 }}>
                                Projected Savings: ${data.projectedSavings?.toLocaleString() || 0}
                              </Typography>
                              {data.alternatives && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  Alternatives: {Array.isArray(data.alternatives) ? data.alternatives.join(', ') : data.alternatives}
                                </Typography>
                              )}
                              {data.gaps && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  Care Gaps: {Array.isArray(data.gaps) ? data.gaps.join(', ') : data.gaps}
                                </Typography>
                              )}
                              {data.avoidableReasons && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  Avoidable Reasons: {Array.isArray(data.avoidableReasons) ? data.avoidableReasons.join(', ') : data.avoidableReasons}
                                </Typography>
                              )}
                              {data.unnecessaryTests && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  Unnecessary Tests: {Array.isArray(data.unnecessaryTests) ? data.unnecessaryTests.join(', ') : data.unnecessaryTests}
                                </Typography>
                              )}
                              {data.socialFactors && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  Social Factors: {Array.isArray(data.socialFactors) ? data.socialFactors.join(', ') : data.socialFactors}
                                </Typography>
                              )}
                              {data.patterns && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  FWA Patterns: {Array.isArray(data.patterns) ? data.patterns.join(', ') : data.patterns}
                                </Typography>
                              )}
                              {data.adminBurdens && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  Admin Burdens: {Array.isArray(data.adminBurdens) ? data.adminBurdens.join(', ') : data.adminBurdens}
                                </Typography>
                              )}
                              {data.clinicalAlternatives && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  Clinical Alternatives: {Array.isArray(data.clinicalAlternatives) ? data.clinicalAlternatives.join(', ') : data.clinicalAlternatives}
                                </Typography>
                              )}
                              <Chip 
                                label={`$${data.projectedSavings?.toLocaleString() || 0} savings`} 
                                size="small" 
                                sx={{ bgcolor: '#4caf50', color: 'white', fontWeight: 600 }}
                              />
                            </Box>
                          ))}
                        </Card>
                      </Grid>
                    </Grid>
                  )}

                  {/* AI Success Metrics */}
                  {/* Debug: {JSON.stringify(costGuardAnalysis.recommendations.aiSuccessMetrics)} */}
                  
                  {/* Test Section - Always Show */}
                  <Grid container spacing={4} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                      <Card sx={{ p: 3, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'info.main' }}>
                          🔍 Debug: AI Success Metrics Test
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          aiSuccessMetrics exists: {costGuardAnalysis.recommendations.aiSuccessMetrics ? 'YES' : 'NO'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Data: {JSON.stringify(costGuardAnalysis.recommendations.aiSuccessMetrics)}
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>

                  {costGuardAnalysis.recommendations.aiSuccessMetrics && (
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                      {/* Readmission Probability & Risk Reduction */}
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, height: '100%', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'info.main' }}>
                            🤖 AI Success Metrics
                          </Typography>
                          
                          {/* Readmission Probability */}
                          <Box sx={{ mb: 3, p: 3, bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: 2, border: '1px solid #2196f3' }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#2196f3' }}>
                              📊 Readmission Probability Impact
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Before: {costGuardAnalysis.recommendations.aiSuccessMetrics.readmissionProbability.before * 100}% → 
                              After: {costGuardAnalysis.recommendations.aiSuccessMetrics.readmissionProbability.after * 100}%
                            </Typography>
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                              Reduction: {costGuardAnalysis.recommendations.aiSuccessMetrics.readmissionProbability.reduction}%
                            </Typography>
                          </Box>

                          {/* Risk Level Distribution */}
                          <Box sx={{ mb: 3, p: 3, bgcolor: 'rgba(156, 39, 176, 0.1)', borderRadius: 2, border: '1px solid #9c27b0' }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#9c27b0' }}>
                              🎯 Risk Level Distribution
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Critical: {costGuardAnalysis.recommendations.aiSuccessMetrics.riskLevelDistribution.critical} • 
                              High: {costGuardAnalysis.recommendations.aiSuccessMetrics.riskLevelDistribution.high} • 
                              Medium: {costGuardAnalysis.recommendations.aiSuccessMetrics.riskLevelDistribution.medium} • 
                              Low: {costGuardAnalysis.recommendations.aiSuccessMetrics.riskLevelDistribution.low}
                            </Typography>
                          </Box>

                          {/* Impact Risk Reduction */}
                          <Box sx={{ mb: 3, p: 3, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2, border: '1px solid #4caf50' }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#4caf50' }}>
                              📉 Impact Risk Reduction
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              High Risk: {costGuardAnalysis.recommendations.aiSuccessMetrics.impactRiskReduction.high} • 
                              Medium Risk: {costGuardAnalysis.recommendations.aiSuccessMetrics.impactRiskReduction.medium} • 
                              Low Risk: {costGuardAnalysis.recommendations.aiSuccessMetrics.impactRiskReduction.low}
                            </Typography>
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                              Total Patients: {costGuardAnalysis.recommendations.aiSuccessMetrics.impactRiskReduction.total}
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>

                      {/* Prevention Post-Discharge & AI Performance */}
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, height: '100%', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                          <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'success.main' }}>
                            🏥 Prevention Post-Discharge
                          </Typography>
                          
                          {/* Follow-up Rate */}
                          <Box sx={{ mb: 3, p: 3, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 2, border: '1px solid #ff9800' }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#ff9800' }}>
                              📞 Follow-up Rate
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Before: {costGuardAnalysis.recommendations.aiSuccessMetrics.preventionPostDischarge.followUpRate.before * 100}% → 
                              After: {costGuardAnalysis.recommendations.aiSuccessMetrics.preventionPostDischarge.followUpRate.after * 100}%
                            </Typography>
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                              Improvement: {costGuardAnalysis.recommendations.aiSuccessMetrics.preventionPostDischarge.followUpRate.improvement}%
                            </Typography>
                          </Box>

                          {/* Medication Adherence */}
                          <Box sx={{ mb: 3, p: 3, bgcolor: 'rgba(244, 67, 54, 0.1)', borderRadius: 2, border: '1px solid #f44336' }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#f44336' }}>
                              💊 Medication Adherence
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Before: {costGuardAnalysis.recommendations.aiSuccessMetrics.preventionPostDischarge.medicationAdherence.before * 100}% → 
                              After: {costGuardAnalysis.recommendations.aiSuccessMetrics.preventionPostDischarge.medicationAdherence.after * 100}%
                            </Typography>
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                              Improvement: {costGuardAnalysis.recommendations.aiSuccessMetrics.preventionPostDischarge.medicationAdherence.improvement}%
                            </Typography>
                          </Box>

                          {/* Care Plan Compliance */}
                          <Box sx={{ mb: 3, p: 3, bgcolor: 'rgba(156, 39, 176, 0.1)', borderRadius: 2, border: '1px solid #9c27b0' }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#9c27b0' }}>
                              📋 Care Plan Compliance
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Before: {costGuardAnalysis.recommendations.aiSuccessMetrics.preventionPostDischarge.carePlanCompliance.before * 100}% → 
                              After: {costGuardAnalysis.recommendations.aiSuccessMetrics.preventionPostDischarge.carePlanCompliance.after * 100}%
                            </Typography>
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                              Improvement: {costGuardAnalysis.recommendations.aiSuccessMetrics.preventionPostDischarge.carePlanCompliance.improvement}%
                            </Typography>
                          </Box>

                          {/* AI Performance Metrics */}
                          <Box sx={{ p: 3, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2, border: '1px solid #4caf50' }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#4caf50' }}>
                              🎯 AI Performance
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Predictive Accuracy: {costGuardAnalysis.recommendations.aiSuccessMetrics.predictiveAccuracy * 100}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Intervention Success Rate: {costGuardAnalysis.recommendations.aiSuccessMetrics.interventionSuccessRate * 100}%
                            </Typography>
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                              Cost Avoidance: ${costGuardAnalysis.recommendations.aiSuccessMetrics.costAvoidance.toLocaleString()}
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                  )}

                  {/* Action Items */}
                  <Card sx={{ p: 4, mt: 4, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', border: '2px solid #2196f3' }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'primary.main' }}>
                      ⚡ Immediate Action Items
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Button variant="contained" fullWidth size="large" sx={{ bgcolor: '#4caf50', py: 2 }}>
                          📊 Generate Detailed Report
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Button variant="contained" fullWidth size="large" sx={{ bgcolor: '#2196f3', py: 2 }}>
                          📧 Send to Care Team
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Button variant="contained" fullWidth size="large" sx={{ bgcolor: '#ff9800', py: 2 }}>
                          🔄 Schedule Follow-up
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>

        {/* Executive Summary Dialog */}
        <Dialog
          open={showExecutiveSummary}
          onClose={() => setShowExecutiveSummary(false)}
          maxWidth="xl"
          fullWidth
          PaperProps={{
            sx: {
              height: '95vh',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)',
              borderRadius: 3,
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)',
            color: 'white',
            p: 3
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                  📊 Executive Summary Dashboard
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.9 }}>
                  CostGuardAI Performance Metrics & ROI Analysis
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Export to PDF">
                  <IconButton 
                    onClick={exportExecutiveSummaryToPDF}
                    sx={{ 
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.2)'
                      }
                    }}
                  >
                    <PdfIcon />
                  </IconButton>
                </Tooltip>
                <IconButton onClick={() => setShowExecutiveSummary(false)} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
            <Box sx={{ height: '100%', overflow: 'auto' }}>
              <Box sx={{ p: 4 }}>
                {/* Executive Summary Header */}
                <Card sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', border: '2px solid #2196f3' }}>
                  <Typography variant="h3" fontWeight={700} sx={{ mb: 2, color: 'primary.main' }}>
                    💰 Total Annual Savings: $8.2M
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                    Based on AI-driven interventions across all 8 cost drivers
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="success.main">
                          12,847
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Patients Impacted
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="info.main">
                          2,456
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          High-Risk Patients Identified
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="warning.main">
                          89.4%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          AI Predictive Accuracy
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight={700} color="error.main">
                          54.8%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Readmission Reduction
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>

                {/* Cost Driver Performance Grid */}
                <Grid container spacing={4} sx={{ mb: 4 }}>
                  {Object.values(COST_DRIVERS).map((driver) => (
                    <Grid item xs={12} md={6} lg={4} key={driver.id}>
                      <Card sx={{ 
                        p: 3, 
                        height: '100%',
                        background: `linear-gradient(135deg, ${driver.color}20 0%, ${driver.color}10 100%)`,
                        border: `2px solid ${driver.color}`,
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 25px ${driver.color}40`
                        }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h3" sx={{ mr: 2 }}>{driver.icon}</Typography>
                          <Box>
                            <Typography variant="h6" fontWeight={700} color={driver.color}>
                              {driver.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {driver.detailedMetrics.patientCount || driver.detailedMetrics.highCostScripts || driver.detailedMetrics.avoidableAdmissions || driver.detailedMetrics.excessiveTests || driver.detailedMetrics.sdohRiskFactors || driver.detailedMetrics.fwaCases || driver.detailedMetrics.priorAuths || driver.detailedMetrics.treatmentPaths} Patients
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="h4" fontWeight={700} color={driver.color} sx={{ mb: 1 }}>
                          ${driver.detailedMetrics.projectedSavings.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Projected Annual Savings
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                            🎯 Key Metrics
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">Risk Reduction:</Typography>
                            <Typography variant="body2" fontWeight={600} color="success.main">
                              {driver.detailedMetrics.aiSuccessMetrics?.readmissionProbability.reduction || 0}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">AI Accuracy:</Typography>
                            <Typography variant="body2" fontWeight={600} color="info.main">
                              {driver.detailedMetrics.aiSuccessMetrics?.predictiveAccuracy * 100 || 0}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Success Rate:</Typography>
                            <Typography variant="body2" fontWeight={600} color="warning.main">
                              {driver.detailedMetrics.aiSuccessMetrics?.interventionSuccessRate * 100 || 0}%
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {driver.detailedMetrics.interventions?.slice(0, 2).map((intervention, index) => (
                            <Chip 
                              key={index}
                              label={`${intervention.type} (${intervention.patients})`}
                              size="small"
                              sx={{ 
                                bgcolor: `${driver.color}20`,
                                color: driver.color,
                                fontWeight: 600
                              }}
                            />
                          ))}
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Risk Level Distribution Chart */}
                <Grid container spacing={4} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, height: '100%', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'primary.main' }}>
                        🎯 Risk Level Distribution
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {Object.values(COST_DRIVERS).map((driver) => (
                          <Box key={driver.id} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: driver.color }}>
                              {driver.name}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">Critical:</Typography>
                              <Typography variant="body2" fontWeight={600} color="error.main">
                                {driver.detailedMetrics.aiSuccessMetrics?.riskLevelDistribution.critical || 0}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">High:</Typography>
                              <Typography variant="body2" fontWeight={600} color="warning.main">
                                {driver.detailedMetrics.aiSuccessMetrics?.riskLevelDistribution.high || 0}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Medium/Low:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">
                                {driver.detailedMetrics.aiSuccessMetrics?.riskLevelDistribution.medium + driver.detailedMetrics.aiSuccessMetrics?.riskLevelDistribution.low || 0}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, height: '100%', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'success.main' }}>
                        📈 Savings by Driver
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {Object.values(COST_DRIVERS)
                          .sort((a, b) => b.detailedMetrics.projectedSavings - a.detailedMetrics.projectedSavings)
                          .map((driver, index) => (
                          <Box key={driver.id} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle2" fontWeight={600} sx={{ color: driver.color }}>
                                {driver.name}
                              </Typography>
                              <Typography variant="h6" fontWeight={700} color="success.main">
                                ${driver.detailedMetrics.projectedSavings.toLocaleString()}
                              </Typography>
                            </Box>
                            <Box sx={{ 
                              width: '100%', 
                              height: 8, 
                              bgcolor: '#e0e0e0', 
                              borderRadius: 4,
                              overflow: 'hidden'
                            }}>
                              <Box sx={{ 
                                width: `${(driver.detailedMetrics.projectedSavings / 2100000) * 100}%`,
                                height: '100%',
                                bgcolor: driver.color,
                                borderRadius: 4
                              }} />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {driver.detailedMetrics.interventions?.length || 0} interventions • {driver.detailedMetrics.aiSuccessMetrics?.impactRiskReduction.total || 0} patients
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Card>
                  </Grid>
                </Grid>

                {/* ROI Analysis */}
                <Card sx={{ p: 4, background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', border: '2px solid #4caf50' }}>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'success.main' }}>
                    💰 ROI Analysis & Investment Impact
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'white', borderRadius: 2 }}>
                        <Typography variant="h3" fontWeight={700} color="success.main">
                          820%
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Return on Investment
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          $8.2M savings on $1M investment
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'white', borderRadius: 2 }}>
                        <Typography variant="h3" fontWeight={700} color="info.main">
                          6.2M
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Net Cost Avoidance
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          After implementation costs
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'white', borderRadius: 2 }}>
                        <Typography variant="h3" fontWeight={700} color="warning.main">
                          8.4M
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Total Cost Avoidance
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Including AI Success Metrics
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>

                {/* Chronic Disease Management Metrics */}
                <Card sx={{ p: 4, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', border: '2px solid #2196f3', mt: 4 }}>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'primary.main' }}>
                    🫀 Chronic Disease Management Impact
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    90% of $4.5T annual healthcare costs for chronic/mental health conditions (CDC)
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {/* National Impact Metrics */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ p: 3, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                        <Typography variant="h6" fontWeight={600} color="error.main" sx={{ mb: 2 }}>
                          📊 National Impact
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                              <Typography variant="h4" fontWeight={700} color="warning.main">
                                68.4%
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                US Population with 2+ Chronic Conditions
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                              <Typography variant="h4" fontWeight={700} color="warning.main">
                                36.4%
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                US Population with 4+ Chronic Conditions
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>

                    {/* AI Intervention Metrics */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ p: 3, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                        <Typography variant="h6" fontWeight={600} color="success.main" sx={{ mb: 2 }}>
                          🤖 AI Intervention Impact
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                              <Typography variant="h4" fontWeight={700} color="success.main">
                                50%
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Treatment Cost Reduction
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                              <Typography variant="h4" fontWeight={700} color="success.main">
                                2-5%
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Total Cost Savings
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>

                    {/* Cost Savings Metrics */}
                    <Grid item xs={12}>
                      <Card sx={{ p: 3, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                        <Typography variant="h6" fontWeight={600} color="info.main" sx={{ mb: 2 }}>
                          💰 Cost Savings Breakdown
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                              <Typography variant="h5" fontWeight={700} color="info.main">
                                $555B
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Annual Cost of Missed Prevention
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                              <Typography variant="h5" fontWeight={700} color="success.main">
                                $10K
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Per Heart Failure Patient (RPM)
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                              <Typography variant="h5" fontWeight={700} color="warning.main">
                                $90-140B
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                AI Clinical Documentation Savings
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fce4ec', borderRadius: 2 }}>
                              <Typography variant="h5" fontWeight={700} color="#e91e63">
                                $107-300
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Medication Adherence Savings
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>

                    {/* AI Intervention Categories */}
                    <Grid item xs={12}>
                      <Card sx={{ p: 3, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                        <Typography variant="h6" fontWeight={600} color="primary.main" sx={{ mb: 2 }}>
                          🎯 AI Intervention Categories
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2, border: '1px solid #4caf50' }}>
                              <Typography variant="subtitle2" fontWeight={600} color="success.main" sx={{ mb: 1 }}>
                                🏥 Augmented Treatment
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Annual physicals, immunizations, wellness visits, preventive screenings
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 2, border: '1px solid #ff9800' }}>
                              <Typography variant="subtitle2" fontWeight={600} color="#e65100" sx={{ mb: 1 }}>
                                🔬 Faster Diagnosis
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                AI-assisted medical imaging and diagnostic tools
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, bgcolor: '#f3e5f5', borderRadius: 2, border: '1px solid #9c27b0' }}>
                              <Typography variant="subtitle2" fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
                                🎯 Delaying Onset
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Diet/fitness apps, smoking cessation, stress management
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, bgcolor: '#e1f5fe', borderRadius: 2, border: '1px solid #03a9f4' }}>
                              <Typography variant="subtitle2" fontWeight={600} color="info.main" sx={{ mb: 1 }}>
                                👨‍⚕️ Care Management
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Medication adherence, wellness tracking, clinical documentation
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, bgcolor: '#fce4ec', borderRadius: 2, border: '1px solid #e91e63' }}>
                              <Typography variant="subtitle2" fontWeight={600} color="#c2185b" sx={{ mb: 1 }}>
                                🔄 Care Coordination
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Assisted discharge, transition of care, patient education
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2, border: '1px solid #4caf50' }}>
                              <Typography variant="subtitle2" fontWeight={600} color="success.main" sx={{ mb: 1 }}>
                                📱 Remote Monitoring
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                AI-assisted RPM, heart failure monitoring, medication adherence
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                </Card>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)',
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)',
        color: 'white',
        p: 3
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
              Care Cost Gaps Center AI
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.9 }}>
              AI-Powered Cost Gap Analysis & Optimization
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', overflow: 'auto' }}>
          <Box sx={{ p: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
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
              <Tab label="Patient Scenario" />
              <Tab label="AI Recommendations" />
              <Tab label="Analysis" />
              <Tab label="Cost of Care Simulation" />
              <Tab label="Gaps in Care Simulation" />
            </Tabs>

            {activeTab === 0 && (
              <Box>
                {renderSummaryCards()}
                {renderCostGapsChart()}
                {renderTopGapsTable()}
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                {renderPatientScenario()}
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                {renderAIRecommendations()}
              </Box>
            )}

            {activeTab === 3 && (
              <Box>
                {renderAnalysisWorkflow()}
                {analysisComplete && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Analysis Complete!
                    </Typography>
                    <Typography variant="body2">
                      AI has identified {COST_GAPS_DATA.summary.costGaps} cost gaps with potential savings of ${(COST_GAPS_DATA.summary.totalSavings / 1000000).toFixed(1)}M.
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}

            {activeTab === 4 && (
              <Box>
                {/* Executive Summary Button */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setShowExecutiveSummary(true)}
                    sx={{
                      background: 'linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)',
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      py: 2,
                      px: 4,
                      borderRadius: 3,
                      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #f7931e 30%, #ff6b35 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(255, 107, 53, 0.4)'
                      }
                    }}
                  >
                    📊 Executive Summary Dashboard
                  </Button>
                </Box>
                {renderCostOfCareSim()}
              </Box>
            )}

            {activeTab === 5 && (
              <Box>
                {renderGapsInCareSim()}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      {/* Proof Popup */}
      <Dialog
        open={proofPopupOpen}
        onClose={() => setProofPopupOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)',
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        {selectedProof && (
          <>
            <DialogTitle sx={{ 
              background: 'linear-gradient(45deg, #2196f3 30%, #4caf50 90%)',
              color: 'white',
              p: 3
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                    📋 AI Intervention Proof
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.9 }}>
                    {selectedProof.patient} • {selectedProof.date}
                  </Typography>
                </Box>
                <IconButton onClick={() => setProofPopupOpen(false)} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ p: 3 }}>
                {/* Event Header */}
                <Card sx={{ p: 2, mb: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', border: '2px solid #2196f3' }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                    {selectedProof.event}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI Agent Intervention • {selectedProof.date}
                  </Typography>
                </Card>

                {/* Dynamic Proof Content */}
                {selectedProof.index === 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                      📱 RPM Alert System Proof
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, bgcolor: '#fff3e0', border: '1px solid #ff9800' }}>
                          <Typography variant="subtitle2" fontWeight={600} color="#e65100" sx={{ mb: 1 }}>
                            🚨 Alert Details
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Time:</Typography>
                              <Typography variant="body2" fontWeight={600}>2:15 AM</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">BP Reading:</Typography>
                              <Typography variant="body2" fontWeight={600} color="error.main">180/110 mmHg</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">AI Risk Score:</Typography>
                              <Typography variant="body2" fontWeight={600} color="error.main">8.7/10 (Critical)</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Device ID:</Typography>
                              <Typography variant="body2" fontWeight={600}>RPM-2024-001</Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, bgcolor: '#e8f5e9', border: '1px solid #4caf50' }}>
                          <Typography variant="subtitle2" fontWeight={600} color="success.main" sx={{ mb: 1 }}>
                            ✅ AI Response
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Response Time:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">2:16 AM (1 min)</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Notifications Sent:</Typography>
                              <Typography variant="body2" fontWeight={600}>3 (Care Team)</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Patient Alert:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">Immediate</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Escalation:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">Level 2</Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>

                    <Card sx={{ p: 2, mt: 2, bgcolor: '#f3e5f5', border: '1px solid #9c27b0' }}>
                      <Typography variant="subtitle2" fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
                        📊 AI Analysis Log
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        [2:15:23] RPM_ALERT: BP_CRITICAL detected<br/>
                        [2:15:25] AI_ANALYSIS: Risk score calculated (8.7/10)<br/>
                        [2:15:27] PATTERN_MATCH: Similar to previous stroke risk cases<br/>
                        [2:15:29] ESCALATION: Level 2 protocol activated<br/>
                        [2:15:31] NOTIFICATION: Care team alerted (3 recipients)<br/>
                        [2:15:33] PATIENT_ALERT: SMS + App notification sent<br/>
                        [2:15:35] FOLLOW_UP: 48-hour monitoring schedule created
                      </Typography>
                    </Card>
                  </Box>
                )}

                {selectedProof.index === 1 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                      👨‍⚕️ Care Team Call Transcript
                    </Typography>
                    
                    <Card sx={{ p: 2, mb: 2, bgcolor: '#e8f5e9', border: '1px solid #4caf50' }}>
                      <Typography variant="subtitle2" fontWeight={600} color="success.main" sx={{ mb: 1 }}>
                        📞 Call Summary
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Duration:</Typography>
                          <Typography variant="body2" fontWeight={600}>15 minutes</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Care Team Member:</Typography>
                          <Typography variant="body2" fontWeight={600}>Dr. Sarah Johnson, RN</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Call Type:</Typography>
                          <Typography variant="body2" fontWeight={600} color="success.main">Proactive Intervention</Typography>
                        </Box>
                      </Box>
                    </Card>

                    <Card sx={{ p: 2, bgcolor: '#fff3e0', border: '1px solid #ff9800' }}>
                      <Typography variant="subtitle2" fontWeight={600} color="#e65100" sx={{ mb: 1 }}>
                        💊 Medication Adjustment
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Previous Dose:</Typography>
                          <Typography variant="body2" fontWeight={600}>Lisinopril 10mg daily</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">New Dose:</Typography>
                          <Typography variant="body2" fontWeight={600} color="success.main">Lisinopril 20mg daily</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Reason:</Typography>
                          <Typography variant="body2" fontWeight={600}>BP control optimization</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Follow-up:</Typography>
                          <Typography variant="body2" fontWeight={600} color="success.main">48 hours</Typography>
                        </Box>
                      </Box>
                    </Card>

                    <Card sx={{ p: 2, mt: 2, bgcolor: '#f3e5f5', border: '1px solid #9c27b0' }}>
                      <Typography variant="subtitle2" fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
                        🎯 AI-Generated Call Script
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        "Good morning, Mr. Thompson. This is Dr. Johnson from your care team.<br/>
                        I'm calling because our AI monitoring system detected elevated blood pressure<br/>
                        readings early this morning. I'd like to discuss adjusting your medication..."<br/><br/>
                        [AI provided real-time guidance during the call based on patient history<br/>
                        and current vitals to ensure optimal care delivery]
                      </Typography>
                    </Card>
                  </Box>
                )}

                {selectedProof.index === 2 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                      🏥 Enhanced Visit - Care Gap Closure
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, bgcolor: '#fff3e0', border: '1px solid #ff9800' }}>
                          <Typography variant="subtitle2" fontWeight={600} color="#e65100" sx={{ mb: 1 }}>
                            🔍 Care Gap Analysis
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Gaps Identified:</Typography>
                              <Typography variant="body2" fontWeight={600} color="error.main">5 Critical Gaps</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Eye Exam:</Typography>
                              <Typography variant="body2" fontWeight={600} color="error.main">105 days overdue</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Foot Care:</Typography>
                              <Typography variant="body2" fontWeight={600} color="error.main">60 days overdue</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Nutrition:</Typography>
                              <Typography variant="body2" fontWeight={600} color="error.main">180 days overdue</Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, bgcolor: '#e8f5e9', border: '1px solid #4caf50' }}>
                          <Typography variant="subtitle2" fontWeight={600} color="success.main" sx={{ mb: 1 }}>
                            ✅ AI Interventions
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Appointments:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">3 Scheduled</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">RPM Device:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">Activated</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Care Plan:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">Updated</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Follow-up:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">30 days</Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>

                    <Card sx={{ p: 2, mt: 2, bgcolor: '#f3e5f5', border: '1px solid #9c27b0' }}>
                      <Typography variant="subtitle2" fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
                        📅 AI-Generated Schedule
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        Ophthalmology: Jan 20, 2024 (2 weeks)<br/>
                        Podiatry: Jan 25, 2024 (2.5 weeks)<br/>
                        Nutrition: Jan 30, 2024 (3 weeks)<br/>
                        RPM Training: Jan 15, 2024 (1 week)<br/><br/>
                        [AI optimized scheduling based on provider availability,<br/>
                        patient preferences, and clinical urgency]
                      </Typography>
                    </Card>
                  </Box>
                )}

                {selectedProof.index === 3 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                      ✅ Prevention Success Metrics
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, bgcolor: '#e8f5e9', border: '1px solid #4caf50' }}>
                          <Typography variant="subtitle2" fontWeight={600} color="success.main" sx={{ mb: 1 }}>
                            📊 Health Improvements
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">BP Control:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">180/110 → 140/85</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">A1C Level:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">8.7% → 7.8%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Medication Adherence:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">85% → 98%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Weight Management:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">-12 lbs</Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, bgcolor: '#fff3e0', border: '1px solid #ff9800' }}>
                          <Typography variant="subtitle2" fontWeight={600} color="#e65100" sx={{ mb: 1 }}>
                            🛡️ Risk Reduction
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Stroke Risk:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">-67%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Heart Attack:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">-45%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Kidney Disease:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">-38%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Vision Loss:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">-52%</Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>

                    <Card sx={{ p: 2, mt: 2, bgcolor: '#f3e5f5', border: '1px solid #9c27b0' }}>
                      <Typography variant="subtitle2" fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
                        🎯 AI Prevention Analysis
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        CRISIS_AVERTED: Stroke event prevented through early intervention<br/>
                        COST_SAVINGS: $125,000 potential hospitalization costs avoided<br/>
                        QUALITY_LIFE: 15+ years of healthy life preserved<br/>
                        FAMILY_IMPACT: Caregiver burden reduced by 80%<br/><br/>
                        [AI continuously monitors and adjusts interventions based on<br/>
                        real-time data to maintain optimal health outcomes]
                      </Typography>
                    </Card>
                  </Box>
                )}

                {selectedProof.index === 4 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                      🏠 Smart Care Routing
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, bgcolor: '#e8f5e9', border: '1px solid #4caf50' }}>
                          <Typography variant="subtitle2" fontWeight={600} color="success.main" sx={{ mb: 1 }}>
                            🧠 AI Decision Engine
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Routing Decision:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">Diabetes Center</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Specialist Match:</Typography>
                              <Typography variant="body2" fontWeight={600}>Dr. Chen (Endocrinologist)</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Care Protocol:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">Personalized</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Wait Time:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">0 hours</Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, bgcolor: '#fff3e0', border: '1px solid #ff9800' }}>
                          <Typography variant="subtitle2" fontWeight={600} color="#e65100" sx={{ mb: 1 }}>
                            📈 Performance Metrics
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Length of Stay:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">-40%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Treatment Time:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">-35%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Recovery Rate:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">+25%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">Patient Satisfaction:</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">9.2/10</Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>

                    <Card sx={{ p: 2, mt: 2, bgcolor: '#f3e5f5', border: '1px solid #9c27b0' }}>
                      <Typography variant="subtitle2" fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
                        🤖 AI Routing Algorithm
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        PATIENT_PROFILE: Type 2 Diabetes, High Risk<br/>
                        SYMPTOM_ANALYSIS: BP elevation, A1C control needed<br/>
                        PROVIDER_MATCH: Endocrinologist with diabetes expertise<br/>
                        LOCATION_OPTIMIZATION: Nearest specialized center<br/>
                        AVAILABILITY_CHECK: Real-time scheduling integration<br/>
                        CARE_PROTOCOL: Personalized treatment plan generated<br/><br/>
                        [AI continuously learns from outcomes to improve routing accuracy]
                      </Typography>
                    </Card>
                  </Box>
                )}

                {selectedProof.index === 5 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#f5f6fa' }}>
                      📊 Home Monitoring & Caregiver Alerts
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, bgcolor: '#e8f5e9', border: '1px solid #4caf50', color: '#f5f6fa' }}>
                          <Typography variant="subtitle2" fontWeight={600} color="#4caf50" sx={{ mb: 1 }}>
                            🏠 Home Monitoring System
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="#f5f6fa">Glucose Monitoring:</Typography>
                              <Typography variant="body2" fontWeight={600} color="#4caf50">24/7 Tracking</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="#f5f6fa">BP Monitoring:</Typography>
                              <Typography variant="body2" fontWeight={600} color="#4caf50">3x Daily</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="#f5f6fa">Medication Reminders:</Typography>
                              <Typography variant="body2" fontWeight={600} color="#4caf50">100% Compliance</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="#f5f6fa">Data Sync:</Typography>
                              <Typography variant="body2" fontWeight={600} color="#4caf50">Real-time</Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, bgcolor: '#fff3e0', border: '1px solid #ff9800', color: '#f5f6fa' }}>
                          <Typography variant="subtitle2" fontWeight={600} color="#e65100" sx={{ mb: 1 }}>
                            👥 Caregiver Network
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="#f5f6fa">Family Members:</Typography>
                              <Typography variant="body2" fontWeight={600}>3 Notified</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="#f5f6fa">Alert Frequency:</Typography>
                              <Typography variant="body2" fontWeight={600} color="#4caf50">Daily Summary</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="#f5f6fa">Emergency Alerts:</Typography>
                              <Typography variant="body2" fontWeight={600} color="#4caf50">Immediate</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="#f5f6fa">Readmission Risk:</Typography>
                              <Typography variant="body2" fontWeight={600} color="#4caf50">0% (vs 28%)</Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>

                    <Card sx={{ p: 2, mt: 2, bgcolor: '#f3e5f5', border: '1px solid #9c27b0', color: '#f5f6fa' }}>
                      <Typography variant="subtitle2" fontWeight={600} color="#9c27b0" sx={{ mb: 1 }}>
                        📱 AI Care Coordination Log
                      </Typography>
                      <Typography variant="body2" color="#f5f6fa" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        HOME_MONITORING: Continuous glucose and BP tracking active<br/>
                        CAREGIVER_ALERTS: 3 family members enrolled in notification system<br/>
                        MEDICATION_ADHERENCE: 100% compliance achieved through smart reminders<br/>
                        EMERGENCY_PROTOCOL: Immediate escalation for critical readings<br/>
                        CARE_COORDINATION: Seamless handoff between hospital and home<br/>
                        OUTCOME_TRACKING: Real-time monitoring of recovery progress<br/><br/>
                        [AI ensures continuous care coordination and prevents care gaps]
                      </Typography>
                                         </Card>
                   </Box>
                 )}

                 {selectedProof.index === 8 && selectedProof.patient === 'Emma Rodriguez' && (
                   <Box>
                     <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#f5f6fa' }}>
                       🚨 Failed Intervention - Provider Outreach Required
                     </Typography>
                     
                     <Card sx={{ p: 2, mb: 2, bgcolor: '#fff3e0', border: '1px solid #ff9800', color: '#f5f6fa' }}>
                       <Typography variant="subtitle2" fontWeight={600} color="#e65100" sx={{ mb: 1 }}>
                         ⚠️ Care Team Call Failed
                       </Typography>
                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Call Attempts:</Typography>
                           <Typography variant="body2" fontWeight={600} color="#ff5722">2 Failed</Typography>
                         </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Patient Response:</Typography>
                           <Typography variant="body2" fontWeight={600} color="#ff5722">Unavailable</Typography>
                         </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Risk Level:</Typography>
                           <Typography variant="body2" fontWeight={600} color="#ff5722">Escalating</Typography>
                         </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">AI Recommendation:</Typography>
                           <Typography variant="body2" fontWeight={600} color="#4caf50">Provider Outreach</Typography>
                         </Box>
                       </Box>
                     </Card>

                     <Card sx={{ p: 2, bgcolor: '#e8f5e9', border: '1px solid #4caf50', color: '#f5f6fa' }}>
                       <Typography variant="subtitle2" fontWeight={600} color="#4caf50" sx={{ mb: 1 }}>
                         🤖 AI Escalation Protocol
                       </Typography>
                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Escalation Trigger:</Typography>
                           <Typography variant="body2" fontWeight={600}>Failed Care Team Contact</Typography>
                         </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Next Action:</Typography>
                           <Typography variant="body2" fontWeight={600} color="#4caf50">Provider Outreach</Typography>
                         </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Priority Level:</Typography>
                           <Typography variant="body2" fontWeight={600} color="#ff5722">High</Typography>
                         </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Time Window:</Typography>
                           <Typography variant="body2" fontWeight={600}>24 hours</Typography>
                         </Box>
                       </Box>
                     </Card>

                     <Card sx={{ p: 2, mt: 2, bgcolor: '#f3e5f5', border: '1px solid #9c27b0', color: '#f5f6fa' }}>
                       <Typography variant="subtitle2" fontWeight={600} color="#9c27b0" sx={{ mb: 1 }}>
                         📋 AI Analysis Log
                       </Typography>
                       <Typography variant="body2" color="#f5f6fa" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                         [1/8 14:30] CARE_TEAM_CALL: Attempt 1 - Patient unavailable<br/>
                         [1/8 16:45] CARE_TEAM_CALL: Attempt 2 - Voicemail only<br/>
                         [1/8 17:00] AI_ANALYSIS: Intervention failure detected<br/>
                         [1/8 17:05] RISK_ASSESSMENT: BP still elevated (175/105)<br/>
                         [1/8 17:10] ESCALATION: Provider outreach protocol activated<br/>
                         [1/8 17:15] PROVIDER_ALERT: Primary care physician notified<br/>
                         [1/8 17:20] WORKFLOW: Provider outreach workflow initiated<br/><br/>
                         [AI automatically detected intervention failure and escalated to provider level]
                       </Typography>
                     </Card>
                   </Box>
                 )}

                 {selectedProof.index === 9 && selectedProof.patient === 'Emma Rodriguez' && (
                   <Box>
                     <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#f5f6fa' }}>
                       🚀 Provider Outreach Workflow Activated
                     </Typography>
                     
                     <Card sx={{ p: 2, mb: 2, bgcolor: '#e8f5e9', border: '1px solid #4caf50', color: '#f5f6fa' }}>
                       <Typography variant="subtitle2" fontWeight={600} color="#4caf50" sx={{ mb: 1 }}>
                         ✅ Workflow Initiation
                       </Typography>
                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Trigger:</Typography>
                           <Typography variant="body2" fontWeight={600}>Failed Care Team Contact</Typography>
                         </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Provider:</Typography>
                           <Typography variant="body2" fontWeight={600}>Dr. Maria Rodriguez, PCP</Typography>
                         </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Priority:</Typography>
                           <Typography variant="body2" fontWeight={600} color="#ff5722">High</Typography>
                         </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Status:</Typography>
                           <Typography variant="body2" fontWeight={600} color="#4caf50">Active</Typography>
                         </Box>
                       </Box>
                     </Card>

                     <Card sx={{ p: 2, bgcolor: '#fff3e0', border: '1px solid #ff9800', color: '#f5f6fa' }}>
                       <Typography variant="subtitle2" fontWeight={600} color="#e65100" sx={{ mb: 1 }}>
                         📞 Provider Call Protocol
                       </Typography>
                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Call Script:</Typography>
                           <Typography variant="body2" fontWeight={600}>AI-Generated Provider Script</Typography>
                         </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Key Points:</Typography>
                           <Typography variant="body2" fontWeight={600}>BP Control, Medication Review</Typography>
                         </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Authority Level:</Typography>
                           <Typography variant="body2" fontWeight={600} color="#4caf50">Medication Adjustment</Typography>
                         </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography variant="body2" color="#f5f6fa">Follow-up:</Typography>
                           <Typography variant="body2" fontWeight={600}>48-hour monitoring</Typography>
                         </Box>
                       </Box>
                     </Card>

                     <Card sx={{ p: 2, mt: 2, bgcolor: '#f3e5f5', border: '1px solid #9c27b0', color: '#f5f6fa' }}>
                       <Typography variant="subtitle2" fontWeight={600} color="#9c27b0" sx={{ mb: 1 }}>
                         🤖 Provider Outreach Workflow
                       </Typography>
                       <Typography variant="body2" color="#f5f6fa" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                         WORKFLOW_ACTIVATED: Provider outreach protocol initiated<br/>
                         PROVIDER_MATCH: Dr. Maria Rodriguez (PCP) selected<br/>
                         CASE_REVIEW: Patient history and current vitals shared<br/>
                         CALL_SCRIPT: AI-generated provider communication script<br/>
                         AUTHORITY_GRANTED: Medication adjustment permissions<br/>
                         ESCALATION_PATH: Direct provider-to-patient contact<br/>
                         MONITORING: Real-time tracking of intervention success<br/><br/>
                         [Provider outreach provides higher authority and patient trust]
                       </Typography>
                     </Card>
                   </Box>
                 )}
               </Box>
             </DialogContent>
          </>
        )}
      </Dialog>



      {/* Gap Details Dialog */}
      <Dialog
        open={gapsDetailDialogOpen}
        onClose={() => setGapsDetailDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)',
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        {selectedPatientGaps && (
          <>
            <DialogTitle sx={{ 
              background: 'linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)',
              color: '#f5f6fa',
              p: 3
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                    📋 Patient Care Gaps Analysis
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.9 }}>
                    {selectedPatientGaps.name} • {selectedPatientGaps.diagnosis}
                  </Typography>
                </Box>
                <IconButton onClick={() => setGapsDetailDialogOpen(false)} sx={{ color: '#f5f6fa' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0, overflow: 'auto' }}>
              <Box sx={{ p: 3 }}>
                {/* Patient Summary Card */}
                <Card sx={{ 
                  p: 3, 
                  mb: 3, 
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', 
                  border: '2px solid #2196f3',
                  boxShadow: '0 4px 20px rgba(33, 150, 243, 0.15)',
                  color: '#f5f6fa'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#2196f3' }}>
                    👤 Patient Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="#f5f6fa">Name:</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPatientGaps.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="#f5f6fa">Age:</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPatientGaps.age} years</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="#f5f6fa">Last Visit:</Typography>
                        <Typography variant="body1" fontWeight={600}>{selectedPatientGaps.lastVisit}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="#f5f6fa">Primary Diagnosis:</Typography>
                        <Typography variant="body1" fontWeight={600} color="#ff5722">{selectedPatientGaps.diagnosis}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="#f5f6fa">Risk Level:</Typography>
                        <Chip 
                          label={selectedPatientGaps.riskLevel} 
                          color={selectedPatientGaps.riskLevel === 'Critical' ? 'error' : selectedPatientGaps.riskLevel === 'High' ? 'warning' : 'success'}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="#f5f6fa">Risk Score:</Typography>
                        <Typography variant="body1" fontWeight={600} color={selectedPatientGaps.riskScore > 70 ? '#ff5722' : '#4caf50'}>
                          {selectedPatientGaps.riskScore}/100
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>

                {/* Disease-Specific Alert */}
                <Alert severity="info" sx={{ mb: 3, background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%)', border: '1px solid #4caf50', color: '#f5f6fa' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    🎯 Disease-Specific Care Gaps Analysis
                  </Typography>
                  <Typography variant="body2">
                    The following care gaps are specifically tailored to {selectedPatientGaps.diagnosis} management and treatment protocols.
                  </Typography>
                </Alert>

                {/* Identified Care Gaps from Disease-wise Analysis */}
                <Card sx={{ 
                  p: 3, 
                  mb: 3, 
                  background: 'linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%)', 
                  border: '2px solid #ff9800',
                  boxShadow: '0 4px 20px rgba(255, 152, 0, 0.15)',
                  color: '#f5f6fa'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#e65100' }}>
                    🔬 Identified Care Gaps from Disease-wise Analysis
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {/* Disease-Specific Risk Factors */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" fontWeight={600} color="#e65100" sx={{ mb: 2 }}>
                        🚨 {selectedPatientGaps.diagnosis} Risk Factors
                      </Typography>
                      {selectedPatientGaps.diagnosis === 'Type 2 Diabetes' && (
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Hyperglycemia Risk:</strong> Missing diabetes medication increases blood sugar levels
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Complication Risk:</strong> Delayed A1C monitoring may miss early complications
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Foot Care:</strong> Missing annual foot exams increases amputation risk
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Infection Risk:</strong> Missing vaccinations increases infection susceptibility
                          </Typography>
                        </Box>
                      )}
                      {selectedPatientGaps.diagnosis === 'Hypertension' && (
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Hypertensive Crisis:</strong> Missing BP medication can cause dangerous spikes
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Cardiovascular Risk:</strong> Uncontrolled BP increases heart attack/stroke risk
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Kidney Damage:</strong> Missing kidney function monitoring may miss early damage
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Stress Impact:</strong> Unmanaged stress can worsen blood pressure control
                          </Typography>
                        </Box>
                      )}
                      {selectedPatientGaps.diagnosis === 'Heart Disease' && (
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Cardiac Events:</strong> Missing cardiac medication increases heart attack risk
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Heart Function:</strong> Delayed monitoring may miss declining heart function
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Rehabilitation:</strong> Missing cardiac rehab slows recovery and increases risk
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Diet Impact:</strong> Poor nutrition can worsen cardiovascular health
                          </Typography>
                        </Box>
                      )}
                      {selectedPatientGaps.diagnosis === 'COPD' && (
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Exacerbation Risk:</strong> Missing inhaler medication increases flare-up risk
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Lung Function:</strong> Delayed PFTs may miss declining lung capacity
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Infection Risk:</strong> Missing vaccines increases respiratory infection risk
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Anxiety Impact:</strong> COPD-related anxiety can worsen breathing difficulties
                          </Typography>
                        </Box>
                      )}
                      {selectedPatientGaps.diagnosis === 'Depression' && (
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Relapse Risk:</strong> Missing antidepressant medication increases relapse risk
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Mood Monitoring:</strong> Delayed therapy may miss mood deterioration
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Medication Levels:</strong> Missing blood work may miss therapeutic levels
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Nutrition Impact:</strong> Poor nutrition can worsen mood and energy levels
                          </Typography>
                        </Box>
                      )}
                      {selectedPatientGaps.diagnosis === 'Obesity' && (
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Weight Regain:</strong> Missing weight management medication increases regain risk
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Metabolic Health:</strong> Delayed monitoring may miss metabolic complications
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Motivation Impact:</strong> Missing mental health support affects weight loss motivation
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                            • <strong>Calorie Management:</strong> Poor nutrition guidance can hinder weight loss progress
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    {/* Disease-Specific Care Patterns */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" fontWeight={600} color="#e65100" sx={{ mb: 2 }}>
                        📊 {selectedPatientGaps.diagnosis} Care Patterns
                      </Typography>
                      
                      {/* Gap Distribution by Type */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight={600} color="#f5f6fa" sx={{ mb: 1 }}>
                          Gap Distribution:
                        </Typography>
                        {selectedPatientGaps.gaps.map((gap, index) => (
                          <Box key={index} sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            p: 1,
                            mb: 0.5,
                            bgcolor: '#fff',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0'
                          }}>
                            <Typography variant="body2" sx={{ flex: 1 }}>
                              {gap.type}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip 
                                label={`${gap.severity}/10`} 
                                size="small" 
                                color={gap.severity > 7 ? 'error' : gap.severity > 4 ? 'warning' : 'success'}
                                sx={{ minWidth: 40 }}
                              />
                              <Chip 
                                label={`${gap.daysOverdue}d`} 
                                size="small" 
                                variant="outlined"
                                color="info"
                                sx={{ minWidth: 40 }}
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>

                      {/* Disease-Specific Metrics */}
                      <Box>
                        <Typography variant="body2" fontWeight={600} color="#f5f6fa" sx={{ mb: 1 }}>
                          Disease-Specific Metrics:
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Box sx={{ p: 1, bgcolor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                              <Typography variant="caption" color="#f5f6fa">Critical Gaps</Typography>
                              <Typography variant="body2" fontWeight={600} color="#ff5722">
                                {selectedPatientGaps.gaps.filter(g => g.severity > 7).length}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ p: 1, bgcolor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                              <Typography variant="caption" color="#f5f6fa">Avg. Overdue</Typography>
                              <Typography variant="body2" fontWeight={600} color="#4caf50">
                                {Math.round(selectedPatientGaps.gaps.reduce((sum, g) => sum + g.daysOverdue, 0) / selectedPatientGaps.gaps.length)} days
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ p: 1, bgcolor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                              <Typography variant="caption" color="#f5f6fa">Cost Impact</Typography>
                              <Typography variant="body2" fontWeight={600} color="#ff5722">
                                ${(selectedPatientGaps.gaps.reduce((sum, g) => sum + g.impact, 0) / 1000).toFixed(1)}K
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ p: 1, bgcolor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                              <Typography variant="caption" color="#f5f6fa">Risk Level</Typography>
                              <Typography variant="body2" fontWeight={600} color={selectedPatientGaps.riskLevel === 'Critical' ? '#ff5722' : selectedPatientGaps.riskLevel === 'High' ? '#ff9800' : '#4caf50'}>
                                {selectedPatientGaps.riskLevel}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Disease-Specific Recommendations Summary */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: '#e8f5e8', borderRadius: 2, border: '1px solid #4caf50', color: '#f5f6fa' }}>
                    <Typography variant="subtitle2" fontWeight={600} color="#4caf50" sx={{ mb: 1 }}>
                      🎯 {selectedPatientGaps.diagnosis} Management Priorities
                    </Typography>
                    {selectedPatientGaps.diagnosis === 'Type 2 Diabetes' && (
                      <Typography variant="body2" color="#f5f6fa">
                        Prioritize medication adherence, A1C monitoring, foot care, and vaccination compliance to prevent complications and maintain glycemic control.
                      </Typography>
                    )}
                    {selectedPatientGaps.diagnosis === 'Hypertension' && (
                      <Typography variant="body2" color="#f5f6fa">
                        Focus on blood pressure medication adherence, regular monitoring, stress management, and low-sodium diet to prevent cardiovascular events.
                      </Typography>
                    )}
                    {selectedPatientGaps.diagnosis === 'Heart Disease' && (
                      <Typography variant="body2" color="#f5f6fa">
                        Emphasize cardiac medication compliance, heart function monitoring, cardiac rehabilitation, and heart-healthy nutrition to prevent cardiac events.
                      </Typography>
                    )}
                    {selectedPatientGaps.diagnosis === 'COPD' && (
                      <Typography variant="body2" color="#f5f6fa">
                        Prioritize inhaler adherence, lung function monitoring, vaccination compliance, and pulmonary rehabilitation to prevent exacerbations.
                      </Typography>
                    )}
                    {selectedPatientGaps.diagnosis === 'Depression' && (
                      <Typography variant="body2" color="#f5f6fa">
                        Focus on antidepressant adherence, mood monitoring, therapy sessions, and mental health support to prevent relapse and improve outcomes.
                      </Typography>
                    )}
                    {selectedPatientGaps.diagnosis === 'Obesity' && (
                      <Typography variant="body2" color="#f5f6fa">
                        Emphasize weight management medication adherence, metabolic monitoring, mental health support, and nutrition counseling to achieve sustainable weight loss.
                      </Typography>
                    )}
                  </Box>
                </Card>

                {/* Gap Details */}
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#f5f6fa', display: 'flex', alignItems: 'center' }}>
                  🔍 Care Gaps Analysis ({selectedPatientGaps.gaps.length} gaps identified)
                  <Chip 
                    label={`Total Impact: $${(selectedPatientGaps.gaps.reduce((sum, g) => sum + g.impact, 0) / 1000).toFixed(1)}K`}
                    color="error"
                    size="small"
                    sx={{ ml: 2 }}
                  />
                </Typography>
                
                {selectedPatientGaps.gaps.map((gap, index) => (
                  <Card key={index} sx={{ 
                    p: 3, 
                    mb: 3, 
                    background: '#fff', 
                    border: `2px solid ${gap.severity > 7 ? '#f44336' : gap.severity > 4 ? '#ff9800' : '#4caf50'}`,
                    boxShadow: `0 4px 15px ${gap.severity > 7 ? 'rgba(244, 67, 54, 0.15)' : gap.severity > 4 ? 'rgba(255, 152, 0, 0.15)' : 'rgba(76, 175, 80, 0.15)'}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 20px ${gap.severity > 7 ? 'rgba(244, 67, 54, 0.25)' : gap.severity > 4 ? 'rgba(255, 152, 0, 0.25)' : 'rgba(76, 175, 80, 0.25)'}`,
                      color: '#f5f6fa'
                    }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={700} color="#f5f6fa" sx={{ mb: 0.5 }}>
                          {gap.type}
                        </Typography>
                        <Typography variant="body2" color="#f5f6fa">
                          {gap.daysOverdue} days overdue • ${(gap.impact / 1000).toFixed(1)}K potential cost impact
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <Chip 
                          label={`Severity: ${gap.severity}/10`} 
                          color={gap.severity > 7 ? 'error' : gap.severity > 4 ? 'warning' : 'success'}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                        <Chip 
                          label={`${gap.daysOverdue} days overdue`} 
                          color="info"
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600} color="#ff5722" sx={{ mb: 1 }}>
                        🚨 Issue Description:
                      </Typography>
                      <Typography variant="body2" color="#f5f6fa" sx={{ 
                        p: 2, 
                        bgcolor: '#fff3e0', 
                        borderRadius: 1, 
                        border: '1px solid #ffcc02',
                        fontStyle: 'italic'
                      }}>
                        {gap.description}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} color="#4caf50" sx={{ mb: 1 }}>
                        💡 AI Recommendation:
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        p: 2, 
                        bgcolor: '#e8f5e8', 
                        borderRadius: 1, 
                        border: '1px solid #4caf50',
                        fontWeight: 500,
                        color: '#f5f6fa'
                      }}>
                        {gap.recommendation}
                      </Typography>
                    </Box>
                  </Card>
                ))}

                {/* Summary Footer */}
                <Card sx={{ 
                  p: 3, 
                  mt: 3, 
                  background: 'linear-gradient(135deg, #f3e5f5 0%, #e8eaf6 100%)', 
                  border: '2px solid #9c27b0',
                  color: '#f5f6fa'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#9c27b0' }}>
                    📊 Care Gaps Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="#f5f6fa">Total Gaps:</Typography>
                      <Typography variant="h6" fontWeight={700} color="#f5f6fa">{selectedPatientGaps.gaps.length}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="#f5f6fa">Average Severity:</Typography>
                      <Typography variant="h6" fontWeight={700} color="#ff9800">
                        {(selectedPatientGaps.gaps.reduce((sum, g) => sum + g.severity, 0) / selectedPatientGaps.gaps.length).toFixed(1)}/10
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="#f5f6fa">Total Cost Impact:</Typography>
                      <Typography variant="h6" fontWeight={700} color="#ff5722">
                        ${(selectedPatientGaps.gaps.reduce((sum, g) => sum + g.impact, 0) / 1000).toFixed(1)}K
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="#f5f6fa">Days Overdue:</Typography>
                      <Typography variant="h6" fontWeight={700} color="#4caf50">
                        {Math.max(...selectedPatientGaps.gaps.map(g => g.daysOverdue))} days
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Detailed Card Report Dialog */}
      <Dialog
        open={showCardDetails}
        onClose={() => setShowCardDetails(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }
        }}
      >
        {selectedCardDetails && (
          <>
            <DialogTitle sx={{
              background: selectedCardDetails.gradient,
              color: '#f5f6fa',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              {selectedCardDetails.icon}
              {selectedCardDetails.title} - Detailed Report
              <IconButton
                onClick={() => setShowCardDetails(false)}
                sx={{ color: '#f5f6fa', ml: 'auto' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              {/* Executive Summary */}
              <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', border: '2px solid #2196f3', color: '#f5f6fa' }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: '#2196f3' }}>
                  📊 Executive Summary
                </Typography>
                <Grid container spacing={3}>
                  {selectedCardDetails.metrics.map((metric, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={idx}>
                      <Box sx={{
                        p: 2,
                        bgcolor: '#fff',
                        borderRadius: 2,
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: '1px solid #e0e0e0',
                        color: '#f5f6fa'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                          {metric.icon}
                        </Box>
                        <Typography variant="h4" fontWeight={700} color="#2196f3" sx={{ mb: 0.5 }}>
                          {metric.prefix || ''}{metric.value.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="#f5f6fa" sx={{ fontWeight: 600 }}>
                          {metric.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </DialogContent>
          </>
        )}
      </Dialog>
      {/* Detailed AI Intervention Timeline Dialog */}
      <Dialog
        open={showDetailedTimeline}
        onClose={() => setShowDetailedTimeline(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            overflow: 'hidden'
          }
        }}
      >
        {selectedTimelineDriver && timelineData.length > 0 && (
          <>
            <DialogTitle sx={{
              background: `linear-gradient(45deg, ${selectedTimelineDriver.color} 30%, ${selectedTimelineDriver.color}80 90%)`,
              color: 'white',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 3
            }}>
              <Typography variant="h3">{selectedTimelineDriver.icon}</Typography>
              <Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                  Detailed AI Intervention Timeline: {selectedTimelineDriver.name}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 0.5, opacity: 0.9 }}>
                  {timelineData.length} patients • {timelineData.reduce((sum, p) => sum + p.interventions, 0)} AI interventions
                </Typography>
              </Box>
              <IconButton
                onClick={() => setShowDetailedTimeline(false)}
                sx={{ color: 'white', ml: 'auto' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
              <Box sx={{ height: '100%', overflow: 'auto', p: 3 }}>
                {/* Patient Selection Dropdown */}
                <Card sx={{ p: 3, mb: 3, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="h5" fontWeight={700} color={selectedTimelineDriver.color}>
                      👤 Select Patient for Detailed View
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setTimelineView('overview')}
                      sx={{ ml: 'auto' }}
                    >
                      Back to Overview
                    </Button>
                  </Box>
                  
                  <FormControl fullWidth>
                    <InputLabel>Choose Patient</InputLabel>
                    <Select
                      value={selectedTimelinePatient?.id || ''}
                      onChange={(e) => {
                        const patient = timelineData.find(p => p.id === e.target.value);
                        setSelectedTimelinePatient(patient);
                        setTimelineView('patient-detail');
                      }}
                      label="Choose Patient"
                      sx={{
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }
                      }}
                    >
                      {timelineData.map((patient) => (
                        <MenuItem key={patient.id} value={patient.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <Avatar sx={{ 
                              bgcolor: patient.driverColor, 
                              width: 32, 
                              height: 32,
                              fontSize: '0.875rem'
                            }}>
                              {patient.name.charAt(0)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" fontWeight={600}>
                                {patient.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {patient.age} years • {patient.diagnosis} • Risk: {patient.riskScore}/100
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Chip 
                                label={patient.status} 
                                color={patient.status === 'Critical' ? 'error' : patient.status === 'High' ? 'warning' : 'info'}
                                size="small"
                              />
                              <Typography variant="body2" color="success.main" fontWeight={600}>
                                ${patient.totalSavings.toLocaleString()}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Card>

                {/* Patient Detail View */}
                {selectedTimelinePatient && timelineView === 'patient-detail' ? (
                  <Box>
                    {/* Patient Header */}
                    <Card sx={{ p: 3, mb: 3, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar sx={{ 
                          bgcolor: selectedTimelinePatient.driverColor, 
                          width: 80, 
                          height: 80,
                          fontSize: '2rem'
                        }}>
                          {selectedTimelinePatient.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h4" fontWeight={700} color="text.primary">
                            {selectedTimelinePatient.name}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                            {selectedTimelinePatient.age} years • {selectedTimelinePatient.diagnosis}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Chip 
                              label={`Risk Score: ${selectedTimelinePatient.riskScore}/100`} 
                              color={selectedTimelinePatient.riskScore > 80 ? 'error' : selectedTimelinePatient.riskScore > 60 ? 'warning' : 'info'}
                            />
                            <Chip 
                              label={selectedTimelinePatient.status} 
                              color={selectedTimelinePatient.status === 'Critical' ? 'error' : selectedTimelinePatient.status === 'High' ? 'warning' : 'info'}
                            />
                            <Typography variant="h5" fontWeight={700} color="success.main">
                              ${selectedTimelinePatient.totalSavings.toLocaleString()} Saved
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Card>

                    {/* Modular Sections - Compact Layout */}
                    <Grid container spacing={2}>
                      {/* AI Recommendations */}
                      <Grid item xs={12} md={4}>
                        <Card sx={{ p: 2, height: '100%', background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', border: '2px solid #2196f3', minHeight: 300 }}>
                          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#2196f3', display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem' }}>
                            🤖 AI Recommendations
                          </Typography>
                          {selectedTimelinePatient.aiRecommendations.map((rec, index) => (
                            <Box key={index} sx={{ mb: 1.5, p: 1.5, bgcolor: 'white', borderRadius: 1.5, border: '1px solid #e0e0e0' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ fontSize: '0.875rem' }}>
                                  {rec.title}
                                </Typography>
                                <Chip 
                                  label={rec.priority} 
                                  color={rec.priority === 'Critical' ? 'error' : rec.priority === 'High' ? 'warning' : 'info'}
                                  size="small"
                                  sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                              </Box>
                              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, lineHeight: 1.3 }}>
                                {rec.description}
                              </Typography>
                              <Typography variant="caption" fontWeight={600} color="success.main">
                                Impact: {rec.impact}
                              </Typography>
                            </Box>
                          ))}
                        </Card>
                      </Grid>

                      {/* Insights */}
                      <Grid item xs={12} md={4}>
                        <Card sx={{ p: 2, height: '100%', background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)', border: '2px solid #4caf50', minHeight: 300 }}>
                          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#2e7d32', display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem' }}>
                            💡 Key Insights
                          </Typography>
                          {selectedTimelinePatient.insights.map((insight, index) => (
                            <Box key={index} sx={{ mb: 1.5, p: 1.5, bgcolor: 'white', borderRadius: 1.5, border: '1px solid #e0e0e0' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ fontSize: '0.875rem' }}>
                                  Insight {index + 1}
                                </Typography>
                                <Chip 
                                  label={index === 0 ? 'Critical' : index === 1 ? 'High' : 'Medium'} 
                                  color={index === 0 ? 'error' : index === 1 ? 'warning' : 'info'}
                                  size="small"
                                  sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                              </Box>
                              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, lineHeight: 1.3 }}>
                                {insight}
                              </Typography>
                              <Typography variant="caption" fontWeight={600} color="success.main">
                                Impact: {index === 0 ? 'High risk of hospitalization' : index === 1 ? 'Disease progression risk' : index === 2 ? 'Quality of life impact' : 'Preventive opportunity'}
                              </Typography>
                            </Box>
                          ))}
                        </Card>
                      </Grid>

                      {/* Future Steps */}
                      <Grid item xs={12} md={4}>
                        <Card sx={{ p: 2, height: '100%', background: 'linear-gradient(135deg, #f3e5f5 0%, #e8eaf6 100%)', border: '2px solid #9c27b0', minHeight: 300 }}>
                          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#7b1fa2', display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem' }}>
                            🚀 Future Steps
                          </Typography>
                          {selectedTimelinePatient.futureSteps.map((step, index) => (
                            <Box key={index} sx={{ mb: 1.5, p: 1.5, bgcolor: 'white', borderRadius: 1.5, border: '1px solid #e0e0e0' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ fontSize: '0.875rem' }}>
                                  {step.step}
                                </Typography>
                                <Chip 
                                  label={step.priority} 
                                  color={step.priority === 'Critical' ? 'error' : step.priority === 'High' ? 'warning' : 'info'}
                                  size="small"
                                  sx={{ fontSize: '0.7rem', height: 20 }}
                                />
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                Timeline: {step.timeline}
                              </Typography>
                            </Box>
                          ))}
                        </Card>
                      </Grid>

                      {/* Animated Timeline */}
                      <Grid item xs={12}>
                        <Card sx={{ p: 3, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                          <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: selectedTimelinePatient.driverColor, display: 'flex', alignItems: 'center', gap: 1 }}>
                            📅 AI Intervention Timeline
                          </Typography>
                          
                          <Box sx={{ position: 'relative' }}>
                            {/* Timeline Line */}
                            <Box sx={{
                              position: 'absolute',
                              left: 20,
                              top: 0,
                              bottom: 0,
                              width: 3,
                              background: `linear-gradient(180deg, ${selectedTimelinePatient.driverColor}, #4caf50)`,
                              borderRadius: 1
                            }} />
                            
                            {selectedTimelinePatient.timeline.map((event, eventIndex) => (
                              <Box key={event.id} sx={{ 
                                display: 'flex', 
                                alignItems: 'flex-start', 
                                mb: 3,
                                position: 'relative'
                              }}>
                                {/* Timeline Dot */}
                                <Box sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  background: event.ai 
                                    ? 'linear-gradient(45deg, #4caf50, #66bb6a)' 
                                    : 'linear-gradient(45deg, #757575, #9e9e9e)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: 16,
                                  fontWeight: 600,
                                  zIndex: 2,
                                  boxShadow: event.ai 
                                    ? '0 4px 12px rgba(76, 175, 80, 0.3)' 
                                    : '0 4px 12px rgba(117, 117, 117, 0.3)',
                                  animation: `fadeInUp 0.5s ease-out ${eventIndex * 0.1}s both`
                                }}>
                                  {event.icon}
                                </Box>
                                
                                {/* Event Card */}
                                <Box sx={{ ml: 2, flex: 1 }}>
                                  <Card sx={{ 
                                    p: 2,
                                    background: event.ai 
                                      ? 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)' 
                                      : 'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)',
                                    border: `2px solid ${event.ai ? '#4caf50' : '#757575'}`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    animation: `slideInRight 0.5s ease-out ${eventIndex * 0.1}s both`
                                  }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                      <Typography variant="subtitle2" fontWeight={600} color={event.ai ? 'success.main' : 'text.secondary'}>
                                        {event.date} • {event.time}
                                      </Typography>
                                      <Chip 
                                        label={event.ai ? 'AI Intervention' : 'Standard Care'} 
                                        size="small" 
                                        color={event.ai ? 'success' : 'default'}
                                        variant="filled"
                                        sx={{ fontSize: '0.75rem' }}
                                      />
                                    </Box>
                                    <Typography variant="body1" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                                      {event.type}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                      {event.description}
                                    </Typography>
                                    {event.ai && (
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                          Agent: {event.agent}
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700} color="success.main">
                                          ${event.costSaved.toLocaleString()}
                                        </Typography>
                                      </Box>
                                    )}
                                    
                                    {/* Proof Button for Lisa Rodriguez, Jennifer Williams, and Michael Chen */}
                                    {event.ai && event.proofData && (selectedTimelinePatient?.name === 'Lisa Rodriguez' || selectedTimelinePatient?.name === 'Jennifer Williams' || selectedTimelinePatient?.name === 'Michael Chen') && (
                                      <Box sx={{ mt: 2 }}>
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          startIcon={<VisibilityIcon />}
                                          onClick={() => {
                                            setSelectedProof({
                                              patientName: selectedTimelinePatient.name,
                                              eventType: event.type,
                                              agent: event.agent,
                                              timestamp: event.timestamp,
                                              ...event.proofData
                                            });
                                            setShowProofDialog(true);
                                          }}
                                          sx={{
                                            borderColor: '#2196f3',
                                            color: '#2196f3',
                                            '&:hover': {
                                              borderColor: '#1976d2',
                                              bgcolor: '#e3f2fd'
                                            }
                                          }}
                                        >
                                          View Proof
                                        </Button>
                                      </Box>
                                    )}
                                  </Card>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Card>
                      </Grid>

                      {/* Outcome Metrics for Lisa Rodriguez and Michael Chen */}
                      {(selectedTimelinePatient.name === 'Lisa Rodriguez' || selectedTimelinePatient.name === 'Michael Chen') && (
                        <Grid item xs={12}>
                          <Card sx={{ p: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', border: '2px solid #2196f3', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                              <Typography variant="h6" fontWeight={700} sx={{ color: '#2196f3', display: 'flex', alignItems: 'center', gap: 1 }}>
                                🚀 Outcome Metrics
                              </Typography>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h5" fontWeight={700} color="success.main">
                                  {selectedTimelinePatient.name === 'Michael Chen' ? '$25,000' : '$15,000'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Total Saved
                                </Typography>
                              </Box>
                            </Box>
                            <Grid container spacing={1.5}>
                              {(() => {
                                // Get unique AI interventions by type from Lisa Rodriguez's timeline
                                const aiEvents = selectedTimelinePatient.timeline.filter(ev => ev.ai);
                                const uniqueTypes = new Set();
                                const uniqueAIEvents = aiEvents.filter(ev => {
                                  if (uniqueTypes.has(ev.type)) return false;
                                  uniqueTypes.add(ev.type);
                                  return true;
                                });
                                return uniqueAIEvents.map((ev, idx) => (
                                  <Grid item xs={12} sm={6} md={4} lg={3} key={ev.type}>
                                    <Card sx={{
                                      p: 1.5,
                                      bgcolor: '#e3f2fd',
                                      border: '1px solid #2196f3',
                                      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                                      position: 'relative',
                                      overflow: 'hidden',
                                      minHeight: 140,
                                      '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 2,
                                        background: 'linear-gradient(90deg, #2196f3, #4caf50, #ff9800)',
                                        animation: `${shimmer} 2s ease-in-out infinite`
                                      }
                                    }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                        <Box sx={{
                                          width: 28,
                                          height: 28,
                                          borderRadius: '50%',
                                          bgcolor: '#4caf50',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          mr: 1
                                        }}>
                                          <Typography variant="body2" color="white" fontWeight={700}>
                                            🤖
                                          </Typography>
                                        </Box>
                                        <Typography variant="subtitle2" fontWeight={600} color="#1a237e" sx={{ fontSize: '0.875rem' }}>
                                          {ev.type}
                                        </Typography>
                                      </Box>
                                      <Typography variant="caption" color="#37383b" sx={{ 
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        mb: 0.5,
                                        lineHeight: 1.2
                                      }}>
                                        {ev.description}
                                      </Typography>
                                      <Typography variant="h6" color="success.main" fontWeight={700} sx={{ mb: 0.5 }}>
                                        ${ev.costSaved.toLocaleString()}
                                      </Typography>
                                      <Chip 
                                        label="AI Intervention" 
                                        color="primary" 
                                        size="small" 
                                        sx={{ 
                                          fontWeight: 600, 
                                          fontSize: '0.7rem',
                                          height: 20
                                        }} 
                                      />
                                    </Card>
                                  </Grid>
                                ));
                              })()}
                            </Grid>
                          </Card>
                        </Grid>
                      )}

                    </Grid>
                  </Box>
                ) : (
                  /* Overview View */
                  <Box>
                    {/* Summary Statistics */}
                    <Card sx={{ p: 3, mb: 3, background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: selectedTimelineDriver.color }}>
                        📊 Intervention Summary
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                            <Typography variant="h4" fontWeight={700} color={selectedTimelineDriver.color}>
                              {timelineData.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Patients
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                            <Typography variant="h4" fontWeight={700} color="success.main">
                              {timelineData.reduce((sum, p) => sum + p.interventions, 0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              AI Interventions
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                            <Typography variant="h4" fontWeight={700} color="success.main">
                              ${timelineData.reduce((sum, p) => sum + p.totalSavings, 0).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Savings
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                            <Typography variant="h4" fontWeight={700} color="info.main">
                              {Math.round(timelineData.reduce((sum, p) => sum + p.totalSavings, 0) / timelineData.length).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Avg Savings/Patient
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Card>

                    {/* Patient Cards Grid */}
                    <Grid container spacing={3}>
                      {timelineData.map((patient, patientIndex) => (
                        <Grid item xs={12} sm={6} md={4} key={patient.id}>
                          <Card sx={{ 
                            p: 3, 
                            background: 'white',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            border: `2px solid ${patient.driverColor}`,
                            borderRadius: 3,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 8px 25px ${patient.driverColor}40`
                            }
                          }}
                          onClick={() => {
                            setSelectedTimelinePatient(patient);
                            setTimelineView('patient-detail');
                          }}
                          >
                            {/* Patient Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Avatar sx={{ 
                                bgcolor: patient.driverColor, 
                                width: 50, 
                                height: 50,
                                fontSize: '1.5rem'
                              }}>
                                {patient.name.charAt(0)}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight={700} color="text.primary">
                                  {patient.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {patient.age} years • {patient.diagnosis}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Risk Score: {patient.riskScore}/100
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <Chip 
                                  label={patient.status} 
                                  color={patient.status === 'Critical' ? 'error' : patient.status === 'High' ? 'warning' : 'info'}
                                  size="small"
                                />
                                <Chip 
                                  label={`${patient.interventions} AI interventions`} 
                                  color="success"
                                  size="small"
                                />
                              </Box>
                            </Box>
                            
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h5" fontWeight={700} color="success.main">
                                ${patient.totalSavings.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Total Savings
                              </Typography>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* AI Intervention Proof Dialog */}
      <Dialog
        open={showProofDialog}
        onClose={() => setShowProofDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            overflow: 'hidden'
          }
        }}
      >
        {selectedProof && (
          <>
            <DialogTitle sx={{
              background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
              color: 'white',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}>
              📱 AI Intervention Proof
              <IconButton
                onClick={() => setShowProofDialog(false)}
                sx={{ color: 'white', ml: 'auto' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                  {selectedProof.patientName} • {selectedProof.eventType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Agent: {selectedProof.agent} • {selectedProof.timestamp}
                </Typography>
              </Box>

              {/* Lisa Rodriguez - Custom Proofs */}
              {selectedProof.patientName === 'Lisa Rodriguez' && (
                <>
                  {/* Prescription Proof */}
                  {selectedProof.eventType === 'Prescription' && selectedProof.systemLog && (
                    <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', border: '2px solid #2196f3' }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#2196f3' }}>
                        📝 Prescription Record
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Provider: {selectedProof.systemLog.provider}</Typography>
                        <Typography variant="body2" color="text.secondary">Medication: {selectedProof.systemLog.medication}</Typography>
                        <Typography variant="body2" color="text.secondary">Dosage: {selectedProof.systemLog.dosage}</Typography>
                        <Typography variant="body2" color="text.secondary">Pharmacy: {selectedProof.systemLog.pharmacy}</Typography>
                        <Typography variant="body2" color="text.secondary">Status: {selectedProof.systemLog.status}</Typography>
                        <Typography variant="body2" color="text.secondary">Notes: {selectedProof.systemLog.notes}</Typography>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" fontWeight={600} color="text.primary">EMR Record</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">Diagnosis: {selectedProof.emrRecord.diagnosis}</Typography>
                        <Typography variant="body2" color="text.secondary">Prescription: {selectedProof.emrRecord.prescription}</Typography>
                        <Typography variant="body2" color="text.secondary">Instructions: {selectedProof.emrRecord.instructions}</Typography>
                        <Typography variant="body2" color="text.secondary">Status: {selectedProof.emrRecord.status}</Typography>
                      </Box>
                    </Card>
                  )}
                  {/* No Fill Detection Proof */}
                  {selectedProof.eventType === 'No Fill Detection' && (
                    <>
                      <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%)', border: '2px solid #ff9800' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#e65100' }}>
                          🏥 Pharmacy Alert
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Medication: {selectedProof.pharmacyAlert.medication}</Typography>
                        <Typography variant="body2" color="text.secondary">Status: {selectedProof.pharmacyAlert.status}</Typography>
                        <Typography variant="body2" color="text.secondary">Risk Level: {selectedProof.pharmacyAlert.riskLevel}</Typography>
                        <Typography variant="body2" color="text.secondary">Pharmacy: {selectedProof.pharmacyAlert.pharmacy}</Typography>
                        <Typography variant="body2" color="text.secondary">Alert Time: {selectedProof.pharmacyAlert.timestamp}</Typography>
                      </Card>
                      <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', border: '2px solid #2196f3' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#2196f3' }}>
                          💊 Prescription
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Patient: Lisa Rodriguez</Typography>
                        <Typography variant="body2" color="text.secondary">Medication: {selectedProof.pharmacyAlert.medication}</Typography>
                        <Typography variant="body2" color="text.secondary">Indication: COPD Exacerbation</Typography>
                        <Typography variant="body2" color="text.secondary">Dosage: {selectedProof.systemLog?.dosage || '2 puffs every 4-6 hours as needed'}</Typography>
                        <Typography variant="body2" color="text.secondary">Instructions: Use as needed for shortness of breath</Typography>
                        <Typography variant="body2" color="text.secondary">Date Prescribed: {selectedProof.pharmacyAlert.prescriptionDate}</Typography>
                        <Typography variant="body2" color="text.secondary">Status: Not Filled</Typography>
                        <Typography variant="body2" color="text.secondary">Copay: {selectedProof.claimsData.copay}</Typography>
                        <Typography variant="body2" color="text.secondary">Prescribed by: Dr. Sarah Johnson, PCP</Typography>
                        <Typography variant="body2" color="text.secondary">Notes: Critical for prevention of COPD exacerbations and hospitalizations.</Typography>
                      </Card>
                    </>
                  )}
                  {/* Digital Outreach Proof */}
                  {selectedProof.eventType === 'Digital Outreach' && (
                    <>
                      {selectedProof.smsMessage && (
                        <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', border: '2px solid #2196f3' }}>
                          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#2196f3' }}>
                            📱 SMS Message
                          </Typography>
                          <Typography variant="body2" color="text.secondary">From: {selectedProof.smsMessage.from}</Typography>
                          <Typography variant="body2" color="text.secondary">To: {selectedProof.smsMessage.to}</Typography>
                          <Typography variant="body2" color="text.secondary">Time: {selectedProof.smsMessage.timestamp}</Typography>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{selectedProof.smsMessage.message}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Status: {selectedProof.smsMessage.status}</Typography>
                          {selectedProof.smsMessage.responseReceived && (
                            <Typography variant="body2" color="text.secondary">Response Received: {selectedProof.smsMessage.responseReceived} (in {selectedProof.smsMessage.responseTime})</Typography>
                          )}
                        </Card>
                      )}
                      {selectedProof.followUpMessage && (
                        <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%)', border: '2px solid #ff9800' }}>
                          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#e65100' }}>
                            📲 Follow-up Message
                          </Typography>
                          <Typography variant="body2" color="text.secondary">From: {selectedProof.followUpMessage.from}</Typography>
                          <Typography variant="body2" color="text.secondary">To: {selectedProof.followUpMessage.to}</Typography>
                          <Typography variant="body2" color="text.secondary">Time: {selectedProof.followUpMessage.timestamp}</Typography>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{selectedProof.followUpMessage.message}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Status: {selectedProof.followUpMessage.status}</Typography>
                        </Card>
                      )}
                    </>
                  )}
                  {/* Case Creation Proof */}
                  {selectedProof.eventType === 'Case Creation' && selectedProof.caseRecord && (
                    <>
                      <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', border: '2px solid #2196f3' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#2196f3' }}>
                          📋 Case Record
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Case ID: {selectedProof.caseRecord.caseId}</Typography>
                          <Typography variant="body2" color="text.secondary">Patient: {selectedProof.caseRecord.patient}</Typography>
                          <Typography variant="body2" color="text.secondary">Issue: {selectedProof.caseRecord.issue}</Typography>
                          <Typography variant="body2" color="text.secondary">Priority: {selectedProof.caseRecord.priority}</Typography>
                          <Typography variant="body2" color="text.secondary">Assigned To: {selectedProof.caseRecord.assignedTo}</Typography>
                          <Typography variant="body2" color="text.secondary">Risk Level: {selectedProof.caseRecord.riskLevel}</Typography>
                          <Typography variant="body2" color="text.secondary">Estimated Resolution: {selectedProof.caseRecord.estimatedResolution}</Typography>
                          <Typography variant="body2" color="text.secondary">Intervention Type: {selectedProof.caseRecord.interventionType}</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">Escalation Triggers</Typography>
                        <Box sx={{ mt: 1 }}>
                          {selectedProof.caseRecord.escalationTriggers.map((trigger, index) => (
                            <Typography key={index} variant="body2" color="text.secondary">• {trigger}</Typography>
                          ))}
                        </Box>
                      </Card>
                      
                      <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #fff3e0 0%, #fff8e1 100%)', border: '2px solid #ff9800' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#e65100' }}>
                          📅 Scheduling System
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Appointment ID: {selectedProof.schedulingSystem.appointmentId}</Typography>
                          <Typography variant="body2" color="text.secondary">Case Manager: {selectedProof.schedulingSystem.caseManager}</Typography>
                          <Typography variant="body2" color="text.secondary">Patient: {selectedProof.schedulingSystem.patient}</Typography>
                          <Typography variant="body2" color="text.secondary">Scheduled Time: {selectedProof.schedulingSystem.scheduledTime}</Typography>
                          <Typography variant="body2" color="text.secondary">Location: {selectedProof.schedulingSystem.location}</Typography>
                          <Typography variant="body2" color="text.secondary">Duration: {selectedProof.schedulingSystem.duration}</Typography>
                          <Typography variant="body2" color="text.secondary">Purpose: {selectedProof.schedulingSystem.purpose}</Typography>
                          <Typography variant="body2" color="text.secondary">Status: {selectedProof.schedulingSystem.status}</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">System Integration</Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">CRM System: {selectedProof.schedulingSystem.systemIntegration.crmSystem}</Typography>
                          <Typography variant="body2" color="text.secondary">Case ID: {selectedProof.schedulingSystem.systemIntegration.caseId}</Typography>
                          <Typography variant="body2" color="text.secondary">Workflow Status: {selectedProof.schedulingSystem.systemIntegration.workflowStatus}</Typography>
                          <Typography variant="body2" color="text.secondary">Next Steps:</Typography>
                          {selectedProof.schedulingSystem.systemIntegration.nextSteps.map((step, index) => (
                            <Typography key={index} variant="body2" color="text.secondary">• {step}</Typography>
                          ))}
                        </Box>
                      </Card>

                      <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)', border: '2px solid #4caf50' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#2e7d32' }}>
                          🏥 Case Management System
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">System Name: {selectedProof.caseManagementSystem.systemName}</Typography>
                          <Typography variant="body2" color="text.secondary">Case ID: {selectedProof.caseManagementSystem.caseId}</Typography>
                          <Typography variant="body2" color="text.secondary">Created By: {selectedProof.caseManagementSystem.createdBy}</Typography>
                          <Typography variant="body2" color="text.secondary">Assigned To: {selectedProof.caseManagementSystem.assignedTo}</Typography>
                          <Typography variant="body2" color="text.secondary">Priority: {selectedProof.caseManagementSystem.priority}</Typography>
                          <Typography variant="body2" color="text.secondary">Category: {selectedProof.caseManagementSystem.category}</Typography>
                          <Typography variant="body2" color="text.secondary">Subcategory: {selectedProof.caseManagementSystem.subcategory}</Typography>
                          <Typography variant="body2" color="text.secondary">Status: {selectedProof.caseManagementSystem.status}</Typography>
                          <Typography variant="body2" color="text.secondary">Estimated Resolution: {selectedProof.caseManagementSystem.estimatedResolution}</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">Intervention Plan</Typography>
                        <Box sx={{ mt: 1, mb: 2 }}>
                          {selectedProof.caseManagementSystem.interventionPlan.map((plan, index) => (
                            <Typography key={index} variant="body2" color="text.secondary">• {plan}</Typography>
                          ))}
                        </Box>
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">Risk Factors</Typography>
                        <Box sx={{ mt: 1, mb: 2 }}>
                          {selectedProof.caseManagementSystem.riskFactors.map((factor, index) => (
                            <Typography key={index} variant="body2" color="text.secondary">• {factor}</Typography>
                          ))}
                        </Box>
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">Escalation Path</Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">Level 1: {selectedProof.caseManagementSystem.escalationPath.level1}</Typography>
                          <Typography variant="body2" color="text.secondary">Level 2: {selectedProof.caseManagementSystem.escalationPath.level2}</Typography>
                          <Typography variant="body2" color="text.secondary">Level 3: {selectedProof.caseManagementSystem.escalationPath.level3}</Typography>
                          <Typography variant="body2" color="text.secondary">Escalation Time: {selectedProof.caseManagementSystem.escalationPath.escalationTime}</Typography>
                        </Box>
                      </Card>

                      <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f3e5f5 0%, #e8eaf6 100%)', border: '2px solid #9c27b0' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#7b1fa2' }}>
                          📱 Notification System
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">SMS Alert:</Typography>
                          <Typography variant="body2" color="text.secondary">To: {selectedProof.notificationSystem.smsAlert.to}</Typography>
                          <Typography variant="body2" color="text.secondary">Time: {selectedProof.notificationSystem.smsAlert.timestamp}</Typography>
                          <Typography variant="body2" color="text.secondary">Status: {selectedProof.notificationSystem.smsAlert.status}</Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{selectedProof.notificationSystem.smsAlert.message}</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Email Notification:</Typography>
                          <Typography variant="body2" color="text.secondary">To: {selectedProof.notificationSystem.emailNotification.to}</Typography>
                          <Typography variant="body2" color="text.secondary">Subject: {selectedProof.notificationSystem.emailNotification.subject}</Typography>
                          <Typography variant="body2" color="text.secondary">Time: {selectedProof.notificationSystem.emailNotification.timestamp}</Typography>
                          <Typography variant="body2" color="text.secondary">Status: {selectedProof.notificationSystem.emailNotification.status}</Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{selectedProof.notificationSystem.emailNotification.body}</Typography>
                        </Box>
                      </Card>
                    </>
                  )}
                  {/* Add similar blocks for other eventTypes and their proof data (riskAssessment, caseRecord, visitReport, etc.) */}
                  {/* Fallback if no proof data */}
                  {!selectedProof.systemLog && !selectedProof.pharmacyAlert && !selectedProof.smsMessage && !selectedProof.caseRecord && (
                    <Alert severity="info">No proof available for this intervention.</Alert>
                  )}
                </>
              )}

              {/* Default fallback for other patients/interventions */}
              {selectedProof.patientName !== 'Lisa Rodriguez' && (
                <Alert severity="info">No proof available for this intervention.</Alert>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* End of Dialogs */}
    </Dialog>
  );
}

export default CareCostGapsCenterAIDialog; 