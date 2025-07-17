import { getJiraConfig } from './jiraService';

export const getOpenAIConfig = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/config/openai');
    const data = await response.json();

    console.log('OpenAI config response:', {
      hasEnvKey: data.hasEnvKey,
      source: data.source,
      isValid: data.isValid
    });

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.hasEnvKey) {
      return null;
    }

    return {
      apiKey: data.maskedKey,
      source: data.source,
      model: data.model,
      isValid: true
    };
  } catch (error) {
    console.error('Error fetching OpenAI config:', error);
    return null;
  }
};

export const saveOpenAIConfig = async (config) => {
  try {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }
    localStorage.setItem('openaiConfig', JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving OpenAI config:', error);
    throw error;
  }
};

// Update the API request function to use server's environment variable when available
export const makeOpenAIRequest = async (endpoint, data) => {
  try {
    const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to make request');
    }

    return response;
  } catch (error) {
    console.error('OpenAI request error:', error);
    throw error;
  }
};

export const getConfiguration = async () => {
  try {
    const jiraConfig = await getJiraConfig();
    return {
      jira: jiraConfig,
      // ... other config
    };
  } catch (error) {
    console.error('Error fetching configuration:', error);
    throw error;
  }
}; 