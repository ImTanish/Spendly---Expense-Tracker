import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  loadExpenses,
  saveExpenses,
} from "../../utils/storage";

// ========================================
// LOAD TRANSACTIONS
// ========================================

export const loadTransactions =
  createAsyncThunk(
    "transactions/loadTransactions",
    async (_, thunkAPI) => {
      try {
        const storedTransactions =
          await loadExpenses();

        const transactions =
          (storedTransactions || []).map(
            (transaction) => ({
              ...transaction,

              type:
                transaction.type ||
                "expense",

              amount:
                Number(
                  transaction.amount
                ) || 0,

              date:
                transaction.date ||
                new Date().toISOString(),
            })
          );

        return transactions;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          "Failed to load transactions"
        );
      }
    }
  );

// ========================================
// SAVE TRANSACTIONS
// ========================================

export const persistTransactions =
  createAsyncThunk(
    "transactions/persistTransactions",
    async (_, thunkAPI) => {
      try {
        const state =
          thunkAPI.getState();

        const transactions =
          state.transactions
            .transactions;

        await saveExpenses(
          transactions
        );

        return true;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          "Failed to save transactions"
        );
      }
    }
  );

// ========================================
// INITIAL STATE
// ========================================

const initialState = {
  transactions: [],

  loading: false,

  error: null,
};

// ========================================
// SLICE
// ========================================

const transactionSlice =
  createSlice({
    name: "transactions",

    initialState,

    reducers: {
      // ==============================
      // ADD
      // ==============================

      addTransaction: (
        state,
        action
      ) => {
        state.transactions.push(
          action.payload
        );
      },

      // ==============================
      // UPDATE
      // ==============================

      updateTransaction: (
        state,
        action
      ) => {
        const updatedTransaction =
          action.payload;

        const index =
          state.transactions.findIndex(
            (transaction) =>
              transaction.id ===
              updatedTransaction.id
          );

        if (index !== -1) {
          state.transactions[
            index
          ] =
            updatedTransaction;
        }
      },

      // ==============================
      // DELETE
      // ==============================

      deleteTransaction: (
        state,
        action
      ) => {
        state.transactions =
          state.transactions.filter(
            (transaction) =>
              transaction.id !==
              action.payload
          );
      },

      // ==============================
      // SET
      // ==============================

      setTransactions: (
        state,
        action
      ) => {
        state.transactions =
          action.payload;
      },

      // ==============================
      // CLEAR
      // ==============================

      clearTransactions: (
        state
      ) => {
        state.transactions = [];
      },

      // ==============================
      // CLEAR ERROR
      // ==============================

      clearTransactionError: (
        state
      ) => {
        state.error = null;
      },
    },

    // =================================
    // ASYNC THUNKS
    // =================================

    extraReducers: (
      builder
    ) => {
      // ==============================
      // LOAD TRANSACTIONS
      // ==============================

      builder
        .addCase(
          loadTransactions.pending,
          (state) => {
            state.loading = true;

            state.error = null;
          }
        )

        .addCase(
          loadTransactions.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.transactions =
              action.payload;
          }
        )

        .addCase(
          loadTransactions.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to load transactions";
          }
        );

      // ==============================
      // SAVE TRANSACTIONS
      // ==============================

      builder
        .addCase(
          persistTransactions.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          persistTransactions.fulfilled,
          (state) => {
            state.loading = false;
          }
        )

        .addCase(
          persistTransactions.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to save transactions";
          }
        );
    },
  });

// ========================================
// ACTIONS
// ========================================

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setTransactions,
  clearTransactions,
  clearTransactionError,
} =
  transactionSlice.actions;

// ========================================
// SELECTORS
// ========================================

export const selectTransactions =
  (state) =>
    state.transactions
      .transactions;

export const selectTransactionLoading =
  (state) =>
    state.transactions.loading;

export const selectTransactionError =
  (state) =>
    state.transactions.error;

// ========================================
// REDUCER
// ========================================

export default
  transactionSlice.reducer;