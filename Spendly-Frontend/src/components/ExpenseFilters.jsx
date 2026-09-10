import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

export default function ExpenseFilters({
  searchText,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}) {
  const categories = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Food",
      value: "Food",
    },
    {
      label: "Travel",
      value: "Travel",
    },
    {
      label: "Shopping",
      value: "Shopping",
    },
    {
      label: "Bills",
      value: "Bills",
    },
    {
      label: "Entertainment",
      value: "Entertainment",
    },
    {
      label: "Other",
      value: "Other",
    },
  ];

  return (
    <View style={styles.container}>

      {/* ========================= */}
      {/* SEARCH BAR */}
      {/* ========================= */}

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#9CA3AF"
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={onSearchChange}
          returnKeyType="search"
        />

        {searchText.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              onSearchChange("")
            }
          >
            <Ionicons
              name="close-circle"
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* ========================= */}
      {/* FILTER HEADER */}
      {/* ========================= */}

      <View style={styles.filterHeader}>
        <View style={styles.filterTitleContainer}>
          <Ionicons
            name="filter-outline"
            size={17}
            color="#111827"
          />

          <Text style={styles.filterTitle}>
            Categories
          </Text>
        </View>

        {selectedCategory !== "all" && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              onCategoryChange("all")
            }
          >
            <Text style={styles.clearText}>
              Clear
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ========================= */}
      {/* CATEGORY BUTTONS */}
      {/* ========================= */}

      <View style={styles.categories}>
        {categories.map((category) => {
          const isSelected =
            selectedCategory ===
            category.value;

          return (
            <TouchableOpacity
              key={category.value}
              activeOpacity={0.75}
              style={[
                styles.categoryButton,
                isSelected &&
                  styles.categoryButtonActive,
              ]}
              onPress={() =>
                onCategoryChange(
                  category.value
                )
              }
            >
              <Text
                style={[
                  styles.categoryText,
                  isSelected &&
                    styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },

  // =========================
  // SEARCH
  // =========================

  searchContainer: {
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  searchInput: {
    flex: 1,

    fontSize: 13,
    color: "#111827",

    marginLeft: 9,

    paddingVertical: 0,
  },

  // =========================
  // FILTER HEADER
  // =========================

  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 17,
    marginBottom: 10,
  },

  filterTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  filterTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },

  clearText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },

  // =========================
  // CATEGORIES
  // =========================

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  categoryButton: {
    paddingHorizontal: 13,
    paddingVertical: 8,

    borderRadius: 20,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  categoryButtonActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },
});