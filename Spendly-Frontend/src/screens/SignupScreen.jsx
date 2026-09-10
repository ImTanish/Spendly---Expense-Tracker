import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import {
  registerUser,
  clearAuthError,
  selectAuthLoading,
  selectAuthError,
} from "../redux/slices/authSlice";

import { useTheme } from "../theme/ThemeContext";

export default function SignupScreen({
  onSwitchToLogin,
}) {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const loading = useSelector(selectAuthLoading);
  const serverError = useSelector(selectAuthError);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = () => {
    setFormError("");
    dispatch(clearAuthError());

    if (!name.trim()) {
      setFormError("Please enter your name.");
      return;
    }

    if (!email.trim() || !password) {
      setFormError("Please enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    dispatch(
      registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      })
    );
  };

  const errorMessage = formError || serverError;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand mark */}
        <View
          style={[
            styles.logoCircle,
            { backgroundColor: colors.accent },
          ]}
        >
          <Ionicons name="wallet" size={30} color="#FFFFFF" />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Create account
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.textSecondary },
          ]}
        >
          Sign up to start tracking your money
        </Text>

        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="person-outline"
            size={19}
            color={colors.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Full name"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={19}
            color={colors.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="lock-closed-outline"
            size={19}
            color={colors.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {!!errorMessage && (
          <View
            style={[
              styles.errorBox,
              { backgroundColor: colors.dangerBg },
            ]}
          >
            <Text style={[styles.errorText, { color: colors.danger }]}>
              {errorMessage}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: colors.accent },
            loading && { opacity: 0.7 },
          ]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitText}>Create account</Text>
          )}
        </TouchableOpacity>

        <Text
          style={[
            styles.footerText,
            { color: colors.textSecondary },
          ]}
        >
          Already have an account?{" "}
          <Text
            style={{ color: colors.accent, fontWeight: "700" }}
            onPress={() => {
              setFormError("");
              dispatch(clearAuthError());
              onSwitchToLogin();
            }}
          >
            Login
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingVertical: 40,
  },

  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 28,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 14,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
  },

  errorBox: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },

  errorText: {
    fontSize: 13,
    fontWeight: "600",
  },

  submitButton: {
    height: 55,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  footerText: {
    textAlign: "center",
    fontSize: 13,
    marginTop: 22,
  },
});