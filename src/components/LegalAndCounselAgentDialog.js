import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
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
  Chip,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  LinearProgress,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Divider,
  Switch,
  FormControlLabel,
  TextareaAutosize,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Gavel as GavelIcon,
  Policy as PolicyIcon,
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  AutoFixHigh as AutoFixHighIcon,
  Dashboard as DashboardIcon,
  Lightbulb as LightbulbIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

// Mock data for legal and counsel analysis
const LEGAL_DATA = {
  summary: {
    totalCases: 1247,
    highRiskCases: 234,
    complianceRate: 89.5,
    pendingReviews: 156,
    regulatoryUpdates: 23,
    riskScore: 7.2
  },
  regulatoryAreas: [
    { name: 'HIPAA Compliance', value: 35, risk: 'Low', color: '#4caf50' },
    { name: 'Medicare Regulations', value: 28, risk: 'Medium', color: '#ff9800' },
    { name: 'State Laws', value: 22, risk: 'Medium', color: '#ff9800' },
    { name: 'Fraud & Abuse', value: 15, risk: 'High', color: '#f44336' }
  ],
  highRiskCases: [
    {
      id: 'CASE-001',
      patientName: 'Sarah Johnson',
      riskLevel: 'Critical',
      issue: 'HIPAA Violation - Unauthorized PHI Access',
      status: 'Under Review',
      deadline: '2024-03-20',
      estimatedPenalty: 50000
    },
    {
      id: 'CASE-002',
      patientName: 'Michael Chen',
      riskLevel: 'High',
      issue: 'Medicare Billing Compliance',
      status: 'Investigation',
      deadline: '2024-03-25',
      estimatedPenalty: 25000
    }
  ],
  regulatoryUpdates: [
    {
      id: 'UPDATE-001',
      title: 'HIPAA Privacy Rule Updates',
      date: '2024-03-15',
      impact: 'High',
      description: 'New requirements for patient data access and sharing',
      deadline: '2024-06-15',
      status: 'Implementation Required'
    },
    {
      id: 'UPDATE-002',
      title: 'Medicare Advantage Changes',
      date: '2024-03-10',
      impact: 'Medium',
      description: 'Updated billing codes and documentation requirements',
      deadline: '2024-05-10',
      status: 'Training Required'
    }
  ]
};

