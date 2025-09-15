import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1982c4", // The color of the icon when the tab is active
        tabBarInactiveTintColor: "#9d9d9dff", // The color of the icon when the tab is inactive
      }}
    >
      <Tabs.Screen
        name="(groups)/index"
        options={{
          title: "Groups",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="circle-slice-4"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(friends)/index"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-group"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(activities)/index"
        options={{
          title: "Activities",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="timeline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="(account)/index"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
