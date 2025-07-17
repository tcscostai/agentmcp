const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const FigmaService = require('../services/figmaService');
require('dotenv').config();

// Debug: Log environment variables
console.log('Environment variables loaded:', {
  hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  hasFigmaKey: !!process.env.FIGMA_ACCESS_TOKEN,
  hasFigmaTemplate: !!process.env.FIGMA_TEMPLATE_FILE_KEY,
  nodeEnv: process.env.NODE_ENV
});

// Set up multer for file uploads
const uploadsDir = path.resolve(path.join(__dirname, '../../uploads'));

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory at:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Initialize OpenAI with error handling
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('OpenAI client initialized successfully');
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
}

// Initialize Figma with error handling
let figmaService;
try {
  figmaService = new FigmaService({
    accessToken: process.env.FIGMA_ACCESS_TOKEN,
    templateFileKey: process.env.FIGMA_TEMPLATE_FILE_KEY
  });
  console.log('Figma service initialized successfully');
} catch (error) {
  console.error('Error initializing Figma service:', error);
}

// PDF Document Analysis route
router.post('/analyze/document', upload.single('file'), async (req, res) => {
  console.log('Received document analysis request');
  try {
    // Debug: Log request details
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file');

    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ 
        success: false, 
        error: 'No document uploaded' 
      });
    }

    const { platform = 'ios', architecture = 'native' } = req.body;
    console.log('Analysis parameters:', { platform, architecture });

    let documentContent;
    if (req.file.mimetype === 'application/pdf') {
      try {
        console.log('Processing PDF file...');
        // Add options for PDF parsing
        const options = {
          pagerender: renderPage,
          max: 0, // No page limit
          version: 'v2.0.550'
        };

        const pdfData = await pdfParse(req.file.buffer, options);
        documentContent = pdfData.text;
        
        if (!documentContent || documentContent.trim().length === 0) {
          console.error('PDF parsing resulted in empty content');
          return res.status(400).json({
            success: false,
            error: 'Could not extract text from PDF. The file might be corrupted or contain only images.'
          });
        }

        console.log('PDF parsed successfully, content length:', documentContent.length);
      } catch (pdfError) {
        console.error('Error parsing PDF:', pdfError);
        
        // Try alternative parsing method
        try {
          console.log('Attempting alternative PDF parsing method...');
          const pdfData = await pdfParse(req.file.buffer, { max: 0 });
          documentContent = pdfData.text;
          
          if (!documentContent || documentContent.trim().length === 0) {
            throw new Error('Alternative parsing method failed to extract text');
          }
          
          console.log('Alternative PDF parsing successful');
        } catch (altPdfError) {
          console.error('Alternative PDF parsing failed:', altPdfError);
          return res.status(400).json({ 
            success: false, 
            error: 'Unable to parse PDF file. Please ensure the file is not corrupted and contains extractable text.' 
          });
        }
      }
    } else if (req.file.mimetype === 'text/plain') {
      documentContent = req.file.buffer.toString('utf-8');
      console.log('Text file read successfully, content length:', documentContent.length);
    } else {
      console.error('Unsupported file type:', req.file.mimetype);
      return res.status(400).json({ 
        success: false, 
        error: 'Unsupported file type. Please upload a PDF or text file.' 
      });
    }

    if (!documentContent || documentContent.trim().length === 0) {
      console.error('Empty document content');
      return res.status(400).json({ 
        success: false, 
        error: 'Document is empty or contains no extractable text' 
      });
    }

    if (!openai) {
      console.error('OpenAI client not initialized');
      return res.status(500).json({
        success: false,
        error: 'OpenAI client not properly initialized'
      });
    }

    console.log('Sending request to OpenAI');
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert mobile app architect. Analyze the provided technical document and create a comprehensive mobile app architecture and implementation plan. Focus on ${platform} platform and ${architecture} architecture.`
          },
          {
            role: "user",
            content: `Please analyze this technical document and provide a detailed mobile app architecture and implementation plan. The response should be a JSON object with the following structure:
            {
              "systemArchitecture": {
                "overview": "High-level architecture description",
                "components": ["List of main components"],
                "diagram": "Architecture diagram description"
              },
              "technologyStack": {
                "frontend": ["List of frontend technologies"],
                "backend": ["List of backend technologies"],
                "database": ["List of database technologies"],
                "devOps": ["List of DevOps tools"]
              },
              "implementationPhases": [
                {
                  "phase": "Phase name",
                  "description": "Phase description",
                  "duration": "Estimated duration",
                  "deliverables": ["List of deliverables"]
                }
              ],
              "keyFeatures": [
                {
                  "name": "Feature name",
                  "description": "Feature description",
                  "priority": "High/Medium/Low",
                  "dependencies": ["List of dependencies"]
                }
              ],
              "securityConsiderations": [
                {
                  "area": "Security area",
                  "description": "Security consideration description",
                  "mitigation": "Mitigation strategy"
                }
              ],
              "performanceOptimization": [
                {
                  "area": "Optimization area",
                  "strategy": "Optimization strategy",
                  "expectedImpact": "Expected performance impact"
                }
              ],
              "testingStrategy": {
                "unitTesting": "Unit testing approach",
                "integrationTesting": "Integration testing approach",
                "e2eTesting": "End-to-end testing approach",
                "performanceTesting": "Performance testing approach"
              },
              "deploymentPlan": {
                "environments": ["List of environments"],
                "deploymentSteps": ["List of deployment steps"],
                "rollbackStrategy": "Rollback strategy description"
              }
            }
            
            Document content:
            ${documentContent}`
          }
        ],
        response_format: { type: "json_object" }
      });

      console.log('Received response from OpenAI');
      const response = completion.choices[0].message.content;
      console.log('Response content:', response);

      try {
        const analysis = JSON.parse(response);
        console.log('Successfully parsed JSON response');
        
        // Validate required sections
        const requiredSections = [
          'systemArchitecture',
          'technologyStack',
          'implementationPhases',
          'keyFeatures',
          'securityConsiderations',
          'performanceOptimization',
          'testingStrategy',
          'deploymentPlan'
        ];

        const missingSections = requiredSections.filter(section => !analysis[section]);
        if (missingSections.length > 0) {
          console.error('Missing required sections:', missingSections);
          return res.status(500).json({
            success: false,
            error: `Missing required sections: ${missingSections.join(', ')}`
          });
        }

        console.log('Sending successful response');
        return res.json({
          success: true,
          analysis
        });
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        return res.status(500).json({
          success: false,
          error: 'Error parsing analysis response: ' + parseError.message
        });
      }
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      return res.status(500).json({
        success: false,
        error: 'OpenAI API error: ' + openaiError.message
      });
    }
  } catch (error) {
    console.error('Error in document analysis:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error analyzing document'
    });
  }
});

// Helper function for PDF page rendering
async function renderPage(pageData) {
  try {
    const renderOptions = {
      normalizeWhitespace: true,
      disableCombineTextItems: false
    };
    
    const textContent = await pageData.getTextContent(renderOptions);
    const text = textContent.items.map(item => item.str).join(' ');
    return text;
  } catch (error) {
    console.error('Error rendering PDF page:', error);
    return '';
  }
}

// System Requirements Check route
router.post('/check-requirements', async (req, res) => {
  console.log('Received requirements check request');
  try {
    const { platform, architecture } = req.body;
    console.log('Requirements check parameters:', { platform, architecture });

    // Mock successful check results
    const mockCheckResults = {
      ios: {
        requirements: [
          {
            name: "Xcode",
            version: "14.0+",
            currentVersion: "15.2",
            status: "success",
            description: "Apple's integrated development environment for iOS development",
            installationGuide: "https://developer.apple.com/xcode/",
            verificationCommand: "xcodebuild -version"
          },
          {
            name: "iOS SDK",
            version: "16.0+",
            currentVersion: "17.2",
            status: "success",
            description: "Software development kit for iOS development",
            installationGuide: "https://developer.apple.com/ios/",
            verificationCommand: "xcrun --show-sdk-version"
          },
          {
            name: "CocoaPods",
            version: "1.12.0+",
            currentVersion: "1.15.2",
            status: "success",
            description: "Dependency manager for iOS projects",
            installationGuide: "https://cocoapods.org/",
            verificationCommand: "pod --version"
          },
          {
            name: "Swift",
            version: "5.0+",
            currentVersion: "5.9",
            status: "success",
            description: "Programming language for iOS development",
            installationGuide: "https://swift.org/download/",
            verificationCommand: "swift --version"
          },
          {
            name: "Git",
            version: "2.0+",
            currentVersion: "2.42.0",
            status: "success",
            description: "Version control system",
            installationGuide: "https://git-scm.com/downloads",
            verificationCommand: "git --version"
          }
        ]
      },
      android: {
        requirements: [
          {
            name: "Android Studio",
            version: "2022.1+",
            currentVersion: "2023.1.1",
            status: "success",
            description: "Official IDE for Android development",
            installationGuide: "https://developer.android.com/studio",
            verificationCommand: "studio.sh --version"
          },
          {
            name: "Android SDK",
            version: "33+",
            currentVersion: "34",
            status: "success",
            description: "Software development kit for Android development",
            installationGuide: "https://developer.android.com/studio#command-tools",
            verificationCommand: "sdkmanager --list"
          },
          {
            name: "Gradle",
            version: "7.0+",
            currentVersion: "8.4",
            status: "success",
            description: "Build automation tool",
            installationGuide: "https://gradle.org/install/",
            verificationCommand: "gradle --version"
          },
          {
            name: "Java",
            version: "11+",
            currentVersion: "17.0.9",
            status: "success",
            description: "Programming language and runtime",
            installationGuide: "https://adoptium.net/",
            verificationCommand: "java -version"
          },
          {
            name: "Git",
            version: "2.0+",
            currentVersion: "2.42.0",
            status: "success",
            description: "Version control system",
            installationGuide: "https://git-scm.com/downloads",
            verificationCommand: "git --version"
          }
        ]
      }
    };

    // Get requirements based on platform
    const requirementsData = mockCheckResults[platform.toLowerCase()];

    if (!requirementsData) {
      console.error('Invalid platform:', platform);
      return res.status(400).json({
        success: false,
        error: 'Invalid platform specified'
      });
    }

    console.log('Returning mock check results for platform:', platform);

    res.json({
      success: true,
      requirements: requirementsData.requirements
    });
  } catch (error) {
    console.error('Error in requirements check:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error checking requirements'
    });
  }
});

// Add this new route after the existing routes
router.post('/generate-wireframes', async (req, res) => {
  try {
    const { architecturePlan, platform, architecture } = req.body;
    console.log('Received wireframe generation request:', { platform, architecture });

    if (!architecturePlan || !platform || !architecture) {
      console.log('Missing parameters:', { architecturePlan: !!architecturePlan, platform: !!platform, architecture: !!architecture });
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters: architecturePlan, platform, and architecture are required' 
      });
    }

    // Create a prompt for OpenAI to generate Figma wireframe specifications
    const prompt = `Generate detailed wireframe specifications for a ${platform} mobile app based on the following architecture plan. 
    The specifications should be in a format that can be easily imported into Figma.
    Return the response as a valid JSON object with the following structure:
    {
      "name": "App Name",
      "wireframes": [
        {
          "screenName": "Screen Name",
          "components": [
            {
              "type": "Component Type",
              "properties": {
                "width": "width in pixels or 'auto'",
                "height": "height in pixels or 'auto'",
                "backgroundColor": "hex color code",
                "borderRadius": "radius in pixels",
                "padding": "padding in pixels"
              },
              "children": []
            }
          ]
        }
      ]
    }

    Architecture Plan:
    ${architecturePlan}

    Platform: ${platform}
    Architecture: ${architecture}

    Generate wireframe specifications that follow ${platform} design guidelines and best practices.`;

    console.log('Sending request to OpenAI for wireframe generation...');
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a UI/UX expert specializing in mobile app wireframe design. Generate detailed wireframe specifications that can be imported into Figma. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    console.log('Received response from OpenAI');
    let wireframeSpecs;
    try {
      wireframeSpecs = JSON.parse(openaiResponse.choices[0].message.content);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return res.status(500).json({
        success: false,
        error: 'Error parsing OpenAI response: ' + parseError.message,
        details: openaiResponse.choices[0].message.content
      });
    }

    // If OpenAI returned an error object instead of a valid spec
    if (wireframeSpecs.error) {
      console.error('OpenAI returned error:', wireframeSpecs.error);
      return res.status(400).json({
        success: false,
        error: wireframeSpecs.error
      });
    }

    // Validate the wireframe specifications
    if (!wireframeSpecs || !wireframeSpecs.wireframes || !Array.isArray(wireframeSpecs.wireframes)) {
      console.error('Invalid wireframe specifications format:', wireframeSpecs);
      return res.status(400).json({
        success: false,
        error: 'Invalid wireframe specifications format. Please provide a detailed architecture plan.'
      });
    }

    // Generate a unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `wireframes-${timestamp}.json`;

    // Create a preview of the wireframes
    const preview = {
      name: wireframeSpecs.name,
      totalScreens: wireframeSpecs.wireframes.length,
      screens: wireframeSpecs.wireframes.map(screen => ({
        name: screen.screenName,
        components: screen.components || []
      }))
    };

    console.log('Created preview:', preview);

    // Save the wireframe JSON to disk
    const wireframeJson = JSON.stringify(wireframeSpecs, null, 2);
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, wireframeJson, 'utf-8');

    // Create the response object
    const response = {
      success: true,
      message: 'Wireframe specifications generated successfully',
      name: wireframeSpecs.name,
      previewScreens: wireframeSpecs.wireframes.length,
      screens: wireframeSpecs.wireframes.map(screen => ({
        name: screen.screenName,
        components: screen.components || []
      })),
      downloadUrl: `/api/mobile/download-wireframes/${filename}`
    };

    console.log('Sending response to client:', {
      success: response.success,
      message: response.message,
      previewScreens: response.previewScreens,
      screens: response.screens,
      downloadUrl: response.downloadUrl
    });

    // Send the response
    res.json(response);

  } catch (error) {
    console.error('Error in wireframe generation:', error);
    res.status(500).json({ 
      success: false, 
      error: `Error in wireframe generation: ${error.message}`,
      details: error.stack
    });
  }
});

// Add a new route for downloading the wireframe file
router.get('/download-wireframes/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename
    if (!filename || !filename.endsWith('.json')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename format. Must end with .json'
      });
    }

    const filePath = path.join(uploadsDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      return res.status(404).json({
        success: false,
        error: 'Wireframe file not found'
      });
    }

    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Verify it's valid JSON
    try {
      JSON.parse(fileContent);
    } catch (parseError) {
      console.error('Invalid JSON in file:', parseError);
      return res.status(500).json({
        success: false,
        error: 'Invalid JSON content in file'
      });
    }

    // Set headers for JSON file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Pragma', 'no-cache');
    
    // Send the file content
    return res.send(fileContent);
  } catch (error) {
    console.error('Error downloading wireframe file:', error);
    return res.status(500).json({
      success: false,
      error: `Error downloading wireframe file: ${error.message}`
    });
  }
});

// Add this new test route before the other routes
router.get('/test-figma', async (req, res) => {
  try {
    if (!figmaService) {
      return res.status(500).json({
        success: false,
        error: 'Figma service not initialized'
      });
    }

    // Test file access
    const fileDetails = await figmaService.getFileDetails(process.env.FIGMA_TEMPLATE_FILE_KEY);
    
    res.json({
      success: true,
      message: 'Figma configuration is valid',
      fileDetails: {
        name: fileDetails.name,
        lastModified: fileDetails.lastModified,
        version: fileDetails.version,
        document: fileDetails.document
      }
    });
  } catch (error) {
    console.error('Figma test failed:', error);
    res.status(500).json({
      success: false,
      error: `Figma test failed: ${error.message}`,
      details: error.response?.data || 'No additional details available'
    });
  }
});

// Add new route for code generation
router.post('/generate-code', async (req, res) => {
  try {
    const { architecturePlan, platform, architecture, wireframes } = req.body;

    if (!architecturePlan || !platform || !architecture || !wireframes) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }

    // Generate project structure based on platform and architecture
    const projectStructure = await generateProjectStructure(platform, architecture, wireframes);
    
    // Generate code files based on the structure
    const generatedCode = await generateCodeFiles(projectStructure, wireframes);

    return res.json({
      success: true,
      projectStructure: JSON.stringify(projectStructure, null, 2),
      code: generatedCode
    });
  } catch (error) {
    console.error('Error generating code:', error);
    return res.status(500).json({
      success: false,
      error: `Error generating code: ${error.message}`
    });
  }
});

// Helper function to generate project structure
async function generateProjectStructure(platform, architecture, wireframes) {
  const structure = {
    name: `${platform}-${architecture}-app`,
    platform,
    architecture,
    version: '1.0.0',
    directories: {},
    files: []
  };

  // Add platform-specific structure
  if (platform === 'iOS') {
    structure.directories = {
      'Sources': {
        'App': [],
        'Features': {},
        'Core': {
          'Network': [],
          'Storage': [],
          'Utils': []
        },
        'UI': {
          'Components': [],
          'Screens': [],
          'Resources': []
        }
      },
      'Tests': {
        'Unit': [],
        'Integration': [],
        'UI': []
      },
      'Resources': []
    };
  } else if (platform === 'Android') {
    structure.directories = {
      'app': {
        'src': {
          'main': {
            'java': {
              'com': {
                'app': {
                  'features': {},
                  'core': {
                    'network': [],
                    'storage': [],
                    'utils': []
                  },
                  'ui': {
                    'components': [],
                    'screens': [],
                    'resources': []
                  }
                }
              }
            },
            'res': []
          }
        }
      },
      'tests': {
        'unit': [],
        'integration': [],
        'ui': []
      }
    };
  }

  // Add wireframe-based structure
  if (wireframes && wireframes.screens) {
    wireframes.screens.forEach(screen => {
      const screenName = screen.name.toLowerCase().replace(/\s+/g, '_');
      if (platform === 'iOS') {
        structure.directories.Sources.UI.Screens.push(screenName);
      } else if (platform === 'Android') {
        structure.directories.app.src.main.java.com.app.ui.screens.push(screenName);
      }
    });
  }

  return structure;
}

// Helper function to generate code files
async function generateCodeFiles(projectStructure, wireframes) {
  const files = {};

  // Generate platform-specific base files
  if (projectStructure.platform === 'iOS') {
    files['AppDelegate.swift'] = generateiOSAppDelegate();
    files['SceneDelegate.swift'] = generateiOSSceneDelegate();
    files['Info.plist'] = generateiOSInfoPlist();
    
    // Generate screen files
    if (wireframes && wireframes.screens) {
      wireframes.screens.forEach(screen => {
        const screenName = screen.name.toLowerCase().replace(/\s+/g, '_');
        files[`${screenName}ViewController.swift`] = generateiOSViewController(screen);
        files[`${screenName}View.swift`] = generateiOSView(screen);
      });
    }
  } else if (projectStructure.platform === 'Android') {
    files['build.gradle'] = generateAndroidBuildGradle();
    files['AndroidManifest.xml'] = generateAndroidManifest();
    
    // Generate screen files
    if (wireframes && wireframes.screens) {
      wireframes.screens.forEach(screen => {
        const screenName = screen.name.toLowerCase().replace(/\s+/g, '_');
        files[`${screenName}Activity.kt`] = generateAndroidActivity(screen);
        files[`${screenName}ViewModel.kt`] = generateAndroidViewModel(screen);
        files[`activity_${screenName}.xml`] = generateAndroidLayout(screen);
      });
    }
  }

  return files;
}

// Helper functions for generating specific files
function generateiOSAppDelegate() {
  return `import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }
}`;
}

function generateiOSSceneDelegate() {
  return `import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = UINavigationController(rootViewController: HomeViewController())
        window?.makeKeyAndVisible()
    }
}`;
}

function generateiOSInfoPlist() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>$(DEVELOPMENT_LANGUAGE)</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$(PRODUCT_NAME)</string>
    <key>CFBundlePackageType</key>
    <string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UIApplicationSceneManifest</key>
    <dict>
        <key>UIApplicationSupportsMultipleScenes</key>
        <false/>
    </dict>
    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
    </array>
</dict>
</plist>`;
}

