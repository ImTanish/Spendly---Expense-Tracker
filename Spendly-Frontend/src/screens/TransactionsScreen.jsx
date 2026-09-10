import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
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
  deleteTransaction,
  updateTransaction,
  persistTransactions,
  selectTransactions,
  selectTransactionLoading,
  selectTransactionError,
  clearTransactionError,
} from "../redux/slices/transactionSlice";

import { useTheme } from "../theme/ThemeContext";

export default function TransactionsScreen() {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  // =========================
  // REDUX
  // =========================

  const transactions = useSelector(
    selectTransactions
  );

  

  const loading = useSelector(
    selectTransactionLoading
  );

  const reduxError = useSelector(
    selectTransactionError
  );

  // =========================
  // SEARCH & FILTER
  // =========================

  const [searchText, setSearchText] =
    useState("");

  const [selectedType, setSelectedType] =
    useState("all");

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  // =========================
  // EDIT MODAL
  // =========================

  const [editModalVisible, setEditModalVisible] =
    useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [editAmount, setEditAmount] =
    useState("");

  const [editError, setEditError] =
    useState("");

  // =========================
  // USE FOCUS EFFECT
  // =========================

  useFocusEffect(
    useCallback(() => {
      dispatch(clearTransactionError());

      return () => {};
    }, [dispatch])
  );

  // =========================
  // RESET FILTERS
  // =========================

  const resetFilters = () => {
    setSearchText("");
    setSelectedType("all");
    setSelectedCategory("all");
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);

    setEditTitle(
      transaction.title || ""
    );

    setEditAmount(
      String(transaction.amount || "")
    );

    setEditError("");

    dispatch(clearTransactionError());

    setEditModalVisible(true);
  };

  // =========================
  // CLOSE EDIT MODAL
  // =========================

  const closeEditModal = () => {
    if (loading) {
      return;
    }

    setEditModalVisible(false);

    setEditingTransaction(null);

    setEditTitle("");

    setEditAmount("");

    setEditError("");

    dispatch(clearTransactionError());
  };

  // =========================
  // UPDATE TRANSACTION
  // =========================

  const handleUpdate = async () => {
    setEditError("");

    if (!editTitle.trim()) {
      setEditError(
        "Please enter a title."
      );

      return;
    }

    if (!editAmount.trim()) {
      setEditError(
        "Please enter an amount."
      );

      return;
    }

    const numericAmount =
      Number(editAmount);

    if (
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      setEditError(
        "Please enter a valid amount."
      );

      return;
    }

    if (!editingTransaction) {
      return;
    }

    try {
      const updatedTransaction = {
        ...editingTransaction,

        title: editTitle.trim(),

        amount: numericAmount,
      };

      dispatch(
        updateTransaction(
          updatedTransaction
        )
      );

      const result = await dispatch(
        persistTransactions()
      );

      if (
        persistTransactions.rejected.match(
          result
        )
      ) {
        setEditError(
          "Could not save changes. Please try again."
        );

        return;
      }

      closeEditModal();
    } catch (error) {
      console.log(
        "Update transaction error:",
        error
      );

      setEditError(
        "Something went wrong. Please try again."
      );
    }
  };

  // =========================
  // DELETE TRANSACTION
  // =========================

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              dispatch(
                deleteTransaction(id)
              );

              await dispatch(
                persistTransactions()
              );
            } catch (error) {
              console.log(
                "Delete transaction error:",
                error
              );
            }
          },
        },
      ]
    );
  };

  // =========================
  // SORT TRANSACTIONS
  // =========================

  const sortedTransactions =
    [...transactions].sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

  // =========================
  // CATEGORIES
  // =========================

  const categories = [
    "all",
    ...new Set(
      transactions
        .map(
          (transaction) =>
            transaction.category
        )
        .filter(Boolean)
    ),
  ];

  // =========================
  // FILTER TRANSACTIONS
  // =========================

  const filteredTransactions =
    sortedTransactions.filter(
      (transaction) => {
        const title =
          transaction.title || "";
 
        const matchesSearch =
          title
            .toLowerCase()
            .includes(
              searchText.toLowerCase()
            );

        const matchesType =
          selectedType === "all" ||
          transaction.type ===
            selectedType;

        const matchesCategory =
          selectedCategory === "all" ||
          transaction.category ===
            selectedCategory;

        return (
          matchesSearch &&
          matchesType &&
          matchesCategory
        );
      }
    );

  // =========================
  // TRANSACTION ITEM
  // =========================

  const renderTransaction = ({
    item,
  }) => {
    const isIncome =
      item.type === "income";

    return (
      <View
        style={
          styles.transactionCard
        }
      >
        {/* LEFT */}

        <View
          style={
            styles.transactionLeft
          }
        >
          <View
            style={[
              styles.iconContainer,
              isIncome
                ? styles.incomeIcon
                : styles.expenseIcon,
            ]}
          >
            <Text
              style={
                styles.iconText
              }
            >
              {isIncome ? "↗" : "↘"}
            </Text>
          </View>

          <View
            style={styles.details}
          >
            <Text
              style={
                styles.transactionTitle
              }
              numberOfLines={1}
            >
              {item.title}
            </Text>

            <View
              style={
                styles.metaRow
              }
            >
              <Text
                style={
                  styles.categoryText
                }
              >
                {item.category ||
                  "Other"}
              </Text>

              <Text
                style={styles.dot}
              >
                •
              </Text>

              <Text
                style={styles.typeText}
              >
                {isIncome
                  ? "Income"
                  : "Expense"}
              </Text>
            </View>

            <Text
              style={styles.date}
            >
              {new Date(
                item.date
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </Text>
          </View>
        </View>

        {/* RIGHT */}

        <View
          style={
            styles.transactionRight
          }
        >
          <Text
            style={[
              styles.amount,
              isIncome
                ? styles.incomeAmount
                : styles.expenseAmount,
            ]}
          >
            {isIncome ? "+" : "-"}₹
            {Number(
              item.amount
            ).toLocaleString("en-IN")}
          </Text>

          <View
            style={styles.actions}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={
                styles.editButton
              }
              onPress={() =>
                openEditModal(item)
              }
              disabled={loading}
            >
              <Text
                style={
                  styles.editText
                }
              >
                Edit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={
                styles.deleteButton
              }
              onPress={() =>
                handleDelete(item.id)
              }
              disabled={loading}
            >
              <Text
                style={
                  styles.deleteText
                }
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={styles.container}
    >
      {/* ===================== */}
      {/* HEADER */}
      {/* ===================== */}

      <View
        style={styles.header}
      >
        <View>
          <Text
            style={styles.title}
          >
            Transactions
          </Text>

          <Text
            style={styles.subtitle}
          >
            Manage all your money activity
          </Text>
        </View>

        <View
          style={
            styles.headerBadge
          }
        >
          <Text
            style={
              styles.headerBadgeText
            }
          >
            {transactions.length}
          </Text>
        </View>
      </View>

      {/* ===================== */}
      {/* SEARCH & FILTERS */}
      {/* ===================== */}

      <View
        style={
          styles.filtersContainer
        }
      >
        {/* SEARCH */}

        <View
          style={
            styles.searchContainer
          }
        >
          <Text
            style={
              styles.searchIcon
            }
          >
            🔍
          </Text>

          <TextInput
            value={searchText}
            onChangeText={
              setSearchText
            }
            placeholder="Search transactions..."
            placeholderTextColor={colors.textMuted}
            style={
              styles.searchInput
            }
          />

          {searchText.length >
            0 && (
            <TouchableOpacity
              onPress={() =>
                setSearchText("")
              }
            >
              <Text
                style={
                  styles.clearSearch
                }
              >
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* TYPE FILTER */}

        <View
          style={styles.filterRow}
        >
          {[
            {
              label: "All",
              value: "all",
            },
            {
              label: "Income",
              value: "income",
            },
            {
              label: "Expense",
              value: "expense",
            },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.value}
              activeOpacity={0.8}
              style={[
                styles.filterButton,
                selectedType ===
                  filter.value &&
                  styles.filterButtonActive,
              ]}
              onPress={() =>
                setSelectedType(
                  filter.value
                )
              }
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedType ===
                    filter.value &&
                    styles.filterButtonTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CATEGORY FILTER */}

        {categories.length > 1 && (
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) =>
              item
            }
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.categoryFilterList
            }
            renderItem={({
              item,
            }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.categoryFilter,
                  selectedCategory ===
                    item &&
                    styles.categoryFilterActive,
                ]}
                onPress={() =>
                  setSelectedCategory(
                    item
                  )
                }
              >
                <Text
                  style={[
                    styles.categoryFilterText,
                    selectedCategory ===
                      item &&
                      styles.categoryFilterTextActive,
                  ]}
                >
                  {item === "all"
                    ? "All Categories"
                    : item}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* RESET */}

        {(searchText ||
          selectedType !== "all" ||
          selectedCategory !==
            "all") && (
          <TouchableOpacity
            style={
              styles.resetButton
            }
            onPress={
              resetFilters
            }
          >
            <Text
              style={
                styles.resetButtonText
              }
            >
              Reset Filters
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ===================== */}
      {/* ERROR */}
      {/* ===================== */}

      {reduxError ? (
        <View
          style={
            styles.errorBox
          }
        >
          <Text
            style={
              styles.errorText
            }
          >
            ⚠️ {reduxError}
          </Text>
        </View>
      ) : null}

      {/* ===================== */}
      {/* TRANSACTIONS LIST */}
      {/* ===================== */}

      <FlatList
        data={
          filteredTransactions
        }
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={
          renderTransaction
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.list
        }
        ListHeaderComponent={
          transactions.length >
          0 ? (
            <View
              style={
                styles.listHeader
              }
            >
              <Text
                style={
                  styles.listHeaderTitle
                }
              >
                {searchText ||
                selectedType !== "all" ||
                selectedCategory !==
                  "all"
                  ? "Filtered Transactions"
                  : "All Transactions"}
              </Text>

              <Text
                style={
                  styles.listHeaderCount
                }
              >
                {
                  filteredTransactions.length
                }{" "}
                {filteredTransactions.length ===
                1
                  ? "transaction"
                  : "transactions"}
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyContainer
            }
          >
            <View
              style={
                styles.emptyIconContainer
              }
            >
              <Text
                style={
                  styles.emptyIcon
                }
              >
                {transactions.length ===
                0
                  ? "💳"
                  : "🔍"}
              </Text>
            </View>

            <Text
              style={
                styles.emptyTitle
              }
            >
              {transactions.length ===
              0
                ? "No transactions yet"
                : "No transactions found"}
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              {transactions.length ===
              0
                ? "Your income and expenses will appear here once you add them."
                : "Try changing your search or filters to find a transaction."}
            </Text>

            {transactions.length >
              0 && (
              <TouchableOpacity
                style={
                  styles.emptyResetButton
                }
                onPress={
                  resetFilters
                }
              >
                <Text
                  style={
                    styles.emptyResetText
                  }
                >
                  Clear Filters
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* ===================== */}
      {/* EDIT MODAL */}
      {/* ===================== */}

      <Modal
        visible={
          editModalVisible
        }
        transparent
        animationType="slide"
        onRequestClose={
          closeEditModal
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={
              styles.modalContainer
            }
          >
            {/* HEADER */}

            <View
              style={
                styles.modalHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.modalTitle
                  }
                >
                  Edit Transaction
                </Text>

                <Text
                  style={
                    styles.modalSubtitle
                  }
                >
                  Update your transaction details
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={
                  closeEditModal
                }
                disabled={loading}
                style={
                  styles.closeButton
                }
              >
                <Text
                  style={
                    styles.closeButtonText
                  }
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* TYPE INFO */}

            {editingTransaction && (
              <View
                style={[
                  styles.typeInfo,
                  editingTransaction.type ===
                    "income"
                    ? styles.typeInfoIncome
                    : styles.typeInfoExpense,
                ]}
              >
                <Text
                  style={
                    styles.typeInfoText
                  }
                >
                  {editingTransaction.type ===
                  "income"
                    ? "↗  Income"
                    : "↘  Expense"}
                </Text>

                <Text
                  style={
                    styles.typeInfoCategory
                  }
                >
                  {editingTransaction.category ||
                    "Other"}
                </Text>
              </View>
            )}

            {/* TITLE */}

            <Text
              style={styles.label}
            >
              Title
            </Text>

            <TextInput
              value={editTitle}
              onChangeText={
                setEditTitle
              }
              placeholder="Transaction title"
              placeholderTextColor={colors.textMuted}
              style={
                styles.input
              }
              editable={!loading}
            />

            {/* AMOUNT */}

            <Text
              style={styles.label}
            >
              Amount
            </Text>

            <View
              style={
                styles.amountInputContainer
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
                value={editAmount}
                onChangeText={
                  setEditAmount
                }
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                style={
                  styles.amountInput
                }
                editable={!loading}
              />
            </View>

            {/* ERROR */}

            {editError ? (
              <View
                style={
                  styles.editErrorBox
                }
              >
                <Text
                  style={
                    styles.editErrorText
                  }
                >
                  ⚠️ {editError}
                </Text>
              </View>
            ) : null}

            {/* ACTIONS */}

            <View
              style={
                styles.modalActions
              }
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={
                  styles.cancelButton
                }
                onPress={
                  closeEditModal
                }
                disabled={loading}
              >
                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.updateButton,
                  loading &&
                    styles.disabledButton,
                ]}
                onPress={
                  handleUpdate
                }
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <Text
                    style={
                      styles.updateButtonText
                    }
                  >
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  // =========================
  // SCREEN
  // =========================

  container: {
    flex: 1,
    backgroundColor: colors.screenBackground,
    paddingTop: 12,
  },

  // =========================
  // HEADER
  // =========================

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 18,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text,
  },

  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },

  headerBadge: {
    minWidth: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  headerBadgeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  // =========================
  // FILTERS
  // =========================

  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 13,
    height: 48,
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },

  clearSearch: {
    fontSize: 14,
    color: colors.textMuted,
    padding: 5,
  },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  filterButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 10,
  },

  filterButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  filterButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  filterButtonTextActive: {
    color: "#FFFFFF",
  },

  categoryFilterList: {
    gap: 7,
    paddingTop: 10,
  },

  categoryFilter: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  categoryFilterActive: {
    backgroundColor: colors.iconBox,
    borderColor: colors.textMuted,
  },

  categoryFilterText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  categoryFilterTextActive: {
    color: colors.text,
    fontWeight: "800",
  },

  resetButton: {
    alignSelf: "flex-end",
    marginTop: 8,
    paddingVertical: 4,
  },

  resetButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  // =========================
  // ERROR
  // =========================

  errorBox: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    padding: 11,
  },

  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "600",
  },

  // =========================
  // LIST
  // =========================

  list: {
    paddingHorizontal: 20,
    paddingBottom: 130,
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  listHeaderTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },

  listHeaderCount: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // =========================
  // TRANSACTION CARD
  // =========================

  transactionCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 1,
  },

  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  incomeIcon: {
    backgroundColor: colors.successBg,
  },

  expenseIcon: {
    backgroundColor: colors.dangerBg,
  },

  iconText: {
    fontSize: 21,
    fontWeight: "800",
    color: colors.text,
  },

  details: {
    flex: 1,
    minWidth: 0,
  },

  transactionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  categoryText: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  dot: {
    fontSize: 10,
    color: colors.textMuted,
    marginHorizontal: 5,
  },

  typeText: {
    fontSize: 10,
    color: colors.textMuted,
  },

  date: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 3,
  },

  transactionRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },

  amount: {
    fontSize: 14,
    fontWeight: "800",
  },

  incomeAmount: {
    color: colors.success,
  },

  expenseAmount: {
    color: colors.danger,
  },

  actions: {
    flexDirection: "row",
    gap: 5,
    marginTop: 7,
  },

  editButton: {
    backgroundColor: colors.iconBox,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
  },

  deleteButton: {
    backgroundColor: colors.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
  },

  editText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
  },

  deleteText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.danger,
  },

  // =========================
  // EMPTY
  // =========================

  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 30,
  },

  emptyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: colors.iconBox,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyIcon: {
    fontSize: 32,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },

  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6,
  },

  emptyResetButton: {
    marginTop: 15,
    backgroundColor: colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  emptyResetText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  // =========================
  // MODAL
  // =========================

  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 22,
    paddingBottom: 32,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: colors.text,
  },

  modalSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },

  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: colors.iconBox,
    alignItems: "center",
    justifyContent: "center",
  },

  closeButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
  },

  typeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 5,
  },

  typeInfoIncome: {
    backgroundColor: colors.successBg,
  },

  typeInfoExpense: {
    backgroundColor: colors.dangerBg,
  },

  typeInfoText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.text,
  },

  typeInfoCategory: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    backgroundColor: colors.iconBox,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },

  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.iconBox,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    paddingHorizontal: 14,
  },

  currency: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },

  amountInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },

  editErrorBox: {
    backgroundColor: colors.dangerBg,
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },

  editErrorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "600",
  },

  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: colors.iconBox,
    borderRadius: 13,
    paddingVertical: 14,
    alignItems: "center",
  },

  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "800",
  },

  updateButton: {
    flex: 1.5,
    backgroundColor: colors.accent,
    borderRadius: 13,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  disabledButton: {
    opacity: 0.6,
  },
});