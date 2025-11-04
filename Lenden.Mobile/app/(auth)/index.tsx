import React, { useEffect } from "react";
import { Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, fetchUserFromAuth } from "@/src/store";
import { fetchMe, logout } from "@/src/store/authSlice";
import {
  signInWithGoogle,
  signOutGoogle,
  onLoginService,
  onRegisterService,
} from "@/src/services";
import { UserLoginDto, UserRegisterDto } from "@/src/types";
import { loginStyles as styles } from "@/src/styles";
import GoogleButton from "@/src/components/GoogleButton";
import LoginScreen from "@/src/screens/auth/loginScreen";
import SignupScreen from "@/src/screens/auth/signUpScreen";

const Authenticate = () => {
  const user = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [loginVisible, setLoginVisible] = React.useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        try {
          const authResult = await dispatch(fetchMe()).unwrap();
          if (authResult?.userId && authResult.userId !== 0) {
            await dispatch(fetchUserFromAuth()).unwrap();
          } else {
            console.log("No valid userId found, skipping user fetch");
          }
        } catch {
          await SecureStore.deleteItemAsync("userToken");
        }
      }
    };
    checkUser();
  }, []);

  const onSignUpPress = async () => {
    try {
      const currentUser = await signInWithGoogle();
      if (currentUser) {
        const dto: UserRegisterDto = {
          authProvider: "google",
          email: currentUser.email,
          fullName: currentUser.displayName || "",
          googleId: currentUser.uid,
          pictureUrl: currentUser.photoURL || "",
          password: "",
        };
        await onRegisterService(dto);

        await dispatch(fetchMe()).unwrap();
        await dispatch(fetchUserFromAuth());
        router.replace("/(tabs)/(groups)");
      }
    } catch (e: any) {
      await signOutGoogle();
      const status = e?.response?.status;
      const message = e?.response?.data?.message;
      if (status === 409) {
        Toast.show({
          type: "error",
          text1: "Account Already Exists",
          text2: "Please use Sign In instead",
          topOffset: 100,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Sign Up Failed",
          text2: message || e.message || "Please try again",
        });
      }
    }
  };

  const onSignInPress = async () => {
    try {
      const currentUser = await signInWithGoogle();
      if (currentUser) {
        const dto: UserLoginDto = {
          authProvider: "google",
          googleId: currentUser.uid,
          email: currentUser.email,
          password: "",
        };
        await onLoginService(dto);
        await dispatch(fetchMe()).unwrap();
        await dispatch(fetchUserFromAuth());
        router.replace("/(tabs)/(groups)");
        // router.replace("/(auth)/askPhoneNumber");
      }
    } catch (e: any) {
      await signOutGoogle();
      console.error("Google sign-in error:", e.response || e.message);
      const status = e?.response?.status;
      const message = e?.response?.data?.message;
      if (status === 409) {
        Toast.show({
          type: "error",
          text1: "Account Already Exists",
          text2: "Please use Sign In instead",
          topOffset: 100,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Sign In Failed",
          text2: message || e.message || "Please try again",
        });
      }
    }
  };

  const onSignOut = async () => {
    await signOutGoogle();
    await SecureStore.deleteItemAsync("userToken");
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Welcome to LenDen</Text> */}
      {loginVisible ? (
        <LoginScreen setLoginVisible={setLoginVisible} />
      ) : (
        <SignupScreen setLoginVisible={setLoginVisible} />
      )}
      <GoogleButton onPress={onSignInPress} title="Sign in with Google" />
      <GoogleButton onPress={onSignUpPress} title="Sign up with Google" />
    </View>
  );
};

export default Authenticate;
