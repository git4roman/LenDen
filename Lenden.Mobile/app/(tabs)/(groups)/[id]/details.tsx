import { View, Pressable, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { axiosInstance } from "@/src/services";
import { Transaction } from "@/src/types/TransactionEntity";
import { styles } from "@/src/styles/groupDetailsStyles";
import { GroupEntity } from "@/src/types/groups/Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { GroupHeader } from "@/src/components/groups/GroupHeader";
import { TransactionList } from "@/src/components/groups/TransactionList";

export default function GroupDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [group, setGroup] = useState<GroupEntity | null>(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<{ toCollect: number; toPay: number }>({
    toCollect: 0,
    toPay: 0,
  });
  const [mutualBalance, setMutualBalance] = useState<
    { amount: number; fromUser: number; toUser: number }[]
  >([]);
  const auth = useSelector((state: RootState) => state.auth);

  const handleAddTransaction = () => {
    router.push({
      pathname: `/(tabs)/(groups)/[id]/transaction`,
      params: { id: id },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          transactionsResponse,
          groupResponse,
          balanceResponse,
          mutualBalanceResponse,
        ] = await Promise.all([
          axiosInstance.get(`/TransactionApi?groupId=${id}`).catch((err) => {
            console.error("Error fetching transactions:", err);
            throw { source: "transactions", error: err };
          }),
          axiosInstance.get(`/GroupApi/${id}/get-group`).catch((err) => {
            console.error("Error fetching group:", err);
            throw { source: "group", error: err };
          }),
          axiosInstance.get(`/BalanceApi/${id}/balance`).catch((err) => {
            console.error("Error fetching balance:", err);
            throw { source: "balance", error: err };
          }),
          axiosInstance.get(`/BalanceApi/${id}/mutual-balance`).catch((err) => {
            console.error("Error fetching mutual balance:", err);
            throw { source: "mutualBalance", error: err };
          }),
        ]);
        setTransactions(transactionsResponse.data);
        setGroup(groupResponse.data);
        setBalance(balanceResponse.data);
        setMutualBalance(mutualBalanceResponse.data);
      } catch (error) {
        console.error("Error fetching data from Group Details:", error);
        // You can now access error.source to know which API failed
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

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

      <GroupHeader
        group={group}
        balance={balance}
        mutualBalance={mutualBalance}
        currentUserId={auth.userId}
      />

      <TransactionList transactions={transactions} />

      <Pressable style={styles.floatingButton} onPress={handleAddTransaction}>
        <AntDesign name="plus-circle" size={56} color="#007BFF" />
      </Pressable>
    </View>
  );
}
