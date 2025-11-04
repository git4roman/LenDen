import { axiosInstance, onLoginService } from "@/src/services";
import { Colors } from "@/src/theme/colors";
import { UserLoginDto } from "@/src/types/LoginDtos";
import { onLog } from "@react-native-firebase/app";
import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";

export default function LoginScreen({ setLoginVisible }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const loginDto: UserLoginDto = {
      email: email,
      password: password,
      authProvider: "email",
      googleId: "",
    };
    await onLoginService(loginDto);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button color={Colors.primary} title="Login" onPress={handleLogin} />

      <Text style={styles.toggle} onPress={() => setLoginVisible(false)}>
        Don't have an account?{" "}
        <Text style={{ color: Colors.info }}>Sign Up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: "center", paddingBottom: 50, width: "60%" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    // color: Colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    color: Colors.primary,
  },
  toggle: { marginTop: 15, textAlign: "center" },
});