// Mock data for invoice analysis
const INVOICE_DATA = {
  summary: {
    totalInvoices: 1247,
    pendingReview: 89,
    approved: 1056,
    rejected: 102,
    totalValue: 28475000,
    savingsIdentified: 1250000,
    averageProcessingTime: '2.3 days'
  },
  sampleInvoices: [
    {
      id: 'INV-2024-001',
      firm: 'Smith & Associates LLP',
      matter: 'Corporate Merger - ABC Corp',
      invoiceNumber: '2024-001',
      date: '2024-03-15',
      dateReceived: '2024-03-16',
      total: 125000,
      status: 'Under Review',
      riskScore: 7.2,
      anomalies: 3,
      remarks: 'High-risk invoice requiring immediate attention',
      mismatchDescription: 'Partner rate exceeds contracted rate by $50/hour',
      agentAnalysis: 'AI Agent detected 3 compliance violations',
      matchInvoice: 'INV-2024-015',
      humanIntervention: {
        required: true,
        type: 'Rate Dispute',
        priority: 'High',
        assignedTo: 'Legal Team Lead',
        deadline: '2024-03-25',
        status: 'Pending Review',
        notes: 'Partner rate exceeds contracted rate. Need legal team to review contract terms and negotiate with firm.',
        manualCorrections: [
          {
            field: 'Partner Rate',
            originalValue: '$850/hour',
            proposedValue: '$800/hour',
            justification: 'Contract specifies $800/hour for partner work',
            requiresApproval: true
          },
          {
            field: 'Research Database Expense',
            originalValue: '$1,200',
            proposedValue: '$0',
            justification: 'Missing receipt - cannot verify expense legitimacy',
            requiresApproval: false
          }
        ]
      },
      attachments: [
        { name: 'Invoice_2024-001.pdf', type: 'PDF', size: '2.3 MB', url: '#invoice-001' },
        { name: 'Supporting_Docs_001.zip', type: 'ZIP', size: '15.7 MB', url: '#docs-001' },
        { name: 'Timekeeper_Logs_001.xlsx', type: 'Excel', size: '1.2 MB', url: '#logs-001' }
      ],
      timekeepers: [
        { name: 'John Smith', role: 'Partner', hours: 45, rate: 850, total: 38250 },
        { name: 'Sarah Johnson', role: 'Associate', hours: 32, rate: 650, total: 20800 },
        { name: 'Mike Davis', role: 'Paralegal', hours: 28, rate: 350, total: 9800 }
      ],
      expenses: [
        { description: 'Travel - New York', amount: 2500, receipt: true },
        { description: 'Research Database', amount: 1200, receipt: false },
        { description: 'Court Filing Fees', amount: 450, receipt: true }
      ],
      utbmsCodes: [
        { task: 'L100', activity: 'A100', expense: 'E100', description: 'Case Analysis' },
        { task: 'L200', activity: 'A200', expense: 'E200', description: 'Document Review' },
        { task: 'L300', activity: 'A300', expense: 'E300', description: 'Client Communication' }
      ]
    },
    {
      id: 'INV-2024-002',
      firm: 'Legal Partners Group',
      matter: 'Patent Litigation - Tech Inc',
      invoiceNumber: '2024-002',
      date: '2024-03-14',
      dateReceived: '2024-03-15',
      total: 89000,
      status: 'Approved',
      riskScore: 2.1,
      anomalies: 0,
      remarks: 'Clean invoice, no issues detected',
      mismatchDescription: 'None',
      agentAnalysis: 'AI Agent verified compliance with all policies',
      matchInvoice: 'INV-2024-018',
      attachments: [
        { name: 'Invoice_2024-002.pdf', type: 'PDF', size: '1.8 MB', url: '#invoice-002' },
        { name: 'Patent_Documents_002.pdf', type: 'PDF', size: '8.5 MB', url: '#patent-002' },
        { name: 'Court_Filings_002.pdf', type: 'PDF', size: '3.2 MB', url: '#court-002' }
      ],
      timekeepers: [
        { name: 'Lisa Chen', role: 'Partner', hours: 38, rate: 800, total: 30400 },
        { name: 'David Wilson', role: 'Associate', hours: 42, rate: 600, total: 25200 },
        { name: 'Emily Brown', role: 'Paralegal', hours: 35, rate: 320, total: 11200 }
      ],
      expenses: [
        { description: 'Expert Witness Fee', amount: 15000, receipt: true },
        { description: 'Court Reporter', amount: 800, receipt: true },
        { description: 'Travel - San Francisco', amount: 1800, receipt: true }
      ],
      utbmsCodes: [
        { task: 'L400', activity: 'A400', expense: 'E400', description: 'Expert Consultation' },
        { task: 'L500', activity: 'A500', expense: 'E500', description: 'Court Proceedings' },
        { task: 'L600', activity: 'A600', expense: 'E600', description: 'Research & Analysis' }
      ]
    },
    {
      id: 'INV-2024-003',
      firm: 'Corporate Counsel Solutions',
      matter: 'Employment Dispute - XYZ Corp',
      invoiceNumber: '2024-003',
      date: '2024-03-13',
      dateReceived: '2024-03-14',
      total: 156000,
      status: 'Rejected',
      riskScore: 8.9,
      anomalies: 5,
      remarks: 'Multiple policy violations detected',
      mismatchDescription: 'Weekend billing detected, missing UTBMS codes',
      agentAnalysis: 'AI Agent flagged 5 critical compliance issues',
      matchInvoice: 'INV-2024-022',
      humanIntervention: {
        required: true,
        type: 'Weekend Billing & UTBMS Issues',
        priority: 'Critical',
        assignedTo: 'Compliance Manager',
        deadline: '2024-03-22',
        status: 'In Progress',
        notes: 'Weekend billing requires special approval. UTBMS codes need manual verification and correction.',
        manualCorrections: [
          {
            field: 'Weekend Hours',
            originalValue: '12 hours (Saturday/Sunday)',
            proposedValue: '8 hours (Saturday only)',
            justification: 'Sunday billing not approved. Saturday hours need justification.',
            requiresApproval: true
          },
          {
            field: 'UTBMS Codes',
            originalValue: 'Missing for 3 line items',
            proposedValue: 'L700-A700-E700 for all items',
            justification: 'Standard employment law coding required',
            requiresApproval: false
          },
          {
            field: 'Expert Consultation Fee',
            originalValue: '$78,000',
            proposedValue: '$65,000',
            justification: 'Fee exceeds approved budget by $13,000',
            requiresApproval: true
          }
        ]
      },
      attachments: [
        { name: 'Invoice_2024-003.pdf', type: 'PDF', size: '2.1 MB', url: '#invoice-003' },
        { name: 'Employment_Records_003.pdf', type: 'PDF', size: '12.3 MB', url: '#records-003' },
        { name: 'Policy_Violations_003.docx', type: 'Word', size: '856 KB', url: '#violations-003' }
      ],
      timekeepers: [
        { name: 'Robert Martinez', role: 'Partner', hours: 52, rate: 875, total: 45500 },
        { name: 'Jennifer Lee', role: 'Associate', hours: 48, rate: 675, total: 32400 }
      ],
      expenses: [
        { description: 'Expert Consultation', amount: 78000, receipt: true },
        { description: 'Court Fees', amount: 1100, receipt: true }
      ],
      utbmsCodes: [
        { task: 'L700', activity: 'A700', expense: 'E700', description: 'Employment Law' }
      ]
    },
    {
      id: 'INV-2024-004',
      firm: 'Intellectual Property Law',
      matter: 'Trademark Registration - Brand Corp',
      invoiceNumber: '2024-004',
      date: '2024-03-12',
      dateReceived: '2024-03-13',
      total: 45000,
      status: 'Approved',
      riskScore: 1.8,
      anomalies: 0,
      remarks: 'Standard trademark work, compliant',
      mismatchDescription: 'None',
      agentAnalysis: 'AI Agent verified all charges are within policy',
      matchInvoice: 'INV-2024-025',
      attachments: [
        { name: 'Invoice_2024-004.pdf', type: 'PDF', size: '1.5 MB', url: '#invoice-004' },
        { name: 'Trademark_Application_004.pdf', type: 'PDF', size: '4.2 MB', url: '#trademark-004' },
        { name: 'USPTO_Correspondence_004.pdf', type: 'PDF', size: '2.8 MB', url: '#uspto-004' }
      ],
      timekeepers: [
        { name: 'Michael Chang', role: 'Partner', hours: 25, rate: 800, total: 20000 },
        { name: 'Amanda Foster', role: 'Associate', hours: 40, rate: 625, total: 25000 }
      ],
      expenses: [
        { description: 'USPTO Filing', amount: 0, receipt: true }
      ],
      utbmsCodes: [
        { task: 'L800', activity: 'A800', expense: 'E800', description: 'Trademark Work' }
      ]
    },
    {
      id: 'INV-2024-005',
      firm: 'Environmental Law Associates',
      matter: 'EPA Compliance - Green Corp',
      invoiceNumber: '2024-005',
      date: '2024-03-11',
      dateReceived: '2024-03-12',
      total: 89000,
      status: 'Under Review',
      riskScore: 6.7,
      anomalies: 2,
      remarks: 'Rate discrepancies detected',
      mismatchDescription: 'Associate rate exceeds 2024 contracted rate by $25',
      agentAnalysis: 'AI Agent detected rate violations and missing receipts',
      matchInvoice: 'INV-2024-028',
      attachments: [
        { name: 'Invoice_2024-005.pdf', type: 'PDF', size: '2.7 MB', url: '#invoice-005' },
        { name: 'EPA_Compliance_Report_005.pdf', type: 'PDF', size: '18.9 MB', url: '#epa-005' },
        { name: 'Environmental_Testing_005.pdf', type: 'PDF', size: '6.4 MB', url: '#testing-005' }
      ],
      timekeepers: [
        { name: 'Sarah Thompson', role: 'Partner', hours: 35, rate: 850, total: 29750 },
        { name: 'James Wilson', role: 'Associate', hours: 45, rate: 675, total: 30375 },
        { name: 'Lisa Rodriguez', role: 'Paralegal', hours: 42, rate: 375, total: 15750 }
      ],
      expenses: [
        { description: 'Environmental Testing', amount: 13125, receipt: false }
      ],
      utbmsCodes: [
        { task: 'L900', activity: 'A900', expense: 'E900', description: 'Environmental Law' }
      ]
    },
    {
      id: 'INV-2024-006',
      firm: 'Tax Law Partners',
      matter: 'IRS Audit Defense - Tax Corp',
      invoiceNumber: '2024-006',
      date: '2024-03-10',
      dateReceived: '2024-03-11',
      total: 125000,
      status: 'Approved',
      riskScore: 2.3,
      anomalies: 0,
      remarks: 'Complex tax work, properly documented',
      mismatchDescription: 'None',
      agentAnalysis: 'AI Agent verified compliance with tax law policies',
      matchInvoice: 'INV-2024-031',
      attachments: [
        { name: 'Invoice_2024-006.pdf', type: 'PDF', size: '2.9 MB', url: '#invoice-006' },
        { name: 'Tax_Returns_006.pdf', type: 'PDF', size: '25.3 MB', url: '#tax-006' },
        { name: 'IRS_Correspondence_006.pdf', type: 'PDF', size: '8.7 MB', url: '#irs-006' }
      ],
      timekeepers: [
        { name: 'David Kim', role: 'Partner', hours: 60, rate: 900, total: 54000 },
        { name: 'Rachel Green', role: 'Senior Associate', hours: 55, rate: 750, total: 41250 },
        { name: 'Tom Anderson', role: 'Associate', hours: 40, rate: 650, total: 26000 }
      ],
      expenses: [
        { description: 'Tax Research Database', amount: 3750, receipt: true }
      ],
      utbmsCodes: [
        { task: 'L1000', activity: 'A1000', expense: 'E1000', description: 'Tax Law' }
      ]
    },
    {
      id: 'INV-2024-007',
      firm: 'Real Estate Law Group',
      matter: 'Property Acquisition - Real Corp',
      invoiceNumber: '2024-007',
      date: '2024-03-09',
      dateReceived: '2024-03-10',
      total: 67000,
      status: 'Under Review',
      riskScore: 5.4,
      anomalies: 2,
      remarks: 'Missing documentation for expenses',
      mismatchDescription: 'Travel expenses missing receipts, rates within range',
      agentAnalysis: 'AI Agent flagged missing receipts and documentation gaps',
      matchInvoice: 'INV-2024-034',
      attachments: [
        { name: 'Invoice_2024-007.pdf', type: 'PDF', size: '2.1 MB', url: '#invoice-007' },
        { name: 'Property_Documents_007.pdf', type: 'PDF', size: '32.1 MB', url: '#property-007' },
        { name: 'Title_Search_007.pdf', type: 'PDF', size: '5.6 MB', url: '#title-007' }
      ],
      timekeepers: [
        { name: 'Patricia Brown', role: 'Partner', hours: 30, rate: 800, total: 24000 },
        { name: 'Kevin Johnson', role: 'Associate', hours: 50, rate: 650, total: 32500 },
        { name: 'Maria Garcia', role: 'Paralegal', hours: 30, rate: 350, total: 10500 }
      ],
      expenses: [
        { description: 'Title Search', amount: 0, receipt: true },
        { description: 'Travel - Site Visit', amount: 0, receipt: false }
      ],
      utbmsCodes: [
        { task: 'L1100', activity: 'A1100', expense: 'E1100', description: 'Real Estate' }
      ]
    },
    {
      id: 'INV-2024-008',
      firm: 'Healthcare Law Associates',
      matter: 'HIPAA Compliance - Health Corp',
      invoiceNumber: '2024-008',
      date: '2024-03-08',
      dateReceived: '2024-03-09',
      total: 78000,
      status: 'Approved',
      riskScore: 1.9,
      anomalies: 0,
      remarks: 'Healthcare compliance work, properly documented',
      mismatchDescription: 'None',
      agentAnalysis: 'AI Agent verified HIPAA compliance documentation',
      matchInvoice: 'INV-2024-037',
      attachments: [
        { name: 'Invoice_2024-008.pdf', type: 'PDF', size: '2.4 MB', url: '#invoice-008' },
        { name: 'HIPAA_Audit_Report_008.pdf', type: 'PDF', size: '14.7 MB', url: '#hipaa-008' },
        { name: 'Compliance_Checklist_008.xlsx', type: 'Excel', size: '2.1 MB', url: '#checklist-008' }
      ],
      timekeepers: [
        { name: 'Dr. Susan Miller', role: 'Partner', hours: 40, rate: 850, total: 34000 },
        { name: 'Alex Turner', role: 'Associate', hours: 55, rate: 650, total: 35750 },
        { name: 'Jordan Smith', role: 'Paralegal', hours: 25, rate: 330, total: 8250 }
      ],
      expenses: [
        { description: 'Compliance Software', amount: 0, receipt: true }
      ],
      utbmsCodes: [
        { task: 'L1200', activity: 'A1200', expense: 'E1200', description: 'Healthcare Law' }
      ]
    },
    {
      id: 'INV-2024-009',
      firm: 'Securities Law Partners',
      matter: 'SEC Investigation - Finance Corp',
      invoiceNumber: '2024-009',
      date: '2024-03-07',
      dateReceived: '2024-03-08',
      total: 189000,
      status: 'Under Review',
      riskScore: 7.8,
      anomalies: 4,
      remarks: 'Complex securities investigation, high-value work',
      mismatchDescription: 'Weekend and holiday billing detected',
      agentAnalysis: 'AI Agent flagged billing policy violations',
      matchInvoice: 'INV-2024-040',
      humanIntervention: {
        required: true,
        type: 'Holiday Billing & Software Expense',
        priority: 'Medium',
        assignedTo: 'Finance Director',
        deadline: '2024-03-28',
        status: 'Pending Review',
        notes: 'Holiday billing needs executive approval. Software expense requires budget verification.',
        manualCorrections: [
          {
            field: 'Holiday Hours',
            originalValue: '16 hours (Christmas Eve/Day)',
            proposedValue: '8 hours (Christmas Eve only)',
            justification: 'Christmas Day billing not approved. Christmas Eve hours need justification.',
            requiresApproval: true
          },
          {
            field: 'Financial Analysis Software',
            originalValue: '$47,200',
            proposedValue: '$35,000',
            justification: 'Software cost exceeds approved budget. Need to negotiate with vendor.',
            requiresApproval: true
          }
        ]
      },
      attachments: [
        { name: 'Invoice_2024-009.pdf', type: 'PDF', size: '3.2 MB', url: '#invoice-009' },
        { name: 'SEC_Investigation_009.pdf', type: 'PDF', size: '45.8 MB', url: '#sec-009' },
        { name: 'Financial_Records_009.xlsx', type: 'Excel', size: '8.9 MB', url: '#financial-009' }
      ],
      timekeepers: [
        { name: 'Mark Stevens', role: 'Partner', hours: 65, rate: 950, total: 61750 },
        { name: 'Lisa Wang', role: 'Senior Associate', hours: 58, rate: 775, total: 44950 },
        { name: 'Chris Rodriguez', role: 'Associate', hours: 52, rate: 675, total: 35100 }
      ],
      expenses: [
        { description: 'Financial Analysis Software', amount: 47200, receipt: true },
        { description: 'Expert Witness Fees', amount: 0, receipt: true }
      ],
      utbmsCodes: [
        { task: 'L1300', activity: 'A1300', expense: 'E1300', description: 'Securities Law' }
      ]
    }
  ]
};

