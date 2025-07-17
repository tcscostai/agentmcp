const axios = require('axios');
require('dotenv').config();

class FigmaService {
  constructor(config) {
    if (!config.accessToken) {
      throw new Error('Figma access token is required');
    }
    if (!config.templateFileKey) {
      throw new Error('Figma template file key is required');
    }

    this.accessToken = config.accessToken;
    this.templateFileKey = config.templateFileKey;
    this.apiBaseUrl = 'https://api.figma.com/v1';
    
    // Log configuration (without sensitive data)
    console.log('FigmaService initialized with:', {
      templateFileKey: this.templateFileKey,
      apiBaseUrl: this.apiBaseUrl
    });
  }

  async createFile(name, wireframeSpecs) {
    try {
      console.log('Attempting to create Figma file with template:', this.templateFileKey);
      
      // First, verify the template file exists and get its details
      try {
        const fileCheck = await axios.get(
          `${this.apiBaseUrl}/files/${this.templateFileKey}`,
          {
            headers: {
              'X-Figma-Token': this.accessToken
            }
          }
        );
        console.log('Template file exists:', {
          name: fileCheck.data.name,
          type: fileCheck.data.type,
          lastModified: fileCheck.data.lastModified
        });
      } catch (error) {
        console.error('Template file check failed:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          url: error.config?.url
        });
        throw new Error(`Template file not found or not accessible: ${error.response?.data?.message || error.message}`);
      }

      // Create a new file by copying the template
      console.log('Creating new file from template...');
      const createResponse = await axios.post(
        `${this.apiBaseUrl}/files/${this.templateFileKey}/copy`,
        {
          name: name
        },
        {
          headers: {
            'X-Figma-Token': this.accessToken,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!createResponse.data || !createResponse.data.key) {
        throw new Error('Failed to create Figma file: No file key returned');
      }

      const fileKey = createResponse.data.key;
      console.log('File created successfully:', fileKey);

      // Update the new file with wireframe specifications
      console.log('Updating file with wireframe specifications...');
      const updateResponse = await axios.patch(
        `${this.apiBaseUrl}/files/${fileKey}`,
        this.convertSpecsToFigmaFormat(wireframeSpecs),
        {
          headers: {
            'X-Figma-Token': this.accessToken,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!updateResponse.data) {
        throw new Error('Failed to update Figma file with wireframes');
      }

      console.log('File updated successfully');
      return {
        fileKey,
        fileUrl: `https://www.figma.com/file/${fileKey}/${encodeURIComponent(name)}`,
        name
      };
    } catch (error) {
      console.error('Error creating Figma file:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        endpoint: error.config?.url,
        data: error.response?.data
      });
      throw new Error(`Failed to create Figma file: ${error.response?.data?.message || error.message}`);
    }
  }

  convertSpecsToFigmaFormat(wireframeSpecs) {
    // Convert wireframe specifications to Figma format
    const frames = wireframeSpecs.wireframes.map((screen, index) => ({
      id: `frame-${index}`,
      name: screen.screenName,
      type: 'FRAME',
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'FIXED',
      itemSpacing: 16,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 16,
      paddingBottom: 16,
      width: 375, // Standard mobile width
      height: 812, // Standard mobile height
      backgroundColor: { r: 1, g: 1, b: 1, a: 1 }, // White background
      children: screen.components.map((component, compIndex) => ({
        id: `component-${index}-${compIndex}`,
        name: component.type,
        type: 'FRAME',
        layoutMode: 'HORIZONTAL',
        primaryAxisSizingMode: 'AUTO',
        counterAxisSizingMode: 'AUTO',
        itemSpacing: 8,
        paddingLeft: component.properties.padding || 0,
        paddingRight: component.properties.padding || 0,
        paddingTop: component.properties.padding || 0,
        paddingBottom: component.properties.padding || 0,
        width: component.properties.width || 'auto',
        height: component.properties.height || 'auto',
        backgroundColor: this.hexToRgb(component.properties.backgroundColor || '#FFFFFF'),
        cornerRadius: component.properties.borderRadius || 0,
        children: component.children || []
      }))
    }));

    return {
      name: wireframeSpecs.name || 'Wireframes',
      children: [
        {
          id: 'page-1',
          name: 'Wireframes',
          type: 'CANVAS',
          children: frames,
          backgroundColor: { r: 0.96, g: 0.96, b: 0.96, a: 1 }
        }
      ]
    };
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { r: 1, g: 1, b: 1, a: 1 }; // Default to white
    return {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
      a: 1
    };
  }

  async shareFile(fileKey, email) {
    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/files/${fileKey}/sharing`,
        {
          email: email,
          role: 'EDITOR'
        },
        {
          headers: {
            'X-Figma-Token': this.accessToken
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error sharing Figma file:', error);
      throw new Error(`Failed to share Figma file: ${error.message}`);
    }
  }

  async getFileDetails(fileKey) {
    try {
      console.log('Attempting to get file details for:', fileKey);
      
      // First, verify the access token
      const meResponse = await axios.get(
        `${this.apiBaseUrl}/me`,
        {
          headers: {
            'X-Figma-Token': this.accessToken
          }
        }
      );
      
      console.log('Access token verified for user:', meResponse.data.email);

      // Then get file details
      const response = await axios.get(
        `${this.apiBaseUrl}/files/${fileKey}`,
        {
          headers: {
            'X-Figma-Token': this.accessToken
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting file details:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
        data: error.response?.data
      });

      if (error.response?.status === 403) {
        throw new Error(
          'Permission denied. Please ensure:\n' +
          '1. Your access token has the correct permissions (files:read, files:write)\n' +
          '2. The file is shared with your Figma account\n' +
          '3. Your access token is valid and not expired'
        );
      }

      throw new Error(`Failed to get file details: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = FigmaService; 