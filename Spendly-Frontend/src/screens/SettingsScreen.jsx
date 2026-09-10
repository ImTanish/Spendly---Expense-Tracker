import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "../theme/ThemeContext";
import {
  logoutUser,
  selectAuthUser,
} from "../redux/slices/authSlice";

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

  const [notifications, setNotifications] = useState(true);

  const handleCurrency = () => {
    Alert.alert(
      "Currency",
      "Spendly currently uses Indian Rupee (₹)."
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About Spendly",
      "Spendly is an expense tracking application built with React Native and Redux Toolkit."
    );
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => dispatch(logoutUser()),
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <Text style={[styles.title, { color: colors.text }]}>
          Settings
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.textSecondary },
          ]}
        >
          Manage your Spendly preferences
        </Text>

        {/* Account */}
        {user && (
          <>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.textSecondary },
              ]}
            >
              Account
            </Text>

            <View
              style={[styles.card, { backgroundColor: colors.card }]}
            >
              <View style={styles.row}>
                <View style={styles.left}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: colors.iconBox },
                    ]}
                  >
                    <Ionicons
                      name="person-outline"
                      size={21}
                      color={colors.icon}
                    />
                  </View>

                  <View>
                    <Text
                      style={[
                        styles.rowTitle,
                        { color: colors.text },
                      ]}
                    >
                      {user.name}
                    </Text>

                    <Text
                      style={[
                        styles.rowSubtitle,
                        { color: colors.textMuted },
                      ]}
                    >
                      {user.email}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Appearance */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textSecondary },
          ]}
        >
          Appearance
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.row}>
            <View style={styles.left}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.iconBox },
                ]}
              >
                <Ionicons
                  name={isDark ? "moon" : "sunny-outline"}
                  size={21}
                  color={colors.icon}
                />
              </View>

              <View>
                <Text
                  style={[styles.rowTitle, { color: colors.text }]}
                >
                  Dark Mode
                </Text>

                <Text
                  style={[
                    styles.rowSubtitle,
                    { color: colors.textMuted },
                  ]}
                >
                  {isDark
                    ? "Dark appearance"
                    : "Light appearance"}
                </Text>
              </View>
            </View>

            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: "#D5D5D5",
                true: colors.accent,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Preferences */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textSecondary },
          ]}
        >
          Preferences
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* Currency */}
          <TouchableOpacity
            style={styles.row}
            onPress={handleCurrency}
            activeOpacity={0.7}
          >
            <View style={styles.left}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.iconBox },
                ]}
              >
                <Ionicons
                  name="cash-outline"
                  size={21}
                  color={colors.icon}
                />
              </View>

              <View>
                <Text
                  style={[styles.rowTitle, { color: colors.text }]}
                >
                  Currency
                </Text>

                <Text
                  style={[
                    styles.rowSubtitle,
                    { color: colors.textMuted },
                  ]}
                >
                  Indian Rupee (₹)
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>

          <View
            style={[styles.divider, { backgroundColor: colors.divider }]}
          />

          {/* Notifications */}
          <View style={styles.row}>
            <View style={styles.left}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.iconBox },
                ]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={21}
                  color={colors.icon}
                />
              </View>

              <View>
                <Text
                  style={[styles.rowTitle, { color: colors.text }]}
                >
                  Notifications
                </Text>

                <Text
                  style={[
                    styles.rowSubtitle,
                    { color: colors.textMuted },
                  ]}
                >
                  Expense reminders
                </Text>
              </View>
            </View>

            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: "#D5D5D5",
                true: colors.accent,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* App */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textSecondary },
          ]}
        >
          App
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* About */}
          <TouchableOpacity
            style={styles.row}
            onPress={handleAbout}
            activeOpacity={0.7}
          >
            <View style={styles.left}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.iconBox },
                ]}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={21}
                  color={colors.icon}
                />
              </View>

              <View>
                <Text
                  style={[styles.rowTitle, { color: colors.text }]}
                >
                  About Spendly
                </Text>

                <Text
                  style={[
                    styles.rowSubtitle,
                    { color: colors.textMuted },
                  ]}
                >
                  About this application
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>

          <View
            style={[styles.divider, { backgroundColor: colors.divider }]}
          />

          {/* Version */}
          <View style={styles.row}>
            <View style={styles.left}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.iconBox },
                ]}
              >
                <Ionicons
                  name="phone-portrait-outline"
                  size={21}
                  color={colors.icon}
                />
              </View>

              <View>
                <Text
                  style={[styles.rowTitle, { color: colors.text }]}
                >
                  Version
                </Text>

                <Text
                  style={[
                    styles.rowSubtitle,
                    { color: colors.textMuted },
                  ]}
                >
                  1.0.0
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[
            styles.logoutCard,
            {
              backgroundColor: colors.dangerBg,
            },
          ]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons
            name="log-out-outline"
            size={19}
            color={colors.danger}
          />
          <Text
            style={[styles.logoutText, { color: colors.danger }]}
          >
            Log Out
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text
          style={[styles.footer, { color: colors.textMuted }]}
        >
          Spendly • Expense Tracker
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 10,
  },

  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  row: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  rowSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  divider: {
    height: 1,
  },

  logoutCard: {
    borderRadius: 16,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },

  footer: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 5,
  },
});
