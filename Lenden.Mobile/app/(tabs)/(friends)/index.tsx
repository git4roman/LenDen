import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { axiosInstance } from "@/src/services";
import { UserEntity } from "@/src/types/UserEntity";
import * as Contacts from "expo-contacts";
import * as Crypto from "expo-crypto";
import PrimaryButton from "@/src/components/PrimaryButton";

export default function Friends() {
  const [friends, setFriends] = useState<UserEntity[]>([]);
  const [loading, setLoading] = useState(false);

  const hashPhoneNumber = async (phone: string): Promise<string> => {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      phone
    );
  };

  const getContactsPermission = async (): Promise<boolean> => {
    try {
      // 1. Check current permission status
      const { status } = await Contacts.getPermissionsAsync();

      if (status === "granted") return true;

      // 2. If not determined yet, request permission
      if (status === "undetermined") {
        const { status: newStatus } = await Contacts.requestPermissionsAsync();
        return newStatus === "granted";
      }

      // 3. If denied, show appropriate message
      if (status === "denied") {
        const { canAskAgain } = await Contacts.getPermissionsAsync();

        if (!canAskAgain) {
          // Permission permanently denied
          Alert.alert(
            "Contacts Permission Required",
            "You've denied contacts access. To find friends, please enable Contacts permission in your device settings.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        } else {
          // Can ask again
          Alert.alert(
            "Contacts Permission Needed",
            "This app needs access to your contacts to help you find friends who are also using the app.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Allow",
                onPress: async () => {
                  const { status: retryStatus } =
                    await Contacts.requestPermissionsAsync();
                  if (retryStatus === "granted") {
                    fetchPhoneContacts();
                  }
                },
              },
            ]
          );
        }
        return false;
      }

      return false;
    } catch (error) {
      console.error("Error getting contacts permission:", error);
      Alert.alert("Error", "Failed to check permissions. Please try again.");
      return false;
    }
  };

  const cleanPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, "");

    // If it starts with +, keep it
    if (cleaned.startsWith("+")) {
      return cleaned;
    }

    // If it starts with country code without +, add it
    if (cleaned.startsWith("977") && cleaned.length > 10) {
      return "+" + cleaned;
    }

    // If it's a local number, add Nepal country code
    if (cleaned.length === 10) {
      return "+977" + cleaned;
    }

    // Otherwise, assume it needs Nepal code
    return "+977" + cleaned;
  };

  const fetchPhoneContacts = async () => {
    setLoading(true);
    try {
      const granted = await getContactsPermission();
      if (!granted) {
        setLoading(false);
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (!data || data.length === 0) {
        Alert.alert("No Contacts", "No contacts found on your device.");
        setLoading(false);
        return;
      }

      const contactsWithNumbers = data
        .filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0)
        .map((c) => ({
          name: c.name || "Unknown",
          number: c.phoneNumbers![0].number!,
        }));

      if (contactsWithNumbers.length === 0) {
        Alert.alert(
          "No Phone Numbers",
          "No phone numbers found in your contacts."
        );
        setLoading(false);
        return;
      }

      const contactsWithHashes = await Promise.all(
        contactsWithNumbers.map(async (contact) => {
          const cleaned = cleanPhoneNumber(contact.number);
          const hash = await hashPhoneNumber(cleaned);
          return { ...contact, hash, cleaned };
        })
      );

      const hashes = contactsWithHashes.map((c) => c.hash);
      // console.log("Yo chai hashes haru ho,", hashes);

      const response = await axiosInstance.post(
        "/UserApi/check-contacts",
        hashes
      );

      const contactFriends = response.data.existingUsers || [];

      if (contactFriends.length === 0) {
        Alert.alert(
          "No Friends Found",
          "None of your contacts are using this app yet."
        );
      } else {
        Alert.alert(
          "Friends Found!",
          `Found ${contactFriends.length} friend(s) from your contacts.`
        );
      }

      // Merge and deduplicate friends
      setFriends((prevFriends) => {
        const mergedMap = new Map<number, UserEntity>();

        // Add existing API friends
        prevFriends.forEach((friend) => {
          mergedMap.set(friend.id, friend);
        });

        // Add contact-based friends (will overwrite if duplicate)
        contactFriends.forEach((friend) => {
          mergedMap.set(friend.id, friend);
        });

        return Array.from(mergedMap.values());
      });
    } catch (err: any) {
      console.error("Error checking contacts:", err);
      Alert.alert("Error", `Failed to fetch contacts. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axiosInstance.get("/UserApi/myfriends");
        setFriends(response.data || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
        Alert.alert("Error", "Failed to fetch friends. Please try again.");
      }
    };

    fetchFriends();
    // Don't automatically fetch phone contacts on mount
    // Let user trigger it via button
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Friends</Text>
      <PrimaryButton
        title={loading ? "Loading..." : "Find Friends from Contacts"}
        onPress={fetchPhoneContacts}
        disabled={loading}
      />
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.fullName}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loading ? "Loading friends..." : "No friends found"}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingHorizontal: 16 },
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
  name: { fontSize: 16, fontWeight: "500", color: "#444" },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
});
