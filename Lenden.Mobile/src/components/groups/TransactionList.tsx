import React from "react";
import { View, Text, SectionList } from "react-native";
import { styles } from "@/src/styles/TransactionListStyles";
import { Transaction } from "@/src/types/TransactionEntity";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
}) => {
  const grouped = transactions.reduce((acc: any, item) => {
    const date = new Date(`${item.createdDate}T${item.createdAt}`);
    const year = date.getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  const sections = Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => ({ year, data: grouped[year] }));

  const renderItem = ({ item }: { item: Transaction }) => {
    const createdOn = new Date(`${item.createdDate}T${item.createdAt}`);
    const dayStr = createdOn.getDate().toString();
    const monthStr = createdOn
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();
    const madeByName = item.madeBy?.fullName || "Unknown";

    return (
      <View style={styles.transactionBlock}>
        <View style={styles.dateColumn}>
          <Text style={styles.day}>{dayStr}</Text>
          <Text style={styles.month}>{monthStr}</Text>
        </View>
        <View style={styles.detailsColumn}>
          <Text style={styles.description}>
            {item.description || "No description provided"}
          </Text>

          {/* Render each payer */}
          {item.payers?.map((p) => (
            <Text key={p.payerId} style={styles.paidInfo}>
              {p.payer?.fullName || "Unknown"} paid Rs.{" "}
              {p.amount.toLocaleString()}
            </Text>
          ))}
        </View>
        <Text style={styles.amount}>Rs. {item.amount.toLocaleString()}</Text>
      </View>
    );
  };

  const renderSectionHeader = ({ section }: any) => (
    <Text style={styles.yearHeader}>{section.year}</Text>
  );

  if (transactions.length === 0)
    return (
      <SafeAreaView style={styles.noTransactionsContainer}>
        <AntDesign name="frown" size={64} color="#ccc" />
        <Text style={styles.noTransactionsText}>No transactions found</Text>
      </SafeAreaView>
    );

  return (
    <SectionList
      sections={sections as any}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 50 }}
    />
  );
};
