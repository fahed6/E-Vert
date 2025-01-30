 export const apiCall = async (
    url: string, // API endpoint URL
    method: string = 'GET', // HTTP method (default: GET)
    body?: any // Request body (optional)
  ) => {
    try {
      // Retrieve the Firebase ID token from localStorage
      const idToken = localStorage.getItem('firebaseIdToken');
      if (!idToken) {
        throw new Error("No token found. Please sign in.");
      }
  
      // Prepare the request options
      const requestOptions: RequestInit = {
        method: method.toUpperCase(), // Ensure the method is uppercase
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      };
  
      // Add the request body if provided
      if (body) {
        requestOptions.body = JSON.stringify(body);
      }
  
      // Make the API call
      const response = await fetch(url, requestOptions);
  
      // Handle the response
      if (response.ok) {
        const data = await response.json();
        return data; // Return the response data
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error in apiCall:", error);
      throw error; // Re-throw the error for handling in the calling function
    }
  };