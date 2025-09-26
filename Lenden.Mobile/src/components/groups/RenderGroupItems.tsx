// components/groups/RenderGroupItems.tsx
import React from "react";
import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "@ant-design/react-native";
import { GroupEntity } from "@/src/types/groups/Interfaces";
import { useRouter } from "expo-router";

interface Props {
  item: GroupEntity;
  onPress?: (item: GroupEntity) => void;
}

export default function RenderGroupItems({ item }: Props) {
  const router = useRouter();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/(groups)/[id]/details",
          params: { id: item.id },
        })
      }
    >
      <Card style={styles.card}>
        <Card.Body>
          <View style={styles.container}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              {/* {item.description ? (
                <Text style={styles.description}>{item.description}</Text>
              ) : null} */}
            </View>
          </View>
        </Card.Body>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eee",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
});
