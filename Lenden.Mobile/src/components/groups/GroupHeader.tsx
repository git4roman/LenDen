import React from "react";
import { View, Text } from "react-native";
import { styles } from "@/src/styles/GroupHeaderStyles";
import { GroupEntity } from "@/src/types/groups/Interfaces";

interface GroupHeaderProps {
  group: GroupEntity | null;
  balance: { toCollect: number; toPay: number };
  mutualBalance: { amount: number; fromUser: number; toUser: number }[];
  currentUserId: number;
}

export const GroupHeader: React.FC<GroupHeaderProps> = ({
  group,
  balance,
  mutualBalance,
  currentUserId,
}) => {
  const total = (balance?.toCollect || 0) + (balance?.toPay || 0);

  if (total === 0) {
    return (
      <View style={styles.header}>
        <Text style={styles.groupName}>{group?.name || "Loading..."}</Text>
      </View>
    );
  }

  const collectRatio = balance?.toCollect ? balance.toCollect / total : 0;
  const payRatio = balance?.toPay ? balance.toPay / total : 0;

  return (
    <View style={styles.header}>
      <Text style={styles.groupName}>{group?.name || "Loading..."}</Text>

      <View style={styles.balanceRow}>
        {balance?.toCollect > 0 && (
          <View
            style={[
              styles.balanceSection,
              styles.collectColor,
              { flex: collectRatio },
              balance?.toPay > 0 && styles.marginRight5,
            ]}
          >
            <Text style={styles.centeredWhiteText}>To Collect</Text>
            <Text style={styles.centeredWhiteText}>
              Rs. {balance.toCollect.toLocaleString()}
            </Text>
          </View>
        )}

        {balance?.toPay > 0 && (
          <View
            style={[styles.balanceSection, styles.payColor, { flex: payRatio }]}
          >
            <Text style={styles.centeredWhiteText}>To Pay</Text>
            <Text style={styles.centeredWhiteText}>
              Rs. {balance.toPay.toLocaleString()}
            </Text>
          </View>
        )}
      </View>

      {/* Mutual balances block */}
      <View style={styles.mutualBalanceContainer}>
        {mutualBalance.map((m, idx) => {
          if (m.fromUser === currentUserId) {
            return (
              <Text
                key={idx}
                style={[styles.centeredText, styles.payTextColor]}
              >
                You owe Rs. {m.amount.toLocaleString()} to User {m.toUser}
              </Text>
            );
          } else if (m.toUser === currentUserId) {
            return (
              <Text
                key={idx}
                style={[styles.centeredText, styles.collectTextColor]}
              >
                You are owed Rs. {m.amount.toLocaleString()} by User{" "}
                {m.fromUser}
              </Text>
            );
          }
          return null;
        })}
      </View>
    </View>
  );
};
