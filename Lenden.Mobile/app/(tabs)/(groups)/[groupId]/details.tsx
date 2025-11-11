import { View, Pressable, ActivityIndicator } from "react-native";
import React, { useState, useCallback } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { RootState } from "@/src/store/store";
import { styles } from "@/src/styles/groupDetailsStyles";
import { GroupHeader } from "@/src/components/groups/GroupHeader";
import { TransactionList } from "@/src/components/groups/TransactionList";
import { GroupEntity } from "@/src/types/groups/Interfaces";
import { Transaction } from "@/src/types/TransactionEntity";
import { Settlement } from "@/src/types/SettlementEntity";
import * as api from "@/src/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/src/theme/colors";

export default function GroupDetails() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const auth = useSelector((state: RootState) => state.auth);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
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

          if (transactionsRes.status === "fulfilled") {
            setTransactions(transactionsRes.value.data.expenses);
            setSettlements(transactionsRes.value.data.settlements);
          }

          if (groupRes.status === "fulfilled") setGroup(groupRes.value.data);
          if (balanceRes.status === "fulfilled")
            setBalance(balanceRes.value.data);
          if (mutualBalanceRes.status === "fulfilled")
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
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.background }}
      edges={["top"]}
    >
      <View style={styles.container}>
        <GroupHeader
          group={group}
          balance={balance}
          mutualBalance={mutualBalance}
          currentUserId={auth.userId}
        />
        <TransactionList
          transactions={transactions}
          settlements={settlements}
        />
        <Pressable style={styles.addButton} onPress={handleAddTransaction}>
          <AntDesign name="plus" size={18} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
