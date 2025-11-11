import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/src/theme/colors";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { axiosInstance } from "@/src/services";

interface User {
  id: number;
  fullName: string;
}

interface MutualBalance {
  fromUser: number;
  toUser: number;
  amount: number;
}

export default function Settlement() {
  const { groupId } = useLocalSearchParams();
  const currentUserId = useSelector((state: RootState) => state.auth.userId);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const membersRes = await axiosInstance.get(
          `/GroupApi/${groupId}/members`
        );
        const filteredMembers = membersRes.data.filter(
          (m: User) => m.id !== currentUserId
        );
        setMembers(filteredMembers);

        const balanceRes = await axiosInstance.get(
          `/BalanceApi/${groupId}/mutual-balance`
        );
        const balances: MutualBalance[] = balanceRes.data;
        const userBalances = balances.filter(
          (b) =>
            (b.amount > 0 && b.fromUser === currentUserId) ||
            (b.amount < 0 && b.toUser === currentUserId)
        );
        if (userBalances.length > 0) {
          const firstBalance = userBalances[0];
          const payToUserId =
            firstBalance.amount > 0
              ? firstBalance.toUser
              : firstBalance.fromUser;
          const payToUser =
            filteredMembers.find((m: User) => m.id === payToUserId) || null;
          setSelectedUser(payToUser);
          setAmount(Math.abs(firstBalance.amount).toFixed(2));
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load settlement data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [groupId]);

  const handleSubmit = async () => {
    if (!selectedUser || !amount) {
      Alert.alert("Error", "Please select a user and enter the amount.");
      return;
    }
    try {
      setLoading(true);
      const dto = {
        fromUserId: currentUserId,
        toUserId: selectedUser.id,
        amount: Number(amount),
      };
      await axiosInstance.post(`/SettlementApi/${groupId}`, dto);
      Alert.alert("Success", "Settlement submitted.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to submit settlement.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "600", color: "#333" }}>
          Settlement
        </Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Ionicons name="checkmark" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={() => setShowUserModal(true)}
          style={{
            padding: 15,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ddd",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 16 }}>
            {selectedUser?.fullName || "Select User"}
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 16, marginBottom: 8 }}>Amount</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 12,
            borderRadius: 8,
            fontSize: 16,
            marginBottom: 20,
          }}
          placeholder="0.00"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <Modal visible={showUserModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: "70%",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}
            >
              Select User
            </Text>
            <ScrollView>
              {members.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  onPress={() => {
                    setSelectedUser(member);
                    setShowUserModal(false);
                  }}
                  style={{
                    padding: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{member.fullName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowUserModal(false)}
              style={{
                padding: 15,
                marginTop: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: Colors.primary,
                alignItems: "center",
              }}
            >
              <Text style={{ color: Colors.primary, fontWeight: "600" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
