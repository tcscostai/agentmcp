import { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  Typography, 
  IconButton, 
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Paper,
  Button,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  CircularProgress,
  Snackbar,
  Alert,
  Menu,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code as CodeIcon,
  Edit as EditIcon,
  Translate as TranslateIcon,
  ExpandMore as ExpandMoreIcon,
  WebAsset as WebAssetIcon,
  Architecture as ArchitectureIcon,
  BugReport as BugReportIcon,
  Storage as StorageIcon,
  Add as AddIcon,
  PlayArrow as PlayArrowIcon,
  Settings as SettingsIcon,
  CloudUpload as CloudUploadIcon,
  SmartToy as SmartToyIcon,
  Analytics as AnalyticsIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Api as ApiIcon,
  CheckCircle as CheckCircleIcon,
  IntegrationInstructions as IntegrationInstructionsIcon,
  PlaylistPlay as PlaylistPlayIcon,
  DataArray as DataArrayIcon,
  Description as DescriptionIcon,
  NewReleases as NewReleasesIcon,
  AutoFixHigh as AutoFixHighIcon,
  Speed as SpeedIcon,
  TrendingDown,
  TrendingUp,
  Security as SecurityIcon,
  Hub as HubIcon,
  AccountTree as AccountTreeIcon,
  Psychology as PsychologyIcon,
  Groups as GroupsIcon,
  ManageSearch as ManageSearchIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Assessment as AssessmentIcon,
  AccessTime as AccessTimeIcon,
  Memory as MemoryIcon,
  LocalHospital as HospitalIcon,
  PhoneAndroid as MobileIcon,
  AttachMoney as AttachMoneyIcon,
  Gavel as GavelIcon,
} from '@mui/icons-material';
import RequirementsAnalyzerDialog from '../components/RequirementsAnalyzerDialog';
import IntegrationTestDesignerDialog from '../components/IntegrationTestDesignerDialog';
import ArchitectureAssistantDialog from '../components/ArchitectureAssistantDialog';
import DataAnalyzerDialog from '../components/DataAnalyzerDialog';
import WorkflowDesignerDialog from '../components/WorkflowDesignerDialog';
import ChainOfThoughtDialog from '../components/ChainOfThoughtDialog';
import AgentCollaborationDialog from '../components/AgentCollaborationDialog';
import UserStoryGeneratorDialog from '../components/UserStoryGeneratorDialog';
import DocumentRetrieverDialog from '../components/DocumentRetrieverDialog';
import ErrorBoundary from '../components/ErrorBoundary';
import CustomAgentDesigner from '../components/CustomAgentDesigner';
import TRRProcessingDialog from '../components/TRRProcessingDialog';
import CSNPWorkflowDialog from '../components/CSNPWorkflowDialog';
import ProviderOutreachDialog from '../components/ProviderOutreachDialog';
import MobileDeveloperAssistDialog from '../components/MobileDeveloperAssistDialog';
import ClaimCenterAIDialog from '../components/ClaimCenterAIDialog';
import CareCostGapsCenterAIDialog from '../components/CareCostGapsCenterAIDialog';
import LegalAndCounselAgentDialog from '../components/LegalAndCounselAgentDialog';
import {
  Psychology,
  Groups,
  Storage,
  AccountTree,
  Speed,
  Assessment,
} from '@mui/icons-material';
import PipelineBuilderWorkflow from '../components/PipelineBuilderWorkflow';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
  },
}));

const AgentCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  overflow: 'hidden',
  height: '100%',
  minHeight: '200px',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    '& .agent-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  padding: '8px 24px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 122, 255, 0.2)',
  },
}));

const TrainingVisualizer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  background: 'rgba(0,0,0,0.02)',
  border: '1px solid rgba(0,0,0,0.08)',
  overflow: 'hidden',
  minHeight: 200,
}));

const AVAILABLE_KNOWLEDGE_RECORDS = [
  {
    id: 'uhg-medical',
    name: 'UHG Knowledge Base',
    type: 'Healthcare',
    lastUpdated: '10 minutes ago',
    memory: '8.2 GB',
    documents: 25432,
    accuracy: 99.2,
    status: 'active',
    version: '3.1.0',
    insights: '12.5M patterns analyzed',
    dataTypes: ['Clinical', 'Claims', 'Pharmacy'],
    usageCount: 1528,
    performance: 'High'
  },
  {
    id: 'medicare-guidelines',
    name: 'CMS Central Knowledge Base',
    type: 'Regulations & Guidelines',
    lastUpdated: '1 hour ago',
    memory: '5.7 GB',
    documents: 18965,
    accuracy: 98.5,
    status: 'updating',
    version: '2.8.4',
    insights: '8.2M rules processed',
    dataTypes: ['Policy', 'Compliance', 'Guidelines'],
    usageCount: 2341,
    performance: 'Medium'
  },
  {
    id: 'claims-processing',
    name: 'Claims Processing',
    type: 'Insurance',
    lastUpdated: '3 hours ago',
    memory: '12.1 GB',
    documents: 31254,
    accuracy: 97.8,
    status: 'active',
    version: '4.0.2',
    insights: '15.3M claims analyzed',
    dataTypes: ['Claims', 'Billing', 'Authorization'],
    usageCount: 3102,
    performance: 'High'
  }
];

