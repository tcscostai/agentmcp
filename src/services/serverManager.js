const SERVER_URL = 'http://localhost:3001';

export const checkServerStatus = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/status`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Server status check failed:', error);
    return { status: 'stopped' };
  }
};

export const startServer = async () => {
  try {
    // Just call start directly since we're not actually spawning a new process
    const response = await fetch(`${SERVER_URL}/api/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Server start failed:', error);
    throw error;
  }
};

export const stopServer = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Server stop failed:', error);
    throw error;
  }
}; 