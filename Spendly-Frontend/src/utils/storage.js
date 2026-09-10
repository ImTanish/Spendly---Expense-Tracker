import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadAuth } from "./authStorage";

const BASE_KEY = "spendly_expenses";

// Transactions are scoped per logged-in user, so switching accounts
// on the same device never mixes one user's data with another's.
const getStorageKey = async () => {
  const { user } = await loadAuth();
  const scope = user?.id || user?.email || "guest";
  return `${BASE_KEY}:${scope}`;
};

export const loadExpenses = async () => {
  try {
    const key = await getStorageKey();
    const storedExpenses = await AsyncStorage.getItem(key);

    if (storedExpenses) {
      return JSON.parse(storedExpenses);
    }

    return [];
  } catch (error) {
    console.log("Error loading expenses:", error);
    return [];
  }
};

export const saveExpenses = async (expenses) => {
  try {
    const key = await getStorageKey();

    await AsyncStorage.setItem(
      key,
      JSON.stringify(expenses)
    );
  } catch (error) {
    console.log("Error saving expenses:", error);
  }
};