// app/_layout.tsx
import { Provider } from "react-redux";
import { Slot } from "expo-router";
import { store } from "@/src/store/store";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Slot />
      <Toast />
    </Provider>
  );
}
