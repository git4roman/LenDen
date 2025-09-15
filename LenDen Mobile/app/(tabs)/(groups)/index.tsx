import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import GroupCard from "../../../components/Groups/GroupCard";

const GroupScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <GroupCard
          title="Appartment"
          imageUri="https://dummyimage.com/200x200/000/fff&text=Group1"
          owed={1000}
          owe={500}
        />
        <GroupCard
          title="Trip to Ilam"
          imageUri="https://dummyimage.com/200x200/333/fff&text=Group2"
          owed={2500}
          owe={800}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#f5f5f5",
  },
  scroll: {
    alignItems: "center",
    paddingVertical: 20,
  },
});

export default GroupScreen;