function generateAndroidBuildGradle() {
  return `plugins {
    id 'com.android.application'
    id 'kotlin-android'
    id 'kotlin-kapt'
}

android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.app"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    
    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.7.0'
    implementation 'androidx.appcompat:appcompat:1.4.1'
    implementation 'com.google.android.material:material:1.5.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.3'
}`;
}

function generateAndroidManifest() {
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.app">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.App">
        <activity
            android:name=".ui.screens.home.HomeActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
}

function generateiOSViewController(screen) {
  const screenName = screen.name.replace(/\s+/g, '');
  return `import UIKit

class ${screenName}ViewController: UIViewController {
    private let customView: ${screenName}View
    
    init() {
        customView = ${screenName}View()
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func loadView() {
        view = customView
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        title = "${screen.name}"
        // Add your setup code here
    }
}`;
}

function generateiOSView(screen) {
  const screenName = screen.name.replace(/\s+/g, '');
  return `import UIKit

class ${screenName}View: UIView {
    // MARK: - UI Components
    ${generateUIComponents(screen)}
    
    // MARK: - Initialization
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - UI Setup
    private func setupUI() {
        backgroundColor = .systemBackground
        ${generateUISetup(screen)}
    }
}

// MARK: - UI Components Generation
${generateUIComponentsCode(screen)}`;
}

