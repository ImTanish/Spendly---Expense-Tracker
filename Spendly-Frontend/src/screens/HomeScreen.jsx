import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  loadTransactions,
  selectTransactions,
  selectTransactionLoading,
  selectTransactionError,
  clearTransactionError,
} from "../redux/slices/transactionSlice";

import SummaryCard from "../components/SummaryCard";
import CategoryBreakdown from "../components/CategoryBreakdown";
import SpendingChart from "../components/SpendingChart";
import { useTheme } from "../theme/ThemeContext";

export default function HomeScreen({
  navigation,
}) {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  // =========================
  // REDUX DATA
  // =========================

  const transactions =
    useSelector(
      selectTransactions
    );

  const loading =
    useSelector(
      selectTransactionLoading
    );

  const error =
    useSelector(
      selectTransactionError
    );

  // =========================
  // REFRESH
  // =========================

  const [refreshing, setRefreshing] =
    useState(false);

  // =========================
  // LOAD DATA WHEN SCREEN
  // COMES INTO FOCUS
  // =========================

  useFocusEffect(
    useCallback(() => {
      dispatch(
        loadTransactions()
      );

      dispatch(
        clearTransactionError()
      );

      return () => {};
    }, [dispatch])
  );

  // =========================
  // CALCULATE TOTALS
  // =========================

  const totalIncome = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type ===
          "income"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(
            transaction.amount || 0
          ),
        0
      );
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type ===
          "expense"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(
            transaction.amount || 0
          ),
        0
      );
  }, [transactions]);

  const balance =
    totalIncome - totalExpense;

  // =========================
  // RECENT TRANSACTIONS
  // =========================

  const recentTransactions =
    useMemo(() => {
      return [...transactions]
        .sort(
          (a, b) =>
            new Date(b.date) -
            new Date(a.date)
        )
        .slice(0, 5);
    }, [transactions]);

  // =========================
  // REFRESH
  // =========================

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await dispatch(
        loadTransactions()
      );
    } finally {
      setRefreshing(false);
    }
  };

  // =========================
  // TRANSACTION ITEM
  // =========================

  const renderTransaction = ({
    item,
  }) => {
    const isIncome =
      item.type === "income";

    // Note: intentionally a plain View, not a TouchableOpacity —
    // tapping an individual recent transaction no longer redirects
    // to the Transactions screen. Use the "View all" link instead.
    return (
      <View
        style={[
          styles.transactionCard,
          { backgroundColor: colors.card },
        ]}
      >
        <View
          style={
            styles.transactionLeft
          }
        >
          <View
            style={[
              styles.transactionIcon,
              isIncome
                ? { backgroundColor: colors.successBg }
                : { backgroundColor: colors.dangerBg },
            ]}
          >
            <Text
              style={[
                styles.transactionIconText,
                { color: colors.text },
              ]}
            >
              {isIncome ? "↗" : "↘"}
            </Text>
          </View>

          <View
            style={
              styles.transactionInfo
            }
          >
            <Text
              style={[
                styles.transactionTitle,
                { color: colors.text },
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>

            <Text
              style={[
                styles.transactionCategory,
                { color: colors.textMuted },
              ]}
            >
              {item.category ||
                "Other"}
            </Text>
          </View>
        </View>

        <View
          style={
            styles.transactionRight
          }
        >
          <Text
            style={[
              styles.transactionAmount,
              isIncome
                ? { color: colors.success }
                : { color: colors.danger },
            ]}
          >
            {isIncome ? "+" : "-"}₹
            {Number(
              item.amount
            ).toLocaleString("en-IN")}
          </Text>

          <Text
            style={[
              styles.transactionDate,
              { color: colors.textMuted },
            ]}
          >
            {new Date(
              item.date
            ).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
              }
            )}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.screenBackground },
      ]}
    >
      <FlatList
        data={recentTransactions}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={
          renderTransaction
        }
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={
              handleRefresh
          }
        />
        }
        contentContainerStyle={
          styles.container
        }
        ListHeaderComponent={
          <>
            {/* ================= */}
            {/* HEADER */}
            {/* ================= */}

            <View
              style={styles.header}
            >
              <View>
                <Text
                  style={[
                    styles.greeting,
                    { color: colors.textSecondary },
                  ]}
                >
                  Welcome back 👋
                </Text>

                <Text
                  style={[
                    styles.title,
                    { color: colors.text },
                  ]}
                >
                  Spendly
                </Text>

                <Text
                  style={[
                    styles.subtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Track your money smarter
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.addButton,
                  { backgroundColor: colors.accent },
                ]}
                onPress={() =>
                  navigation.navigate(
                    "Add"
                  )
                }
              >
                <Text
                  style={
                    styles.addButtonText
                  }
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>

            {/* ================= */}
            {/* SUMMARY */}
            {/* ================= */}

      <TouchableOpacity
  activeOpacity={0.8}
  onPress={() => navigation.navigate("Transactions")}
>
  <SummaryCard
    totalIncome={totalIncome}
    totalExpense={totalExpense}
    balance={balance}
  />
</TouchableOpacity>
           

            {/* ================= */}
            {/* QUICK STATS */}
            {/* ================= */}

            <View
              style={
                styles.quickStats
              }
            >
              <View
                style={[
                  styles.quickStatCard,
                  { backgroundColor: colors.card },
                ]}
              >
                <View
                  style={[
                    styles.quickIcon,
                    { backgroundColor: colors.successBg },
                  ]}
                >
                  <Text>
                    💰
                  </Text>
                </View>

                <View>
                  <Text
                    style={[
                      styles.quickLabel,
                      { color: colors.textMuted },
                    ]}
                  >
                    Income
                  </Text>

                  <Text
                    style={[
                      styles.quickValue,
                      { color: colors.text },
                    ]}
                  >
                    ₹
                    {totalIncome.toLocaleString(
                      "en-IN"
                    )}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.quickStatCard,
                  { backgroundColor: colors.card },
                ]}
              >
                <View
                  style={[
                    styles.quickIcon,
                    { backgroundColor: colors.dangerBg },
                  ]}
                >
                  <Text>
                    💸
                  </Text>
                </View>

                <View>
                  <Text
                    style={[
                      styles.quickLabel,
                      { color: colors.textMuted },
                    ]}
                  >
                    Expenses
                  </Text>

                  <Text
                    style={[
                      styles.quickValue,
                      { color: colors.text },
                    ]}
                  >
                    ₹
                    {totalExpense.toLocaleString(
                      "en-IN"
                    )}
                  </Text>
                </View>
              </View>
            </View>

            {/* ================= */}
            {/* CHART */}
            {/* ================= */}

            {transactions.length >
              0 && (
              <View
                style={
                  styles.section
                }
              >
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: colors.text },
                  ]}
                >
                  Spending Overview
                </Text>

                <SpendingChart
                  expenses={
                    transactions
                  }
                />
              </View>
            )}

            {/* ================= */}
            {/* CATEGORY */}
            {/* ================= */}

            {transactions.length >
              0 && (
              <View
                style={
                  styles.section
                }
              >
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: colors.text },
                  ]}
                >
                  Category Breakdown
                </Text>

                <CategoryBreakdown
                  expenses={
                    transactions
                  }
                />
              </View>
            )}

            {/* ================= */}
            {/* RECENT HEADER */}
            {/* ================= */}

            <View
              style={
                styles.recentHeader
              }
            >
              <View>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: colors.text },
                  ]}
                >
                  Recent Transactions
                </Text>

                <Text
                  style={[
                    styles.sectionSubtitle,
                    { color: colors.textMuted },
                  ]}
                >
                  Your latest money activity
                </Text>
              </View>

              {transactions.length >
                0 && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate(
                      "Transactions"
                    )
                  }
                >
                  <Text
                    style={[
                      styles.viewAll,
                      { color: colors.accent },
                    ]}
                  >
                    View all →
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ================= */}
            {/* ERROR */}
            {/* ================= */}

            {error && (
              <View
                style={[
                  styles.errorBox,
                  {
                    backgroundColor: colors.dangerBg,
                    borderColor: colors.danger,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.errorText,
                    { color: colors.danger },
                  ]}
                >
                  ⚠️ {error}
                </Text>
              </View>
            )}

            {/* ================= */}
            {/* EMPTY */}
            {/* ================= */}

            {transactions.length ===
              0 &&
              !loading && (
                <View
                  style={[
                    styles.emptyCard,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <View
                    style={[
                      styles.emptyIcon,
                      { backgroundColor: colors.iconBox },
                    ]}
                  >
                    <Text
                      style={
                        styles.emptyIconText
                      }
                    >
                      💳
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.emptyTitle,
                      { color: colors.text },
                    ]}
                  >
                    No transactions yet
                  </Text>

                  <Text
                    style={[
                      styles.emptyText,
                      { color: colors.textMuted },
                    ]}
                  >
                    Start tracking your money
                    by adding your first
                    income or expense.
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.emptyAddButton,
                      { backgroundColor: colors.accent },
                    ]}
                    onPress={() =>
                      navigation.navigate(
                        "Add"
                      )
                    }
                  >
                    <Text
                      style={
                        styles.emptyAddButtonText
                      }
                    >
                      Add Transaction
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
          </>
        }
        ListFooterComponent={
          <View
            style={
              styles.footerSpace
            }
          />
        }
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    // =========================
    // SCREEN
    // =========================

    screen: {
      flex: 1,
      backgroundColor: "#F5F6FA",
    },

    container: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 120,
    },

    // =========================
    // HEADER
    // =========================

    header: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom: 20,
    },

    greeting: {
      fontSize: 13,
      color: "#6B7280",
      fontWeight: "600",
      marginBottom: 3,
    },

    title: {
      fontSize: 32,
      fontWeight: "800",
      color: "#111827",
    },

    subtitle: {
      fontSize: 13,
      color: "#6B7280",
      marginTop: 4,
    },

    addButton: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: "#111827",
      alignItems: "center",
      justifyContent: "center",

      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 4,
      },

      elevation: 4,
    },

    addButtonText: {
      color: "#FFFFFF",
      fontSize: 28,
      fontWeight: "300",
      lineHeight: 30,
    },

    // =========================
    // QUICK STATS
    // =========================

    quickStats: {
      flexDirection: "row",
      gap: 10,
      marginTop: 12,
    },

    quickStatCard: {
      flex: 1,
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      padding: 13,
      flexDirection: "row",
      alignItems: "center",
    },

    quickIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 9,
    },

    incomeQuickIcon: {
      backgroundColor: "#DCFCE7",
    },

    expenseQuickIcon: {
      backgroundColor: "#FEE2E2",
    },

    quickLabel: {
      fontSize: 10,
      color: "#9CA3AF",
      fontWeight: "600",
    },

    quickValue: {
      fontSize: 13,
      color: "#111827",
      fontWeight: "800",
      marginTop: 2,
    },

    // =========================
    // SECTIONS
    // =========================

    section: {
      marginTop: 25,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: "#111827",
    },

    sectionSubtitle: {
      fontSize: 11,
      color: "#9CA3AF",
      marginTop: 3,
    },

    recentHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "flex-end",
      marginTop: 28,
      marginBottom: 12,
    },

    viewAll: {
      fontSize: 12,
      color: "#111827",
      fontWeight: "800",
    },

    // =========================
    // TRANSACTION
    // =========================

    transactionCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 17,
      padding: 13,
      marginBottom: 9,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
    },

    transactionLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    transactionIcon: {
      width: 43,
      height: 43,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 11,
    },

    incomeIcon: {
      backgroundColor: "#DCFCE7",
    },

    expenseIcon: {
      backgroundColor: "#FEE2E2",
    },

    transactionIconText: {
      fontSize: 20,
      fontWeight: "800",
      color: "#111827",
    },

    transactionInfo: {
      flex: 1,
    },

    transactionTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: "#111827",
    },

    transactionCategory: {
      fontSize: 10,
      color: "#9CA3AF",
      marginTop: 3,
    },

    transactionRight: {
      alignItems: "flex-end",
      marginLeft: 10,
    },

    transactionAmount: {
      fontSize: 13,
      fontWeight: "800",
    },

    incomeAmount: {
      color: "#16A34A",
    },

    expenseAmount: {
      color: "#DC2626",
    },

    transactionDate: {
      fontSize: 9,
      color: "#9CA3AF",
      marginTop: 3,
    },

    // =========================
    // ERROR
    // =========================

    errorBox: {
      backgroundColor: "#FEF2F2",
      borderWidth: 1,
      borderColor: "#FECACA",
      borderRadius: 13,
      padding: 11,
      marginBottom: 12,
    },

    errorText: {
      color: "#B91C1C",
      fontSize: 12,
      fontWeight: "600",
    },

    // =========================
    // EMPTY
    // =========================

    emptyCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      padding: 25,
      alignItems: "center",
      marginTop: 5,
    },

    emptyIcon: {
      width: 65,
      height: 65,
      borderRadius: 22,
      backgroundColor: "#F3F4F6",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 13,
    },

    emptyIconText: {
      fontSize: 30,
    },

    emptyTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: "#111827",
    },

    emptyText: {
      fontSize: 12,
      color: "#9CA3AF",
      textAlign: "center",
      lineHeight: 18,
      marginTop: 5,
    },

    emptyAddButton: {
      backgroundColor: "#111827",
      paddingHorizontal: 18,
      paddingVertical: 11,
      borderRadius: 12,
      marginTop: 15,
    },

    emptyAddButtonText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "800",
    },

    footerSpace: {
      height: 30,
    },
  });