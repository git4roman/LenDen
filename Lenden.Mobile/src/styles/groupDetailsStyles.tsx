import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1a1a1a",
  },
  content: {
    flex: 1,
  },
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
  transactionList: {
    marginTop: 10,
  },
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
  transactionDescription: {
    color: "#fff",
    marginRight: 5,
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
