import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
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
  addTransaction,
  persistTransactions,
  selectTransactionLoading,
  selectTransactionError,
  clearTransactionError,
} from "../redux/slices/transactionSlice";

import { useTheme } from "../theme/ThemeContext";

export default function AddExpenseScreen({
  navigation,
}) {
  const dispatch =
    useDispatch();

  const { colors } = useTheme();
  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  // =========================
  // REDUX STATE
  // =========================

  const loading =
    useSelector(
      selectTransactionLoading
    );

  const reduxError =
    useSelector(
      selectTransactionError
    );

  // =========================
  // FORM STATE
  // =========================

  const [type, setType] =
    useState("expense");

  const [title, setTitle] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [formError, setFormError] =
    useState("");

  // =========================
  // RESET FORM
  // =========================

  const resetForm = useCallback(
    () => {
      setType("expense");
      setTitle("");
      setAmount("");
      setCategory("");
      setFormError("");

      dispatch(
        clearTransactionError()
      );
    },
    [dispatch]
  );

  // =========================
  // USE FOCUS EFFECT
  // =========================

  useFocusEffect(
    useCallback(() => {
      resetForm();

      return () => {};
    }, [resetForm])
  );

  // =========================
  // CATEGORIES
  // =========================

  const expenseCategories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
    "Rent",
    "Health",
    "Other",
  ];

  const incomeCategories = [
    "Job",
    "Business",
    "Freelance",
    "Investment",
    "Gift",
    "Other",
  ];

  const categories =
    type === "income"
      ? incomeCategories
      : expenseCategories;

  // =========================
  // CHANGE TYPE
  // =========================

  const changeType = (
    selectedType
  ) => {
    setType(
      selectedType
    );

    setCategory("");

    setFormError("");

    dispatch(
      clearTransactionError()
    );
  };

  // =========================
  // ADD TRANSACTION
  // =========================

  const handleAddTransaction =
    async () => {
      setFormError("");

      dispatch(
        clearTransactionError()
      );

      // =======================
      // TITLE VALIDATION
      // =======================

      if (!title.trim()) {
        setFormError(
          "Please enter a title."
        );

        return;
      }

      // =======================
      // AMOUNT VALIDATION
      // =======================

      if (!amount.trim()) {
        setFormError(
          "Please enter an amount."
        );

        return;
      }

      const numericAmount =
        Number(amount);

      if (
        Number.isNaN(
          numericAmount
        ) ||
        numericAmount <= 0
      ) {
        setFormError(
          "Please enter a valid amount."
        );

        return;
      }

      // =======================
      // CATEGORY VALIDATION
      // =======================

      if (!category) {
        setFormError(
          "Please select a category."
        );

        return;
      }

      try {
        // =====================
        // CREATE TRANSACTION
        // =====================

        const newTransaction = {
          id:
            Date.now().toString(),

          title:
            title.trim(),

          amount:
            numericAmount,

          category,

          type,

          date:
            new Date().toISOString(),
        };

        // =====================
        // ADD TO REDUX
        // =====================

        dispatch(
          addTransaction(
            newTransaction
          )
        );

        // =====================
        // SAVE TO STORAGE
        // =====================

        const result =
          await dispatch(
            persistTransactions()
          );

        // =====================
        // CHECK SAVE RESULT
        // =====================

        if (
          persistTransactions
            .rejected
            .match(result)
        ) {
          setFormError(
            "Transaction could not be saved. Please try again."
          );

          return;
        }

        // =====================
        // RESET
        // =====================

        resetForm();

        // =====================
        // GO HOME
        // =====================

        navigation.navigate(
          "Dashboard"
        );
      } catch (error) {
        console.log(
          "Add transaction error:",
          error
        );

        setFormError(
          "Something went wrong. Please try again."
        );
      }
    };

  // =========================
  // DISPLAY ERROR
  // =========================

  const displayError =
    formError ||
    reduxError;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          styles.container
        }
      >
        {/* ===================== */}
        {/* HEADER */}
        {/* ===================== */}

        <View
          style={
            styles.header
          }
        >
          <Text
            style={styles.title}
          >
            Add Transaction
          </Text>

          <Text
            style={styles.subtitle}
          >
            Record your income or expense
          </Text>
        </View>

        {/* ===================== */}
        {/* TRANSACTION TYPE */}
        {/* ===================== */}

        <Text
          style={styles.label}
        >
          Transaction Type
        </Text>

        <View
          style={
            styles.typeContainer
          }
        >
          {/* EXPENSE */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.typeButton,
              type === "expense" &&
                styles.expenseActive,
            ]}
            onPress={() =>
              changeType(
                "expense"
              )
            }
            disabled={loading}
          >
            <View
              style={[
                styles.typeIconContainer,
                type === "expense" &&
                  styles.expenseIconActive,
              ]}
            >
              <Text
                style={
                  styles.typeIcon
                }
              >
                ↘
              </Text>
            </View>

            <Text
              style={[
                styles.typeText,
                type === "expense" &&
                  styles.activeTypeText,
              ]}
            >
              Expense
            </Text>

            <Text
              style={
                styles.typeDescription
              }
            >
              Money spent
            </Text>
          </TouchableOpacity>

          {/* INCOME */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.typeButton,
              type === "income" &&
                styles.incomeActive,
            ]}
            onPress={() =>
              changeType(
                "income"
              )
            }
            disabled={loading}
          >
            <View
              style={[
                styles.typeIconContainer,
                type === "income" &&
                  styles.incomeIconActive,
              ]}
            >
              <Text
                style={
                  styles.typeIcon
                }
              >
                ↗
              </Text>
            </View>

            <Text
              style={[
                styles.typeText,
                type === "income" &&
                  styles.activeTypeText,
              ]}
            >
              Income
            </Text>

            <Text
              style={
                styles.typeDescription
              }
            >
              Money received
            </Text>
          </TouchableOpacity>
        </View>

        {/* ===================== */}
        {/* TITLE */}
        {/* ===================== */}

        <Text
          style={styles.label}
        >
          Title
        </Text>

        <TextInput
          value={title}
          onChangeText={
            setTitle
          }
          placeholder={
            type === "income"
              ? "e.g. Monthly Salary"
              : "e.g. Grocery Shopping"
          }
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          editable={!loading}
        />

        {/* ===================== */}
        {/* AMOUNT */}
        {/* ===================== */}

        <Text
          style={styles.label}
        >
          Amount
        </Text>

        <View
          style={
            styles.amountContainer
          }
        >
          <Text
            style={
              styles.currency
            }
          >
            ₹
          </Text>

          <TextInput
            value={amount}
            onChangeText={
              setAmount
            }
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            style={
              styles.amountInput
            }
            editable={!loading}
          />
        </View>

        {/* ===================== */}
        {/* CATEGORY */}
        {/* ===================== */}

        <Text
          style={styles.label}
        >
          Category
        </Text>

        <View
          style={
            styles.categoryContainer
          }
        >
          {categories.map(
            (item) => (
              <TouchableOpacity
                key={item}
                activeOpacity={0.8}
                style={[
                  styles.categoryButton,
                  category ===
                    item &&
                    styles.categoryActive,
                ]}
                onPress={() =>
                  setCategory(
                    item
                  )
                }
                disabled={loading}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category ===
                      item &&
                      styles.categoryTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* ===================== */}
        {/* ERROR */}
        {/* ===================== */}

        {displayError ? (
          <View
            style={
              styles.errorBox
            }
          >
            <Text
              style={
                styles.errorIcon
              }
            >
              ⚠️
            </Text>

            <Text
              style={
                styles.errorText
              }
            >
              {displayError}
            </Text>
          </View>
        ) : null}

        {/* ===================== */}
        {/* SUBMIT */}
        {/* ===================== */}

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.addButton,
            type === "income"
              ? styles.incomeButton
              : styles.expenseButton,
            loading &&
              styles.disabledButton,
          ]}
          onPress={
            handleAddTransaction
          }
          disabled={loading}
        >
          {loading ? (
            <View
              style={
                styles.loadingButtonContent
              }
            >
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.addButtonText
                }
              >
                Saving...
              </Text>
            </View>
          ) : (
            <Text
              style={
                styles.addButtonText
              }
            >
              {type === "income"
                ? "Add Income"
                : "Add Expense"}
            </Text>
          )}
        </TouchableOpacity>

        {/* ===================== */}
        {/* FOOTER */}
        {/* ===================== */}

        <Text
          style={
            styles.footerText
          }
        >
          Your transaction will be securely
          saved on this device.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    // =========================
    // SCREEN
    // =========================

    screen: {
      flex: 1,
      backgroundColor: colors.screenBackground,
    },

    container: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 130,
    },

    // =========================
    // HEADER
    // =========================

    header: {
      marginBottom: 20,
    },

    title: {
      fontSize: 30,
      fontWeight: "800",
      color: colors.text,
    },

    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 5,
    },

    // =========================
    // LABEL
    // =========================

    label: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textSecondary,
      marginBottom: 9,
      marginTop: 13,
    },

    // =========================
    // TYPE
    // =========================

    typeContainer: {
      flexDirection: "row",
      gap: 12,
    },

    typeButton: {
      flex: 1,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: 15,
    },

    expenseActive: {
      backgroundColor: colors.dangerBg,
      borderColor: colors.danger,
    },

    incomeActive: {
      backgroundColor: colors.successBg,
      borderColor: colors.success,
    },

    typeIconContainer: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: colors.iconBox,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 9,
    },

    expenseIconActive: {
      backgroundColor: colors.dangerBg,
    },

    incomeIconActive: {
      backgroundColor: colors.successBg,
    },

    typeIcon: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.text,
    },

    typeText: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.textSecondary,
    },

    activeTypeText: {
      color: colors.text,
    },

    typeDescription: {
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 3,
    },

    // =========================
    // INPUT
    // =========================

    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 15,
      paddingVertical: 13,
      fontSize: 15,
      color: colors.text,
    },

    // =========================
    // AMOUNT
    // =========================

    amountContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 15,
    },

    currency: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.text,
    },

    amountInput: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 13,
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },

    // =========================
    // CATEGORY
    // =========================

    categoryContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },

    categoryButton: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 9,
    },

    categoryActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },

    categoryText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
    },

    categoryTextActive: {
      color: "#FFFFFF",
    },

    // =========================
    // ERROR
    // =========================

    errorBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.dangerBg,
      borderWidth: 1,
      borderColor: colors.danger,
      borderRadius: 12,
      padding: 11,
      marginTop: 15,
    },

    errorIcon: {
      fontSize: 15,
      marginRight: 8,
    },

    errorText: {
      flex: 1,
      color: colors.danger,
      fontSize: 12,
      fontWeight: "600",
    },

    // =========================
    // BUTTON
    // =========================

    addButton: {
      marginTop: 24,
      borderRadius: 15,
      paddingVertical: 15,
      alignItems: "center",
      justifyContent: "center",
    },

    expenseButton: {
      backgroundColor: colors.accent,
    },

    incomeButton: {
      backgroundColor: colors.success,
    },

    disabledButton: {
      opacity: 0.65,
    },

    loadingButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    addButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "800",
    },

    // =========================
    // FOOTER
    // =========================

    footerText: {
      textAlign: "center",
      color: colors.textMuted,
      fontSize: 11,
      marginTop: 15,
      lineHeight: 17,
    },
  });