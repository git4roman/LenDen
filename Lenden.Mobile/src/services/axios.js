import axios from "axios";
// or any other storage solution

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// axiosInstance.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     } catch (error) {
//       return Promise.reject(error);
//     }
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => {
//     // This runs for successful responses
//     return response;
//   },
//   (error) => {
//     // This runs for errors
//     if (error.response && error.response.status === 401) {
//       console.log("Authentication failed. Logging out...");
//       // Implement logic to clear user data and navigate to the login screen
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
