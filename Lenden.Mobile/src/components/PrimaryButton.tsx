// components/PrimaryButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Colors } from "../theme/colors";

const PrimaryButton = ({ onPress, title, style = {} }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PrimaryButton;
