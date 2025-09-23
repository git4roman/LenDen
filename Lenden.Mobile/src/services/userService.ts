import axiosInstance from "./axios";
import * as SecureStore from "expo-secure-store";
import { UserRegisterDto } from "@/src/types";

// export const sendGoogleUserToBackend = async (userDetails) => {
//   const { googleId } = userDetails;

//   try {
//     const response = await axiosInstance.post("/AuthApi/login", {
//       googleId,
//     });
  
//     console.log("Backend login response:", response.data);
//     const token = response.data.token;
//     await SecureStore.setItemAsync("userToken", token);

//     return token;
//   } catch (error) {
//     console.error(
//       "Error sending Google user to backend:",
//       error.response ? error.response.data : error.message
//     );
//     throw error;
//   }  
// };

export const onRegister = async (userRegisterDto: UserRegisterDto) => {
  try {
    const response = await axiosInstance.post(
      "/AuthApi/register",
      userRegisterDto
    );
    console.log("User registered:", response.data);
    await SecureStore.setItemAsync("userToken", response.data.token);
  } catch (error) {
    console.error("Error registering user:", error);
  }
};
