import {
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function SummaryCard({
  totalIncome,
  totalExpense,
  balance,
}) {
  return (
    <View style={styles.container}>
      {/* BALANCE */}

      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>
          Total Balance
        </Text>

        <Text style={styles.balance}>
          ₹
          {Number(balance).toLocaleString(
            "en-IN"
          )}
        </Text>

        <Text style={styles.balanceSubtext}>
          Available balance
        </Text>
      </View>

      {/* INCOME / EXPENSE */}

      <View style={styles.row}>
        <View style={styles.stat}>
          <View style={styles.iconCircle}>
            <Text style={styles.incomeIcon}>
              ↗
            </Text>
          </View>

          <View>
            <Text style={styles.statLabel}>
              Income
            </Text>

            <Text style={styles.incomeAmount}>
              ₹
              {Number(
                totalIncome
              ).toLocaleString(
                "en-IN"
              )}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <View style={styles.iconCircle}>
            <Text style={styles.expenseIcon}>
              ↘
            </Text>
          </View>

          <View>
            <Text style={styles.statLabel}>
              Expenses
            </Text>

            <Text style={styles.expenseAmount}>
              ₹
              {Number(
                totalExpense
              ).toLocaleString(
                "en-IN"
              )}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },

  balanceSection: {
    marginBottom: 22,
  },

  balanceLabel: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "600",
  },

  balance: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 6,
  },

  balanceSubtext: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  stat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  divider: {
    width: 1,
    height: 38,
    backgroundColor: "#374151",
    marginHorizontal: 12,
  },

  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  incomeIcon: {
    color: "#4ADE80",
    fontSize: 18,
    fontWeight: "800",
  },

  expenseIcon: {
    color: "#F87171",
    fontSize: 18,
    fontWeight: "800",
  },

  statLabel: {
    color: "#9CA3AF",
    fontSize: 11,
  },

  incomeAmount: {
    color: "#4ADE80",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 2,
  },

  expenseAmount: {
    color: "#F87171",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 2,
  },
});