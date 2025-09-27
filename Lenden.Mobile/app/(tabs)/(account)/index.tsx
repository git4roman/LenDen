import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/store/store";
import { logout } from "@/src/store/userSlice";
import * as SecureStore from "expo-secure-store";
import { signOutGoogle } from "@/src/services";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Account() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutGoogle();
      await SecureStore.deleteItemAsync("userToken");
      dispatch(logout());
      console.log("User signed out successfully");

      router.replace("/(auth)");
    } catch (e) {
      console.error("Sign out error:", e);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: user.pictureUrl || "https://via.placeholder.com/150",
            }}
            style={styles.profilePicture}
          />
          <Text style={styles.fullName}>{user.fullName || "User"}</Text>
          <Text style={styles.email}>{user.email || "No Email"}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <AntDesign name="team" size={24} color="#888" style={styles.icon} />
            <Text style={styles.infoText}>Role: {user.role}</Text>
          </View>
          <View style={styles.infoRow}>
            <AntDesign
              name="calendar"
              size={24}
              color="#888"
              style={styles.icon}
            />
            <Text style={styles.infoText}>
              Member Since: {user.createdAt.split("T")[0]}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginVertical: 30,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#ddd",
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  infoSection: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  icon: {
    marginRight: 15,
  },
  infoText: {
    fontSize: 16,
    color: "#444",
  },
  signOutButton: {
    backgroundColor: "#ff6347",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 30,
    shadowColor: "#ff6347",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
