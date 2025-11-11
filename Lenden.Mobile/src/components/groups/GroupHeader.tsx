import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "@/src/styles/GroupHeaderStyles";
import { GroupEntity } from "@/src/types/groups/Interfaces";
// import PrimaryButton from "../PrimaryButton";
import axiosInstance from "@/src/services/axios";
import { useRouter } from "expo-router";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/src/theme/colors";

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
  const router = useRouter();

  const handleAddMembers = async () => {
    router.push({
      pathname: `/[groupId]/addMembers`,
      params: { groupId: group?.id as number },
    });
  };

  const handleSettlement = async () => {
    router.push({
      pathname: `/(tabs)/(groups)/[groupId]/settlement`,
      params: { groupId: group?.id as number },
    });
  };

  const total = (balance?.toCollect || 0) + (balance?.toPay || 0);

  const collectRatio = balance?.toCollect ? balance.toCollect / total : 0;
  const payRatio = balance?.toPay ? balance.toPay / total : 0;

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Pressable
            onPress={() => {
              router.back();
            }}
          >
            <AntDesign name="arrow-left" size={18} color={Colors.primary} />
          </Pressable>
          <Text style={styles.groupName}>{group?.name || "Loading..."}</Text>
        </View>
        <Pressable style={styles.addButton} onPress={handleAddMembers}>
          {total === 0 ? (
            <>
              <AntDesign name="plus" size={18} color="#fff" />
              <Text style={styles.addButtonText}>Add Members</Text>
            </>
          ) : (
            <>
              <AntDesign name="plus" size={18} color="#fff" />
              <Text style={styles.addButtonText}>Add Members</Text>
            </>
          )}
        </Pressable>
      </View>

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

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
          // backgroundColor: Colors.accent,
        }}
      >
        <Pressable
          onPress={handleSettlement}
          style={({ pressed }) => [
            {
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 14,
              borderRadius: 25,
              backgroundColor: Colors.primary,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              // elevation: 3,
              transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
            },
          ]}
        >
          <MaterialIcons name="auto-fix-high" size={20} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
            Settle Now
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {}}
          style={{
            flex: 1,
            borderWidth: 0.1,
            paddingVertical: 10,
            marginLeft: 6,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            backgroundColor: Colors.accent,
            flexDirection: "row",
            gap: 5,
          }}
        >
          <MaterialIcons name="info" size={18} color={Colors.primary} />
          <Text style={{ color: Colors.primary }}>Details</Text>
        </Pressable>
      </View>
    </View>
  );
};
