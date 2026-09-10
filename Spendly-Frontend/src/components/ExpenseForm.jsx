import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import {
  expenseCategories,
  incomeCategories,
} from "../constants/categories";

export default function ExpenseForm({
  title,
  amount,
  category,
  type,
  onTitleChange,
  onAmountChange,
  onCategoryChange,
  onTypeChange,
  onSubmit,
  isEditing,
  formError,
}) {
  const currentCategories =
    type === "income"
      ? incomeCategories
      : expenseCategories;

  return (
    <View>
      {/* TRANSACTION TYPE */}

      <Text style={styles.label}>
        Transaction Type
      </Text>

      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            type === "expense" &&
              styles.selectedType,
          ]}
          onPress={() => {
            onTypeChange("expense");
            onCategoryChange("");
          }}
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
          onPress={() => {
            onTypeChange("income");
            onCategoryChange("");
          }}
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

      {/* TITLE */}

      <Text style={styles.label}>
        {type === "income"
          ? "Income Title"
          : "Expense Title"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={
          type === "income"
            ? "e.g. Monthly Salary"
            : "e.g. Groceries"
        }
        value={title}
        onChangeText={onTitleChange}
      />

      {/* AMOUNT */}

      <Text style={styles.label}>
        Amount
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={onAmountChange}
      />

      {/* CATEGORY */}

      <Text style={styles.label}>
        {type === "income"
          ? "Income Source"
          : "Expense Category"}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
        style={styles.categoryList}
      >
        {currentCategories.map(
          (item) => {
            const isSelected =
              category === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.categoryButton,
                  isSelected &&
                    styles.selectedCategory,
                ]}
                onPress={() =>
                  onCategoryChange(
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
                    isSelected &&
                      styles.selectedCategoryText,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </ScrollView>

      {/* ERROR */}

      {formError ? (
        <Text style={styles.errorText}>
          {formError}
        </Text>
      ) : null}

      {/* SUBMIT */}

      <TouchableOpacity
        style={[
          styles.button,
          type === "income" &&
            styles.incomeButton,
        ]}
        onPress={onSubmit}
      >
        <Text style={styles.buttonText}>
          {isEditing
            ? "Update Transaction"
            : type === "income"
            ? "Add Income"
            : "Add Expense"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },

  typeContainer: {
    flexDirection: "row",
    backgroundColor: "#E8E8EC",
    borderRadius: 14,
    padding: 4,
    marginBottom: 10,
  },

  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 11,
  },

  selectedType: {
    backgroundColor: "#111",
  },

  typeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },

  selectedTypeText: {
    color: "#fff",
  },

  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    fontSize: 16,
  },

  categoryList: {
    marginBottom: 10,
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

  errorText: {
    color: "#D32F2F",
    fontSize: 13,
    marginTop: 5,
    marginBottom: 5,
  },

  button: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  incomeButton: {
    backgroundColor: "#159957",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});