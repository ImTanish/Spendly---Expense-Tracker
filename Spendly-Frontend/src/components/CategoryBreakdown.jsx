import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useTheme } from "../theme/ThemeContext";

export default function CategoryBreakdown({
  expenses = [],
}) {
  const { colors } = useTheme();
  // Only expenses
  const expenseTransactions =
    expenses.filter(
      (item) =>
        item.type === "expense"
    );

  // =========================
  // EMPTY STATE
  // =========================

  if (
    expenseTransactions.length === 0
  ) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Spending by Category
        </Text>

        <View
          style={styles.emptyContainer}
        >
          <Text style={styles.emptyIcon}>
            🧾 
          </Text>

          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No categories yet
          </Text>

          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Add some expenses to see your
            category breakdown.
          </Text>
        </View>
      </View>
    );
  }

  // =========================
  // CATEGORY TOTALS
  // =========================

  const categoryTotals = {};

  expenseTransactions.forEach(
    (expense) => {
      const category =
        expense.category ||
        "Other";

      categoryTotals[category] =
        (categoryTotals[category] ||
          0) +
        Number(
          expense.amount || 0
        );
    }
  );

  // Sort highest spending first
  const categories =
    Object.entries(
      categoryTotals
    ).sort(
      (a, b) => b[1] - a[1]
    );

  // Total expense
  const totalExpense =
    categories.reduce(
      (total, [, amount]) =>
        total + amount,
      0
    );

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            Spending by Category
          </Text>

          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Your biggest spending areas
          </Text>
        </View>

        <Text style={[styles.categoryCount, { backgroundColor: colors.iconBox, color: colors.textSecondary }]}>
          {categories.length}{" "}
          {categories.length === 1
            ? "category"
            : "categories"}
        </Text>
      </View>

      {/* CATEGORY LIST */}

      <View style={styles.list}>
        {categories.map(
          (
            [category, amount],
            index
          ) => {
            const percentage =
              totalExpense > 0
                ? (amount /
                    totalExpense) *
                  100
                : 0;

            return (
              <View
                key={category}
                style={styles.categoryItem}
              >
                {/* TOP ROW */}

                <View
                  style={
                    styles.categoryHeader
                  }
                >
                  <View
                    style={
                      styles.categoryNameContainer
                    }
                  >
                    <View
                      style={[
                        styles.numberCircle,
                        { backgroundColor: colors.iconBox },
                      ]}
                    >
                      <Text
                        style={[
                          styles.number,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {index + 1}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.categoryName,
                        { color: colors.text },
                      ]}
                    >
                      {category}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.amountContainer
                    }
                  >
                    <Text
                      style={[
                        styles.amount,
                        { color: colors.text },
                      ]}
                    >
                      ₹
                      {amount.toLocaleString(
                        "en-IN"
                      )}
                    </Text>

                    <Text
                      style={[
                        styles.percentage,
                        { color: colors.textMuted },
                      ]}
                    >
                      {percentage.toFixed(
                        0
                      )}
                      %
                    </Text>
                  </View>
                </View>

                {/* PROGRESS BAR */}

                <View
                  style={[
                    styles.progressBackground,
                    { backgroundColor: colors.iconBox },
                  ]}
                >
                  <View
                    style={[
                      styles.progress,
                      { backgroundColor: colors.accent },
                      {
                        width: `${percentage}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          }
        )}
      </View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    card: {
      backgroundColor:
        "#FFFFFF",
      borderRadius: 20,
      padding: 18,
      marginBottom: 18,

      shadowColor:
        "#000",
      shadowOpacity:
        0.04,
      shadowRadius:
        8,
      shadowOffset: {
        width: 0,
        height: 3,
      },

      elevation: 2,
    },

    header: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "flex-start",
      marginBottom: 20,
    },

    title: {
      fontSize: 17,
      fontWeight: "800",
      color: "#111827",
    },

    subtitle: {
      fontSize: 12,
      color: "#9CA3AF",
      marginTop: 3,
    },

    categoryCount: {
      fontSize: 11,
      color: "#6B7280",
      fontWeight: "600",
      backgroundColor:
        "#F3F4F6",
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 10,
    },

    list: {
      gap: 18,
    },

    categoryItem: {
      width: "100%",
    },

    categoryHeader: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      marginBottom: 8,
    },

    categoryNameContainer: {
      flexDirection:
        "row",
      alignItems:
        "center",
      flex: 1,
    },

    numberCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor:
        "#F3F4F6",
      alignItems:
        "center",
      justifyContent:
        "center",
      marginRight: 9,
    },

    number: {
      fontSize: 11,
      fontWeight: "800",
      color: "#6B7280",
    },

    categoryName: {
      fontSize: 14,
      fontWeight: "700",
      color: "#374151",
    },

    amountContainer: {
      alignItems:
        "flex-end",
    },

    amount: {
      fontSize: 13,
      fontWeight: "800",
      color: "#111827",
    },

    percentage: {
      fontSize: 10,
      color: "#9CA3AF",
      marginTop: 2,
    },

    progressBackground: {
      height: 7,
      backgroundColor:
        "#F3F4F6",
      borderRadius: 10,
      overflow: "hidden",
    },

    progress: {
      height: "100%",
      backgroundColor:
        "#111827",
      borderRadius: 10,
    },

    emptyContainer: {
      alignItems:
        "center",
      paddingVertical: 30,
      paddingHorizontal: 15,
    },

    emptyIcon: {
      fontSize: 32,
      marginBottom: 10,
    },

    emptyTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: "#374151",
    },

    emptyText: {
      textAlign: "center",
      fontSize: 12,
      color: "#9CA3AF",
      marginTop: 5,
    },
  });