function generateAndroidActivity(screen) {
  const screenName = screen.name.replace(/\s+/g, '');
  return `package com.app.ui.screens.${screenName.toLowerCase()}

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider

class ${screenName}Activity : AppCompatActivity() {
    private lateinit var viewModel: ${screenName}ViewModel
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_${screenName.toLowerCase()})
        
        viewModel = ViewModelProvider(this)[${screenName}ViewModel::class.java]
        setupUI()
    }
    
    private fun setupUI() {
        title = "${screen.name}"
        // Add your setup code here
    }
}`;
}

function generateAndroidViewModel(screen) {
  const screenName = screen.name.replace(/\s+/g, '');
  return `package com.app.ui.screens.${screenName.toLowerCase()}

import androidx.lifecycle.ViewModel

class ${screenName}ViewModel : ViewModel() {
    // Add your ViewModel code here
}`;
}

function generateAndroidLayout(screen) {
  const screenName = screen.name.toLowerCase();
  return `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    ${generateAndroidLayoutComponents(screen)}

</androidx.constraintlayout.widget.ConstraintLayout>`;
}

// Helper functions for generating UI components
function generateUIComponents(screen) {
  if (!screen.components) return '';
  
  return screen.components.map((component, index) => {
    const componentName = component.name.replace(/\s+/g, '');
    return `private let ${componentName}: ${getComponentType(component.type)}`;
  }).join('\n    ');
}

