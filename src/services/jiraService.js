export const getJiraConfig = async () => {
  try {
    const response = await fetch('/api/jira/config');
    if (!response.ok) {
      throw new Error(`Failed to fetch Jira config: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getJiraConfig:', error);
    throw error;
  }
};

export const saveJiraConfig = async (config) => {
  try {
    const response = await fetch('/api/jira/config/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    if (!response.ok) {
      throw new Error(`Failed to save Jira config: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in saveJiraConfig:', error);
    throw error;
  }
};

export const getJiraProjects = async () => {
  try {
    const response = await fetch('/api/jira/projects');
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in getJiraProjects:', error);
    throw error;
  }
};

export const testJiraConnection = async () => {
  try {
    const response = await fetch('/api/jira/test');
    if (!response.ok) {
      throw new Error(`Connection test failed: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error in testJiraConnection:', error);
    throw error;
  }
}; 