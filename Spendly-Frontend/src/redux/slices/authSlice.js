import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { API_ROUTES } from "../../api/config";
import {
  saveAuth,
  loadAuth,
  clearAuth,
} from "../../utils/authStorage";
import { clearTransactions } from "./transactionSlice";

// ========================================
// HELPERS
// ========================================

const postJSON = async (url, body) => {
  let response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (networkError) {
    throw new Error(
      "Couldn't reach the server. Check your connection and the API URL in src/api/config.js."
    );
  }

  let data = {};

  try {
    data = await response.json();
  } catch (parseError) {
    // no JSON body, ignore
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

// ========================================
// THUNKS
// ========================================

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const data = await postJSON(API_ROUTES.register, {
        name,
        email,
        password,
      });

      await saveAuth(data.token, data.user);

      return { token: data.token, user: data.user };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await postJSON(API_ROUTES.login, {
        email,
        password,
      });

      await saveAuth(data.token, data.user);

      return { token: data.token, user: data.user };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Restore session on app launch from AsyncStorage
export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async () => {
    const { token, user } = await loadAuth();
    return { token, user };
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    await clearAuth();
    thunkAPI.dispatch(clearTransactions());
    return true;
  }
);
// ========================================
// SLICE
// ========================================

const initialState = {
  token: null,
  user: null,

  isAuthenticated: false,
  isRestoring: true, // true until we've checked AsyncStorage once

  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ---------- REGISTER ----------
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });

    // ---------- LOGIN ----------
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });

    // ---------- RESTORE ----------
    builder.addCase(restoreSession.fulfilled, (state, action) => {
      state.isRestoring = false;

      if (action.payload.token) {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      }
    });

    // ---------- LOGOUT ----------
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearAuthError } = authSlice.actions;

// ========================================
// SELECTORS
// ========================================

export const selectAuthUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) =>
  state.auth.isAuthenticated;
export const selectIsRestoring = (state) => state.auth.isRestoring;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
