import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "spendly_auth_token";
const USER_KEY = "spendly_auth_user";

export const saveAuth = async (token, user) => {
  try {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token || ""],
      [USER_KEY, JSON.stringify(user || null)],
    ]);
  } catch (error) {
    console.log("Error saving auth:", error);
  }
};

export const loadAuth = async () => {
  try {
    const values = await AsyncStorage.multiGet([
      TOKEN_KEY,
      USER_KEY,
    ]);

    const token = values[0][1] || null;
    const userRaw = values[1][1];

    const user = userRaw ? JSON.parse(userRaw) : null;

    return { token, user };
  } catch (error) {
    console.log("Error loading auth:", error);
    return { token: null, user: null };
  }
};

export const clearAuth = async () => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.log("Error clearing auth:", error);
  }
};
