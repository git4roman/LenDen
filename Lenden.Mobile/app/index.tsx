import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Stack, Redirect } from "expo-router";
import { RootState, AppDispatch } from "@/src/store/store";
import { fetchMe } from "@/src/store/authSlice";
import { fetchUserFromAuth } from "@/src/store/userSlice";

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { userId, loading } = useSelector((state: RootState) => state.auth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        try {
          await dispatch(fetchMe()).unwrap();
          await dispatch(fetchUserFromAuth()).unwrap(); // fetch full user profile
        } catch {
          await SecureStore.deleteItemAsync("userToken");
        }
      }
      setIsReady(true);
    })();
  }, []);

  if (!isReady || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return userId ? (
    <Redirect href="/(tabs)/(groups)" />
  ) : (
    <Redirect href="/(auth)" />
  );
}
