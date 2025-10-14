import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";

export const styles = StyleSheet.create({
  content: { flex: 1 },

  yearHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginVertical: 8,
    marginLeft: 10,
  },

  transactionBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 12,
  },

  dateColumn: {
    width: 40,
    alignItems: "center",
  },

  day: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "bold",
  },

  month: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 2,
  },

  detailsColumn: {
    flex: 1,
    marginLeft: 10,
  },

  description: {
    fontSize: 15,
    color: Colors.textPrimary,
  },

  paidInfo: {
    fontSize: 14,
    color: Colors.secondary,
  },

  amount: {
    width: 90,
    textAlign: "right",
    fontWeight: "bold",
    color: Colors.textPrimary,
  },

  noTransactionsContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  noTransactionsText: {
    color: "#888",
    marginTop: 10,
    fontSize: 16,
    fontStyle: "italic",
  },

  sectionHeader: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
});
