export const apiCall = async (
  url: string,
  method: string = 'GET',
  body?: any
) => {
  try {
    const idToken = localStorage.getItem('firebaseIdToken');
    if (!idToken) {
      throw new Error("No token found. Please sign in.");
    }

    const requestOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    console.log("Sending Request:", { url, method, body }); // Log request

    const response = await fetch(url, requestOptions);
    console.log("Received Response:", response); // Log response

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
     
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error in apiCall:", error);
      throw error; 
    }
  };