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

const Authenticate = () => {
  const [user, setUser] = useState<null | any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      setUser(!!token);
    };
    checkUser();
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      const currentUser = await signInWithGoogle();
      if (currentUser) {
        setUser(true);
        const userRegisterDto: UserRegisterDto = {
          email: currentUser.email,
          fullName: currentUser.displayName || "",
          googleId: currentUser.uid,
          pictureUrl: currentUser.photoURL || "",
        };
        await onAuthenticate(userRegisterDto);
        console.log("User signed in: ", currentUser.email);
        router.replace("/(tabs)/(groups)");
      }
    } catch (e) {
      console.error("Google sign-in error: ", e);
    }
  };

  const onSignOut = async () => {
    try {
      await signOutGoogle();
      console.log("User signed out successfully");
    } catch (e) {
      console.error("Sign out error: ", e);
    } finally {
      await SecureStore.deleteItemAsync("userToken");
      setUser(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to LenDen</Text>
      {user ? (
        <TouchableOpacity style={styles.button} onPress={onSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      ) : (
        <GoogleSigninButton onPress={onGoogleButtonPress} />
      )}
    </View>
  );
};

export default Authenticate;
