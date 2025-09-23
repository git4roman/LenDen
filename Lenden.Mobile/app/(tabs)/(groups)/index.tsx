import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/src/services";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const bgColors = ["2a9d8f", "e9c46a", "f4a261", "e76f51", "264653"];
const textColors = ["ffffff", "000000"];

export default function Index() {
  const router = useRouter();

  const [groupName, setGroupName] = useState("");
  const [createdBy, setCreatedBy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState([]);

  const generateImageUrl = (name: string) => {
    const firstWord = name.split(" ")[0] || "Group";
    const randomBgColor = bgColors[Math.floor(Math.random() * bgColors.length)];
    const randomTextColor =
      textColors[Math.floor(Math.random() * textColors.length)];
    return `https://placehold.co/600x400/${randomBgColor}/${randomTextColor}?text=${firstWord}%0ABills`;
  };

  const fetchUserId = async () => {
    try {
      const response = await axiosInstance.get(
        "http://lenden-backend.runasp.net/api/AuthApi/me"
      );
      if (response.data && response.data.userId) {
        setCreatedBy(response.data.userId);
        fetchGroups();
      } else {
        // If the ID is missing, we assume a failed session
        Alert.alert("Error", "User ID not found. Please log in again.");
        router.push("/login");
      }
    } catch (error) {
      // If the API call fails, it's likely an authentication issue
      console.error("Failed to fetch user ID:", error);
      Alert.alert(
        "Authentication Failed",
        "Could not get user ID. Redirecting to login."
      );
      router.push("/login");
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  useEffect(() => {
    fetchUserId();
    fetchGroups();
  }, []);

  const renderGroupItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
      }}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: 50, height: 50, marginRight: 10, borderRadius: 25 }}
      />
      <Text style={{ fontSize: 16 }}>{item.name}</Text>
    </View>
  );

  const fetchGroups = async () => {
    try {
      const response = await axiosInstance.get("/GroupApi");
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleCreateGroup = () => {
    try {
      const imageUrl = generateImageUrl(groupName);
      axiosInstance.post("/GroupApi/create", {
        name: groupName,
        createdBy: createdBy,
        imageUrl: imageUrl,
      });
      Alert.alert("Success", "Group created successfully!");
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Error", "Failed to create group. Please try again later.");
      router.push("/login");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Create Group
      </Text>
      <Text>My Id : {createdBy}</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
        placeholder="Enter Group Name"
        onChangeText={setGroupName}
        value={groupName}
      />
      <TouchableOpacity onPress={handleCreateGroup}>
        <Text
          style={{
            backgroundColor: "#2a9d8f",
            color: "#ffffff",
            padding: 10,
            textAlign: "center",
          }}
        >
          Create Group
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={fetchUserId}>
        <Text
          style={{
            backgroundColor: "#2a9d8f",
            color: "#ffffff",
            padding: 10,
            textAlign: "center",
          }}
        >
          check user
        </Text>
      </TouchableOpacity>
      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}
