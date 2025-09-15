import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "expo-router";

const GroupCard = ({ title, imageUri, owed, owe }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("group-details", { groupId: 123 }); // Example with a parameter
  };
  return (
    <Pressable onPress={handlePress} style={styles.card}>
      {/* Left: Image */}
      <Image source={{ uri: imageUri }} style={styles.image} />

      {/* Right: Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.summary}>
          <Text style={styles.positive}>You are owed Rs. {owed}</Text>
          <Text style={styles.negative}>You owe Rs. {owe}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    width: "90%",
    marginBottom: 15,
  },
  image: {
    width: 130,
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    padding: 15,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  summary: {
    gap: 6,
  },
  positive: {
    color: "green",
    fontSize: 16,
    fontWeight: "500",
  },
  negative: {
    color: "red",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default GroupCard;
