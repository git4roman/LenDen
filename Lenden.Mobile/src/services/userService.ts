import axiosInstance from "./axios";
import * as SecureStore from "expo-secure-store";
import { UserRegisterDto } from "@/src/types";

export const onAuthenticate = async (userRegisterDto: UserRegisterDto) => {
  try {
    const response = await axiosInstance.post(
      "/AuthApi/authenticate",
      userRegisterDto
    );
    await SecureStore.setItemAsync("userToken", response.data.token);
  } catch (error) {
    console.error("Error authenticating user:", error);
  }
};
