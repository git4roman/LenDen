import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import {
  signInWithGoogle,
  signOutGoogle,
  onAuthenticate,
} from "@/src/services";
import { loginStyles as styles } from "@/src/styles";
import { UserRegisterDto } from "@/src/types";
import * as SecureStore from "expo-secure-store";
import { onLog } from "@react-native-firebase/app";

interface LoginProps {
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const [user, setUser] = useState<null | any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        setUser(true);
      } else {
        setUser(false);
      }
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
      }
    } catch (e) {
      console.error("Google sign-in error: ", e);
    }
  };

  const onSignOut = async () => {
    try {
      await signOutGoogle();
    } catch (e) {
      console.error("Sign out error: ", e);
    } finally {
      await SecureStore.deleteItemAsync("userToken");
      setUser(null);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onSwitchToSignup} style={styles.switchButton}>
        <Text style={styles.switchButtonText}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
      <GoogleSigninButton onPress={onGoogleButtonPress} />
      {user && (
        <TouchableOpacity style={styles.button} onPress={onSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Login;
