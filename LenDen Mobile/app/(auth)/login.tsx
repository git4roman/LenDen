import React, { useEffect } from "react";
import { View, Button, Text, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useAuthRequest } from "expo-auth-session";
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

// More explicit redirect URI configuration
const redirectUri = AuthSession.makeRedirectUri({
  scheme: "lenden",
  path: "auth", 
});

export default function Login() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    // For Android-only, you might only need androidClientId
    androidClientId:
      process.env.EXPO_PUBLIC_CLIENT_ID_ANDROID ||
      "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    // Remove webClientId if you only want Android
    // webClientId: process.env.EXPO_PUBLIC_CLIENT_ID_WEB || "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
    redirectUri,
    // Add these additional configuration options
    selectAccount: true,
    responseType: AuthSession.ResponseType.Code,
  });

  useEffect(() => {
    // Debug information
    console.log("=== Debug Information ===");
    console.log("Platform:", Platform.OS);
    console.log("Redirect URI:", redirectUri);
    console.log(
      "Android Client ID:",
      process.env.EXPO_PUBLIC_CLIENT_ID_ANDROID
    );
    console.log("Web Client ID:", process.env.EXPO_PUBLIC_CLIENT_ID_WEB);
    console.log("Request object:", request);
  }, [request]);

  useEffect(() => {
    if (response) {
      console.log("=== Auth Response ===");
      console.log("Response type:", response.type);
      console.log("Full response:", response);

      if (response.type === "success") {
        console.log("Access token:", response.authentication?.accessToken);
        Alert.alert("Success", "Login successful!");
      } else if (response.type === "error") {
        console.log("Error:", response.error);
        Alert.alert(
          "Error",
          `Login failed: ${response.error?.message || "Unknown error"}`
        );
      } else if (response.type === "cancel") {
        console.log("User cancelled the login");
        Alert.alert("Cancelled", "Login was cancelled");
      }
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      console.log("Starting login process...");
      const result = await promptAsync();
      console.log("Login result:", result);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred during login");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ marginBottom: 20, textAlign: "center" }}>
        Platform: {Platform.OS}
      </Text>
      <Text
        style={{
          marginBottom: 20,
          textAlign: "center",
          color: Platform.OS === "android" ? "green" : "orange",
        }}
      >
        {Platform.OS === "android"
          ? "✅ Android - Ready for Google Auth"
          : "⚠️ Not Android - May not work"}
      </Text>
      <Button
        disabled={!request}
        title="Login with Google"
        onPress={handleLogin}
      />
      {!request && (
        <Text style={{ marginTop: 10, color: "red" }}>
          Request not ready. Check your Android Client ID.
        </Text>
      )}
    </View>
  );
}
