// app/index.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Stack, Redirect } from "expo-router";
import { RootState, AppDispatch } from "@/src/store/store";
import { fetchMe } from "@/src/store/authSlice";

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { userId, loading } = useSelector((state: RootState) => state.auth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        if (token) await dispatch(fetchMe()).unwrap();
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  if (!isReady || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect instead of initialRouteName
  return userId ? (
    <Redirect href="/(tabs)/(groups)" />
  ) : (
    <Redirect href="/(auth)" />
  );
}
