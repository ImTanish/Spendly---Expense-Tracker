import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import { useEffect, useState } from "react";

import { categories } from "../constants/categories";

export default function EditExpenseModal({
  visible,
  expense,
  onClose,
  onUpdate,
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] =
    useState("");
  const [type, setType] =
    useState("expense");
  const [error, setError] = useState("");

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(
        expense.amount.toString()
      );
      setCategory(expense.category);
      setType(
        expense.type || "expense"
      );
      setError("");
    }
  }, [expense]);

  const handleUpdate = () => {
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!amount.trim()) {
      setError("Please enter an amount.");
      return;
    }

    const numericAmount = Number(amount);

    if (
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(
        "Please enter a valid amount."
      );
      return;
    }

    if (!category) {
      setError(
        "Please select a category."
      );
      return;
    }

    onUpdate({
      ...expense,
      title: title.trim(),
      amount: numericAmount,
      category,
      type,
    });

    setError("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.heading}>
              Edit Transaction
            </Text>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
          >
            <Text style={styles.label}>
              Type
            </Text>

            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "expense" &&
                    styles.selectedType,
                ]}
                onPress={() =>
                  setType("expense")
                }
              >
                <Text
                  style={[
                    styles.typeText,
                    type === "expense" &&
                      styles.selectedTypeText,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === "income" &&
                    styles.selectedType,
                ]}
                onPress={() =>
                  setType("income")
                }
              >
                <Text
                  style={[
                    styles.typeText,
                    type === "income" &&
                      styles.selectedTypeText,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>
              Title
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter title"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>
              Amount
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.label}>
              Category
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              style={styles.categoryList}
            >
              {categories.map((item) => {
                const selected =
                  category === item.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.categoryButton,
                      selected &&
                        styles.selectedCategory,
                    ]}
                    onPress={() =>
                      setCategory(
                        item.id
                      )
                    }
                  >
                    <Text
                      style={
                        styles.categoryEmoji
                      }
                    >
                      {item.emoji}
                    </Text>

                    <Text
                      style={[
                        styles.categoryText,
                        selected &&
                          styles.selectedCategoryText,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {error ? (
              <Text style={styles.error}>
                {error}
              </Text>
            ) : null}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdate}
              >
                <Text style={styles.updateText}>
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "#F5F6FA",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: "90%",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8E8EC",
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    fontSize: 16,
    color: "#555",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
  },

  typeContainer: {
    flexDirection: "row",
    backgroundColor: "#E8E8EC",
    borderRadius: 12,
    padding: 4,
    marginBottom: 8,
  },

  typeButton: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 9,
  },

  selectedType: {
    backgroundColor: "#111",
  },

  typeText: {
    color: "#555",
    fontWeight: "600",
  },

  selectedTypeText: {
    color: "#fff",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 8,
  },

  categoryList: {
    marginBottom: 8,
  },

  categoryButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
  },

  selectedCategory: {
    backgroundColor: "#111",
  },

  categoryEmoji: {
    fontSize: 20,
  },

  categoryText: {
    fontSize: 12,
    marginTop: 4,
    color: "#444",
  },

  selectedCategoryText: {
    color: "#fff",
  },

  error: {
    color: "#D32F2F",
    marginTop: 8,
    marginBottom: 4,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    marginBottom: 10,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#E8E8EC",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  cancelText: {
    fontWeight: "600",
  },

  updateButton: {
    flex: 1,
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  updateText: {
    color: "#fff",
    fontWeight: "bold",
  },
});