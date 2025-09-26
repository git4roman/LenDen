import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { axiosInstance } from "@/src/services";
import { Transaction } from "@/src/types/TransactionEntity";
import { styles } from "@/src/styles/groupDetailsStyles";
import { GroupEntity } from "@/src/types/groups/Interfaces";

export default function GroupDetails() {
  const { id } = useLocalSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [group, setGroup] = useState<GroupEntity | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAddTransaction = () => {
    console.log("Add transaction button pressed for group ID:", id);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axiosInstance.get(
          `/TransactionApi?groupId=${id}`
        );
        setTransactions(response.data);
        console.log("Fetched transactions:", response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchGroup = async () => {
      try {
        const response = await axiosInstance.get(`/GroupApi/${id}/get-group`);
        setGroup(response.data);
        console.log("Fetched group:", response.data);
      } catch (error) {
        console.error("Error fetching group:", error);
      }
    };
    fetchTransactions();
    fetchGroup();
  }, [id]);

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const paidOn = new Date(`${item.paidOnDate}T${item.paidOnTime}`);
    const dateStr = paidOn
      .toLocaleDateString("en-US", { month: "short", year: "numeric" })
      .toUpperCase();
    const dayStr = paidOn.getDate().toString();

    return (
      <View style={styles.transactionItem}>
        <Text style={styles.transactionDate}>{dateStr}</Text>
        <View style={styles.transactionRow}>
          <Text style={styles.transactionDay}>{dayStr}</Text>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionDescription}>Transaction</Text>
            <Text
              style={styles.transactionPaidBy}
            >{`You paid ${item.amount.toLocaleString()}`}</Text>
          </View>
          <Text style={styles.transactionAmount}>
            Rs. {item.amount.toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.groupName}>{group ? group.name : "Loading..."}</Text>
      <View style={styles.transactionSummary}>
        <View style={styles.transactionToCollect}>
          <Text style={{ textAlign: "center" }}>To Collect</Text>
          <Text style={{ textAlign: "center" }}>Rs. 9000</Text>
        </View>
        <View style={styles.transactionToPay}>
          <Text style={{ textAlign: "center" }}>To Pay</Text>
          <Text style={{ textAlign: "center" }}>Rs. 5000</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Group Details` }} />
      {renderHeader()}
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id.toString()}
        style={styles.content}
      />
      <Pressable style={styles.floatingButton} onPress={handleAddTransaction}>
        <AntDesign name="plus-circle" size={56} color="#007BFF" />
      </Pressable>
    </View>
  );
}
