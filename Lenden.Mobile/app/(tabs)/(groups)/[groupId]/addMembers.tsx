import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import React, { useEffect } from "react";
import axiosInstance from "@/src/services/axios";
import PrimaryButton from "@/src/components/PrimaryButton";
import {
  Checkbox,
  Provider as PaperProvider,
  IconButton,
} from "react-native-paper";
import { Stack, useLocalSearchParams } from "expo-router";

const AddMembers = () => {
  const { groupId } = useLocalSearchParams();

  const [members, setMembers] = React.useState<
    Array<{ id: number; givenName: string }>
  >([]);
  const [friends, setFriends] = React.useState<
    Array<{ id: number; givenName: string }>
  >([]);
  const [selectedFriendIds, setSelectedFriendIds] = React.useState<number[]>(
    []
  );
  const [adding, setAdding] = React.useState(false);

  const fetchMembers = async () => {
    try {
      const response = await axiosInstance.get(`/GroupApi/${groupId}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching group members:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axiosInstance.get(`/UserApi/myfriends`);
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchFriends();
  }, [groupId]);

  const toggleFriendSelection = (friendId: number) => {
    setSelectedFriendIds((prevIds) =>
      prevIds.includes(friendId)
        ? prevIds.filter((id) => id !== friendId)
        : [...prevIds, friendId]
    );
  };

  const handleAddMembers = async () => {
    if (selectedFriendIds.length === 0) return;
    try {
      setAdding(true);
      await axiosInstance.post(
        `/GroupApi/${groupId}/addUsers`,
        selectedFriendIds
      );
      Alert.alert("Success", "Users added successfully!");
      setSelectedFriendIds([]);
      fetchMembers();
    } catch (error) {
      console.error("Error adding members:", error);
      Alert.alert("Error", "Failed to add users. Try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = (memberId: number, memberName: string) => {
    Alert.alert(
      "Remove Member",
      `Are you sure you want to remove ${memberName} from the group?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () => {
            try {
              setMembers((prev) => prev.filter((m) => m.id !== memberId));
            } catch (error) {
              console.error("Error removing member:", error);
              Alert.alert(
                "Error",
                "Could not remove member. Please try again."
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const filteredFriends = friends.filter(
    (friend) => !members.some((m) => m.id === friend.id)
  );

  return (
    <>
      <Stack.Screen options={{ title: "Group Members" }} />
      <PaperProvider>
        <View style={styles.container}>
          <Text style={styles.title}>Group Members ({members.length})</Text>
          <View style={styles.memberList}>
            {members.length === 0 ? (
              <Text style={styles.noMembersText}>No members found</Text>
            ) : (
              members.map((member) => (
                <View key={member.id} style={styles.memberRow}>
                  <Text style={styles.memberName}>{member.givenName}</Text>
                  <IconButton
                    icon="account-remove"
                    iconColor="#FF0000"
                    size={24}
                    onPress={() =>
                      handleRemoveMember(member.id, member.givenName)
                    }
                  />
                </View>
              ))
            )}
          </View>
          <View style={styles.separator} />

          <Text style={styles.title}>Add New Members</Text>
          <View style={styles.friendContainer}>
            <Pressable onPress={() => {}}>
              <Text style={styles.inviteLinkText}>Share Invite Link</Text>
            </Pressable>
            {filteredFriends.length === 0 ? (
              <Text style={styles.noFriendsText}>No friends to add</Text>
            ) : (
              filteredFriends.map((friend) => (
                <View key={friend.id} style={styles.friendRow}>
                  <Checkbox
                    status={
                      selectedFriendIds.includes(friend.id)
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => toggleFriendSelection(friend.id)}
                  />
                  <Text style={styles.friendName}>{friend.givenName}</Text>
                </View>
              ))
            )}
          </View>

          <PrimaryButton
            title={
              adding ? "Adding..." : `Add Members (${selectedFriendIds.length})`
            }
            onPress={handleAddMembers}
            disabled={adding || selectedFriendIds.length === 0}
          />
        </View>
      </PaperProvider>
    </>
  );
};

export default AddMembers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 10,
    color: "#333",
  },
  separator: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 10 },
  memberList: {
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },
  memberName: { fontSize: 16, fontWeight: "500", color: "#555", flex: 1 },
  noMembersText: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    paddingVertical: 10,
  },
  friendContainer: { marginBottom: 20 },
  inviteLinkText: {
    color: "#1E90FF",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  noFriendsText: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    paddingVertical: 10,
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  friendName: { fontSize: 16, marginLeft: 10, color: "#333" },
});
