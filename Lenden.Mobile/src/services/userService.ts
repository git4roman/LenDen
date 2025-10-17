import axiosInstance from "./axios";
import * as SecureStore from "expo-secure-store";
import { UserLoginDto, UserRegisterDto } from "@/src/types";

// export const onAuthenticate = async (userRegisterDto: UserRegisterDto) => {
//   try {
//     const response = await axiosInstance.post(
//       "/AuthApi/authenticate",
//       userRegisterDto
//     );
//     await SecureStore.setItemAsync("userToken", response.data.token);
//   } catch (error) {
//     console.error("Error authenticating user:", error);
//   }
// };

export const onLoginService = async (userLoginDto: UserLoginDto) => {
  try {
    const response = await axiosInstance.post(
      "/AuthApi/auth/google/login",
      userLoginDto
    );
    await SecureStore.setItemAsync("userToken", response.data.token);
  } catch (error) {
    console.error("Error authenticating user:", error);
  }
};

export const onRegisterService = async (userRegisterDto: UserRegisterDto) => {
  const response = await axiosInstance.post(
    "/AuthApi/auth/google/register",
    userRegisterDto
  );
  await SecureStore.setItemAsync("userToken", response.data.token);
  return response.data;
};
