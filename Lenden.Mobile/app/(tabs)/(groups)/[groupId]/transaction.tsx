import { View, Text, TextInput, ActivityIndicator, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { axiosInstance } from "@/src/services";
import { GroupEntity } from "@/src/types/groups/Interfaces";
import PrimaryButton from "@/src/components/PrimaryButton";
import { Colors } from "@/src/theme/colors";

interface User {
  id: number;
  fullName: string;
}

export default function Transaction() {
  const { groupId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<User[]>([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [description, setDescription] = useState("");
  const [payerId, setPayerId] = useState<number | null>(null);
  const [group, setGroup] = useState<GroupEntity | null>(null);

  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const groupResponse = await axiosInstance.get("/GroupApi");
        const foundGroup = groupResponse.data.find(
          (g: GroupEntity) => g.id == Number(groupId)
        );
        setGroup(foundGroup || null);

        const membersResponse = await axiosInstance.get(
          `/GroupApi/${groupId}/members`
        );
        setMembers(membersResponse.data);

        if (membersResponse.data.length > 0)
          setPayerId(membersResponse.data[0].id);
      } catch (error: any) {
        console.error("Fetch error:", error.response?.status, error.message);
        Alert.alert("Error", "Failed to load group data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  const handleAddTransaction = async () => {
    if (!paymentAmount || !payerId) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/TransactionApi", {
        groupId: Number(groupId),
        payedByUserId: payerId,
        amount: Number(paymentAmount),
        description: description, // Added description
      });

      Alert.alert(
        "Success",
        "Transaction added successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              setPaymentAmount("");
              setDescription("");
              router.back();
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      console.error(
        "Transaction error:",
        error.response?.status,
        error.message
      );
      Alert.alert("Error", "Failed to add transaction.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Transaction for{" "}
        {group && (
          <Text
            style={{
              marginBottom: 20,
              fontSize: 24,
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            {group.name}
          </Text>
        )}
      </Text>

      {/* Description Input */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>Description</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 10,
            borderRadius: 5,
          }}
          placeholder="Enter description"
          placeholderTextColor="gray"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Payment Amount Input */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>Payment Amount</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 10,
            borderRadius: 5,
          }}
          placeholder="Enter amount"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={paymentAmount}
          onChangeText={setPaymentAmount}
        />
      </View>

      {/* Who Paid Dropdown */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>Who Paid?</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 5,
          }}
        >
          <Picker
            selectedValue={payerId}
            onValueChange={(itemValue) => setPayerId(itemValue)}
            style={{ color: Colors.textSecondary }}
          >
            {members.map((member) => (
              <Picker.Item
                key={member.id}
                label={member.fullName}
                value={member.id}
              />
            ))}
          </Picker>
        </View>
      </View>

      <PrimaryButton
        title="Add Transaction"
        onPress={handleAddTransaction}
        disabled={false}
      />
    </View>
  );
}
