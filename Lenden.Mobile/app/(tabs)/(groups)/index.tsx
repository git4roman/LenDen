// app/index.tsx
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/src/services";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { generateImageUrl } from "@/src/utils/groups";
import RenderGroupItems from "@/src/components/groups/RenderGroupItems";
import { GroupDto } from "@/src/types/groups/Interfaces";
import { AntDesign } from "@expo/vector-icons";

export default function Index() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [createdBy, setCreatedBy] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<GroupDto[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchUserId = async () => {
    try {
      const response = await axiosInstance.get(
        "http://lenden-backend.runasp.net/api/AuthApi/me"
      );
      if (response.data?.userId) {
        setCreatedBy(response.data.userId);
        fetchGroups();
      } else {
        Alert.alert("Error", "User ID not found. Please log in again.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Failed to fetch user ID:", error);
      Alert.alert("Authentication Failed", "Redirecting to login.");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axiosInstance.get("/GroupApi");
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    fetchUserId();
    fetchGroups();
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name.");
      return;
    }
    try {
      const imageUrl = generateImageUrl(groupName);
      await axiosInstance.post("/GroupApi/create", {
        name: groupName,
        createdBy,
        imageUrl,
      });

      // refresh after server responds
      await fetchGroups();

      setGroupName("");
      setModalVisible(false);
      Alert.alert("Success", "Group created successfully!");
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Error", "Failed to create group. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <FlatList
        contentContainerStyle={{ padding: 20 }}
        data={groups}
        renderItem={({ item }) => <RenderGroupItems item={item} />}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={{ textAlign: "center", marginTop: 40, color: "#555" }}>
              No groups yet.
            </Text>
          ) : null
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 20,
          bottom: 30,
          backgroundColor: "#2a9d8f",
          borderRadius: 30,
          padding: 15,
          elevation: 5,
        }}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modal for Group Creation */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: "85%",
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 12,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 15,
                textAlign: "center",
              }}
            >
              Create Group
            </Text>
            <TextInput
              style={{
                height: 45,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 8,
                marginBottom: 15,
                paddingHorizontal: 10,
              }}
              placeholder="Enter Group Name"
              onChangeText={setGroupName}
              value={groupName}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#2a9d8f",
                padding: 12,
                borderRadius: 8,
              }}
              onPress={handleCreateGroup}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: "#e63946",
                padding: 12,
                borderRadius: 8,
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
