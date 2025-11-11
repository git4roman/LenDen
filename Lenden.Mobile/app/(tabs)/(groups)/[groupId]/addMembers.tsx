import { View, Text, Alert, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import axiosInstance from "@/src/services/axios";
import PrimaryButton from "@/src/components/PrimaryButton";
import {
  Checkbox,
  Provider as PaperProvider,
  IconButton,
} from "react-native-paper";
import { Stack, useLocalSearchParams } from "expo-router";
import * as Contacts from "expo-contacts";
import * as Crypto from "expo-crypto";
import { SafeAreaView } from "react-native-safe-area-context";

const AddMembers = () => {
  const { groupId } = useLocalSearchParams();

  const [members, setMembers] = React.useState<
    Array<{ id: number; fullName: string }>
  >([]);
  const [friends, setFriends] = React.useState<
    Array<{ id: number; fullName: string }>
  >([]);
  const [selectedFriendIds, setSelectedFriendIds] = React.useState<number[]>(
    []
  );
  const [adding, setAdding] = React.useState(false);
  const [loadingContacts, setLoadingContacts] = React.useState(false);

  // ------------------- Contacts & Hashing -------------------
  const hashPhoneNumber = async (phone: string) =>
    await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, phone);

  const cleanPhoneNumber = (phone: string) => {
    let cleaned = phone.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+")) return cleaned;
    if (cleaned.startsWith("977") && cleaned.length > 10) return "+" + cleaned;
    if (cleaned.length === 10) return "+977" + cleaned;
    return "+977" + cleaned;
  };

  const getContactsPermission = async () => {
    try {
      const { status } = await Contacts.getPermissionsAsync();
      if (status === "granted") return true;
      if (status === "undetermined") {
        const { status: newStatus } = await Contacts.requestPermissionsAsync();
        return newStatus === "granted";
      }
      if (status === "denied") {
        Alert.alert(
          "Contacts Permission Required",
          "Enable contacts permission in settings to add friends from your contacts.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => Contacts.requestPermissionsAsync(),
            },
          ]
        );
      }
      return false;
    } catch (error) {
      console.error("Error getting contacts permission:", error);
      return false;
    }
  };

  const fetchContactFriends = async () => {
    setLoadingContacts(true);
    try {
      const granted = await getContactsPermission();
      if (!granted) return [];

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });
      const contactsWithNumbers = data
        .filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0)
        .map((c) => ({
          name: c.name || "Unknown",
          number: c.phoneNumbers![0].number!,
        }));

      const contactsWithHashes = await Promise.all(
        contactsWithNumbers.map(async (contact) => {
          const cleaned = cleanPhoneNumber(contact.number);
          const hash = await hashPhoneNumber(cleaned);
          return { ...contact, hash, cleaned };
        })
      );

      const hashes = contactsWithHashes.map((c) => c.hash);
      const response = await axiosInstance.post(
        "/UserApi/check-contacts",
        hashes
      );
      return response.data.existingUsers || [];
    } catch (err: any) {
      console.error("Error checking contacts:", err);
      return [];
    } finally {
      setLoadingContacts(false);
    }
  };

  // ------------------- Fetch Members & Friends -------------------
  const fetchMembers = async () => {
    try {
      const response = await axiosInstance.get(`/GroupApi/${groupId}/members`);
      setMembers(response.data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const fetchFriendsToAdd = async () => {
    const contactFriends = await fetchContactFriends();
    // Only include contacts who are NOT already group members
    const filtered = contactFriends.filter(
      (f: any) => !members.some((m) => m.id === f.id)
    );
    setFriends(filtered);
  };

  useEffect(() => {
    fetchMembers();
    fetchFriendsToAdd();
  }, [groupId]);

  // ------------------- Add / Remove -------------------
  const toggleFriendSelection = (friendId: number) => {
    setSelectedFriendIds((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
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
      await fetchMembers();
      setFriends((prev) =>
        prev.filter((f) => !selectedFriendIds.includes(f.id))
      );
      setSelectedFriendIds([]);
      Alert.alert("Success", "Users added successfully!");
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
      `Are you sure you want to remove ${memberName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () =>
            setMembers((prev) => prev.filter((m) => m.id !== memberId)),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PaperProvider>
        <View style={styles.container}>
          <Text style={styles.title}>Group Members ({members.length})</Text>
          <View style={styles.memberList}>
            {members.length === 0 ? (
              <Text style={styles.noMembersText}>No members found</Text>
            ) : (
              members.map((member) => (
                <View key={member.id} style={styles.memberRow}>
                  <Text style={styles.memberName}>{member.fullName}</Text>
                  <IconButton
                    icon="account-remove"
                    iconColor="#FF0000"
                    size={24}
                    onPress={() =>
                      handleRemoveMember(member.id, member.fullName)
                    }
                  />
                </View>
              ))
            )}
          </View>

          <View style={styles.separator} />
          <Text style={styles.title}>Add New Members</Text>

          {loadingContacts ? (
            <Text style={styles.loadingText}>Loading contacts...</Text>
          ) : friends.length === 0 ? (
            <Text style={styles.noFriendsText}>No contacts available</Text>
          ) : (
            friends.map((friend) => (
              <View key={friend.id} style={styles.friendRow}>
                <Checkbox
                  status={
                    selectedFriendIds.includes(friend.id)
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => toggleFriendSelection(friend.id)}
                />
                <Text style={styles.friendName}>{friend.fullName}</Text>
              </View>
            ))
          )}

          <PrimaryButton
            title={
              adding ? "Adding..." : `Add Members (${selectedFriendIds.length})`
            }
            onPress={handleAddMembers}
            disabled={adding || selectedFriendIds.length === 0}
          />
        </View>
      </PaperProvider>
    </SafeAreaView>
  );
};

export default AddMembers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: "#fff",
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#333" },
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
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  friendName: { fontSize: 16, marginLeft: 10, color: "#333" },
  noFriendsText: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    paddingVertical: 10,
  },
  loadingText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
    color: "#555",
  },
});
