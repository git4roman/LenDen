import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, FlatList, StyleSheet } from "react-native";
import { axiosInstance } from "@/src/services";
import { UserEntity } from "@/src/types/UserEntity";

export default function Friends() {
  const [friends, setFriends] = useState<UserEntity[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axiosInstance.get("/UserApi/myfriends");
        setFriends(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.fullName}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No friends found</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 16,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
});
