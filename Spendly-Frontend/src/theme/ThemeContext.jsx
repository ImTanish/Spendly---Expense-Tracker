import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_STORAGE_KEY = "spendly_theme_mode";

// ========================================
// COLOR PALETTES
// ========================================

const lightColors = {
  mode: "light",

  background: "#F5F6FA",
  screenBackground: "#F5F6FA",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  elevatedCard: "#FFFFFF",

  primary: "#111827",
  accent: "#6C5CE7",

  text: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",

  border: "#EEEEEE",
  divider: "#EEEEEE",

  icon: "#111111",
  iconBox: "#F1F1F1",

  success: "#16A34A",
  successBg: "#DCFCE7",
  danger: "#DC2626",
  dangerBg: "#FEE2E2",

  tabBarActive: "#111111",
  tabBarInactive: "#9CA3AF",
  tabBarBackground: "#FFFFFF",

  headerBackground: "#FFFFFF",
  headerText: "#111827",

  drawerBackground: "#FFFFFF",
  drawerActiveBg: "#111827",
  drawerActiveText: "#FFFFFF",
  drawerInactiveText: "#4B5563",

  statusBarStyle: "dark-content",
  overlay: "rgba(0,0,0,0.35)",
};

const darkColors = {
  mode: "dark",

  background: "#0D0D0F",
  screenBackground: "#0D0D0F",
  surface: "#1A1A1D",
  card: "#1A1A1D",
  elevatedCard: "#222226",

  primary: "#FFFFFF",
  accent: "#8B7CF6",

  text: "#F5F5F7",
  textSecondary: "#9A9AA2",
  textMuted: "#6E6E76",

  border: "#2A2A2E",
  divider: "#2A2A2E",

  icon: "#FFFFFF",
  iconBox: "#26262B",

  success: "#4ADE80",
  successBg: "#14321F",
  danger: "#F87171",
  dangerBg: "#3A1A1A",

  tabBarActive: "#FFFFFF",
  tabBarInactive: "#6E6E76",
  tabBarBackground: "#1A1A1D",

  headerBackground: "#141416",
  headerText: "#F5F5F7",

  drawerBackground: "#141416",
  drawerActiveBg: "#FFFFFF",
  drawerActiveText: "#111111",
  drawerInactiveText: "#B4B4BA",

  statusBarStyle: "light-content",
  overlay: "rgba(0,0,0,0.6)",
};

// ========================================
// CONTEXT
// ========================================

const ThemeContext = createContext({
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
  setDarkMode: () => {},
  isLoaded: false,
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted preference once on app start
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(
          THEME_STORAGE_KEY
        );

        if (stored === "dark") {
          setIsDark(true);
        } else if (stored === "light") {
          setIsDark(false);
        }
      } catch (error) {
        console.log("Error loading theme:", error);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const persist = async (value) => {
    try {
      await AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        value ? "dark" : "light"
      );
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      persist(next);
      return next;
    });
  };

  const setDarkMode = (value) => {
    setIsDark(value);
    persist(value);
  };

  const colors = useMemo(
    () => (isDark ? darkColors : lightColors),
    [isDark]
  );

  const value = useMemo(
    () => ({
      isDark,
      colors,
      toggleTheme,
      setDarkMode,
      isLoaded,
    }),
    [isDark, colors, isLoaded]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
