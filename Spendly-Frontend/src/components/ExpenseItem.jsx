import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { categories } from "../constants/categories";

export default function ExpenseItem({
  expense,
  onEdit,
  onDelete,
}) {
  const selectedCategory =
    categories.find(
      (item) =>
        item.id === expense.category
    );

  const isIncome =
    expense.type === "income";

  const formattedDate = new Date(
    expense.date
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.expenseItem}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>
            {selectedCategory?.emoji || "💰"}
          </Text>
        </View>

        <View style={styles.expenseInfo}>
          <Text style={styles.expenseTitle}>
            {expense.title}
          </Text>

          <Text style={styles.expenseCategory}>
            {selectedCategory?.name ||
              "Other"}
          </Text>

          <Text style={styles.date}>
            {formattedDate}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text
          style={[
            styles.amount,
            isIncome
              ? styles.incomeAmount
              : styles.expenseAmount,
          ]}
        >
          {isIncome ? "+" : "-"}₹
          {expense.amount}
        </Text>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              onEdit(expense)
            }
          >
            <Text style={styles.editText}>
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              onDelete(expense.id)
            }
          >
            <Text
              style={styles.deleteText}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expenseItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,

    backgroundColor: "#F1F2F6",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  icon: {
    fontSize: 21,
  },

  expenseInfo: {
    flex: 1,
  },

  expenseTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  expenseCategory: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },

  date: {
    fontSize: 11,
    color: "#999",
    marginTop: 3,
  },

  rightSection: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  amount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 7,
  },

  incomeAmount: {
    color: "#159957",
  },

  expenseAmount: {
    color: "#D64545",
  },

  actionContainer: {
    flexDirection: "row",
    gap: 5,
  },

  editButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 7,
    backgroundColor: "#F1F2F6",
  },

  editText: {
    fontSize: 10,
    fontWeight: "600",
  },

  deleteButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 7,
    backgroundColor: "#F1F2F6",
  },

  deleteText: {
    fontSize: 10,
    fontWeight: "600",
  },
});