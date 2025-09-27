// app/_layout.tsx
import { Provider } from "react-redux";
import { Slot } from "expo-router";
import { store } from "@/src/store/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}
