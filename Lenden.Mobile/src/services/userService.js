// src/services/userService.js
import axiosInstance from "./axios";

export const sendGoogleUserToBackend = async (userDetails) => {
  const { email, fullName, googleId, pictureUrl } = userDetails;

  try {
    const response = await axiosInstance.post(
      "UserApi", // The endpoint, relative to the baseURL
      {}, // An empty request body, as required by the backend
      {
        params: {
          // The data to be sent as URL query parameters
          email,
          fullName,
          googleId,
          pictureUrl,
        },
      }
    );

    console.log("User data sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error sending user data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
