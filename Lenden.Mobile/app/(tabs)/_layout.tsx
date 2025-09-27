import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1e5be9ff",
        tabBarStyle: { paddingBottom: 5 },
        tabBarLabelStyle: { fontSize: 12 },
        headerShown: false,
      }}
      initialRouteName="(groups)"
    >
      <Tabs.Screen
        name="(groups)"
        options={{
          headerShown: false,
          title: "Groups",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="users" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(friends)"
        options={{
          headerShown: false,
          title: "Friends", // Optional: set a title for the tab
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-friends" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(activity)"
        options={{
          headerShown: false,
          title: "Activity", // Optional: set a title for the tab
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(account)"
        options={{
          headerShown: false,
          title: "Account", // Optional: set a title for the tab
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-alt" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
