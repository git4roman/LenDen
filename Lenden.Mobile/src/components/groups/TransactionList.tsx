import React from "react";
import { View, Text, SectionList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { styles } from "@/src/styles/TransactionListStyles";
import { Transaction, Settlement } from "@/src/types/TransactionEntity";
// import { Settlement } from "@/src/types/SettlementEntity";
import { Colors } from "@/src/theme/colors";

interface TransactionListProps {
  transactions: Transaction[];
  settlements: Settlement[];
}

type CombinedItem = (Transaction | Settlement) & {
  type: "Expense" | "Settlement";
};

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  settlements,
}) => {
  const combined: CombinedItem[] = [
    ...transactions.map((t) => ({ ...t, type: "Expense" as const })),
    ...settlements.map((s) => ({ ...s, type: "Settlement" as const })),
  ];

  if (combined.length === 0)
    return (
      <SafeAreaView style={styles.noTransactionsContainer}>
        <AntDesign name="frown" size={64} color="#ccc" />
        <Text style={styles.noTransactionsText}>No transactions found</Text>
      </SafeAreaView>
    );

  combined.sort((a, b) => {
    const dateA = new Date(`${a.createdDate}T${a.createdAt}`).getTime();
    const dateB = new Date(`${b.createdDate}T${b.createdAt}`).getTime();
    return dateB - dateA;
  });

  const grouped = combined.reduce(
    (acc: Record<string, CombinedItem[]>, item) => {
      const year = new Date(`${item.createdDate}T${item.createdAt}`)
        .getFullYear()
        .toString();
      if (!acc[year]) acc[year] = [];
      acc[year].push(item);
      return acc;
    },
    {}
  );

  const sections = Object.keys(grouped)
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => ({ year, data: grouped[year] }));

  const renderItem = ({ item }: { item: CombinedItem }) => {
    const createdOn = new Date(`${item.createdDate}T${item.createdAt}`);
    const day = createdOn.getDate().toString();
    const month = createdOn
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();

    if (item.type === "Settlement") {
      const settlement = item as Settlement & { type: "Settlement" }; // type narrowing

      return (
        <View style={styles.transactionBlock}>
          <View style={styles.dateColumn}>
            <Text style={styles.day}>{day}</Text>
            <Text style={styles.month}>{month}</Text>
          </View>
          <View style={styles.detailsColumn}>
            <Text style={[styles.description, { color: Colors.success }]}>
              💸 Settlement
            </Text>
            <Text style={[styles.paidInfo, { color: Colors.success }]}>
              {settlement.fromUser?.fullName} paid {settlement.toUser?.fullName}
            </Text>
          </View>
          <Text style={[styles.amount, { color: Colors.success }]}>
            Rs. {settlement.amount.toLocaleString()}
          </Text>
        </View>
      );
    }

    const expense = item as Transaction & { type: "Expense" }; // type narrowing

    return (
      <View style={styles.transactionBlock}>
        <View style={styles.dateColumn}>
          <Text style={styles.day}>{day}</Text>
          <Text style={styles.month}>{month}</Text>
        </View>
        <View style={styles.detailsColumn}>
          <Text style={styles.description}>{expense.description}</Text>
          {expense.payers?.map((p) => (
            <Text key={p.payerId} style={styles.paidInfo}>
              {p.payer?.fullName || "Unknown"} paid Rs.{" "}
              {p.amount.toLocaleString()}
            </Text>
          ))}
        </View>
        <Text style={styles.amount}>Rs. {expense.amount.toLocaleString()}</Text>
      </View>
    );
  };

  const renderSectionHeader = ({ section }: any) => (
    <Text style={styles.yearHeader}>{section.year}</Text>
  );

  return (
    <SectionList
      sections={sections as any}
      keyExtractor={(item) => `${item.type}-${item.id}`}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 50 }}
    />
  );
};