function generateUISetup(screen) {
  if (!screen.components) return '';
  
  return screen.components.map((component, index) => {
    const componentName = component.name.replace(/\s+/g, '');
    return `addSubview(${componentName})`;
  }).join('\n        ');
}

function generateUIComponentsCode(screen) {
  if (!screen.components) return '';
  
  return screen.components.map((component, index) => {
    const componentName = component.name.replace(/\s+/g, '');
    return `private func create${componentName}() -> ${getComponentType(component.type)} {
    let component = ${getComponentType(component.type)}()
    component.translatesAutoresizingMaskIntoConstraints = false
    // Add component configuration here
    return component
}`;
  }).join('\n\n');
}

function generateAndroidLayoutComponents(screen) {
  if (!screen.components) return '';
  
  return screen.components.map((component, index) => {
    const componentName = component.name.toLowerCase().replace(/\s+/g, '_');
    return `<${getAndroidComponentType(component.type)}
    android:id="@+id/${componentName}"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="${component.name}"
    app:layout_constraintTop_toTopOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    android:layout_margin="16dp" />`;
  }).join('\n\n    ');
}

function getComponentType(type) {
  const typeMap = {
    'button': 'UIButton',
    'label': 'UILabel',
    'textField': 'UITextField',
    'imageView': 'UIImageView',
    'tableView': 'UITableView',
    'collectionView': 'UICollectionView',
    'stackView': 'UIStackView',
    'scrollView': 'UIScrollView'
  };
  return typeMap[type.toLowerCase()] || 'UIView';
}

function getAndroidComponentType(type) {
  const typeMap = {
    'button': 'com.google.android.material.button.MaterialButton',
    'label': 'TextView',
    'textField': 'com.google.android.material.textfield.TextInputLayout',
    'imageView': 'ImageView',
    'tableView': 'androidx.recyclerview.widget.RecyclerView',
    'collectionView': 'androidx.recyclerview.widget.RecyclerView',
    'stackView': 'LinearLayout',
    'scrollView': 'ScrollView'
  };
  return typeMap[type.toLowerCase()] || 'View';
}

module.exports = router; 