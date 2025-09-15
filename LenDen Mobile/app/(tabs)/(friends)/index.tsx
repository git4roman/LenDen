// app/(tabs)/(account)/index.tsx

import { View, Text, StyleSheet } from "react-native";

export default function FriendsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends Tab</Text>
      <Text style={styles.subtitle}>
        This is the main screen for your account settings.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
