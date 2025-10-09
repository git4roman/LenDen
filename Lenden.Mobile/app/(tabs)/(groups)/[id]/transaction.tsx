import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { axiosInstance } from "@/src/services";
import { GroupEntity } from "@/src/types/groups/Interfaces";
import axios from "axios";

// Define the User interface for type safety
interface User {
  id: number;
  fullName: string;
}

export default function Transaction() {
  // Use 'id' to match the dynamic route parameter
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<User[]>([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [payerId, setPayerId] = useState<number | null>(null);
  const [group, setGroup] = useState<GroupEntity | null>(null);

  useEffect(() => {
    // Check if the id is available before fetching
    const fetchGroup = async () => {
      const response = await axiosInstance(`/GroupApi/${group?.id}`);
      setGroup(response.data);
    };
    if (id) {
      const fetchMembers = async () => {
        try {
          setLoading(true);
          console.log("The group Id:", id);
          const response = await axiosInstance.get(`/GroupApi/${id}/members`);
          setMembers(response.data);
          console.log(response.data);

          // Set the first member as the default payer
          if (response.data.length > 0) {
            setPayerId(response.data[0].id);
          }
        } catch (error) {
          console.error("Error fetching group members:", error);
          Alert.alert("Error", "Failed to load group members.");
        } finally {
          setLoading(false);
        }
      };
      fetchMembers();
      fetchGroup();
    }
  }, [id]);

  const handleAddTransaction = async () => {
    await axiosInstance.post("/TransactionApi", {
      groupId: id,
      amount: paymentAmount,
      payedByuserId: payerId,
    });
    setPaymentAmount("");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading members...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        New Transaction for Group ID: {id}
      </Text>

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
          keyboardType="numeric"
          value={paymentAmount}
          onChangeText={setPaymentAmount}
        />
      </View>

      {/* "Who Paid" Dropdown */}
      <View>
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
      <Pressable onPress={()=>handleAddTransaction}>
        <Text
          style={{
            padding: 10,
            backgroundColor: "rgb(28, 150, 197)",
            textAlign: "center",
          }}
        >
          Add Transaction
        </Text>
      </Pressable>
    </View>
  );
}
