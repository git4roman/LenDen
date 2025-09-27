import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  signInWithGoogle,
  signOutGoogle,
  onAuthenticate,
} from "@/src/services";
import { loginStyles as styles } from "@/src/styles";
import { UserRegisterDto } from "@/src/types";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, fetchUserFromAuth } from "../../src/store";
import { fetchMe, logout } from "@/src/store/authSlice";

const Authenticate = () => {
  const user = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkUser = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        try {
          await dispatch(fetchMe()).unwrap();
          await dispatch(fetchUserFromAuth());
        } catch {
          await SecureStore.deleteItemAsync("userToken");
        }
      }
    };
    checkUser();
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      const currentUser = await signInWithGoogle();
      if (currentUser) {
        const userRegisterDto: UserRegisterDto = {
          email: currentUser.email,
          fullName: currentUser.displayName || "",
          googleId: currentUser.uid,
          pictureUrl: currentUser.photoURL || "",
        };
        await onAuthenticate(userRegisterDto);
        await dispatch(fetchMe()).unwrap();
        await dispatch(fetchUserFromAuth());
        router.replace("/(tabs)/(groups)");
      }
    } catch (e) {
      console.error("Google sign-in error:", e);
    }
  };

  const onSignOut = async () => {
    try {
      await signOutGoogle();
      await SecureStore.deleteItemAsync("userToken");
      dispatch(logout());
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to LenDen</Text>

      <GoogleSigninButton onPress={onGoogleButtonPress} />
    </View>
  );
};

export default Authenticate;
