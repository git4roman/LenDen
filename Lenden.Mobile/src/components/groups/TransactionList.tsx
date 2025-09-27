import React from "react";
import { View, Text, FlatList } from "react-native";
import { styles } from "@/src/styles/TransactionListStyles";
import { Transaction } from "@/src/types/TransactionEntity";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
}) => {
  const renderTransaction = ({ item }: { item: Transaction }) => {
    const paidOn = new Date(`${item.paidOnDate}T${item.paidOnTime}`);
    const dateStr = paidOn
      .toLocaleDateString("en-US", { month: "short", year: "numeric" })
      .toUpperCase();
    const dayStr = paidOn.getDate().toString();

    return (
      <View style={styles.transactionItem}>
        <Text style={[styles.grayText, styles.transactionDate]}>{dateStr}</Text>
        <View style={styles.transactionRow}>
          <Text style={styles.transactionDay}>{dayStr}</Text>
          <View style={styles.transactionDetails}>
            <Text style={[styles.whiteText, styles.marginRight5Text]}>
              Transaction
            </Text>
            <Text style={styles.transactionPaidBy}>
              {`${
                item.paidByUser.givenName
              } paid ${item.amount.toLocaleString()}`}
            </Text>
          </View>
          <Text style={styles.transactionAmount}>
            Rs. {item.amount.toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={transactions}
      renderItem={renderTransaction}
      keyExtractor={(item) => item.id.toString()}
      style={styles.content}
      showsVerticalScrollIndicator={false}
    />
  );
};
