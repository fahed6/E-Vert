export const apiCall = async (
  url: string,
  method: string,
  data?: any,
  options?: { headers?: Record<string, string> }
) => {
  try {
    const headers = options?.headers || {};

    // If data is FormData, don't set Content-Type header
    if (data instanceof FormData) {
      delete headers["Content-Type"];
    } else if (method !== 'GET' && method !== 'DELETE') {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      method,
      headers,
      body: method !== 'GET' && method !== 'DELETE' 
        ? (data instanceof FormData ? data : JSON.stringify(data))
        : undefined,
    });

    // Handle empty responses for DELETE requests
    if (method === 'DELETE' && response.status === 204) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Only try to parse JSON if there's content
    const contentLength = response.headers.get('Content-Length');
    if (contentLength && parseInt(contentLength) > 0) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error in apiCall:", error);
    throw error;
  }
};