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
    } else {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      method,
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in apiCall:", error);
    throw error;
  }
};