import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Container styles (shared/main container)
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1a1a1a",
  },

  // Header styles
  header: {
    height: 200,
    marginBottom: 10,
  },
  groupName: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  // Reusable text styles
  whiteText: {
    color: "#fff",
  },
  centeredText: {
    textAlign: "center",
  },
  centeredWhiteText: {
    textAlign: "center",
    color: "#fff",
  },
  grayText: {
    color: "#888",
  },
  lightGrayText: {
    color: "#d3d3d3",
  },

  // Reusable layout styles
  row: {
    flexDirection: "row",
  },
  fullWidth: {
    width: "100%",
  },
  flex1: {
    flex: 1,
  },
  alignCenter: {
    alignItems: "center",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },

  // Balance section styles
  balanceRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
  },
  balanceSection: {
    padding: 10,
    borderRadius: 8,
  },
  collectColor: {
    backgroundColor: "#2a9d8f",
  },
  payColor: {
    backgroundColor: "#e63946",
  },
  collectTextColor: {
    color: "#2a9d8f",
  },
  payTextColor: {
    color: "#e63946",
  },
  marginRight5: {
    marginRight: 5,
  },

  // Mutual balance styles
  mutualBalanceContainer: {
    marginTop: 12,
  },

  // Floating button styles (since it's in main component)
  floatingButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#fff",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
