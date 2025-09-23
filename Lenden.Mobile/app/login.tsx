import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { signInWithGoogle, onSignOut,onRegister } from "@/src/services";
import { loginStyles as styles } from "@/src/styles";
import { UserRegisterDto } from "@/src/types";

interface LoginProps {
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState<string>("jane.doe@example.com");
  const [password, setPassword] = useState<string>("SuperSecretPassword!");

  useEffect(() => {
    async function init() {
      const has = await GoogleSignin.hasPlayServices();
      if (has) {
        GoogleSignin.configure({
          offlineAccess: true,
          webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
        });
      }
    }
    init();
  }, []);

  const onLogin = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("User signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          console.log("No user found for that email.");
        }
        if (error.code === "auth/wrong-password") {
          console.log("Incorrect password.");
        }
        console.error(error);
      });
  };

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
        await onRegister(userRegisterDto);
      }
    } catch (e) {
      console.error("Google sign-in error: ", e);
    }
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles?.heading}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSwitchToSignup} style={styles.switchButton}>
        <Text style={styles.switchButtonText}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
      <GoogleSigninButton onPress={onGoogleButtonPress} />
      <TouchableOpacity style={styles.button} onPress={onSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
