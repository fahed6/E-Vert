import React, { useEffect, useState } from 'react';
import { apiCall } from '../config/api/apiCall';

const HomePage: React.FC = () => {
  const [data, setData] = useState<any>(null); // State to store the API response
  const [error, setError] = useState<string | null>(null); // State to store errors

  useEffect(() => {
    const fetchData = async () => {
      try {
  
        const response = await apiCall('http://localhost:5000/user', 'GET');
        setData(response); // Store the response data in state
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again."); // Set error message
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []);

  return (
    <div>
      <h1>Hello New User</h1>

      {/* Display the raw JSON data */}
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre> // Pretty-print the JSON data
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p> // Display error message
      ) : (
        <p>Loading...</p> // Display loading message
      )}
    </div>
  );
};

export default HomePage;