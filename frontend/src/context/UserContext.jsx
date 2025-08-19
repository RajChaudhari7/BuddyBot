import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const userDataContext = createContext();

const UserDataProvider = ({ children }) => {
  // Define backendUrl as an array
  const backendUrl = ["http://localhost:3000", "https://buddy-bot-backend.vercel.app"];

  // Select the appropriate URL (e.g., based on environment or preference)
  const selectedBackendUrl = backendUrl[1]; // Use the Vercel URL (or switch logic as needed)

  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(selectedBackendUrl + '/api/user/current', {
        withCredentials: true,
      });
      if (result.data.success) {
        setUserData(result.data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(selectedBackendUrl + '/api/user/ask', { command }, { withCredentials: true });
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    backendUrl: selectedBackendUrl, // Pass the selected URL
    navigate,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    isLoading,
    getGeminiResponse,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserDataProvider;
