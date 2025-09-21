import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

  const onSignOut = async () => {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
      console.log("User signed out!");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

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
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Obtain the user's ID token
      const { data } = await GoogleSignin.signIn();
      const idToken = data ? data.idToken : null;

      if (!idToken) {
        throw new Error("No ID token found");
      }

      // Create a new Firebase credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log("credential: ", googleCredential);

      // Login with credential
      await auth().signInWithCredential(googleCredential);

      console.log("Signed in with Google!");
      console.log("User Info: ", auth().currentUser);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "black",
    backgroundColor: "#C8C8C8",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#6200ea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 15,
    marginBottom: 15,
  },
  switchButtonText: {
    color: "#6200ea",
    fontSize: 14,
  },
  heading: {
    fontSize: 30,
    margin: 10,
  },
});

export default Login;
