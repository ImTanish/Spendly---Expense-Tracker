import React, { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from "react-redux";

import { store } from "./src/redux/store";
import {
  restoreSession,
  selectIsAuthenticated,
  selectIsRestoring,
} from "./src/redux/slices/authSlice";

import {
  ThemeProvider,
  useTheme,
} from "./src/theme/ThemeContext";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import AppNavigator from "./src/navigation/AppNavigator";

function AppRoot() {
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isRestoring = useSelector(selectIsRestoring);

  // "login" or "signup" — which auth screen to show when logged out
  const [authMode, setAuthMode] = useState("login");

  // Check AsyncStorage once on launch to see if the user is already logged in
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (isRestoring) {
    return (
      <View
        style={[
          styles.loadingScreen,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const renderAuthScreen = () => {
    if (authMode === "signup") {
      return (
        <SignupScreen
          onSwitchToLogin={() => setAuthMode("login")}
        />
      );
    }

    return (
      <LoginScreen
        onSwitchToSignup={() => setAuthMode("signup")}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={colors.statusBarStyle} />
      {isAuthenticated ? <AppNavigator /> : renderAuthScreen()}
    </View>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider>
          <AppRoot />
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;