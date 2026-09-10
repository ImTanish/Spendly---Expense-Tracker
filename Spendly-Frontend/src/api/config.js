// ========================================
// API CONFIG
// ========================================
//
// Point this at your running Spendly-Backend server.
//
// - iOS simulator: "http://localhost:5000" works fine.
// - Android emulator: use "http://10.0.2.2:5000" instead of localhost.
// - Physical phone (Expo Go): use your computer's LAN IP,
//   e.g. "http://192.168.1.42:5000" (same Wi-Fi network as your phone).
// - Production: your deployed backend URL, e.g. "https://api.yourapp.com".

export const API_BASE_URL = "http://192.168.1.7:5000";

export const API_ROUTES = {
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  me: `${API_BASE_URL}/api/auth/me`,
};