function DesignAgent() {
  const [requirementsAnalyzerOpen, setRequirementsAnalyzerOpen] = useState(false);
  const [integrationTestDesignerOpen, setIntegrationTestDesignerOpen] = useState(false);
  const [architectureAssistantOpen, setArchitectureAssistantOpen] = useState(false);
  const [dataAnalyzerOpen, setDataAnalyzerOpen] = useState(false);
  const [workflowDesignerOpen, setWorkflowDesignerOpen] = useState(false);
  const [chainOfThoughtOpen, setChainOfThoughtOpen] = useState(false);
  const [agentCollaborationOpen, setAgentCollaborationOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [newAgent, setNewAgent] = useState({
    category: '',
    name: '',
    description: '',
    features: []
  });
  const [loading, setLoading] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [pipelineBuilderOpen, setPipelineBuilderOpen] = useState(false);
  const [infraManagerOpen, setInfraManagerOpen] = useState(false);
  const [deploymentOrchestratorOpen, setDeploymentOrchestratorOpen] = useState(false);
  const [codeScannerOpen, setCodeScannerOpen] = useState(false);
  const [complianceCheckerOpen, setComplianceCheckerOpen] = useState(false);
  const [securityMonitorOpen, setSecurityMonitorOpen] = useState(false);
  const [testGeneratorOpen, setTestGeneratorOpen] = useState(false);
  const [codeQualityAnalyzerOpen, setCodeQualityAnalyzerOpen] = useState(false);
  const [performanceTesterOpen, setPerformanceTesterOpen] = useState(false);
  const [documentationGeneratorOpen, setDocumentationGeneratorOpen] = useState(false);
  const [metricsAnalyzerOpen, setMetricsAnalyzerOpen] = useState(false);
  const [userAnalyzerOpen, setUserAnalyzerOpen] = useState(false);
  const [reportGeneratorOpen, setReportGeneratorOpen] = useState(false);
  const [userStoryGeneratorOpen, setUserStoryGeneratorOpen] = useState(false);
  const [documentRetrieverOpen, setDocumentRetrieverOpen] = useState(false);
  const [contextAugmenterOpen, setContextAugmenterOpen] = useState(false);
  const [knowledgeBaseOpen, setKnowledgeBaseOpen] = useState(false);
  const [queryOptimizerOpen, setQueryOptimizerOpen] = useState(false);
  const [customAgentDialogOpen, setCustomAgentDialogOpen] = useState(false);
  const [agents, setAgents] = useState({
    sdlc: [],
    rag: [],
    workflow: []
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [trrProcessingDialogOpen, setTrrProcessingDialogOpen] = useState(false);
  const [csnpWorkflowOpen, setCSNPWorkflowOpen] = useState(false);
  const [providerOutreachOpen, setProviderOutreachOpen] = useState(false);
  const [mobileDeveloperAssistOpen, setMobileDeveloperAssistOpen] = useState(false);
  const [claimCenterAIOpen, setClaimCenterAIOpen] = useState(false);
  const [careCostGapsCenterAIOpen, setCareCostGapsCenterAIOpen] = useState(false);
  const [legalAndCounselAgentOpen, setLegalAndCounselAgentOpen] = useState(false);

  const handleAgentClick = (agentType) => {
    console.log('Agent clicked:', agentType);
    switch (agentType) {
      case 'requirements':
        setRequirementsAnalyzerOpen(true);
        break;
      case 'architecture':
        setArchitectureAssistantOpen(true);
        break;
      case 'testing':
        setIntegrationTestDesignerOpen(true);
        break;
      case 'data':
        setDataAnalyzerOpen(true);
        break;
      case 'workflow':
        setWorkflowDesignerOpen(true);
        break;
      case 'chain':
        setChainOfThoughtOpen(true);
        break;
      case 'collaboration':
        setAgentCollaborationOpen(true);
        break;
      case 'pipeline':
        setPipelineBuilderOpen(true);
        break;
      case 'infrastructure':
        setInfraManagerOpen(true);
        break;
      case 'deployment':
        setDeploymentOrchestratorOpen(true);
        break;
      case 'scanner':
        setCodeScannerOpen(true);
        break;
      case 'compliance':
        setComplianceCheckerOpen(true);
        break;
      case 'security-monitor':
        setSecurityMonitorOpen(true);
        break;
      case 'test-generator':
        setTestGeneratorOpen(true);
        break;
      case 'code-quality':
        setCodeQualityAnalyzerOpen(true);
        break;
      case 'performance':
        setPerformanceTesterOpen(true);
        break;
      case 'documentation':
        setDocumentationGeneratorOpen(true);
        break;
      case 'metrics':
        setMetricsAnalyzerOpen(true);
        break;
      case 'user-analytics':
        setUserAnalyzerOpen(true);
        break;
      case 'reporting':
        setReportGeneratorOpen(true);
        break;
      case 'story-generator':
        setUserStoryGeneratorOpen(true);
        break;
      case 'document-retriever':
        setDocumentRetrieverOpen(true);
        break;
      case 'context-augmenter':
        setContextAugmenterOpen(true);
        break;
      case 'knowledge-base':
        setKnowledgeBaseOpen(true);
        break;
      case 'query-optimizer':
        setQueryOptimizerOpen(true);
        break;
      case 'trr_processor':
        setTrrProcessingDialogOpen(true);
        break;
      case 'csnp_workflow':
        setCSNPWorkflowOpen(true);
        break;
      case 'provider_outreach':
        setProviderOutreachOpen(true);
        break;
      case 'mobile-developer-assist':
        setMobileDeveloperAssistOpen(true);
        break;
      case 'claim_center':
        setClaimCenterAIOpen(true);
        break;
      case 'care_cost_gaps_center':
        setCareCostGapsCenterAIOpen(true);
        break;
      case 'legal_counsel':
        setLegalAndCounselAgentOpen(true);
        break;
      default:
        console.log('Unknown agent type:', agentType);
        break;
    }
  };

  const handleDeleteClick = async (agent) => {
    try {
      setMenuAnchor(null);
      setDeleteDialogOpen(false);
      
      const response = await fetch(`http://localhost:3001/api/agents/${agent.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }

      // Remove agent from state
      setAgents(prev => ({
        ...prev,
        [agent.category]: prev[agent.category].filter(a => a.id !== agent.id)
      }));

      // Show success message
      setSnackbar({
        open: true,
        message: 'Agent deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting agent:', error);
      setSnackbar({
        open: true,
        message: `Failed to delete agent: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log('Deleting agent:', selectedAgent);

      if (!selectedAgent?.id || !selectedAgent?.category) {
        throw new Error('Missing required agent information');
      }

      const response = await fetch(
        `http://localhost:3001/api/agents/${selectedAgent.id}?category=${selectedAgent.category}`, 
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete agent');
      }

      await fetchAgents();

      setSnackbar({
        open: true,
        message: data.message || `Agent "${selectedAgent.name}" deleted successfully`,
        severity: 'success'
      });

    } catch (error) {
      console.error('Error deleting agent:', error);
      setSnackbar({
        open: true,
        message: `Failed to delete agent: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedAgent(null);
      setMenuAnchor(null);
    }
  };

  const AGENT_CATEGORIES = [
    {
      value: 'sdlc',
      label: 'SDLC Agents',
      icon: <CodeIcon fontSize="large" />,
      color: '#007AFF',
      description: 'Streamline your development lifecycle',
      subcategories: [
        'Requirements Analysis',
        'Design',
        'Development',
        'Testing',
        'Deployment',
        'Maintenance'
      ],
      subAgents: [
        {
          name: 'Requirements Analyzer',
          icon: <AssignmentIcon />,
          description: 'Analyze and validate software requirements',
          features: ['Requirements validation', 'Gap analysis', 'User story generation', 'Acceptance criteria'],
          status: 'stable',
          type: 'requirements'
        },
        {
          name: 'Architecture Assistant',
          icon: <ArchitectureIcon />,
          description: 'Help with system architecture decisions',
          features: ['Pattern suggestions', 'Scalability analysis', 'Best practices'],
          status: 'beta',
          type: 'architecture'
        },
        {
          name: 'Integration Test Designer',
          icon: <IntegrationInstructionsIcon />,
          description: 'Design and execute integration tests',
          features: ['API testing', 'End-to-end scenarios', 'Test automation'],
          status: 'beta',
          type: 'testing'
        },
        {
          name: 'Data Analyzer',
          icon: <StorageIcon />,
          description: 'Analyze and optimize data structures',
          features: ['Data modeling', 'Schema optimization', 'Performance analysis'],
          status: 'beta',
          type: 'data'
        },
        {
          name: 'User Story Generator',
          icon: <AssignmentIcon />,
          description: 'Generate user stories from requirements and push to Jira',
          features: ['AI-powered story generation', 'Jira integration', 'Story refinement', 'Acceptance criteria'],
          status: 'stable',
          type: 'story-generator'
        }
      ]
    },
    {
      value: 'multiagent',
      label: 'MultiAgent Workflows',
      icon: <HubIcon fontSize="large" />,
      color: '#FF9500',
      description: 'Create collaborative agent workflows',
      subcategories: ['Sequential', 'Parallel', 'Hybrid'],
      subAgents: [
        {
          name: 'Workflow Designer',
          icon: <AccountTreeIcon />,
          description: 'Design and orchestrate agent workflows',
          features: ['Visual workflow builder', 'Agent chaining', 'Parallel execution'],
          status: 'stable',
          type: 'workflow'
        },
        {
          name: 'Chain of Thought',
          icon: <PsychologyIcon />,
          description: 'Create reasoning chains between agents',
          features: ['Reasoning steps', 'Knowledge transfer', 'Decision tracking'],
          status: 'beta',
          type: 'chain'
        },
        {
          name: 'Agent Collaboration',
          icon: <GroupsIcon />,
          description: 'Enable agent-to-agent communication',
          features: ['Shared context', 'Message passing', 'Conflict resolution'],
          status: 'beta',
          type: 'collaboration'
        },
        {
          id: "trr_processor",
          name: "TRR Processing Workflow",
          icon: <AssessmentIcon />,
          description: "Automated TRR file processing and validation workflow",
          features: [
            "File Upload & Validation",
            "TRC Logic Processing",
            "Automated Testing",
            "Report Generation",
            "Error Handling"
          ],
          type: "trr_processor"
        },
        {
          name: 'CSNP Workflow',
          icon: <HubIcon />,
          description: 'Chronic Condition Special Needs Plan workflow automation',
          features: ['Eligibility Verification', 'Condition Management', 'Care Coordination'],
          status: 'beta',
          type: 'csnp_workflow'
        },
        {
          id: "provider_outreach",
          name: "Provider Outreach",
          icon: <HospitalIcon />,
          description: "Automated provider outreach and verification workflow",
          features: [
            "Provider Selection",
            "Multiple Contact Methods",
            "Real-time Verification",
            "Documentation Tracking"
          ],
          type: "provider_outreach"
        },
        {
          id: "legal_counsel",
          name: "Legal and Counsel Agent",
          icon: <GavelIcon />,
          description: "AI-powered legal compliance and regulatory guidance workflow",
          features: [
            "Regulatory Compliance",
            "Legal Document Review",
            "Risk Assessment",
            "Policy Guidance",
            "Compliance Monitoring"
          ],
          status: "beta",
          type: "legal_counsel"
        }
      ]
    },
    {
      value: 'claims_processing',
      label: 'Claims Processing',
      icon: <AssignmentIcon fontSize="large" />,
      color: '#007AFF',
      description: 'Process and manage claims with AI assistance',
      subAgents: [
        {
          name: 'Claim Center AI',
          icon: <AssignmentIcon />,
          description: 'Process and manage claims with AI assistance',
          features: ['Claim PEND Resolution', 'Claims Policy', 'General Inquiry'],
          status: 'stable',
          type: 'claim_center'
        },
        {
          name: 'Care Cost Gaps Center AI',
          icon: <AttachMoneyIcon />,
          description: 'AI-powered analysis of care cost gaps and optimization opportunities',
          features: ['Cost Gap Analysis', 'Savings Optimization', 'Provider Rate Validation'],
          status: 'stable',
          type: 'care_cost_gaps_center'
        }
      ]
    },
    {
      value: 'rag',
      label: 'RAG Agents',
      icon: <StorageIcon fontSize="large" />,
      color: '#5856D6',
      description: 'Retrieval Augmented Generation Agents',
      subcategories: [
        'Document Retrieval',
        'Context Augmentation',
        'Knowledge Management',
        'Query Optimization'
      ],
      subAgents: [
        {
          name: 'Document Retriever',
          icon: <DescriptionIcon />,
          description: 'Efficiently retrieves relevant documents from your knowledge base',
          features: ['Smart retrieval', 'Document indexing', 'Semantic search'],
          status: 'stable',
          type: 'document-retriever'
        },
        {
          name: 'Context Augmenter',
          icon: <AutoFixHighIcon />,
          description: 'Enhances prompts with relevant context from retrieved documents',
          features: ['Context injection', 'Prompt enhancement', 'Knowledge fusion'],
          status: 'beta',
          type: 'context-augmenter'
        },
        {
          name: 'Knowledge Base Manager',
          icon: <StorageIcon />,
          description: 'Manages and updates your RAG knowledge base',
          features: ['Document management', 'Version control', 'Content indexing'],
          status: 'stable',
          type: 'knowledge-base'
        },
        {
          name: 'Query Optimizer',
          icon: <ManageSearchIcon />,
          description: 'Optimizes retrieval queries for better context matching',
          features: ['Query refinement', 'Search optimization', 'Relevance tuning'],
          status: 'beta',
          type: 'query-optimizer'
        }
      ]
    },
    {
      value: 'mlops',
      label: 'MLOps Agents',
      icon: <AnalyticsIcon fontSize="large" />,
      color: '#34C759',
      description: 'Streamline your machine learning operations',
      subcategories: [
        'Data Processing',
        'Model Training',
        'Model Deployment',
        'Monitoring'
      ],
      subAgents: [
        {
          name: 'Data Preprocessor',
          icon: <DataArrayIcon />,
          description: 'Prepare and clean data for ML models',
          features: ['Data cleaning', 'Feature engineering', 'Data augmentation'],
          status: 'stable'
        },
        {
          name: 'Model Trainer',
          icon: <PlaylistPlayIcon />,
          description: 'Train machine learning models',
          features: ['Hyperparameter tuning', 'Distributed training', 'Model evaluation'],
          status: 'beta'
        },
        {
          name: 'Model Deployer',
          icon: <CloudUploadIcon />,
          description: 'Deploy models to production',
          features: ['Containerization', 'Scalable deployment', 'Versioning'],
          status: 'stable'
        },
        {
          name: 'Model Monitor',
          icon: <TrendingUp />,
          description: 'Monitor model performance in production',
          features: ['Drift detection', 'Performance metrics', 'Alerting'],
          status: 'beta'
        }
      ]
    },
    {
      value: 'devops',
      label: 'DevOps Agents',
      icon: <CloudUploadIcon fontSize="large" />,
      color: '#5856D6',
      description: 'Automate your DevOps workflows',
      subcategories: [
        'CI/CD',
        'Infrastructure',
        'Monitoring',
        'Deployment'
      ],
      subAgents: [
        {
          name: 'Pipeline Builder',
          icon: <IntegrationInstructionsIcon />,
          description: 'Design and optimize CI/CD pipelines',
          features: ['Pipeline automation', 'Build optimization', 'Deployment strategies'],
          status: 'stable',
          type: 'pipeline'
        },
        {
          name: 'Infrastructure Manager',
          icon: <StorageIcon />,
          description: 'Manage cloud infrastructure and resources',
          features: ['IaC generation', 'Resource optimization', 'Cost analysis'],
          status: 'beta',
          type: 'infrastructure'
        },
        {
          name: 'Deployment Orchestrator',
          icon: <PlayArrowIcon />,
          description: 'Orchestrate application deployments',
          features: ['Zero-downtime deployment', 'Rollback automation', 'Environment management'],
          status: 'stable',
          type: 'deployment'
        }
      ]
    },
    {
      value: 'security',
      label: 'Security Agents',
      icon: <SecurityIcon fontSize="large" />,
      color: '#FF3B30',
      description: 'Enhance your application security',
      subcategories: [
        'Code Analysis',
        'Vulnerability Scanning',
        'Compliance',
        'Monitoring'
      ],
      subAgents: [
        {
          name: 'Code Scanner',
          icon: <SearchIcon />,
          description: 'Scan code for security vulnerabilities',
          features: ['SAST analysis', 'Dependency checking', 'Security best practices'],
          status: 'stable',
          type: 'scanner'
        },
        {
          name: 'Compliance Checker',
          icon: <CheckCircleIcon />,
          description: 'Ensure compliance with security standards',
          features: ['Policy validation', 'Compliance reporting', 'Risk assessment'],
          status: 'beta',
          type: 'compliance'
        },
        {
          name: 'Security Monitor',
          icon: <SpeedIcon />,
          description: 'Monitor security events and alerts',
          features: ['Real-time monitoring', 'Threat detection', 'Incident response'],
          status: 'beta',
          type: 'security-monitor'
        }
      ]
    },
    {
      value: 'quality',
      label: 'Quality Assurance Agents',
      icon: <BugReportIcon fontSize="large" />,
      color: '#34C759',
      description: 'Ensure software quality and reliability',
      subcategories: [
        'Testing',
        'Code Quality',
        'Performance',
        'Documentation'
      ],
      subAgents: [
        {
          name: 'Test Generator',
          icon: <PlaylistPlayIcon />,
          description: 'Generate comprehensive test suites',
          features: ['Unit test generation', 'Integration testing', 'Test coverage analysis'],
          status: 'stable',
          type: 'test-generator'
        },
        {
          name: 'Code Quality Analyzer',
          icon: <CodeIcon />,
          description: 'Analyze and improve code quality',
          features: ['Code review', 'Best practices', 'Technical debt analysis'],
          status: 'beta',
          type: 'code-quality'
        },
        {
          name: 'Performance Tester',
          icon: <SpeedIcon />,
          description: 'Test application performance',
          features: ['Load testing', 'Performance metrics', 'Bottleneck detection'],
          status: 'beta',
          type: 'performance'
        },
        {
          name: 'Documentation Generator',
          icon: <DescriptionIcon />,
          description: 'Generate and maintain documentation',
          features: ['API documentation', 'Code documentation', 'User guides'],
          status: 'stable',
          type: 'documentation'
        }
      ]
    },
    {
      value: 'analytics',
      label: 'Analytics Agents',
      icon: <TrendingUp />,
      color: '#FF9500',
      description: 'Gain insights from your data and metrics',
      subcategories: [
        'Performance Analytics',
        'User Analytics',
        'Business Intelligence',
        'Monitoring'
      ],
      subAgents: [
        {
          name: 'Metrics Analyzer',
          icon: <AnalyticsIcon />,
          description: 'Analyze application metrics and KPIs',
          features: ['Performance analysis', 'Trend detection', 'Anomaly detection'],
          status: 'stable',
          type: 'metrics'
        },
        {
          name: 'User Behavior Analyzer',
          icon: <PersonIcon />,
          description: 'Analyze user behavior and patterns',
          features: ['Usage patterns', 'User journey analysis', 'Conversion optimization'],
          status: 'beta',
          type: 'user-analytics'
        },
        {
          name: 'Report Generator',
          icon: <AssignmentIcon />,
          description: 'Generate comprehensive reports',
          features: ['Custom reporting', 'Data visualization', 'Automated insights'],
          status: 'stable',
          type: 'reporting'
        }
      ]
    }
  ];

  useEffect(() => {
    // Initialize all sections as collapsed
    const initialCollapsedState = AGENT_CATEGORIES.reduce((acc, category) => {
      acc[category.value] = true;
      return acc;
    }, {});
    setCollapsedSections(initialCollapsedState);
  }, []); // Empty dependency array means this runs once on mount

  const handleCreateAgent = () => {
    setLoading(true);
    // Simulate agent creation
    setTimeout(() => {
      setLoading(false);
      setCreateDialogOpen(false);
      setActiveStep(0);
      setNewAgent({
        category: '',
        name: '',
        description: '',
        features: []
      });
    }, 2000);
  };

  const handleCollapseToggle = (categoryValue) => {
    setCollapsedSections(prev => ({
      ...prev,
      [categoryValue]: !prev[categoryValue]
    }));
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/agents');
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleAgentSelect = (agent) => {
    console.log("Selected agent:", agent);
    if (agent.type === "trr_processor") {
      setTrrProcessingDialogOpen(true);
    }
    if (agent.type === 'csnp_workflow') {
      setCSNPWorkflowOpen(true);
    }
    if (agent.type === 'claim_center') {
      setClaimCenterAIOpen(true);
    }
    handleAgentClick(agent.type);
  };

  const renderCategorySelection = () => {
    return (
      <Grid container spacing={3}>
        {AGENT_CATEGORIES.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' }
              }}
            >
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: category.color, mr: 1 }}>{category.icon}</Box>
                  <Typography variant="h6">{category.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {category.description}
                </Typography>
                {category.agents && category.agents.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Available Agents:
                    </Typography>
                    <List>
                      {category.agents.map((agent) => (
                        <ListItem 
                          key={agent.id}
                          button
                          onClick={() => handleAgentSelect(agent)}
                        >
                          <ListItemIcon>{agent.icon}</ListItemIcon>
                          <ListItemText 
                            primary={agent.name}
                            secondary={agent.description}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const handleAgentCreated = (newAgent) => {
    setAgents(prev => ({
      ...prev,
      [newAgent.category]: [...prev[newAgent.category], newAgent]
    }));
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Agent created successfully!',
      severity: 'success'
    });
  };

  const KNOWLEDGE_BASES = [
    {
      id: 'healthcare',
      name: 'UHG Knowledge Base',
      description: 'Records of UHG Medical Knowledge',
      lastUpdated: '5 minutes ago',
      memory: '4.2 GB',
      documents: 15243,
      accuracy: 98.5,
      status: 'active',
      version: '2.3.0',
      trainingProgress: 92,
      activeAgents: 8,
      lastTrainingDuration: '2h 15m',
      dataQuality: 96.5,
      modelType: 'GPT-4 Fine-tuned'
    },
    {
      id: 'claims',
      name: 'CMS Knowledge Base',
      description: 'CMS Central Knowledge Base',
      lastUpdated: '2 hours ago',
      memory: '2.8 GB',
      documents: 8756,
      accuracy: 94.2,
      status: 'needs_review',
      version: '1.8.5'
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy Database',
      description: 'Medication and prescription information',
      lastUpdated: '1 day ago',
      memory: '3.5 GB',
      documents: 12890,
      accuracy: 99.1,
      status: 'validated',
      version: '3.0.1'
    },
    {
      id: 'providers',
      name: 'Provider Network',
      description: 'Healthcare provider and facility information',
      lastUpdated: '3 days ago',
      memory: '1.9 GB',
      documents: 5432,
      accuracy: 96.8,
      status: 'updating',
      version: '2.1.4'
    }
  ];

  return (
    <Box>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        gap: 2, 
        flexWrap: 'nowrap', 
        overflowX: 'auto', 
        pb: 1,
        justifyContent: 'center',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        width: '100%',
        maxWidth: '100vw',
        px: 2
      }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCustomAgentDialogOpen(true)}
          sx={{ 
            background: 'linear-gradient(45deg, #007AFF 30%, #5856D6 90%)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            whiteSpace: 'nowrap',
            '&:hover': {
              background: 'linear-gradient(45deg, #0055B2 30%, #4240AB 90%)',
            }
          }}
        >
          Design Custom AI Agent
        </Button>

        <Button
          variant="contained"
          startIcon={<Groups />}
          onClick={() => handleAgentClick('collaboration')}
          sx={{ 
            background: 'linear-gradient(45deg, #FF9500 30%, #FFBD2E 90%)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            whiteSpace: 'nowrap',
            '&:hover': {
              background: 'linear-gradient(45deg, #C93400 30%, #C93400 90%)',
            }
          }}
        >
          Agent Collaboration Hub
        </Button>

        <Button
          variant="contained"
          startIcon={<Storage />}
          onClick={() => handleAgentClick('knowledge-base')}
          sx={{ 
            background: 'linear-gradient(45deg, #AF52DE 30%, #5E5CE6 90%)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            whiteSpace: 'nowrap',
            '&:hover': {
              background: 'linear-gradient(45deg, #8944AB 30%, #4141B0 90%)',
            }
          }}
        >
          Knowledge Base Manager
        </Button>

        <Button
          variant="contained"
          startIcon={<AccountTree />}
          onClick={() => handleAgentClick('workflow')}
          sx={{ 
            background: 'linear-gradient(45deg, #FF375F 30%, #FF6482 90%)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            whiteSpace: 'nowrap',
            '&:hover': {
              background: 'linear-gradient(45deg, #D70015 30%, #D70015 90%)',
            }
          }}
        >
          Workflow Designer
        </Button>

        <Button
          variant="contained"
          startIcon={<Speed />}
          onClick={() => handleAgentClick('performance')}
          sx={{ 
            background: 'linear-gradient(45deg, #64D2FF 30%, #5AC8FA 90%)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            whiteSpace: 'nowrap',
            '&:hover': {
              background: 'linear-gradient(45deg, #0071A4 30%, #0071A4 90%)',
            }
          }}
        >
          Performance Optimizer
        </Button>

        <Button
          variant="contained"
          startIcon={<MobileIcon />}
          onClick={() => setMobileDeveloperAssistOpen(true)}
          sx={{ 
            background: 'linear-gradient(45deg, #FF2D55 30%, #FF375F 90%)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            whiteSpace: 'nowrap',
            '&:hover': {
              background: 'linear-gradient(45deg, #D70015 30%, #D70015 90%)',
            }
          }}
        >
          Mobile Developer Assist
        </Button>
      </Box>
      <Grid container spacing={3}>
        {AGENT_CATEGORIES.map((category) => (
          <Grid item xs={12} key={category.value}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StyledCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: `${category.color}15`,
                      color: category.color,
                      height: 'fit-content',
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {category.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleCollapseToggle(category.value)}
                    sx={{
                      transform: collapsedSections[category.value] ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.3s'
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
                <Collapse in={!collapsedSections[category.value]}>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {category.subAgents.concat(
                      agents[category.value]?.map(agent => ({
                        id: agent.id,
                        name: agent.name,
                        description: agent.description,
                        icon: <SmartToyIcon />,
                        type: agent.type || 'custom',
                        status: agent.status,
                        features: agent.features || [],
                        category: category.value
                      })) || []
                    ).map((agent) => (
                      <Grid item xs={12} sm={6} md={4} key={agent.id || agent.name} sx={{ height: '100%' }}>
                        <AgentCard
                          onClick={(e) => {
                            if (e.defaultPrevented) return;
                            handleAgentSelect(agent);
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 2,
                                bgcolor: `${category.color}15`,
                                color: category.color,
                                height: 'fit-content',
                              }}
                            >
                              {agent.icon}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {agent.name}
                                </Typography>
                                <Chip 
                                  label={agent.status} 
                                  size="small"
                                  color={agent.status === 'stable' ? 'success' : 'warning'}
                                />
                              </Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                {agent.description}
                              </Typography>
                              {agent.features && agent.features.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                  {agent.features.map((feature, index) => (
                                    <Chip
                                      key={`${agent.name}-${feature}-${index}`}
                                      label={feature}
                                      size="small"
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              )}
                            </Box>
                          </Box>
                          {agent.type === 'custom' && (
                            <Box 
                              className="agent-actions"
                              sx={{ 
                                position: 'absolute',
                                right: 16,
                                bottom: 16,
                                opacity: 0,
                                transform: 'translateY(10px)',
                                transition: 'all 0.3s',
                                display: 'flex',
                                gap: 1,
                              }}
                            >
                              <IconButton 
                                size="small" 
                                sx={{ bgcolor: 'background.paper' }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setMenuAnchor(e.currentTarget);
                                  setSelectedAgent(agent);
                                }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </Box>
                          )}
                        </AgentCard>
                      </Grid>
                    ))}
                  </Grid>
                </Collapse>
              </StyledCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToyIcon color="primary" />
            <Typography variant="h6">Create Custom Agent</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
            {['Category', 'Details', 'Capabilities', 'Review'].map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Select Agent Category
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newAgent.category}
                  onChange={(e) => setNewAgent({ ...newAgent, category: e.target.value })}
                >
                  {AGENT_CATEGORIES.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Agent Details
              </Typography>
              <TextField
                fullWidth
                label="Agent Name"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                value={newAgent.description}
                onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                multiline
                rows={3}
              />
            </Box>
          )}

          {activeStep === 2 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Agent Capabilities
              </Typography>
              <TextField
                fullWidth
                label="Features (comma separated)"
                value={newAgent.features.join(', ')}
                onChange={(e) => setNewAgent({ ...newAgent, features: e.target.value.split(',').map(f => f.trim()) })}
              />
            </Box>
          )}

          {activeStep === 3 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Review Agent Details
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Category: {newAgent.category}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Name: {newAgent.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Description: {newAgent.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Features: {newAgent.features.join(', ')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            disabled={activeStep === 0} 
            onClick={() => setActiveStep(prev => prev - 1)}
          >
            Back
          </Button>
          {activeStep === 3 ? (
            <Button
              variant="contained"
              onClick={handleCreateAgent}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
            >
              Create Agent
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={() => setActiveStep(prev => prev + 1)}
              disabled={
                (activeStep === 0 && !newAgent.category) ||
                (activeStep === 1 && (!newAgent.name || !newAgent.description))
              }
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <RequirementsAnalyzerDialog 
        open={requirementsAnalyzerOpen}
        onClose={() => setRequirementsAnalyzerOpen(false)}
      />

      <IntegrationTestDesignerDialog 
        open={integrationTestDesignerOpen}
        onClose={() => setIntegrationTestDesignerOpen(false)}
      />

      <ArchitectureAssistantDialog 
        open={architectureAssistantOpen}
        onClose={() => setArchitectureAssistantOpen(false)}
      />

      <DataAnalyzerDialog 
        open={dataAnalyzerOpen}
        onClose={() => setDataAnalyzerOpen(false)}
      />

      <WorkflowDesignerDialog
        open={workflowDesignerOpen}
        onClose={() => setWorkflowDesignerOpen(false)}
      />
      
      <ChainOfThoughtDialog
        open={chainOfThoughtOpen}
        onClose={() => setChainOfThoughtOpen(false)}
      />
      
      <AgentCollaborationDialog
        open={agentCollaborationOpen}
        onClose={() => setAgentCollaborationOpen(false)}
      />

      <Dialog 
        open={pipelineBuilderOpen}
        onClose={() => setPipelineBuilderOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IntegrationInstructionsIcon color="primary" />
            <Typography variant="h6">CI/CD Pipeline Builder</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <PipelineBuilderWorkflow />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPipelineBuilderOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            startIcon={<CloudUploadIcon />}
            color="primary"
          >
            Save Pipeline Configuration
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={infraManagerOpen}
        onClose={() => setInfraManagerOpen(false)}
      >
        <DialogTitle>Infrastructure Manager</DialogTitle>
        <DialogContent>
          {/* Add infrastructure manager content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfraManagerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={deploymentOrchestratorOpen}
        onClose={() => setDeploymentOrchestratorOpen(false)}
      >
        <DialogTitle>Deployment Orchestrator</DialogTitle>
        <DialogContent>
          {/* Add deployment orchestrator content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeploymentOrchestratorOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={codeScannerOpen}
        onClose={() => setCodeScannerOpen(false)}
      >
        <DialogTitle>Code Scanner</DialogTitle>
        <DialogContent>
          {/* Add code scanner content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCodeScannerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={complianceCheckerOpen}
        onClose={() => setComplianceCheckerOpen(false)}
      >
        <DialogTitle>Compliance Checker</DialogTitle>
        <DialogContent>
          {/* Add compliance checker content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComplianceCheckerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={securityMonitorOpen}
        onClose={() => setSecurityMonitorOpen(false)}
      >
        <DialogTitle>Security Monitor</DialogTitle>
        <DialogContent>
          {/* Add security monitor content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSecurityMonitorOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={testGeneratorOpen}
        onClose={() => setTestGeneratorOpen(false)}
      >
        <DialogTitle>Test Generator</DialogTitle>
        <DialogContent>
          {/* Add test generator content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestGeneratorOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={codeQualityAnalyzerOpen}
        onClose={() => setCodeQualityAnalyzerOpen(false)}
      >
        <DialogTitle>Code Quality Analyzer</DialogTitle>
        <DialogContent>
          {/* Add code quality analyzer content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCodeQualityAnalyzerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={performanceTesterOpen}
        onClose={() => setPerformanceTesterOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Speed color="primary" />
            <Typography variant="h6">Performance Optimizer</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="600">
                    Response Time
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingDown color="success" />
                    <Typography variant="h4" sx={{ ml: 1 }}>245ms</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    color="success"
                    sx={{ mb: 1 }} 
                  />
                  <Typography variant="body2" color="text.secondary">
                    25% faster than last week
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="600">
                    Resource Usage
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp color="warning" />
                    <Typography variant="h4" sx={{ ml: 1 }}>68%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={68} 
                    color="warning"
                    sx={{ mb: 1 }} 
                  />
                  <Typography variant="body2" color="text.secondary">
                    CPU and Memory utilization
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="600">
                    Optimization Suggestions
                  </Typography>
                  <List>
                    {[
                      'Implement caching for frequently accessed data',
                      'Optimize database queries',
                      'Enable compression for responses',
                      'Upgrade infrastructure resources'
                    ].map((suggestion, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AutoFixHighIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={suggestion} />
                        <Button size="small" variant="outlined">
                          Apply
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPerformanceTesterOpen(false)}>Close</Button>
          <Button variant="contained">Apply Optimizations</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={documentationGeneratorOpen}
        onClose={() => setDocumentationGeneratorOpen(false)}
      >
        <DialogTitle>Documentation Generator</DialogTitle>
        <DialogContent>
          {/* Add documentation generator content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocumentationGeneratorOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={metricsAnalyzerOpen}
        onClose={() => setMetricsAnalyzerOpen(false)}
      >
        <DialogTitle>Metrics Analyzer</DialogTitle>
        <DialogContent>
          {/* Add metrics analyzer content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMetricsAnalyzerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={userAnalyzerOpen}
        onClose={() => setUserAnalyzerOpen(false)}
      >
        <DialogTitle>User Behavior Analyzer</DialogTitle>
        <DialogContent>
          {/* Add user behavior analyzer content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserAnalyzerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={reportGeneratorOpen}
        onClose={() => setReportGeneratorOpen(false)}
      >
        <DialogTitle>Report Generator</DialogTitle>
        <DialogContent>
          {/* Add report generator content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportGeneratorOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <UserStoryGeneratorDialog 
        open={userStoryGeneratorOpen}
        onClose={() => setUserStoryGeneratorOpen(false)}
      />

      <ErrorBoundary>
        <DocumentRetrieverDialog 
          open={documentRetrieverOpen}
          onClose={() => setDocumentRetrieverOpen(false)}
        />
      </ErrorBoundary>

      <Dialog 
        open={contextAugmenterOpen}
        onClose={() => setContextAugmenterOpen(false)}
      >
        <DialogTitle>Context Augmenter</DialogTitle>
        <DialogContent>
          {/* Add context augmenter content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContextAugmenterOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={knowledgeBaseOpen}
        onClose={() => setKnowledgeBaseOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Storage color="primary" />
            <Typography variant="h6">Knowledge Base Manager</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Search Knowledge Base"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="600">
                    Active Training Sessions
                  </Typography>
                  
                  <TrainingVisualizer>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" color="primary">
                          UHG Knowledge Base Training
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Training 8 agents • GPT-4 Fine-tuning
                        </Typography>
                      </Box>
                      <Chip 
                        label="Training in Progress" 
                        color="primary" 
                        size="small"
                        icon={<motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <AutoFixHighIcon fontSize="small" />
                        </motion.div>}
                      />
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="h4" color="primary">92%</Typography>
                          <Typography variant="caption">Training Progress</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="h4" color="success.main">8</Typography>
                          <Typography variant="caption">Active Agents</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="h4" color="warning.main">2h 15m</Typography>
                          <Typography variant="caption">Time Remaining</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="h4" color="info.main">96.5%</Typography>
                          <Typography variant="caption">Data Quality</Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Animated Training Visualization */}
                    <Box sx={{ position: 'relative', height: 100, mb: 2 }}>
                      <motion.div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-around'
                        }}
                      >
                        {[...Array(8)].map((_, index) => (
                          <motion.div
                            key={index}
                            animate={{
                              y: [0, -10, 0],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.2,
                            }}
                          >
                            <SmartToyIcon 
                              color="primary" 
                              sx={{ fontSize: 24 + (index % 2) * 8 }} 
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                      
                      {/* Data Flow Animation */}
                      <motion.div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                        }}
                        animate={{
                          background: [
                            'radial-gradient(circle, rgba(25,118,210,0.1) 0%, transparent 50%)',
                            'radial-gradient(circle, rgba(25,118,210,0.2) 10%, transparent 60%)',
                            'radial-gradient(circle, rgba(25,118,210,0.1) 0%, transparent 50%)',
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                      />
                    </Box>

                    {/* Training Metrics */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Training Metrics
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <LinearProgress 
                            variant="determinate" 
                            value={92} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption">Model Accuracy</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <LinearProgress 
                            variant="determinate" 
                            value={88} 
                            color="success"
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption">Data Processing</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </TrainingVisualizer>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StorageIcon color="primary" />
                    Available Knowledge Records
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {AVAILABLE_KNOWLEDGE_RECORDS.map((record) => (
                      <Grid item xs={12} key={record.id}>
                        <Paper 
                          sx={{ 
                            p: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: (theme) => theme.shadows[4]
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="600">
                                {record.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {record.type} • v{record.version}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip 
                                size="small"
                                label={record.status === 'active' ? 'Active' : 'Updating'}
                                color={record.status === 'active' ? 'success' : 'warning'}
                              />
                              <Chip 
                                size="small"
                                label={record.performance}
                                color={record.performance === 'High' ? 'primary' : 'default'}
                              />
                            </Box>
                          </Box>

                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={8}>
                              <Box sx={{ display: 'flex', gap: 3 }}>
                                <Box>
                                  <Typography variant="caption" color="text.secondary">Memory Usage</Typography>
                                  <Typography variant="body2" fontWeight="500">{record.memory}</Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="text.secondary">Documents</Typography>
                                  <Typography variant="body2" fontWeight="500">{record.documents.toLocaleString()}</Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="text.secondary">Accuracy</Typography>
                                  <Typography variant="body2" fontWeight="500">{record.accuracy}%</Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="text.secondary">Usage Count</Typography>
                                  <Typography variant="body2" fontWeight="500">{record.usageCount.toLocaleString()}</Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                {record.dataTypes.map((type) => (
                                  <Chip 
                                    key={type}
                                    label={type}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.75rem' }}
                                  />
                                ))}
                              </Box>
                            </Grid>
                          </Grid>

                          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTimeIcon fontSize="small" />
                              Last updated: {record.lastUpdated}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AnalyticsIcon fontSize="small" />
                              {record.insights}
                            </Typography>
                          </Box>

                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<PlayArrowIcon />}
                            >
                              Use Knowledge Base
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<AnalyticsIcon />}
                            >
                              View Analytics
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<SettingsIcon />}
                            >
                              Configure
                            </Button>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mr: 1 }}
                >
                  Upload New Data
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ManageSearchIcon />}
                >
                  Manage Sources
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setKnowledgeBaseOpen(false)}>Close</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={queryOptimizerOpen}
        onClose={() => setQueryOptimizerOpen(false)}
      >
        <DialogTitle>Query Optimizer</DialogTitle>
        <DialogContent>
          {/* Add query optimizer content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQueryOptimizerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <CustomAgentDesigner 
        open={customAgentDialogOpen}
        onClose={() => setCustomAgentDialogOpen(false)}
        onAgentCreated={handleAgentCreated}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem 
          onClick={() => handleDeleteClick(selectedAgent)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <ListItemText>Delete Agent</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Agent</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the agent "{selectedAgent?.name}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <TRRProcessingDialog
        open={trrProcessingDialogOpen}
        onClose={() => setTrrProcessingDialogOpen(false)}
      />

      <CSNPWorkflowDialog 
        open={csnpWorkflowOpen} 
        onClose={() => setCSNPWorkflowOpen(false)} 
      />

      <ProviderOutreachDialog 
        open={providerOutreachOpen}
        onClose={() => setProviderOutreachOpen(false)}
      />

      <MobileDeveloperAssistDialog
        open={mobileDeveloperAssistOpen}
        onClose={() => setMobileDeveloperAssistOpen(false)}
      />

      <ClaimCenterAIDialog
        open={claimCenterAIOpen}
        onClose={() => setClaimCenterAIOpen(false)}
      />

      <CareCostGapsCenterAIDialog
        open={careCostGapsCenterAIOpen}
        onClose={() => setCareCostGapsCenterAIOpen(false)}
      />

      <LegalAndCounselAgentDialog
        open={legalAndCounselAgentOpen}
        onClose={() => setLegalAndCounselAgentOpen(false)}
      />
    </Box>
  );
}

export default DesignAgent; 