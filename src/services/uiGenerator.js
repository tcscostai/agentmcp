// Add this import at the top
import { getOpenAIConfig } from './configService';

// Function to analyze project
export const analyzeProject = async (files) => {
  try {
    const relevantFiles = Array.from(files).filter(file => {
      const ext = file.name.toLowerCase().split('.').pop();
      return ['js', 'jsx', 'ts', 'tsx', 'css', 'scss', 'json'].includes(ext);
    });

    console.log('Analyzing files:', {
      total: files.length,
      relevant: relevantFiles.length
    });

    // Read files using FileReader
    const readFile = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            name: file.name,
            path: file.webkitRelativePath,
            type: file.name.split('.').pop(),
            content: e.target.result
          });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
      });
    };

    // Read all relevant files
    const fileContents = await Promise.all(
      relevantFiles.map(async (file) => {
        try {
          return await readFile(file);
        } catch (error) {
          console.warn(`Failed to read file ${file.name}:`, error);
          return {
            name: file.name,
            path: file.webkitRelativePath,
            type: file.name.split('.').pop(),
            content: null,
            error: error.message
          };
        }
      })
    );

    const structure = {
      files: fileContents,
      rootDir: files[0].webkitRelativePath.split('/')[0]
    };

    console.log('Analysis complete:', {
      filesProcessed: fileContents.length,
      rootDir: structure.rootDir
    });

    return {
      success: true,
      structure
    };
  } catch (error) {
    console.error('Error analyzing project:', error);
    throw new Error('Failed to analyze project: ' + error.message);
  }
};

// Function to optimize project structure for OpenAI
const optimizeProjectStructure = (files) => {
  // Only include relevant files and their basic info
  const relevantFiles = files.filter(file => {
    const ext = file.path.toLowerCase().split('.').pop();
    return ['js', 'jsx', 'ts', 'tsx', 'json'].includes(ext);
  }).map(file => ({
    path: file.path,
    type: file.type,
    // Only include first 500 chars of content for key files
    content: file.path.includes('App.') || file.path.includes('index.') 
      ? file.content?.substring(0, 500) 
      : undefined
  }));

  return {
    files: relevantFiles.slice(0, 20), // Limit number of files
    rootDir: files[0]?.path.split('/')[0]
  };
};

// Function to generate changes
export const generateChanges = async (formData) => {
  try {
    console.log('Generating changes for:', {
      componentName: formData.componentName,
      filesCount: formData.projectStructure.files.length
    });

    // Optimize project structure before sending
    const optimizedStructure = optimizeProjectStructure(formData.projectStructure.files);

    console.log('Optimized structure:', {
      originalFiles: formData.projectStructure.files.length,
      optimizedFiles: optimizedStructure.files.length
    });

    const response = await fetch('http://localhost:3001/api/generate-changes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OpenAI-Model': 'gpt-4'
      },
      body: JSON.stringify({
        componentName: formData.componentName,
        description: formData.description,
        projectStructure: optimizedStructure,
        targetPath: formData.targetPath,
        placement: formData.placement
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Server error:', data);
      throw new Error(data.details || data.error || 'Failed to generate changes');
    }

    if (!data.changes || !data.changes.modifications) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from server');
    }

    console.log('Changes generated successfully:', {
      hasChanges: true,
      modifications: data.changes.modifications.length,
      dependencies: data.changes.dependencies
    });

    return data;
  } catch (error) {
    console.error('Generation error:', error);
    throw error;
  }
};

// Function to apply changes
export const applyChanges = async (formData, changes) => {
  try {
    console.log('Applying changes:', {
      projectPath: formData.projectPath,
      changes: changes
    });

    const response = await fetch('http://localhost:3001/api/apply-changes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        changes,
        projectPath: formData.projectPath
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.details || data.error || 'Failed to apply changes');
    }

    console.log('Deployment results:', {
      success: data.success,
      message: data.message,
      files: data.files
    });

    return data;
  } catch (error) {
    console.error('Error applying changes:', error);
    throw error;
  }
}; 