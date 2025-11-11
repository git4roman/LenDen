import { StyleSheet } from "react-native";
import { Colors } from "../theme/colors";

export const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 0,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  // Header styles
  header: {
    height: 200,
    marginBottom: 10,
  },
  groupName: {
    fontSize: 24,
    color: Colors.textPrimary,
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
    backgroundColor: Colors.income,
  },
  payColor: {
    backgroundColor: Colors.expense,
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
  // Floating button styles
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
  noTransactionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noTransactionsText: {
    color: "#888",
    marginTop: 10,
    fontSize: 16,
    fontStyle: "italic",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    width: 50,
    height: 50,
    gap: 6,
    position: "absolute",
    bottom: 25,
    right: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
