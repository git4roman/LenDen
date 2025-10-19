import { View, Pressable, ActivityIndicator } from "react-native";
import React, { useState, useCallback } from "react";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { RootState } from "@/src/store/store";
import { styles } from "@/src/styles/groupDetailsStyles";
import { GroupHeader } from "@/src/components/groups/GroupHeader";
import { TransactionList } from "@/src/components/groups/TransactionList";
import { GroupEntity } from "@/src/types/groups/Interfaces";
import { Transaction } from "@/src/types/TransactionEntity";
import * as api from "@/src/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";

export default function GroupDetails() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const auth = useSelector((state: RootState) => state.auth);

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

  const handleAddTransaction = () => {
    router.push({
      pathname: `/(tabs)/(groups)/[groupId]/transaction`,
      params: { groupId: groupId as string },
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (!groupId) return;

      const fetchData = async () => {
        try {
          setLoading(true);
          const results = await Promise.allSettled([
            api.fetchTransactions(groupId as string),
            api.fetchGroup(groupId as string),
            api.fetchBalance(groupId as string),
            api.fetchMutualBalance(groupId as string),
          ]);

          const [transactionsRes, groupRes, balanceRes, mutualBalanceRes] =
            results;

          transactionsRes.status === "fulfilled" &&
            setTransactions(transactionsRes.value.data);
          groupRes.status === "fulfilled" && setGroup(groupRes.value.data);
          balanceRes.status === "fulfilled" &&
            setBalance(balanceRes.value.data);
          mutualBalanceRes.status === "fulfilled" &&
            setMutualBalance(mutualBalanceRes.value.data);
        } catch (error) {
          console.error("Error fetching data from Group Details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [groupId])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Group Details" }} />
      <View style={styles.container}>
        <GroupHeader
          group={group}
          balance={balance}
          mutualBalance={mutualBalance}
          currentUserId={auth.userId}
        />
        <TransactionList transactions={transactions} />
        <Pressable style={styles.addButton} onPress={handleAddTransaction}>
          <AntDesign name="plus" size={18} color="#fff" />
        </Pressable>
      </View>
    </>
  );
}
