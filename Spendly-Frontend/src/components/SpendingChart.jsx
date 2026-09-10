import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useTheme } from "../theme/ThemeContext";

export default function SpendingChart({
  expenses = [],
}) {
  const { colors } = useTheme();

  // Only expenses
  const expenseTransactions =
    expenses.filter(
      (item) =>
        item.type === "expense"
    );

  // No data
  if (
    expenseTransactions.length === 0
  ) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Spending Overview
        </Text>

        <View
          style={styles.emptyContainer}
        >
          <Text style={styles.emptyIcon}>
            📊
          </Text>

          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No spending data yet
          </Text>

          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Add an expense to see your
            spending overview.
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
        (categoryTotals[category] || 0) +
        Number(expense.amount || 0);
    }
  );

  const categories =
    Object.entries(
      categoryTotals
    ).sort(
      (a, b) => b[1] - a[1]
    );

  // =========================
  // TOTAL
  // =========================

  const totalExpense =
    categories.reduce(
      (total, [, amount]) =>
        total + amount,
      0
    );

  // =========================
  // TOP CATEGORIES
  // =========================

  const visibleCategories =
    categories.slice(0, 5);

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            Spending Overview
          </Text>

          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Where your money goes
          </Text>
        </View>

        <Text style={[styles.total, { color: colors.text }]}>
          ₹
          {totalExpense.toLocaleString(
            "en-IN"
          )}
        </Text>
      </View>

      {/* BARS */}

      <View style={styles.chart}>
        {visibleCategories.map(
          (
            [category, amount],
            index
          ) => {
            const percentage =
              totalExpense > 0
                ? amount /
                  totalExpense
                : 0;

            return (
              <View
                key={category}
                style={
                  styles.barRow
                }
              >
                <View
                  style={
                    styles.categoryRow
                  }
                >
                  <Text
                    style={[
                      styles.category,
                      { color: colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {category}
                  </Text>

                  <Text
                    style={[
                      styles.amount,
                      { color: colors.textMuted },
                    ]}
                  >
                    ₹
                    {amount.toLocaleString(
                      "en-IN"
                    )}
                  </Text>
                </View>

                <View
                  style={[
                    styles.barBackground,
                    { backgroundColor: colors.iconBox },
                  ]}
                >
                  <View
                    style={[
                      styles.bar,
                      { backgroundColor: colors.accent },
                      {
                        width: `${Math.max(
                          percentage *
                            100,
                          3
                        )}%`,
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

    total: {
      fontSize: 15,
      fontWeight: "800",
      color: "#111827",
    },

    chart: {
      gap: 15,
    },

    barRow: {
      width: "100%",
    },

    categoryRow: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      marginBottom: 7,
    },

    category: {
      flex: 1,
      fontSize: 13,
      fontWeight: "600",
      color: "#374151",
    },

    amount: {
      fontSize: 12,
      fontWeight: "700",
      color: "#6B7280",
    },

    barBackground: {
      height: 8,
      backgroundColor:
        "#F3F4F6",
      borderRadius: 10,
      overflow: "hidden",
    },

    bar: {
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