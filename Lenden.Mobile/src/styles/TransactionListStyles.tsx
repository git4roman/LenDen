import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Content container
  content: {
    flex: 1,
  },

  // Reusable text styles
  whiteText: {
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
  flex1: {
    flex: 1,
  },
  alignCenter: {
    alignItems: "center",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },

  // Transaction styles
  transactionItem: {
    marginBottom: 10,
  },
  transactionDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  transactionDay: {
    fontSize: 16,
    color: "#fff",
    width: 30,
    textAlign: "center",
  },
  transactionDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  transactionPaidBy: {
    color: "#d3d3d3",
    fontSize: 12,
  },
  transactionAmount: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "right",
    width: 80,
  },
  marginRight5Text: {
    marginRight: 5,
  },

  // Legacy styles (can be removed if not used elsewhere)
  transactionContainer: {},
  transactionSummary: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#2a2a2a",
    borderRadius: 5,
    marginTop: 10,
  },
  transactionToCollect: {
    backgroundColor: "#4caf50",
    width: 120,
    height: 55,
    textAlign: "center",
    color: "#fff",
  },
  transactionToPay: {
    backgroundColor: "#ff4d4d",
    width: 120,
    height: 55,
    textAlign: "center",
    color: "#fff",
  },
  transactionList: {
    marginTop: 10,
  },
});
