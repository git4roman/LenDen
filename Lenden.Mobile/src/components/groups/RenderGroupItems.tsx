// components/groups/RenderGroupItems.tsx
import { View, Text, Image } from "react-native";
import React from "react";
import { GroupDto } from "@/src/types/groups/Interfaces";

export default function RenderGroupItems({ item }: { item: GroupDto }) {
  console.log("Image URL:", item.imageUrl);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Image
        source={{
          uri: item.imageUrl,
        }}
        style={{
          width: 55,
          height: 55,
          marginRight: 12,
          borderRadius: 28,
          backgroundColor: "#eee",
        }}
        resizeMode="cover"
      />
      <Text style={{ fontSize: 17, fontWeight: "600", color: "#333" }}>
        {item.name}
      </Text>
    </View>
  );
}
