import { View, Text, Platform } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/src/theme/colors";

export default function Activity() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ fontSize: 18, color: Colors.textPrimary }}>
        Activity Screen under Construction
      </Text>
    </SafeAreaView>
  );
}
