import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  InputAdornment,
  FormHelperText,
  IconButton,
  StepContent,
  Avatar,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  HealthAndSafety as HealthIcon,
  Person as PersonIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  AutoFixHigh as AutoFixIcon,
  Mail as MailIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  Message as MessageIcon,
  Check as CheckCircleIcon,
  Description as FormIcon,
  Send as SendIcon,
  Star as StarIcon,
  SmartToy as SmartToyIcon,
  WebAsset as WebAssetIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const steps = [
  'Pre-Enrollment Validation',
  'CSNP Application',
  'Data Extraction & Validation',
  'Provider Verification',
  'Final Review',
  'Plan Recommendation'
];

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 122, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(0,122,255,0.05), rgba(88,86,214,0.05))',
    zIndex: 0,
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 122, 255, 0.15)',
  }
}));

const SearchCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 122, 255, 0.1)',
  marginBottom: theme.spacing(3),
}));

const AIAssistantCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.03), rgba(88, 86, 214, 0.05))',
  borderRadius: theme.shape.borderRadius * 3,
  border: '2px solid rgba(0, 122, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  marginTop: theme.spacing(3),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '200%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(0,122,255,0.1), transparent)',
    animation: 'shimmer 3s infinite',
  },
}));

function CSNPWorkflowDialog({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [memberData, setMemberData] = useState(null);
  const [missingFields, setMissingFields] = useState([]);
  const [providerOutreach, setProviderOutreach] = useState(null);
  const [eligibilityResults, setEligibilityResults] = useState(null);
  const [planRecommendations, setPlanRecommendations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [medicareId, setMedicareId] = useState('');
  const [chronicCondition, setChronicCondition] = useState('');
  const [preEnrollmentData, setPreEnrollmentData] = useState(null);
  const [duplicateCheck, setDuplicateCheck] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [canProceed, setCanProceed] = useState(false);
  const [applicationType, setApplicationType] = useState('');
  const [applicationNumber, setApplicationNumber] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [finalReviewData, setFinalReviewData] = useState(null);
  const [applicationAnalysis, setApplicationAnalysis] = useState(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationStatus, setVerificationStatus] = useState({});
  const [searchMethod, setSearchMethod] = useState('web');
  const [applicationData, setApplicationData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const resetWorkflowState = () => {
    setActiveStep(0);
    setLoading(false);
    setError('');
    setSuccess('');
    setMemberData(null);
    setMissingFields([]);
    setProviderOutreach(null);
    setEligibilityResults(null);
    setPlanRecommendations([]);
    setMedicareId('');
    setChronicCondition('');
    setPreEnrollmentData(null);
    setDuplicateCheck(null);
    setChatMessages([]);
    setCanProceed(false);
    setApplicationType('');
    setApplicationNumber('');
    setChatInput('');
    setFinalReviewData(null);
    setApplicationAnalysis(null);
    setEmail('');
    setVerificationStatus({});
    setSearchMethod('web');
    setApplicationData(null);
    setAiAnalysis(null);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      setAiAnalysis(null);
      setApplicationData(null);

      // Search for application in MongoDB
      const response = await fetch('http://localhost:3001/api/csnp/search-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchType: searchMethod,
          value: searchMethod === 'web' ? applicationNumber : email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Application not found');
      }

      setApplicationData(data.application);

      // Trigger AI validation and analysis
      const aiResponse = await fetch('http://localhost:3001/api/csnp/validate-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application: data.application })
      });

      const aiResult = await aiResponse.json();
      
      // Transform the AI analysis into the format expected by the UI
      setAiAnalysis({
        checks: [
          {
            name: 'Medicare Eligibility',
            status: aiResult.analysis.medicareEligible ? 'pass' : 'fail',
            details: aiResult.analysis.medicareDetails
          },
          {
            name: 'Chronic Conditions',
            status: aiResult.analysis.conditionsValid ? 'pass' : 'fail',
            details: aiResult.analysis.conditionsDetails
          },
          {
            name: 'Required Documents',
            status: aiResult.analysis.documentsComplete ? 'pass' : 'fail',
            details: aiResult.analysis.documentDetails
          },
          {
            name: 'Data Completeness',
            status: aiResult.analysis.dataComplete ? 'pass' : 'fail',
            details: aiResult.analysis.missingFields.length === 0 ? 
              'All required data is present' : 
              `Missing fields: ${aiResult.analysis.missingFields.join(', ')}`
          }
        ],
        recommendation: aiResult.analysis.recommendation,
        canProceedToEligibility: aiResult.analysis.canProceedToEligibility
      });

    } catch (error) {
      console.error('Search error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchResults([]);
    setError('');
  }, [searchQuery]);

  const resetTestData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/csnp/reset-test-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reset test data');
      }

      const data = await response.json();
      console.log('Test data reset:', data);
    } catch (error) {
      console.error('Reset test data error:', error);
    }
  };

  const handleSearchApplication = async () => {
    try {
      setLoading(true);
      setError('');
      setVerificationStatus({
        applicationNumber: 'pending',
        medicareId: 'pending',
        chronicCondition: 'pending'
      });

      const response = await fetch(`http://localhost:3001/api/csnp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ applicationNumber })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify application');
      }

      // Update verification status based on the response
      setVerificationStatus({
        applicationNumber: 'verified',
        medicareId: data.medicareStatus ? 'verified' : 'error',
        chronicCondition: data.chronicCondition ? 'verified' : 'error',
        documents: data.documents ? 'verified' : 'pending'
      });

      setPreEnrollmentData(data);
      setSuccess('Application found and verified successfully');
    } catch (error) {
      console.error('Application search error:', error);
      setError(error.message);
      setVerificationStatus({
        applicationNumber: 'error',
        medicareId: 'error',
        chronicCondition: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSearch = async () => {
    try {
      setLoading(true);
      setError('');
      setVerificationStatus({
        email: 'pending',
        application: 'pending'
      });

      const response = await fetch(`http://localhost:3001/api/csnp/search-by-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to find application by email');
      }

      if (data.found) {
        setVerificationStatus({
          email: 'verified',
          application: 'verified'
        });
        setPreEnrollmentData(data.application);
        setSuccess('Application found via email successfully');
      } else {
        setVerificationStatus({
          email: 'verified',
          application: 'error'
        });
        setError('No application found for this email address');
      }
    } catch (error) {
      console.error('Email search error:', error);
      setError(error.message);
      setVerificationStatus({
        email: 'error',
        application: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToEligibility = async () => {
    try {
      setLoading(true);
      setError('');

      // Format chronic conditions for the API
      const formattedConditions = applicationData.chronicConditions.map(condition => ({
        name: condition.name,
        diagnosisDate: condition.diagnosisDate,
        severity: condition.severity
      }));

      // Call the eligibility check endpoint
      const response = await fetch('http://localhost:3001/api/csnp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicationNumber: applicationData.applicationNumber,
          medicareId: applicationData.medicareId,
          conditions: formattedConditions,
          applicant: applicationData.applicant,
          effectiveDate: applicationData.submissionDate
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check eligibility');
      }

      // Update the eligibility results
      setEligibilityResults(data);
      
      // If eligible, move to the next step and show success message
      if (data.eligible) {
        setSuccess('Eligibility verified successfully. Proceeding to application processing.');
        setActiveStep((prevStep) => prevStep + 1);
        
        // Set pre-enrollment data for next steps
        setPreEnrollmentData({
          ...applicationData,
          eligibilityResults: data
        });

        // Trigger the application analysis for the next step
        const analysisResponse = await fetch('http://localhost:3001/api/csnp/analyze-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicationNumber: applicationData.applicationNumber,
            medicareId: applicationData.medicareId,
            chronicCondition: formattedConditions[0].name, // Primary condition
            applicant: applicationData.applicant
          })
        });

        const analysisData = await analysisResponse.json();
        setApplicationAnalysis(analysisData.analysis);

      } else {
        setError('Applicant does not meet eligibility criteria: ' + data.details);
      }

    } catch (error) {
      console.error('Eligibility check error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSelect = async (member) => {
    resetWorkflowState();
    
    try {
      setLoading(true);
      console.log('Selected member:', member.memberId);

      if (member.memberId === 'CSNP749117') {
        await resetTestData();
      }
      
      const response = await fetch(`http://localhost:3001/api/csnp/member/${member.memberId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch member details');
      }
      
      const data = await response.json();
      if (!data.success || !data.member) {
        throw new Error('Invalid member data received');
      }

      console.log('Fetched member data:', {
        memberId: data.member.memberId,
        name: data.member.name,
        documents: data.member.eligibilityDocuments.map(doc => ({
          type: doc.type,
          verified: doc.verified,
          verifiedType: typeof doc.verified
        }))
      });

      const processedMemberData = {
        ...data.member,
        eligibilityDocuments: data.member.eligibilityDocuments.map(doc => ({
          ...doc,
          verified: doc.verified === true
        }))
      };

      setMemberData(processedMemberData);
      await validateData(processedMemberData);
      
    } catch (error) {
      console.error('Member selection error:', error);
      setError('Failed to load member data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateData = async (member) => {
    setLoading(true);
    try {
      console.log('Starting validation for member:', member.memberId);
      const missing = [];

      if (member.eligibilityDocuments && Array.isArray(member.eligibilityDocuments)) {
        console.log('Raw document data:', member.eligibilityDocuments);

        const unverifiedDocs = member.eligibilityDocuments.filter(doc => {
          const isVerified = doc.verified === true;
          console.log(`Document ${doc.type}:`, {
            verified: doc.verified,
            isVerified: isVerified,
            type: typeof doc.verified
          });
          return !isVerified;
        });

        if (unverifiedDocs.length > 0) {
          missing.push('Verified Eligibility Documents');
          console.log('Unverified documents found:', unverifiedDocs);
        }
      }

      const requiredFields = [
        { field: 'dateOfBirth', label: 'Date of Birth' },
        { field: 'chronicConditions', label: 'Chronic Conditions' },
        { field: 'primaryCareProvider', label: 'Primary Care Provider' },
        { field: 'medications', label: 'Medications' }
      ];

      requiredFields.forEach(({ field, label }) => {
        if (!member[field] || 
            (Array.isArray(member[field]) && member[field].length === 0) ||
            (typeof member[field] === 'object' && Object.keys(member[field]).length === 0)) {
          missing.push(label);
        }
      });

      setMemberData(member);
      setMissingFields(missing);
      setActiveStep(1);

      console.log('Validation results:', {
        memberId: member.memberId,
        name: member.name,
        missingFields: missing,
        hasUnverifiedDocs: missing.includes('Verified Eligibility Documents'),
        documents: member.eligibilityDocuments.map(doc => ({
          type: doc.type,
          verified: doc.verified
        }))
      });

      if (missing.length === 0) {
        setSuccess('All required data is present and verified');
      } else {
        setSuccess('');
        if (missing.includes('Verified Eligibility Documents')) {
          setError('Documents require verification from provider');
        } else {
          setError(`Missing information: ${missing.join(', ')}`);
        }
      }

    } catch (error) {
      console.error('Data validation error:', error);
      setError('Data validation failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderOutreach = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/csnp/provider-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: memberData.memberId,
          missingFields,
          provider: memberData.primaryCareProvider
        })
      });
      
      if (!response.ok) {
        throw new Error('Provider outreach request failed');
      }

      const data = await response.json();
      console.log('Provider outreach response:', data);
      
      if (data.success && data.member) {
        setMemberData(data.member);
        setSuccess('Provider outreach completed successfully');
        setActiveStep(2);
        setMissingFields([]);
      } else {
        throw new Error('Invalid response from provider outreach');
      }
    } catch (error) {
      console.error('Provider outreach error:', error);
      setError('Provider outreach failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoPopulate = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/csnp/auto-populate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: memberData.memberId,
          missingFields,
          providerResponse: providerOutreach
        })
      });
      const data = await response.json();
      setMemberData({ ...memberData, ...data.populatedData });
      setActiveStep(4);
    } catch (error) {
      setError('Failed to auto-populate data');
    } finally {
      setLoading(false);
    }
  };

  const handleEligibilityCheck = async () => {
    setLoading(true);
    setError('');
    try {
      const applicantData = memberData || preEnrollmentData;
      
      if (!applicantData) {
        throw new Error('No application data available');
      }

      console.log('Starting eligibility check for:', applicantData);
      
      const response = await fetch('http://localhost:3001/api/csnp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: applicantData.medicareId,
          applicationNumber: applicantData.applicationNumber,
          conditions: applicantData.chronicCondition || applicantData.chronicConditions,
          effectiveDate: new Date().toISOString(),
          applicant: applicantData.applicant || {
            firstName: applicantData.firstName,
            lastName: applicantData.lastName
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || `Eligibility check failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Eligibility results:', data);

      setEligibilityResults(data);

      if (data.eligible) {
        setSuccess('Applicant is eligible for CSNP enrollment');
        setActiveStep(4);
        await getFinalReview();
      } else {
        setError('Applicant does not meet eligibility criteria');
      }

    } catch (error) {
      console.error('Eligibility check error:', error);
      setError('Failed to check eligibility: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFinalReview = async () => {
    try {
      const applicantData = memberData || preEnrollmentData;
      
      const response = await fetch('http://localhost:3001/api/csnp/final-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationNumber: applicantData.applicationNumber,
          medicareId: applicantData.medicareId,
          chronicCondition: applicantData.chronicCondition,
          applicant: applicantData.applicant,
          eligibilityResults
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate final review');
      }

      const data = await response.json();
      setFinalReviewData(data.review);
    } catch (error) {
      console.error('Final review error:', error);
      setError('Failed to generate final review: ' + error.message);
    }
  };

  const getPlanRecommendations = useCallback(async () => {
    try {
      const applicantData = memberData || preEnrollmentData;
      
      if (!applicantData) {
        throw new Error('No application data available');
      }

      setIsLoadingPlans(true);
      const response = await fetch('http://localhost:3001/api/csnp/recommend-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: applicantData.medicareId,
          applicationNumber: applicantData.applicationNumber,
          conditions: applicantData.chronicCondition || applicantData.chronicConditions,
          medications: applicantData.medications || []
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to get plan recommendations');
      }

      const data = await response.json();
      console.log('Plan recommendations response:', data);

      if (!data.success || !Array.isArray(data.recommendations)) {
        throw new Error('Invalid plan recommendations format received');
      }

      setPlanRecommendations(data.recommendations);
      setSuccess('Plan recommendations generated successfully');
    } catch (error) {
      console.error('Plan recommendations error:', error);
      setError('Failed to get plan recommendations: ' + error.message);
      setPlanRecommendations([]);
    } finally {
      setIsLoadingPlans(false);
    }
  }, [memberData, preEnrollmentData]);

  useEffect(() => {
    if (memberData) {
      console.log('Member data updated:', memberData);
    }
  }, [memberData]);

  useEffect(() => {
    console.log('Member data changed:', {
      memberId: memberData?.memberId,
      name: memberData?.name,
      documentsVerified: memberData?.eligibilityDocuments?.map(doc => ({
        type: doc.type,
        verified: doc.verified
      }))
    });
  }, [memberData]);

  useEffect(() => {
    console.log('Missing fields updated:', missingFields);
  }, [missingFields]);

  useEffect(() => {
    console.log('Active step changed:', activeStep);
  }, [activeStep]);

  const handlePreEnrollmentValidation = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:3001/api/csnp/pre-enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicareId,
          chronicCondition
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Pre-enrollment validation failed');
      }

      setPreEnrollmentData(data);
      setCanProceed(true);
      setSuccess('Pre-enrollment validation successful');
      setActiveStep(1); // Move to CSNP Application step
    } catch (error) {
      console.error('Pre-enrollment error:', error);
      setError(error.message);
      setCanProceed(false);
    } finally {
      setLoading(false);
    }
  };

  const checkDuplicateProspect = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/csnp/check-duplicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicareId,
          memberData: preEnrollmentData
        })
      });

      const data = await response.json();
      setDuplicateCheck(data);
      return data.isDuplicate;
    } catch (error) {
      console.error('Duplicate check error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAIAssistant = async (message) => {
    try {
      setChatMessages(prev => [...prev, { text: message, isBot: false }]);
      setLoading(true);
      
      const response = await fetch('http://localhost:3001/api/csnp/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationNumber: preEnrollmentData.applicationNumber,
          application: preEnrollmentData,
          message,
          context: activeStep
        })
      });
      
      if (!response.ok) {
        throw new Error('AI Assistant failed to respond');
      }

      const data = await response.json();
      
      // Add the AI response to chat
      setChatMessages(prev => [...prev, { 
        text: data.response,
        isBot: true,
        isStructured: true
      }]);

      // Handle validation results
      if (data.validationResults) {
        if (data.validationResults.isValid) {
          setSuccess('Application validated successfully');
          setCanProceed(true);
          
          // Add proceed message with button
          setChatMessages(prev => [...prev, {
            text: "All checks have passed! You can now proceed to the next step.",
            isBot: true,
            showProceedButton: true
          }]);

          // Set plan recommendations if available
          if (data.planRecommendations) {
            setPlanRecommendations(data.planRecommendations);
          }
        } else {
          setError('Please address the identified issues');
          data.validationResults.recommendations.forEach(recommendation => {
            setChatMessages(prev => [...prev, {
              text: `📋 ${recommendation}`,
              isBot: true
            }]);
          });
          setCanProceed(false);
        }
      }

    } catch (error) {
      console.error('AI Assistant error:', error);
      setChatMessages(prev => [...prev, {
        text: "I apologize, but I'm having trouble analyzing the application. Please try again or contact support for assistance.",
        isBot: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessOpsSupport = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/csnp/ops-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: preEnrollmentData?.medicareId || memberData?.memberId,
          step: activeStep,
          chronicCondition: preEnrollmentData?.chronicCondition,
          issue: 'Additional assistance needed',
          timestamp: new Date().toISOString()
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setSuccess('Ops team has been notified');
      } else {
        throw new Error(data.error || 'Failed to contact Ops team');
      }
    } catch (error) {
      console.error('Ops Support error:', error);
      setError('Failed to contact Ops team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationLookup = async () => {
    try {
      setLoading(true);
      setError('');

      // Add console.log to debug the application number
      console.log('Looking up application number:', applicationNumber);

      // Clean the application number (remove any whitespace)
      const cleanedAppNumber = applicationNumber.trim();

      // Validate application number format
      const appNumberPattern = /^APP-\d{4}-\d{4}$/;
      if (!appNumberPattern.test(cleanedAppNumber)) {
        throw new Error('Invalid application number format. Please use format: APP-YYYY-NNNN');
      }

      const response = await fetch(`http://localhost:3001/api/csnp/application/${cleanedAppNumber}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to find application');
      }

      console.log('Application found:', data); // Debug log

      // Set pre-enrollment data from application
      setPreEnrollmentData({
        applicationNumber: data.application.applicationNumber,
        medicareId: data.application.medicareId,
        chronicCondition: data.application.chronicCondition,
        applicant: data.application.applicant,
        documents: data.application.documents,
        status: data.application.status
      });

      setSuccess('Application found successfully');
    } catch (error) {
      console.error('Application lookup error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getApplicationAnalysis = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/csnp/analyze-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicationNumber: preEnrollmentData.applicationNumber,
            medicareId: preEnrollmentData.medicareId,
            chronicCondition: preEnrollmentData.chronicCondition,
            applicant: preEnrollmentData.applicant
          })
        });

        const data = await response.json();
        setApplicationAnalysis(data.analysis);
      } catch (error) {
        console.error('Application analysis error:', error);
      }
    };

    if (preEnrollmentData) {
      getApplicationAnalysis();
    }
  }, [preEnrollmentData]);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPreEnrollmentContent();
      case 1:
        return renderApplicationContent();
      case 2:
        return renderDataExtractionContent();
      case 3:
        return renderProviderVerificationContent();
      case 4:
        return renderFinalReviewContent();
      case 5:
        return renderPlanRecommendations();
      default:
        return null;
    }
  };

  const renderPreEnrollmentContent = () => (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Pre-Enrollment Validation
      </Typography>

      {/* Application Search Section */}
      <SearchCard>
        {renderSearchMethodSelection()}
        
        {renderSearchForm()}
      </SearchCard>

      {/* AI Analysis Section */}
      {renderAIAnalysis()}
    </Box>
  );

  const renderSearchMethodSelection = () => (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel>Search Method</InputLabel>
      <Select
        value={searchMethod}
        onChange={(e) => setSearchMethod(e.target.value)}
        label="Search Method"
      >
        <MenuItem value="web">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WebAssetIcon /> Web Portal Application
          </Box>
        </MenuItem>
        <MenuItem value="email">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MailIcon /> Direct Email Application
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );

  const renderSearchForm = () => (
    <Box sx={{ mt: 2 }}>
      {searchMethod === 'web' ? (
        <TextField
          fullWidth
          label="Application Number"
          value={applicationNumber}
          onChange={(e) => setApplicationNumber(e.target.value)}
          placeholder="APP-2024-0001"
          helperText="Enter the application number (e.g., APP-2024-0001)"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssignmentIcon />
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <TextField
          fullWidth
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          helperText="Enter the applicant's email address"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailIcon />
              </InputAdornment>
            ),
          }}
        />
      )}

      <Button
        fullWidth
        variant="contained"
        onClick={handleSearch}
        disabled={loading || (!applicationNumber && !email)}
        sx={{ 
          mt: 2,
          background: 'linear-gradient(45deg, #007AFF, #5856D6)',
          '&:hover': {
            background: 'linear-gradient(45deg, #0055B2, #4745B0)',
          }
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            <span>Searching...</span>
          </Box>
        ) : (
          'Search Application'
        )}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );

  const renderAIAnalysis = () => (
    applicationData && (
      <AIAssistantCard>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main',
            boxShadow: '0 4px 12px rgba(0,122,255,0.3)'
          }}>
            <SmartToyIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" color="primary.main">
              AI Application Validation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Application #{applicationData.applicationNumber}
            </Typography>
          </Box>
        </Box>

        {aiAnalysis ? (
          <>
            <List>
              {aiAnalysis.checks.map((check, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {check.status === 'pass' ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <ErrorIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1" fontWeight={500}>
                        {check.name}
                      </Typography>
                    }
                    secondary={check.details}
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: 'primary.light',
              borderRadius: 2,
              color: 'white'
            }}>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                AI Recommendation
              </Typography>
              <Typography>
                {aiAnalysis.recommendation}
              </Typography>
            </Box>

            {aiAnalysis.canProceedToEligibility ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleProceedToEligibility}
                sx={{ 
                  mt: 3,
                  background: 'linear-gradient(45deg, #007AFF, #5856D6)',
                  boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
                }}
                startIcon={<CheckCircleIcon />}
              >
                Proceed to Eligibility Check
              </Button>
            ) : (
              <Alert severity="warning" sx={{ mt: 3 }}>
                Please resolve the identified issues before proceeding with eligibility check.
              </Alert>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>
              Analyzing application...
            </Typography>
          </Box>
        )}
      </AIAssistantCard>
    )
  );

  const renderApplicationContent = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        CSNP Application Process
      </Typography>

      {duplicateCheck && (
        <Alert 
          severity={duplicateCheck.isDuplicate ? "warning" : "success"} 
          sx={{ mb: 2 }}
        >
          {duplicateCheck.message}
        </Alert>
      )}

      {preEnrollmentData && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Applicant Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText 
                      primary={`${preEnrollmentData.applicant.firstName} ${preEnrollmentData.applicant.lastName}`}
                      secondary="Applicant Name"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText 
                      primary={preEnrollmentData.medicareId}
                      secondary="Medicare ID"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><HealthIcon /></ListItemIcon>
                    <ListItemText 
                      primary={preEnrollmentData.chronicCondition}
                      secondary="Chronic Condition"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Condition Analysis
                </Typography>
                {applicationAnalysis ? (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      {applicationAnalysis.summary}
                    </Typography>
                    <List>
                      {applicationAnalysis.keyPoints.map((point, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircleIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={point} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  const renderDataExtractionContent = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Data Analysis Results
      </Typography>
      
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            Analyzing member data...
          </Typography>
        </Box>
      ) : (
        <>
          {missingFields.includes('Verified Eligibility Documents') ? (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Document verification required. Provider outreach needed.
              </Alert>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Document Verification Status:
                </Typography>
                <List>
                  {memberData.eligibilityDocuments.map((doc, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {doc.verified === true ? (
                          <CheckIcon color="success" />
                        ) : (
                          <WarningIcon color="warning" />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={doc.type}
                        secondary={doc.verified === true ? 'Verified' : 'Requires Provider Verification'}
                      />
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="contained"
                  onClick={handleProviderOutreach}
                  startIcon={<MailIcon />}
                  sx={{ mt: 2 }}
                >
                  Contact Provider for Document Verification
                </Button>
              </Box>
            </>
          ) : missingFields.length > 0 ? (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                The following information needs to be verified or completed:
              </Alert>
              <List>
                {missingFields.map((field) => (
                  <ListItem key={field}>
                    <ListItemIcon>
                      <WarningIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={field}
                      secondary={
                        field === 'Verified Eligibility Documents' 
                          ? 'Documents require verification from provider'
                          : 'Information needs to be completed'
                      }
                    />
                  </ListItem>
                ))}
              </List>
              {memberData.eligibilityDocuments && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Document Verification Status:
                  </Typography>
                  <List dense>
                    {memberData.eligibilityDocuments.map((doc, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {doc.verified === true ? (
                            <CheckIcon color="success" />
                          ) : (
                            <WarningIcon color="warning" />
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={doc.type}
                          secondary={doc.verified === true ? 'Verified' : 'Requires Verification'}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              <Button
                variant="contained"
                onClick={handleProviderOutreach}
                startIcon={<MailIcon />}
                sx={{ mt: 2 }}
              >
                Contact Provider for Missing Information
              </Button>
            </>
          ) : (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                All required information is present and verified. Ready to proceed with eligibility check.
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <StyledCard>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Document Status
                      </Typography>
                      <List dense>
                        {memberData.eligibilityDocuments.map((doc, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <CheckIcon color="success" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={doc.type}
                              secondary="Verified"
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </StyledCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledCard>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Member Information
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                          <ListItemText primary="Date of Birth" secondary={new Date(memberData.dateOfBirth).toLocaleDateString()} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                          <ListItemText primary="Provider" secondary={memberData.primaryCareProvider.name} />
                        </ListItem>
                      </List>
                    </CardContent>
                  </StyledCard>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                onClick={handleEligibilityCheck}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <AssessmentIcon />}
                sx={{ mt: 3 }}
              >
                {loading ? 'Checking Eligibility...' : 'Check Eligibility'}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );

  const renderProviderVerificationContent = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Provider Verification
      </Typography>
      {memberData && (
        <Card sx={{ mb: 3, p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Primary Care Provider Details
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText 
                primary={memberData.primaryCareProvider.name}
                secondary={`NPI: ${memberData.primaryCareProvider.npi}`}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><HealthIcon /></ListItemIcon>
              <ListItemText 
                primary={memberData.primaryCareProvider.clinic}
              />
            </ListItem>
          </List>
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            Provider has been contacted and documents have been verified.
          </Alert>
          <Button
            variant="contained"
            onClick={() => setActiveStep(4)}
            startIcon={<CheckIcon />}
            sx={{ mt: 2 }}
          >
            Proceed to Data Review
          </Button>
        </Card>
      )}

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleBusinessOpsSupport}
          startIcon={<MailIcon />}
          disabled={loading}
        >
          Contact Ops Support
        </Button>
      </Box>
    </Box>
  );

  const renderFinalReviewContent = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Final Review
      </Typography>
      
      {!finalReviewData ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            Generating final review...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Application Summary
                </Typography>
                <Box sx={{ whiteSpace: 'pre-line' }}>
                  {finalReviewData.summary}
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Key Observations
                </Typography>
                <List>
                  {finalReviewData.observations.map((observation, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={observation} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Recommendations
                </Typography>
                <List>
                  {finalReviewData.recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <StarIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </StyledCard>
          </Grid>

          {eligibilityResults?.eligible && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setActiveStep(5);
                    getPlanRecommendations();
                  }}
                  startIcon={<StarIcon />}
                  size="large"
                >
                  View Plan Recommendations
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );

  const renderPlanRecommendations = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Personalized Plan Recommendations
      </Typography>
      <PlanRecommendationsContent 
        planRecommendations={planRecommendations}
        getPlanRecommendations={getPlanRecommendations}
        isLoadingPlans={isLoadingPlans}
        error={error}
      />
    </Box>
  );

  const handleNext = () => {
    if (activeStep === 0) {
      handleSearch();
    } else if (activeStep === 3) {
      handleEligibilityCheck();
    }
  };

  const LoadingOverlay = () => (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1000,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          Processing eligibility check...
        </Typography>
      </Box>
    </Box>
  );

  const handleClose = () => {
    resetWorkflowState();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HealthIcon color="primary" />
          <Typography>CSNP Workflow</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        {activeStep === 0 && (
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading || (!searchQuery && !applicationNumber)}
            startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
          >
            Search
          </Button>
        )}
        {activeStep === 1 && (
          <Button
            variant="contained"
            onClick={handleEligibilityCheck}
            disabled={loading || (!memberData && !preEnrollmentData)}
            startIcon={loading ? <CircularProgress size={20} /> : <AssessmentIcon />}
          >
            {loading ? 'Checking Eligibility...' : 'Check Eligibility'}
          </Button>
        )}
        {activeStep === 4 && eligibilityResults?.eligible && (
          <Button
            variant="contained"
            onClick={() => setActiveStep(5)}
            startIcon={<CheckIcon />}
          >
            View Recommendations
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

const ChatMessage = ({ message, onProceed }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: message.isBot ? 'flex-start' : 'flex-end',
      mb: 1,
    }}
  >
    <Paper
      sx={{
        p: 1.5,
        bgcolor: message.isBot ? 'grey.100' : 'primary.light',
        color: message.isBot ? 'text.primary' : 'white',
        maxWidth: '80%',
        borderRadius: message.isBot ? '0 12px 12px 12px' : '12px 0 12px 12px',
      }}
    >
      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
        {message.text}
      </Typography>
      
      {message.showProceedButton && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={onProceed}
            startIcon={<CheckIcon />}
          >
            Proceed to Next Step
          </Button>
        </Box>
      )}
    </Paper>
  </Box>
);

const PlanRecommendationsContent = ({ 
  planRecommendations, 
  getPlanRecommendations, 
  isLoadingPlans, 
  error 
}) => {
  useEffect(() => {
    if (planRecommendations.length === 0) {
      getPlanRecommendations();
    }
  }, [planRecommendations, getPlanRecommendations]);

  if (isLoadingPlans) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Generating Personalized Plan Recommendations
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          We're analyzing your condition and creating tailored plans...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!planRecommendations?.length) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No plan recommendations available. Please try again.
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      {planRecommendations.map((plan, index) => (
        <Grid item xs={12} md={6} key={index}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="primary">
                  {plan.name || 'Plan Option'}
                </Typography>
                {plan.starRating && (
                  <Chip 
                    label={`★ ${plan.starRating}`}
                    color="primary"
                    size="small"
                  />
                )}
              </Box>

              <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Coverage Level: {plan.coverageLevel}
                </Typography>
              </Box>

              {plan.specializedBenefits?.length > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Specialized Benefits
                  </Typography>
                  <List dense>
                    {plan.specializedBenefits.map((benefit, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {plan.coverageDetails && (
                <>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Coverage Details
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {plan.coverageDetails.primaryCare && (
                      <Typography variant="body2">
                        Primary Care: {plan.coverageDetails.primaryCare}
                      </Typography>
                    )}
                    {plan.coverageDetails.specialists && (
                      <Typography variant="body2">
                        Specialists: {plan.coverageDetails.specialists}
                      </Typography>
                    )}
                    {plan.coverageDetails.hospitalStays && (
                      <Typography variant="body2">
                        Hospital: {plan.coverageDetails.hospitalStays}
                      </Typography>
                    )}
                    {plan.coverageDetails.prescriptionDrugs && (
                      <Typography variant="body2">
                        Prescriptions: {plan.coverageDetails.prescriptionDrugs}
                      </Typography>
                    )}
                  </Box>
                </>
              )}

              {plan.bestFor && (
                <Box sx={{ mt: 2, p: 1, bgcolor: 'primary.light', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="white">
                    Best For: {plan.bestFor}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default CSNPWorkflowDialog; 