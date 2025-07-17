const fetchStories = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/jira/stories');
    const data = await response.json();
    
    console.log('Stories response:', data);

    if (data.error) {
      throw new Error(data.error);
    }

    if (data.success && data.issues) {
      setStories(data.issues);
    } else {
      setStories([]);
    }
  } catch (error) {
    console.error('Error fetching stories:', error);
    // Handle error appropriately
  }
}; 