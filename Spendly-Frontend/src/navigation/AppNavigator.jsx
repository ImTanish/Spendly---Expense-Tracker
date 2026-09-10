import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import { useDispatch, useSelector } from "react-redux";

import HomeScreen from "../screens/HomeScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import SettingsScreen from "../screens/SettingsScreen";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../theme/ThemeContext";
import {
  logoutUser,
  selectAuthUser,
} from "../redux/slices/authSlice";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.74;

// ========================================
// BOTTOM TAB NAVIGATION
// ========================================

function MainTabs() {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarShowLabel: true,

        tabBarStyle: [
          styles.floatingTabBar,
          {
            backgroundColor: colors.tabBarBackground,
            shadowOpacity: isDark ? 0.4 : 0.12,
            borderColor: colors.border,
          },
        ],

        tabBarItemStyle: {
          borderRadius: 16,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      {/* HOME */}
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* ADD */}
      <Tab.Screen
        name="Add"
        component={AddExpenseScreen}
        options={{
          tabBarLabel: "Add",
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={[
                styles.addTabIcon,
                { backgroundColor: colors.accent },
              ]}
            >
              <Ionicons
                name={focused ? "add" : "add"}
                size={22}
                color="#FFFFFF"
              />
            </View>
          ),
        }}
      />

      {/* TRANSACTIONS */}
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ========================================
// CUSTOM DRAWER
// ========================================

function CustomDrawerContent(props) {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

  const activeRoute =
    props.state.routes[props.state.index]?.name;

  const menuItems = [
    {
      key: "MainTabs",
      label: "Home",
      icon: "home-outline",
      activeIcon: "home",
    },
    {
      key: "Settings",
      label: "Settings",
      icon: "settings-outline",
      activeIcon: "settings",
    },
  ];

  return (
    <View
      style={[
        styles.drawerRoot,
        { backgroundColor: colors.drawerBackground },
      ]}
    >
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScroll}
      >
        {/* PROFILE HEADER */}
        <View style={styles.drawerHeader}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.accent },
            ]}
          >
            <Text style={styles.avatarText}>
              {(user?.name || "S").charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text
            style={[styles.drawerName, { color: colors.text }]}
            numberOfLines={1}
          >
            {user?.name || "Spendly"}
          </Text>

          <Text
            style={[
              styles.drawerEmail,
              { color: colors.textSecondary },
            ]}
            numberOfLines={1}
          >
            {user?.email || "Track your money smarter"}
          </Text>
        </View>

        <View
          style={[
            styles.drawerDivider,
            { backgroundColor: colors.divider },
          ]}
        />

        {/* MENU */}
        {menuItems.map((item) => {
          const focused = activeRoute === item.key;

          return (
            <DrawerItem
              key={item.key}
              label={item.label}
              focused={focused}
              activeBackgroundColor={colors.drawerActiveBg}
              inactiveBackgroundColor="transparent"
              activeTintColor={colors.drawerActiveText}
              inactiveTintColor={colors.drawerInactiveText}
              labelStyle={styles.drawerItemLabel}
              style={styles.drawerItem}
              icon={({ color, size }) => (
                <Ionicons
                  name={
                    focused ? item.activeIcon : item.icon
                  }
                  size={size}
                  color={color}
                />
              )}
              onPress={() => {
                props.navigation.navigate(item.key);
              }}
            />
          );
        })}

        <View style={{ flex: 1 }} />

        {/* LOGOUT */}
        <View
          style={[
            styles.drawerDivider,
            { backgroundColor: colors.divider, marginBottom: 8 },
          ]}
        />

        <TouchableOpacity
          style={styles.logoutRow}
          activeOpacity={0.7}
          onPress={() => dispatch(logoutUser())}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.danger}
          />
          <Text
            style={[styles.logoutText, { color: colors.danger }]}
          >
            Log Out
          </Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
}

// ========================================
// DRAWER NAVIGATION
// ========================================

function DrawerNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        drawerType: "front",

        drawerStyle: {
          width: DRAWER_WIDTH,
          backgroundColor: colors.drawerBackground,
        },

        overlayColor: colors.overlay,

        headerShown: true,
        headerTitle: "Spendly",

        headerStyle: {
          backgroundColor: colors.headerBackground,
          shadowOpacity: 0,
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },

        headerTintColor: colors.headerText,

        headerTitleStyle: {
          fontSize: 19,
          fontWeight: "800",
          color: colors.headerText,
        },
      }}
    >
      {/* MAIN APP */}
      <Drawer.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          title: "Spendly",
          drawerItemStyle: { display: "none" },
        }}
      />

      {/* SETTINGS */}
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer.Navigator>
  );
}

// ========================================
// MAIN NAVIGATION
// ========================================

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // ---------- TAB BAR ----------
  floatingTabBar: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 22,
    height: 70,
    borderRadius: 26,
    borderWidth: 1,
    paddingTop: 8,

    shadowColor: "#000",
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  addTabIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -2,
  },

  // ---------- DRAWER ----------
  drawerRoot: {
    flex: 1,
  },

  drawerScroll: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 8,
  },

  drawerHeader: {
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },

  drawerName: {
    fontSize: 17,
    fontWeight: "800",
  },

  drawerEmail: {
    fontSize: 12,
    marginTop: 2,
  },

  drawerDivider: {
    height: 1,
    marginVertical: 16,
  },

  drawerItem: {
    borderRadius: 14,
    marginBottom: 4,
  },

  drawerItemLabel: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: -4,
  },

  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 12,
  },
});