// CSS Animations
const shimmerAnimation = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

function LegalAndCounselAgentDialog({ open, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [invoiceAnalysis, setInvoiceAnalysis] = useState(null);
  const [isAnalyzingInvoice, setIsAnalyzingInvoice] = useState(false);
  const [selectedInvoiceType, setSelectedInvoiceType] = useState('brightflag');
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState('');
  const [analysisSteps, setAnalysisSteps] = useState([]);
  const [selectedInvoiceForAnalysis, setSelectedInvoiceForAnalysis] = useState(null);
  const [showInvoiceAnalysisReport, setShowInvoiceAnalysisReport] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showAttachmentsDialog, setShowAttachmentsDialog] = useState(false);
  const [showHumanInterventionDialog, setShowHumanInterventionDialog] = useState(false);
  const [selectedInterventionInvoice, setSelectedInterventionInvoice] = useState(null);
  const [interventionNotes, setInterventionNotes] = useState('');
  const [correctionApprovals, setCorrectionApprovals] = useState({});
  const [isProcessingIntervention, setIsProcessingIntervention] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
    setShowAttachmentsDialog(true);
  };

  const handleHumanInterventionClick = (invoice) => {
    setSelectedInterventionInvoice(invoice);
    setInterventionNotes(invoice.humanIntervention?.notes || '');
    setCorrectionApprovals({});
    setShowHumanInterventionDialog(true);
  };

  const handleProcessIntervention = () => {
    setIsProcessingIntervention(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessingIntervention(false);
      setShowHumanInterventionDialog(false);
      
      // Update the invoice status
      if (selectedInterventionInvoice) {
        const updatedInvoice = {
          ...selectedInterventionInvoice,
          humanIntervention: {
            ...selectedInterventionInvoice.humanIntervention,
            status: 'Completed',
            completedDate: new Date().toISOString().split('T')[0],
            completedBy: 'Current User',
            finalNotes: interventionNotes
          }
        };
        
        // In a real app, you would update the invoice in your data store
        console.log('Human intervention completed:', updatedInvoice);
      }
    }, 2000);
  };

  const generateAndDownloadInvoice = (invoice) => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Invoice ${invoice.invoiceNumber}`,
      subject: `Legal Services - ${invoice.matter}`,
      author: invoice.firm,
      creator: 'CostCare AI System'
    });

    // Header
    doc.setFontSize(24);
    doc.setTextColor(44, 62, 80);
    doc.text('INVOICE', 105, 30, { align: 'center' });
    
    // Company Logo/Header
    doc.setFontSize(12);
    doc.setTextColor(52, 73, 94);
    doc.text('CostCare Legal Services', 20, 50);
    doc.text('123 Legal Street, Suite 100', 20, 57);
    doc.text('New York, NY 10001', 20, 64);
    doc.text('Phone: (555) 123-4567', 20, 71);
    doc.text('Email: legal@costcare.com', 20, 78);

    // Invoice Details
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Invoice Details', 20, 100);
    
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 20, 110);
    doc.text(`Date: ${invoice.date}`, 20, 117);
    doc.text(`Date Received: ${invoice.dateReceived}`, 20, 124);
    doc.text(`Status: ${invoice.status}`, 20, 131);
    doc.text(`Risk Score: ${invoice.riskScore}/10`, 20, 138);

    // Client Information
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Client Information', 20, 160);
    
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    doc.text(`Firm: ${invoice.firm}`, 20, 170);
    doc.text(`Matter: ${invoice.matter}`, 20, 177);

    // Timekeeper Details
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Timekeeper Details', 20, 200);
    
    let yPos = 210;
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    
    // Table headers
    doc.setFillColor(52, 73, 94);
    doc.setTextColor(255, 255, 255);
    doc.rect(20, yPos - 5, 170, 8, 'F');
    doc.text('Name', 25, yPos);
    doc.text('Role', 70, yPos);
    doc.text('Hours', 120, yPos);
    doc.text('Rate', 140, yPos);
    doc.text('Total', 160, yPos);
    
    yPos += 15;
    doc.setTextColor(52, 73, 94);
    
    invoice.timekeepers.forEach((timekeeper) => {
      doc.text(timekeeper.name, 25, yPos);
      doc.text(timekeeper.role, 70, yPos);
      doc.text(timekeeper.hours.toString(), 120, yPos);
      doc.text(`$${timekeeper.rate}`, 140, yPos);
      doc.text(`$${timekeeper.total.toLocaleString()}`, 160, yPos);
      yPos += 10;
    });

    // Expenses
    if (invoice.expenses && invoice.expenses.length > 0) {
      yPos += 10;
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text('Expenses', 20, yPos);
      
      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(52, 73, 94);
      
      // Expense table headers
      doc.setFillColor(52, 73, 94);
      doc.setTextColor(255, 255, 255);
      doc.rect(20, yPos - 5, 170, 8, 'F');
      doc.text('Description', 25, yPos);
      doc.text('Amount', 140, yPos);
      doc.text('Receipt', 160, yPos);
      
      yPos += 15;
      doc.setTextColor(52, 73, 94);
      
      invoice.expenses.forEach((expense) => {
        doc.text(expense.description, 25, yPos);
        doc.text(`$${expense.amount.toLocaleString()}`, 140, yPos);
        doc.text(expense.receipt ? 'Yes' : 'No', 160, yPos);
        yPos += 10;
      });
    }

    // UTBMS Codes
    if (invoice.utbmsCodes && invoice.utbmsCodes.length > 0) {
      yPos += 10;
      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text('UTBMS Codes', 20, yPos);
      
      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(52, 73, 94);
      
      invoice.utbmsCodes.forEach((code) => {
        doc.text(`${code.task}-${code.activity}-${code.expense}: ${code.description}`, 25, yPos);
        yPos += 8;
      });
    }

    // AI Analysis Summary
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('AI Analysis Summary', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(52, 73, 94);
    doc.text(`Agent Analysis: ${invoice.agentAnalysis}`, 25, yPos);
    yPos += 8;
    doc.text(`Anomalies Detected: ${invoice.anomalies}`, 25, yPos);
    yPos += 8;
    doc.text(`Risk Score: ${invoice.riskScore}/10`, 25, yPos);
    yPos += 8;
    doc.text(`Remarks: ${invoice.remarks}`, 25, yPos);

    // Total Amount
    yPos += 15;
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('Total Amount', 140, yPos);
    doc.setFontSize(18);
    doc.setTextColor(231, 76, 60);
    doc.text(`$${invoice.total.toLocaleString()}`, 140, yPos + 10);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(149, 165, 166);
    doc.text('Generated by CostCare AI System', 105, 280, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 285, { align: 'center' });

    // Save the PDF
    doc.save(`Invoice_${invoice.invoiceNumber}_${invoice.firm.replace(/\s+/g, '_')}.pdf`);
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const startInvoiceAnalysis = () => {
    setShowAnalysisPopup(true);
    setAnalysisProgress(0);
    setCurrentAnalysisStep('');
    setAnalysisSteps([]);
    
    // Define analysis steps
    const steps = [
      { name: 'Policy Book & Billing Guidelines', icon: '📚', duration: 2000 },
      { name: 'Rate Cards & Timekeeper Master', icon: '💰', duration: 1500 },
      { name: 'Matter Master Data', icon: '📋', duration: 1800 },
      { name: 'Historical Invoice Records', icon: '📊', duration: 2200 },
      { name: 'Anomaly Detection & Analysis', icon: '🔍', duration: 2500 },
      { name: 'Generating Recommendations', icon: '💡', duration: 1500 }
    ];
    
    setAnalysisSteps(steps);
    
    let currentStepIndex = 0;
    let totalProgress = 0;
    
    const runAnalysis = () => {
      if (currentStepIndex >= steps.length) {
        // Analysis complete
        setTimeout(() => {
          setShowAnalysisPopup(false);
          setIsAnalyzingInvoice(false);
          // Generate comprehensive analysis results
          setInvoiceAnalysis({
            status: 'completed',
            riskScore: 7.2,
            anomalies: [
              { 
                type: 'Rate Mismatch', 
                description: 'Partner rate exceeds contracted rate by $50', 
                severity: 'high', 
                confidence: 0.95, 
                policyReference: 'Section 3.2 - Rate Compliance', 
                savings: 2250,
                lineItems: ['Partner hours - 45 hours', 'Associate hours - 32 hours'],
                impact: 'High financial impact on invoice total'
              },
              { 
                type: 'Missing Receipt', 
                description: 'Research Database expense missing receipt', 
                severity: 'medium', 
                confidence: 0.88, 
                policyReference: 'Section 4.1 - Receipt Requirements', 
                savings: 1200,
                lineItems: ['Travel expenses', 'Research database costs'],
                impact: 'Cannot verify expense legitimacy'
              },
              { 
                type: 'Weekend Billing', 
                description: 'Hours billed on Saturday detected', 
                severity: 'high', 
                confidence: 0.92, 
                policyReference: 'Section 2.3 - Billing Hours Policy', 
                savings: 1800,
                lineItems: ['Saturday hours - 8 hours', 'Sunday hours - 4 hours'],
                impact: 'Violates company weekend billing policy'
              },
              { 
                type: 'UTBMS Code Missing', 
                description: 'Line item missing required UTBMS codes', 
                severity: 'medium', 
                confidence: 0.85, 
                policyReference: 'Section 5.2 - UTBMS Requirements', 
                savings: 800,
                lineItems: ['Document review activities', 'Client communication'],
                impact: 'Insufficient coding for audit purposes'
              },
              { 
                type: 'Excessive Travel Expense', 
                description: 'First class upgrade without approval', 
                severity: 'high', 
                confidence: 0.90, 
                policyReference: 'Section 6.1 - Travel Policy', 
                savings: 1500,
                lineItems: ['First class upgrade', 'Hotel room upgrade'],
                impact: 'Exceeds approved travel budget'
              }
            ],
            adjustments: {
              rateCorrections: -2250,
              disallowedExpenses: -1200,
              weekendBillingAdjustments: -1800,
              utbmsAdjustments: -800,
              travelAdjustments: -1500,
              totalAdjustments: -7550,
              adjustedTotal: 117450
            },
            complianceScore: 72.4,
            policyCompliance: {
              rateCompliance: 85.2,
              receiptCompliance: 78.6,
              timeCompliance: 92.1,
              utbmsCompliance: 88.3,
              travelCompliance: 76.8
            },
            recommendations: [
              'Request rate correction for Partner hours (Policy: Section 3.2)',
              'Obtain receipt for Research Database expense (Policy: Section 4.1)',
              'Review weekend billing justification (Policy: Section 2.3)',
              'Verify UTBMS code accuracy (Policy: Section 5.2)',
              'Approve travel expenses in advance (Policy: Section 6.1)',
              'Implement automated compliance monitoring',
              'Provide training on billing guidelines'
            ],
            savingsBreakdown: {
              rateViolations: 2250,
              missingReceipts: 1200,
              policyViolations: 1800,
              codingErrors: 800,
              travelViolations: 1500
            }
          });
        }, 1000);
        return;
      }
      
      const step = steps[currentStepIndex];
      setCurrentAnalysisStep(step.name);
      
      // Animate progress for this step
      const stepProgress = 100 / steps.length;
      const startProgress = totalProgress;
      const endProgress = Math.min(startProgress + stepProgress, 100); // Ensure we don't exceed 100%
      
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= endProgress) {
            clearInterval(progressInterval);
            currentStepIndex++;
            totalProgress = endProgress;
            setTimeout(runAnalysis, 500); // Brief pause between steps
            return prev;
          }
          return Math.min(prev + 0.5, endProgress); // Ensure we don't exceed the step limit
        });
      }, 25);
      
    };
    
    runAnalysis();
  };

  const generateInvoiceAnalysisReport = (invoice) => {
    console.log('generateInvoiceAnalysisReport called with invoice:', invoice);
    setSelectedInvoiceForAnalysis(invoice);
    setShowInvoiceAnalysisReport(true);
    
    // Generate comprehensive analysis for the selected invoice
    const analysis = {
      invoice: invoice,
      analysisDate: new Date().toISOString().split('T')[0],
      riskScore: invoice.riskScore,
      complianceScore: Math.max(20, 100 - (invoice.riskScore * 8)),
      anomalies: [
        {
          type: 'Rate Mismatch',
          description: `Partner rate exceeds contracted rate by $${Math.floor(Math.random() * 100 + 50)}`,
          severity: 'high',
          confidence: 0.95,
          policyReference: 'Section 3.2 - Rate Compliance',
          savings: Math.floor(Math.random() * 2000 + 1000),
          lineItems: ['Partner hours - 45 hours', 'Associate hours - 32 hours'],
          impact: 'High financial impact on invoice total'
        },
        {
          type: 'Missing Receipts',
          description: 'Expense items missing required receipts',
          severity: 'medium',
          confidence: 0.88,
          policyReference: 'Section 4.1 - Receipt Requirements',
          savings: Math.floor(Math.random() * 800 + 400),
          lineItems: ['Travel expenses', 'Research database costs'],
          impact: 'Cannot verify expense legitimacy'
        },
        {
          type: 'Weekend Billing',
          description: 'Hours billed on weekends detected',
          severity: 'high',
          confidence: 0.92,
          policyReference: 'Section 2.3 - Billing Hours Policy',
          savings: Math.floor(Math.random() * 1500 + 800),
          lineItems: ['Saturday hours - 8 hours', 'Sunday hours - 4 hours'],
          impact: 'Violates company weekend billing policy'
        },
        {
          type: 'UTBMS Code Missing',
          description: 'Line items missing required UTBMS codes',
          severity: 'medium',
          confidence: 0.85,
          policyReference: 'Section 5.2 - UTBMS Requirements',
          savings: Math.floor(Math.random() * 600 + 300),
          lineItems: ['Document review activities', 'Client communication'],
          impact: 'Insufficient coding for audit purposes'
        }
      ],
      adjustments: {
        rateCorrections: -Math.floor(Math.random() * 2000 + 1000),
        disallowedExpenses: -Math.floor(Math.random() * 800 + 400),
        weekendBillingAdjustments: -Math.floor(Math.random() * 1500 + 800),
        utbmsAdjustments: -Math.floor(Math.random() * 600 + 300),
        totalAdjustments: 0,
        adjustedTotal: 0
      },
      recommendations: [
        'Request rate correction for Partner hours (Policy: Section 3.2)',
        'Obtain receipts for all expense items (Policy: Section 4.1)',
        'Review weekend billing justification (Policy: Section 2.3)',
        'Add UTBMS codes to all line items (Policy: Section 5.2)',
        'Implement automated compliance monitoring',
        'Provide training on billing guidelines',
        'Establish pre-approval process for weekend work'
      ],
      policyCompliance: {
        rateCompliance: Math.floor(Math.random() * 30 + 70),
        receiptCompliance: Math.floor(Math.random() * 40 + 60),
        timeCompliance: Math.floor(Math.random() * 20 + 80),
        utbmsCompliance: Math.floor(Math.random() * 35 + 65)
      },
      savingsBreakdown: {
        rateViolations: Math.floor(Math.random() * 2000 + 1000),
        missingReceipts: Math.floor(Math.random() * 800 + 400),
        policyViolations: Math.floor(Math.random() * 1500 + 800),
        codingErrors: Math.floor(Math.random() * 600 + 300)
      }
    };
    
    // Calculate totals
    analysis.adjustments.totalAdjustments = 
      analysis.adjustments.rateCorrections + 
      analysis.adjustments.disallowedExpenses + 
      analysis.adjustments.weekendBillingAdjustments + 
      analysis.adjustments.utbmsAdjustments;
    
    analysis.adjustments.adjustedTotal = invoice.total + analysis.adjustments.totalAdjustments;
    
    setInvoiceAnalysis(analysis);
    console.log('Invoice analysis set:', analysis);
    console.log('State - selectedInvoiceForAnalysis:', invoice);
    console.log('State - showInvoiceAnalysisReport:', true);
  };

  const renderDashboard = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Legal & Compliance Dashboard
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {LEGAL_DATA.summary.totalCases}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Cases
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {LEGAL_DATA.summary.highRiskCases}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                High Risk Cases
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {LEGAL_DATA.summary.complianceRate}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Compliance Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {LEGAL_DATA.summary.riskScore}/10
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Risk Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Regulatory Areas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Regulatory Risk Areas
              </Typography>
              <Box sx={{ mt: 2 }}>
                {LEGAL_DATA.regulatoryAreas.map((area, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{area.name}</Typography>
                      <Chip 
                        label={area.risk} 
                        size="small"
                        color={area.risk === 'Low' ? 'success' : area.risk === 'Medium' ? 'warning' : 'error'}
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={area.value} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: area.color
                        }
                      }} 
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                High Risk Cases
              </Typography>
              <List>
                {LEGAL_DATA.highRiskCases.map((caseData) => (
                  <ListItem key={caseData.id}>
                    <ListItemIcon>
                      <WarningIcon color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={caseData.issue}
                      secondary={`${caseData.patientName} - ${caseData.deadline}`}
                    />
                    <Chip 
                      label={caseData.riskLevel} 
                      size="small"
                      color={caseData.riskLevel === 'Critical' ? 'error' : 'warning'}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderRegulatoryCompliance = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Regulatory Compliance Analysis
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                HIPAA Compliance
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Overall</Typography>
                  <Typography variant="body2" color="primary">94.2%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={94.2} 
                  sx={{ height: 8, borderRadius: 4, mb: 2 }} 
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Privacy</Typography>
                  <Typography variant="body2" color="primary">96.8%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={96.8} 
                  sx={{ height: 6, borderRadius: 3, mb: 2 }} 
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Security</Typography>
                  <Typography variant="body2" color="primary">91.5%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={91.5} 
                  sx={{ height: 6, borderRadius: 3 }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Medicare Compliance
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Overall</Typography>
                  <Typography variant="body2" color="primary">87.6%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={87.6} 
                  sx={{ height: 8, borderRadius: 4, mb: 2 }} 
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Billing</Typography>
                  <Typography variant="body2" color="primary">85.2%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={85.2} 
                  sx={{ height: 6, borderRadius: 3, mb: 2 }} 
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Documentation</Typography>
                  <Typography variant="body2" color="primary">89.1%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={89.1} 
                  sx={{ height: 6, borderRadius: 3 }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderDocumentReview = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Legal Document Review
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Document Analysis
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                placeholder="Paste legal document content here for AI analysis..."
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button 
                variant="contained" 
                startIcon={<AutoFixHighIcon />}
                onClick={startAnalysis}
                disabled={isAnalyzing}
                sx={{ mr: 2 }}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
              </Button>
              <Button variant="outlined" startIcon={<UploadIcon />}>
                Upload Document
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Analysis Results
              </Typography>
              {isAnalyzing ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Analyzing document for legal compliance...
                  </Typography>
                </Box>
              ) : analysisComplete ? (
                <Box>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Analysis Complete
                  </Alert>
                  <Typography variant="body2" color="text.secondary">
                    Document has been analyzed for:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="HIPAA Compliance" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Medicare Regulations" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <WarningIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary="State Law Compliance" />
                    </ListItem>
                  </List>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Paste a document to begin analysis
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderPolicyGuidance = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Policy Guidance & Recommendations
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Regulatory Updates
              </Typography>
              <List>
                {LEGAL_DATA.regulatoryUpdates.map((update) => (
                  <ListItem key={update.id}>
                    <ListItemIcon>
                      <InfoIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={update.title}
                      secondary={`${update.date} - ${update.impact} Impact`}
                    />
                    <Chip 
                      label={update.status} 
                      size="small"
                      color={update.status === 'Implementation Required' ? 'error' : 'warning'}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Compliance Recommendations
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <LightbulbIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Implement HIPAA Training Program"
                    secondary="Required for all staff by June 2024"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LightbulbIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Update Medicare Billing Procedures"
                    secondary="New codes effective April 2024"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LightbulbIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Review State Licensing Requirements"
                    secondary="Annual compliance check due"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderComplianceMonitoring = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Compliance Monitoring & Reporting
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Real-time Compliance Dashboard
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Select monitoring areas to view real-time compliance metrics and alerts
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<AssessmentIcon />}
                >
                  Generate Report
                </Button>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<NotificationsIcon />}
                >
                  Set Alerts
                </Button>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={<SettingsIcon />}
                >
                  Configure Rules
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderInvoiceChecker = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        External Counsel Invoice Checker
      </Typography>
      
      {/* Human Intervention Summary */}
      {INVOICE_DATA.sampleInvoices.filter(inv => inv.humanIntervention?.required).length > 0 && (
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', border: '2px solid #ff9800' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <PersonIcon sx={{ fontSize: 32, color: '#ff9800' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e65100' }}>
                Human Intervention Required
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {INVOICE_DATA.sampleInvoices.filter(inv => inv.humanIntervention?.required).length} invoices require manual review and correction. 
              These cases cannot be fully automated and need human expertise to resolve compliance issues.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {INVOICE_DATA.sampleInvoices.filter(inv => inv.humanIntervention?.required).map((invoice) => (
                <Chip
                  key={invoice.id}
                  label={`${invoice.invoiceNumber} - ${invoice.humanIntervention.type}`}
                  color="warning"
                  variant="outlined"
                  onClick={() => handleHumanInterventionClick(invoice)}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Invoice Upload Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Invoice Upload & Processing
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Invoice Source</InputLabel>
                <Select
                  value={selectedInvoiceType}
                  onChange={(e) => setSelectedInvoiceType(e.target.value)}
                  label="Invoice Source"
                >
                  <MenuItem value="brightflag">Brightflag Integration</MenuItem>
                  <MenuItem value="manual">Manual Upload</MenuItem>
                  <MenuItem value="ledes">LEDES1998B Format</MenuItem>
                  <MenuItem value="scanned">Scanned PDF/Image</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                fullWidth
                sx={{ height: 56 }}
              >
                Upload Invoice
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                startIcon={<AutoFixHighIcon />}
                fullWidth
                onClick={startInvoiceAnalysis}
                disabled={isAnalyzingInvoice}
                sx={{ height: 56 }}
              >
                {isAnalyzingInvoice ? 'Analyzing...' : 'Analyze Invoice'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Invoice Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {INVOICE_DATA.summary.totalInvoices.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Invoices
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 1 }}>
                ${(INVOICE_DATA.summary.totalValue / 1000000).toFixed(1)}M
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 1 }}>
                ${(INVOICE_DATA.summary.savingsIdentified / 1000).toFixed(0)}K
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Savings Identified
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {INVOICE_DATA.summary.averageProcessingTime}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Avg Processing Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {INVOICE_DATA.sampleInvoices.filter(inv => inv.humanIntervention?.required).length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Human Interventions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Invoice Analysis Results */}
      {invoiceAnalysis && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontSize: '1.5rem', fontWeight: 'bold' }}>
              🎯 AI Analysis Results Dashboard
            </Typography>
            
            {/* Risk Score and Compliance */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 3, 
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
                }}>
                  <Typography variant="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {invoiceAnalysis.riskScore}/10
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Risk Score
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {invoiceAnalysis.riskScore <= 3 ? 'Low Risk' : invoiceAnalysis.riskScore <= 6 ? 'Medium Risk' : 'High Risk'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 3, 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)'
                }}>
                  <Typography variant="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {invoiceAnalysis.complianceScore}%
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Compliance Score
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {invoiceAnalysis.complianceScore >= 80 ? 'Excellent' : invoiceAnalysis.complianceScore >= 60 ? 'Good' : 'Needs Improvement'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 3, 
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 25px rgba(67, 233, 123, 0.3)'
                }}>
                  <Typography variant="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    ${Math.abs(invoiceAnalysis.adjustments.totalAdjustments).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Potential Savings
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Through Compliance Adjustments
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 3, 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 25px rgba(240, 147, 251, 0.3)'
                }}>
                  <Typography variant="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {invoiceAnalysis.anomalies.length}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Issues Detected
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Compliance Violations Found
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Detected Anomalies */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4, fontSize: '1.3rem', fontWeight: 'bold' }}>
              🔍 Detected Anomalies & Compliance Violations
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {invoiceAnalysis.anomalies.map((anomaly, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card sx={{ 
                    border: `3px solid ${anomaly.severity === 'high' ? '#f44336' : '#ff9800'}`,
                    background: anomaly.severity === 'high' ? 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)' : 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                          {anomaly.type}
                        </Typography>
                        <Chip 
                          label={anomaly.severity.toUpperCase()} 
                          size="small"
                          color={anomaly.severity === 'high' ? 'error' : 'warning'}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                        {anomaly.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                          📚 Policy Reference:
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                          {anomaly.policyReference}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Confidence: {(anomaly.confidence * 100).toFixed(0)}%
                          </Typography>
                          <Box sx={{ 
                            width: 60, 
                            height: 4, 
                            bgcolor: 'rgba(0,0,0,0.1)', 
                            borderRadius: 2,
                            overflow: 'hidden'
                          }}>
                            <Box sx={{ 
                              width: `${anomaly.confidence * 100}%`, 
                              height: '100%', 
                              bgcolor: anomaly.severity === 'high' ? '#f44336' : '#ff9800',
                              borderRadius: 2
                            }} />
                          </Box>
                        </Box>
                        
                        <Box sx={{ 
                          textAlign: 'right',
                          p: 1,
                          bgcolor: anomaly.severity === 'high' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                          borderRadius: 2,
                          border: `1px solid ${anomaly.severity === 'high' ? '#f44336' : '#ff9800'}`
                        }}>
                          <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                            ${anomaly.savings?.toLocaleString() || '0'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Potential Savings
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Proposed Adjustments */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4, fontSize: '1.3rem', fontWeight: 'bold' }}>
              💰 Proposed Adjustments & Savings Breakdown
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={2}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                  borderRadius: 3,
                  boxShadow: '0 4px 15px rgba(255, 154, 158, 0.3)'
                }}>
                  <Typography variant="h5" color="error" sx={{ mb: 1, fontWeight: 'bold' }}>
                    ${Math.abs(invoiceAnalysis.adjustments.rateCorrections).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Rate Corrections
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Contract Violations
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                  borderRadius: 3,
                  boxShadow: '0 4px 15px rgba(168, 237, 234, 0.3)'
                }}>
                  <Typography variant="h5" color="error" sx={{ mb: 1, fontWeight: 'bold' }}>
                    ${Math.abs(invoiceAnalysis.adjustments.disallowedExpenses).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Disallowed Expenses
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Policy Violations
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                  borderRadius: 3,
                  boxShadow: '0 4px 15px rgba(255, 236, 210, 0.3)'
                }}>
                  <Typography variant="h5" color="error" sx={{ mb: 1, fontWeight: 'bold' }}>
                    ${Math.abs(invoiceAnalysis.adjustments.weekendBillingAdjustments || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Weekend Billing
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Time Policy
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
                  borderRadius: 3,
                  boxShadow: '0 4px 15px rgba(210, 153, 194, 0.3)'
                }}>
                  <Typography variant="h5" color="error" sx={{ mb: 1, fontWeight: 'bold' }}>
                    ${Math.abs(invoiceAnalysis.adjustments.utbmsAdjustments || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    UTBMS Errors
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Coding Issues
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
                  borderRadius: 3,
                  boxShadow: '0 4px 15px rgba(137, 247, 254, 0.3)'
                }}>
                  <Typography variant="h5" color="error" sx={{ mb: 1, fontWeight: 'bold' }}>
                    ${Math.abs(invoiceAnalysis.adjustments.travelAdjustments || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Travel Adjustments
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Policy Violations
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}>
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                    ${Math.abs(invoiceAnalysis.adjustments.totalAdjustments).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Total Adjustments
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Overall Savings
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Final Totals */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  color: 'white',
                  borderRadius: 3
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Original Total: ${(invoiceAnalysis.adjustments.adjustedTotal + Math.abs(invoiceAnalysis.adjustments.totalAdjustments)).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Before Adjustments
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  borderRadius: 3
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Adjusted Total: ${invoiceAnalysis.adjustments.adjustedTotal.toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      After Compliance Adjustments
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* AI Recommendations */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4, fontSize: '1.3rem', fontWeight: 'bold' }}>
              💡 AI-Generated Recommendations & Action Items
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {invoiceAnalysis.recommendations.map((rec, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%', 
                          backgroundColor: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '1.2rem',
                          flexShrink: 0
                        }}>
                          💡
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Recommendation #{index + 1}
                          </Typography>
                          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            {rec}
                          </Typography>
                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Chip 
                              label="High Priority" 
                              size="small" 
                              color="error" 
                              variant="outlined"
                            />
                            <Chip 
                              label="Policy Compliance" 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Policy Compliance Breakdown */}
            {invoiceAnalysis.policyCompliance && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                  📊 Policy Compliance Breakdown
                </Typography>
                <Grid container spacing={3}>
                  {Object.entries(invoiceAnalysis.policyCompliance).map(([policy, score]) => (
                    <Grid item xs={12} sm={6} md={4} key={policy}>
                      <Card sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: 3
                      }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                            {score}%
                          </Typography>
                          <Typography variant="body1" sx={{ opacity: 0.9, textTransform: 'capitalize' }}>
                            {policy.replace(/([A-Z])/g, ' $1').trim()}
                          </Typography>
                          <Box sx={{ 
                            mt: 2, 
                            width: '100%', 
                            height: 8, 
                            backgroundColor: 'rgba(255,255,255,0.2)', 
                            borderRadius: 4,
                            overflow: 'hidden'
                          }}>
                            <Box sx={{ 
                              width: `${score}%`, 
                              height: '100%', 
                              background: score >= 80 ? 'linear-gradient(90deg, #4caf50, #8bc34a)' : 
                                         score >= 60 ? 'linear-gradient(90deg, #ff9800, #ffc107)' : 
                                         'linear-gradient(90deg, #f44336, #e91e63)',
                              borderRadius: 4
                            }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="contained" color="success" startIcon={<CheckCircleIcon />}>
                Approve Invoice
              </Button>
              <Button variant="outlined" color="error" startIcon={<WarningIcon />}>
                Request Clarification
              </Button>
              <Button variant="outlined" startIcon={<DescriptionIcon />}>
                Download Report
              </Button>
              <Button variant="outlined" startIcon={<AutoFixHighIcon />}>
                Generate Email
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Recent Invoices Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Recent Invoices - Comprehensive Analysis
          </Typography>
          
          {/* Table Controls */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search invoices..."
              sx={{ minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status Filter</InputLabel>
              <Select label="Status Filter" defaultValue="all">
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Risk Level</InputLabel>
              <Select label="Risk Level" defaultValue="all">
                <MenuItem value="all">All Risk Levels</MenuItem>
                <MenuItem value="low">Low (0-3)</MenuItem>
                <MenuItem value="medium">Medium (4-6)</MenuItem>
                <MenuItem value="high">High (7-10)</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Intervention Type</InputLabel>
              <Select label="Intervention Type" defaultValue="all">
                <MenuItem value="all">All Invoices</MenuItem>
                <MenuItem value="human">Human Intervention Required</MenuItem>
                <MenuItem value="automated">Automated Processing</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" size="small" startIcon={<AutoFixHighIcon />}>
              Export Data
            </Button>
          </Box>

          {/* Amazing Table */}
          <Box sx={{ overflowX: 'auto' }}>
            <Box
              component="table"
              sx={{
                width: '100%',
                borderCollapse: 'collapse',
                '& th, & td': {
                  border: '1px solid #e0e0e0',
                  padding: '12px 8px',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                },
                '& th': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontWeight: 600,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                },
                '& tr:nth-of-type(even)': {
                  backgroundColor: '#fafafa',
                },
                '& tr:hover': {
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer',
                },
              }}
            >
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Firm</th>
                  <th>Matter</th>
                  <th>Date</th>
                  <th>Date Received</th>
                  <th>Total ($)</th>
                  <th>Status</th>
                  <th>Risk Score</th>
                  <th>Anomalies</th>
                  <th>Remarks</th>
                  <th>Mismatch Description</th>
                  <th>Agent Analysis</th>
                  <th>Match Invoice</th>
                  <th>Human Intervention</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {INVOICE_DATA.sampleInvoices.map((invoice) => (
                  <tr 
                    key={invoice.id}
                    style={{
                      backgroundColor: invoice.humanIntervention?.required ? 'rgba(255, 152, 0, 0.05)' : 'inherit',
                      borderLeft: invoice.humanIntervention?.required ? '4px solid #ff9800' : 'inherit',
                    }}
                  >
                    <td>
                      <Tooltip
                        title={
                          <Box sx={{ p: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'white' }}>
                              Invoice Attachments
                            </Typography>
                            {invoice.attachments && invoice.attachments.length > 0 ? (
                              <Box>
                                {invoice.attachments.map((attachment, index) => (
                                  <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        backgroundColor: 
                                          attachment.type === 'PDF' ? '#f44336' :
                                          attachment.type === 'Excel' ? '#4caf50' :
                                          attachment.type === 'Word' ? '#2196f3' :
                                          attachment.type === 'ZIP' ? '#ff9800' : '#9e9e9e'
                                      }}
                                    />
                                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 500 }}>
                                      {attachment.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', ml: 'auto' }}>
                                      {attachment.size}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            ) : (
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                No attachments available
                              </Typography>
                            )}
                          </Box>
                        }
                        arrow
                        placement="top-start"
                        PopperProps={{
                          sx: {
                            '& .MuiTooltip-tooltip': {
                              backgroundColor: 'rgba(0,0,0,0.9)',
                              maxWidth: 400,
                              fontSize: '0.75rem'
                            }
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography 
                            variant="body2" 
                            fontWeight="600" 
                            color="primary"
                            onClick={() => handleInvoiceClick(invoice)}
                            sx={{ 
                              cursor: 'pointer',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            {invoice.invoiceNumber}
                          </Typography>
                          {invoice.attachments && invoice.attachments.length > 0 && (
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.6rem',
                                fontWeight: 'bold'
                              }}
                            >
                              {invoice.attachments.length}
                            </Box>
                          )}
                        </Box>
                      </Tooltip>
                    </td>
                    <td>
                      <Typography variant="body2" fontWeight="500">
                        {invoice.firm}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {invoice.matter}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body2" color="text.secondary">
                        {invoice.date}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body2" color="text.secondary">
                        {invoice.dateReceived}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body2" fontWeight="600" color="primary">
                        ${invoice.total.toLocaleString()}
                      </Typography>
                    </td>
                    <td>
                      <Chip 
                        label={invoice.status} 
                        size="small"
                        color={
                          invoice.status === 'Approved' ? 'success' : 
                          invoice.status === 'Rejected' ? 'error' : 'warning'
                        }
                        sx={{ fontWeight: 500 }}
                      />
                    </td>
                    <td>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            backgroundColor: 
                              invoice.riskScore <= 3 ? '#4caf50' :
                              invoice.riskScore <= 6 ? '#ff9800' : '#f44336'
                          }}
                        >
                          {invoice.riskScore}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          /10
                        </Typography>
                      </Box>
                    </td>
                    <td>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="500">
                          {invoice.anomalies}
                        </Typography>
                        {invoice.anomalies > 0 && (
                          <Chip 
                            label="Issues" 
                            size="small" 
                            color="error" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </td>
                    <td>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 200, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          fontStyle: 'italic',
                          color: 'text.secondary'
                        }}
                        title={invoice.remarks}
                      >
                        {invoice.remarks}
                      </Typography>
                    </td>
                    <td>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 200, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          color: invoice.mismatchDescription === 'None' ? 'success.main' : 'error.main'
                        }}
                        title={invoice.mismatchDescription}
                      >
                        {invoice.mismatchDescription === 'None' ? '✓ Compliant' : invoice.mismatchDescription}
                      </Typography>
                    </td>
                    <td>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 200, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          color: 'info.main',
                          fontWeight: 500
                        }}
                        title={invoice.agentAnalysis}
                      >
                        {invoice.agentAnalysis}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body2" color="primary" fontWeight="500">
                        {invoice.matchInvoice}
                      </Typography>
                    </td>
                    <td>
                      {invoice.humanIntervention?.required ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label="Required" 
                            size="small" 
                            color="warning" 
                            icon={<PersonIcon />}
                            sx={{ fontWeight: 'bold' }}
                          />
                          <IconButton 
                            size="small" 
                            color="warning" 
                            title="Process Human Intervention"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHumanInterventionClick(invoice);
                            }}
                            sx={{ 
                              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)'
                              }
                            }}
                          >
                            <AssignmentIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="success.main" sx={{ fontStyle: 'italic' }}>
                          ✓ Automated
                        </Typography>
                      )}
                    </td>
                    <td>
                                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton 
                            size="small" 
                            color="primary" 
                            title="View Analysis Report"
                            onClick={(e) => {
                              e.stopPropagation();
                              generateInvoiceAnalysisReport(invoice);
                            }}
                            sx={{ 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                              }
                            }}
                          >
                            <AutoFixHighIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="info" 
                            title="Download Invoice PDF"
                            onClick={(e) => {
                              e.stopPropagation();
                              generateAndDownloadInvoice(invoice);
                            }}
                            sx={{ 
                              background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #2980b9 0%, #1f5f8b 100%)'
                              }
                            }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="success" title="Approve">
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="warning" title="Request Changes">
                            <WarningIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" title="Reject">
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>

          {/* Pagination Info */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing 1-22 of {INVOICE_DATA.sampleInvoices.length} invoices
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined">Previous</Button>
              <Button size="small" variant="outlined">Next</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderAnalysisPopup = () => (
    <Dialog
      open={showAnalysisPopup}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {/* Header */}
        <Box sx={{ 
          p: 4, 
          textAlign: 'center',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            🚀 AI-Powered Invoice Analysis
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Analyzing invoices using advanced compliance algorithms
          </Typography>
        </Box>

        {/* Progress Section */}
        <Box sx={{ p: 4, background: 'rgba(255,255,255,0.05)' }}>
          {/* Overall Progress */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Overall Progress</Typography>
              <Typography variant="h6">{Math.round(analysisProgress)}%</Typography>
            </Box>
            <Box sx={{ 
              width: '100%', 
              height: 12, 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              borderRadius: 6,
              overflow: 'hidden',
              position: 'relative'
            }}>
              <Box
                sx={{
                  width: `${analysisProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                  borderRadius: 6,
                  transition: 'width 0.3s ease',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'shimmer 2s infinite'
                  }
                }}
              />
            </Box>
          </Box>

          {/* Current Step */}
          {currentAnalysisStep && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                🔍 Currently Analyzing
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {currentAnalysisStep}
              </Typography>
            </Box>
          )}

          {/* Analysis Steps */}
          <Grid container spacing={2}>
            {analysisSteps.map((step, index) => {
              const stepProgress = (index + 1) * (100 / analysisSteps.length);
              const isCompleted = analysisProgress >= stepProgress;
              const isCurrent = currentAnalysisStep === step.name;
              
              return (
                <Grid item xs={12} sm={6} key={index}>
                  <Card sx={{
                    background: isCompleted ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.1)',
                    border: isCurrent ? '2px solid #4facfe' : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    p: 2,
                    transition: 'all 0.3s ease',
                    transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isCurrent ? '0 8px 25px rgba(79, 172, 254, 0.3)' : 'none'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        fontSize: '2rem',
                        opacity: isCompleted ? 1 : 0.6,
                        filter: isCompleted ? 'none' : 'grayscale(1)'
                      }}>
                        {step.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {step.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          {isCompleted ? (
                            <Box sx={{ 
                              width: 20, 
                              height: 20, 
                              borderRadius: '50%', 
                              backgroundColor: '#4caf50',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '0.75rem'
                            }}>
                              ✓
                            </Box>
                          ) : (
                            <Box sx={{ 
                              width: 20, 
                              height: 20, 
                              borderRadius: '50%', 
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '0.75rem'
                            }}>
                              {isCurrent ? '⟳' : '○'}
                            </Box>
                          )}
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Animated Elements */}
          <Box sx={{ 
            mt: 4, 
            textAlign: 'center',
            animation: 'pulse 2s infinite'
          }}>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              ⚡ AI Agent is processing data and detecting compliance violations...
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const renderInvoiceAnalysisReport = () => {
    console.log('renderInvoiceAnalysisReport called');
    console.log('showInvoiceAnalysisReport:', showInvoiceAnalysisReport);
    console.log('selectedInvoiceForAnalysis:', selectedInvoiceForAnalysis);
    
    return (
      <Dialog
        open={showInvoiceAnalysisReport}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 3,
            overflow: 'hidden',
            maxHeight: '95vh'
          }
        }}
      >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {/* Header */}
        <Box sx={{ 
          p: 4, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            📊 Invoice Analysis Report
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Comprehensive AI Analysis for {selectedInvoiceForAnalysis?.firm}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
            Invoice #{selectedInvoiceForAnalysis?.invoiceNumber} • Analysis Date: {invoiceAnalysis?.analysisDate}
          </Typography>
        </Box>

        {/* Invoice Summary */}
        <Box sx={{ p: 3, background: 'rgba(255,255,255,0.8)' }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3
          }}>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    📋 Invoice Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Firm:</strong> {selectedInvoiceForAnalysis?.firm}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Matter:</strong> {selectedInvoiceForAnalysis?.matter}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Date:</strong> {selectedInvoiceForAnalysis?.date}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Total Amount:</strong> ${selectedInvoiceForAnalysis?.total.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff6b6b' }}>
                        {invoiceAnalysis?.riskScore}/10
                      </Typography>
                      <Typography variant="body2">Risk Score</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4facfe' }}>
                        {invoiceAnalysis?.complianceScore}%
                      </Typography>
                      <Typography variant="body2">Compliance</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Main Content */}
        <Box sx={{ p: 3, maxHeight: '60vh', overflow: 'auto' }}>
          <Grid container spacing={3}>
            {/* Detected Anomalies */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                borderRadius: 3,
                height: '100%'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                    🔍 Detected Anomalies & Compliance Violations
                  </Typography>
                  <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                    {invoiceAnalysis?.anomalies.map((anomaly, index) => (
                      <Card key={index} sx={{ 
                        mb: 2, 
                        background: 'rgba(255,255,255,0.9)',
                        border: `2px solid ${anomaly.severity === 'high' ? '#f44336' : '#ff9800'}`,
                        borderRadius: 2
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                              {anomaly.type}
                            </Typography>
                            <Chip 
                              label={anomaly.severity.toUpperCase()} 
                              size="small"
                              color={anomaly.severity === 'high' ? 'error' : 'warning'}
                              sx={{ fontWeight: 'bold' }}
                            />
                          </Box>
                          
                          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                            {anomaly.description}
                          </Typography>
                          
                          <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                              📚 Policy Reference:
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                              {anomaly.policyReference}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                              📝 Affected Line Items:
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              {anomaly.lineItems && anomaly.lineItems.length > 0 ? (
                                anomaly.lineItems.map((item, idx) => (
                                  <Chip 
                                    key={idx}
                                    label={item} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ mr: 1, mb: 1 }}
                                  />
                                ))
                              ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                  No specific line items identified
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                              ⚠️ Impact:
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5, color: 'error.main' }}>
                              {anomaly.impact || 'Impact assessment pending'}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Confidence: {(anomaly.confidence * 100).toFixed(0)}%
                              </Typography>
                              <Box sx={{ 
                                width: 60, 
                                height: 4, 
                                bgcolor: 'rgba(0,0,0,0.1)', 
                                borderRadius: 2,
                                overflow: 'hidden'
                              }}>
                                <Box sx={{ 
                                  width: `${anomaly.confidence * 100}%`, 
                                  height: '100%', 
                                  bgcolor: anomaly.severity === 'high' ? '#f44336' : '#ff9800',
                                  borderRadius: 2
                                }} />
                              </Box>
                            </Box>
                            
                            <Box sx={{ 
                              textAlign: 'right',
                              p: 1,
                              bgcolor: anomaly.severity === 'high' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                              borderRadius: 2,
                              border: `1px solid ${anomaly.severity === 'high' ? '#f44336' : '#ff9800'}`
                            }}>
                              <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>
                                ${anomaly.savings?.toLocaleString() || '0'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Potential Savings
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Proposed Adjustments & Savings */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                borderRadius: 3,
                height: '100%'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    💰 Proposed Adjustments & Savings Breakdown
                  </Typography>
                  
                  {/* Adjustments Grid */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Box sx={{ 
                        textAlign: 'center', 
                        p: 2, 
                        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                        borderRadius: 2,
                        boxShadow: '0 4px 15px rgba(255, 154, 158, 0.3)'
                      }}>
                        <Typography variant="h5" color="error" sx={{ fontWeight: 'bold' }}>
                          ${Math.abs(invoiceAnalysis?.adjustments.rateCorrections || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Rate Corrections
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Contract Violations
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ 
                        textAlign: 'center', 
                        p: 2, 
                        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                        borderRadius: 2,
                        boxShadow: '0 4px 15px rgba(168, 237, 234, 0.3)'
                      }}>
                        <Typography variant="h5" color="error" sx={{ fontWeight: 'bold' }}>
                          ${Math.abs(invoiceAnalysis?.adjustments.disallowedExpenses || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Disallowed Expenses
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Policy Violations
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ 
                        textAlign: 'center', 
                        p: 2, 
                        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                        borderRadius: 2,
                        boxShadow: '0 4px 15px rgba(255, 236, 210, 0.3)'
                      }}>
                        <Typography variant="h5" color="error" sx={{ fontWeight: 'bold' }}>
                          ${Math.abs(invoiceAnalysis?.adjustments.weekendBillingAdjustments || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Weekend Billing
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Time Policy
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ 
                        textAlign: 'center', 
                        p: 2, 
                        background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
                        borderRadius: 2,
                        boxShadow: '0 4px 15px rgba(210, 153, 194, 0.3)'
                      }}>
                        <Typography variant="h5" color="error" sx={{ fontWeight: 'bold' }}>
                          ${Math.abs(invoiceAnalysis?.adjustments.utbmsAdjustments || 0).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          UTBMS Errors
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Coding Issues
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Final Totals */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Card sx={{ 
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        color: 'white',
                        borderRadius: 2
                      }}>
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            Original: ${selectedInvoiceForAnalysis?.total.toLocaleString()}
                          </Typography>
                          <Typography variant="caption">
                            Before Adjustments
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card sx={{ 
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        color: 'white',
                        borderRadius: 2
                      }}>
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            Adjusted: ${invoiceAnalysis?.adjustments.adjustedTotal?.toLocaleString() || '0'}
                          </Typography>
                          <Typography variant="caption">
                            After Compliance
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Total Savings */}
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 3
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      💎 Total Potential Savings
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      ${Math.abs(invoiceAnalysis?.adjustments.totalAdjustments || 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Through Compliance Adjustments
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* AI Recommendations */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
                borderRadius: 3
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    💡 AI-Generated Recommendations & Action Items
                  </Typography>
                  <Grid container spacing={2}>
                    {invoiceAnalysis?.recommendations.map((rec, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card sx={{ 
                          background: 'rgba(255,255,255,0.8)',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                          }
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Box sx={{ 
                                width: 40, 
                                height: 40, 
                                borderRadius: '50%', 
                                backgroundColor: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '1.2rem',
                                flexShrink: 0
                              }}>
                                💡
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                  Recommendation #{index + 1}
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                  {rec}
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                  <Chip 
                                    label="High Priority" 
                                    size="small" 
                                    color="error" 
                                    variant="outlined"
                                  />
                                  <Chip 
                                    label="Policy Compliance" 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined"
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Policy Compliance Breakdown */}
          {invoiceAnalysis?.policyCompliance && (
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
                  borderRadius: 3
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                      📊 Policy Compliance Breakdown
                    </Typography>
                    <Grid container spacing={3}>
                      {Object.entries(invoiceAnalysis.policyCompliance).map(([policy, score]) => (
                        <Grid item xs={12} sm={6} md={3} key={policy}>
                          <Card sx={{ 
                            background: 'rgba(255,255,255,0.9)',
                            borderRadius: 2
                          }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                                {score}%
                              </Typography>
                              <Typography variant="body1" sx={{ textTransform: 'capitalize', mb: 2 }}>
                                {policy.replace(/([A-Z])/g, ' $1').trim()}
                              </Typography>
                              <Box sx={{ 
                                width: '100%', 
                                height: 8, 
                                backgroundColor: 'rgba(0,0,0,0.1)', 
                                borderRadius: 4,
                                overflow: 'hidden'
                              }}>
                                <Box sx={{ 
                                  width: `${score}%`, 
                                  height: '100%', 
                                  background: score >= 80 ? 'linear-gradient(90deg, #4caf50, #8bc34a)' : 
                                             score >= 60 ? 'linear-gradient(90deg, #ff9800, #ffc107)' : 
                                             'linear-gradient(90deg, #f44336, #e91e63)',
                                  borderRadius: 4
                                }} />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ p: 3, background: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="success" 
              startIcon={<CheckCircleIcon />}
              sx={{ 
                background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #45a049 0%, #7cb342 100%)' }
              }}
            >
              Approve Invoice
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<WarningIcon />}
              sx={{ borderColor: '#f44336', color: '#f44336' }}
            >
              Request Clarification
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<DescriptionIcon />}
              sx={{ borderColor: '#1976d2', color: '#1976d2' }}
            >
              Download Report
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<AutoFixHighIcon />}
              sx={{ borderColor: '#ff9800', color: '#ff9800' }}
            >
              Generate Email
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setShowInvoiceAnalysisReport(false)}
              sx={{ borderColor: '#666', color: '#666' }}
            >
              Close Report
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
    );
  };

  return (
    <>
      <style>{shimmerAnimation}</style>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="xl" 
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh'
          }
        }}
      >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GavelIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h5">
            Legal and Counsel Agent
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 3 }}
          >
            <Tab label="Dashboard" icon={<DashboardIcon />} />
            <Tab label="Regulatory Compliance" icon={<PolicyIcon />} />
            <Tab label="Document Review" icon={<DescriptionIcon />} />
            <Tab label="Policy Guidance" icon={<LightbulbIcon />} />
            <Tab label="Compliance Monitoring" icon={<AssessmentIcon />} />
            <Tab label="Invoice Checker" icon={<DescriptionIcon />} />
          </Tabs>
        </Box>

        <Box sx={{ p: 3, height: 'calc(90vh - 140px)', overflow: 'auto' }}>
          {activeTab === 0 && renderDashboard()}
          {activeTab === 1 && renderRegulatoryCompliance()}
          {activeTab === 2 && renderDocumentReview()}
          {activeTab === 3 && renderPolicyGuidance()}
          {activeTab === 4 && renderComplianceMonitoring()}
          {activeTab === 5 && renderInvoiceChecker()}
        </Box>
      </DialogContent>
      
      {/* Analysis Popup */}
      {renderAnalysisPopup()}
      
      {/* Invoice Analysis Report */}
      {renderInvoiceAnalysisReport()}

      {/* Invoice Attachments Dialog */}
      <Dialog
        open={showAttachmentsDialog}
        onClose={() => setShowAttachmentsDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DescriptionIcon />
            <Typography variant="h6">
              Invoice Attachments - {selectedInvoice?.invoiceNumber}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              title="Download Invoice PDF"
              onClick={() => generateAndDownloadInvoice(selectedInvoice)}
              sx={{ 
                color: 'white',
                background: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <DownloadIcon />
            </IconButton>
            <IconButton 
              onClick={() => setShowAttachmentsDialog(false)} 
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {selectedInvoice && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedInvoice.firm} - {selectedInvoice.matter}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Invoice #{selectedInvoice.invoiceNumber} • {selectedInvoice.date} • ${selectedInvoice.total.toLocaleString()}
                </Typography>
              </Box>
              
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Attachments ({selectedInvoice.attachments?.length || 0})
              </Typography>
              
              {selectedInvoice.attachments && selectedInvoice.attachments.length > 0 ? (
                <Grid container spacing={2}>
                  {selectedInvoice.attachments.map((attachment, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card 
                        sx={{ 
                          p: 2, 
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onClick={() => window.open(attachment.url, '_blank')}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 
                                attachment.type === 'PDF' ? '#f44336' :
                                attachment.type === 'Excel' ? '#4caf50' :
                                attachment.type === 'Word' ? '#2196f3' :
                                attachment.type === 'ZIP' ? '#ff9800' : '#9e9e9e',
                              color: 'white',
                              fontSize: '1.2rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {attachment.type === 'PDF' ? '📄' :
                             attachment.type === 'Excel' ? '📊' :
                             attachment.type === 'Word' ? '📝' :
                             attachment.type === 'ZIP' ? '📦' : '📎'}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {attachment.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {attachment.type} • {attachment.size}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          startIcon={<DownloadIcon />}
                          onClick={() => generateAndDownloadInvoice(selectedInvoice)}
                          sx={{ mt: 1 }}
                        >
                          Download Invoice
                        </Button>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <DescriptionIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Attachments Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This invoice doesn't have any supporting documents attached.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={() => setShowAttachmentsDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Human Intervention Dialog */}
      <Dialog
        open={showHumanInterventionDialog}
        onClose={() => setShowHumanInterventionDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PersonIcon sx={{ fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Human Intervention Required
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setShowHumanInterventionDialog(false)} 
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {selectedInterventionInvoice && (
            <Box>
              {/* Invoice Summary Header */}
              <Box sx={{ p: 3, background: 'rgba(255,152,0,0.1)' }}>
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 2
                }}>
                  <CardContent>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>
                          📋 Invoice Requiring Human Review
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="body2">
                            <strong>Firm:</strong> {selectedInterventionInvoice.firm}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Matter:</strong> {selectedInterventionInvoice.matter}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Invoice #:</strong> {selectedInterventionInvoice.invoiceNumber}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Total Amount:</strong> ${selectedInterventionInvoice.total.toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Chip 
                            label={selectedInterventionInvoice.humanIntervention.priority} 
                            size="large"
                            color={selectedInterventionInvoice.humanIntervention.priority === 'Critical' ? 'error' : 
                                   selectedInterventionInvoice.humanIntervention.priority === 'High' ? 'warning' : 'info'}
                            sx={{ fontWeight: 'bold', mb: 2 }}
                          />
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Priority Level
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>

              {/* Intervention Details */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Left Column - Intervention Info */}
                  <Grid item xs={12} lg={6}>
                    <Card sx={{ 
                      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                          🚨 Intervention Details
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Type of Intervention:
                          </Typography>
                          <Chip 
                            label={selectedInterventionInvoice.humanIntervention.type} 
                            color="warning" 
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Assigned To:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: '500' }}>
                            {selectedInterventionInvoice.humanIntervention.assignedTo}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Deadline:
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            fontWeight: '500',
                            color: new Date(selectedInterventionInvoice.humanIntervention.deadline) < new Date() ? 'error.main' : 'text.primary'
                          }}>
                            {selectedInterventionInvoice.humanIntervention.deadline}
                            {new Date(selectedInterventionInvoice.humanIntervention.deadline) < new Date() && (
                              <Chip 
                                label="OVERDUE" 
                                size="small" 
                                color="error" 
                                sx={{ ml: 1, fontWeight: 'bold' }}
                              />
                            )}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Current Status:
                          </Typography>
                          <Chip 
                            label={selectedInterventionInvoice.humanIntervention.status} 
                            color={
                              selectedInterventionInvoice.humanIntervention.status === 'Completed' ? 'success' :
                              selectedInterventionInvoice.humanIntervention.status === 'In Progress' ? 'warning' : 'info'
                            }
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Notes:
                          </Typography>
                          <TextareaAutosize
                            minRows={3}
                            maxRows={6}
                            value={interventionNotes}
                            onChange={(e) => setInterventionNotes(e.target.value)}
                            placeholder="Add your notes and observations here..."
                            style={{
                              width: '100%',
                              padding: '12px',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              fontFamily: 'inherit',
                              fontSize: '14px',
                              resize: 'vertical'
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Right Column - Manual Corrections */}
                  <Grid item xs={12} lg={6}>
                    <Card sx={{ 
                      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                          ✏️ Manual Corrections Required
                        </Typography>
                        
                        <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                          {selectedInterventionInvoice.humanIntervention.manualCorrections.map((correction, index) => (
                            <Accordion key={index} sx={{ mb: 2, background: 'rgba(255,255,255,0.8)' }}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {correction.field}
                                  </Typography>
                                  {correction.requiresApproval && (
                                    <Chip 
                                      label="Approval Required" 
                                      size="small" 
                                      color="warning" 
                                      variant="outlined"
                                    />
                                  )}
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Original Value:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'error.main', fontStyle: 'italic' }}>
                                    {correction.originalValue}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Proposed Value:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'success.main', fontStyle: 'italic' }}>
                                    {correction.proposedValue}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Justification:
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                    {correction.justification}
                                  </Typography>
                                </Box>

                                {correction.requiresApproval && (
                                  <Box sx={{ mb: 2 }}>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={correctionApprovals[index] || false}
                                          onChange={(e) => setCorrectionApprovals({
                                            ...correctionApprovals,
                                            [index]: e.target.checked
                                          })}
                                          color="primary"
                                        />
                                      }
                                      label="Approve this correction"
                                    />
                                  </Box>
                                )}
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Action Timeline */}
                <Grid container spacing={3} sx={{ mt: 3 }}>
                  <Grid item xs={12}>
                    <Card sx={{ 
                      background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
                      borderRadius: 2
                    }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                          📅 Action Timeline
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <TimelineIcon color="primary" />
                          <Typography variant="body2" sx={{ fontWeight: '500' }}>
                            This intervention was created on {selectedInterventionInvoice.humanIntervention.deadline}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <AssignmentIcon color="warning" />
                          <Typography variant="body2" sx={{ fontWeight: '500' }}>
                            Assigned to {selectedInterventionInvoice.humanIntervention.assignedTo}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <WarningIcon color="error" />
                          <Typography variant="body2" sx={{ fontWeight: '500' }}>
                            Due by {selectedInterventionInvoice.humanIntervention.deadline}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, background: 'rgba(255,255,255,0.9)', borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', width: '100%' }}>
            <Button 
              onClick={() => setShowHumanInterventionDialog(false)}
              variant="outlined"
              color="inherit"
            >
              Cancel
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<SaveIcon />}
              >
                Save Draft
              </Button>
              <Button 
                variant="contained" 
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={handleProcessIntervention}
                disabled={isProcessingIntervention}
                sx={{ 
                  background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #45a049 0%, #7cb342 100%)' }
                }}
              >
                {isProcessingIntervention ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} color="inherit" />
                    Processing...
                  </Box>
                ) : (
                  'Complete Intervention'
                )}
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button 
          variant="contained" 
          startIcon={<AutoFixHighIcon />}
          onClick={startAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}

export default LegalAndCounselAgentDialog;
