import { createSlice } from "@reduxjs/toolkit";
export const transactionSlice = createSlice({
  name: "transactionSlice",
  initialState: {
    transactions: [],
    isLoading: false,
    isFilterApplied: false,
    filterFrom: new Date() + "",
    filterTo: new Date() + "",
    totalBalance: 0,
    todaysBalance: 0,
    remainingBalance: 0,
  },
  reducers: {
    updateTransactions: (state, action) => {
      return { ...state, transactions: action?.payload };
    },
    updateTransaction: (state, action) => {
      const { response } = action.payload;
      const { transactionId, type } = response;

      const updatedArray = state.transactions.map((transaction) => {
        if (transaction.id === transactionId) {
          if (type === "feedback") {
            return { ...transaction, feedback: response };
          } else {
            return { ...transaction, acknowledgment: response };
          }
        }
        return transaction;
      });
      return { ...state, transactions: updatedArray };
    },
    setLoading: (state, action) => {
      return { ...state, isLoading: action.payload };
    },
    updateFilterFrom: (state, action) => {
      return { ...state, filterFrom: action.payload };
    },
    updateFilterTo: (state, action) => {
      return { ...state, filterTo: action.payload };
    },
    setIsFilterApplied: (state, action) => {
      return { ...state, isFilterApplied: action.payload };
    },
    setBalanceDetails: (state, action) => {
      return {
        ...state,
        totalBalance: action.payload.totalBalance,
        todaysBalance: action.payload.todaysBalance,
        remainingBalance: action.payload.remainingBalance,
      };
    },
    resetTransactionSlice: (state, action) => {
      return {
        ...state,
        transactions: [],
        isLoading: false,
        isFilterApplied: false,
        filterFrom: new Date() + "",
        filterTo: new Date() + "",
        totalBalance: 0,
        todaysBalance: 0,
        remainingBalance: 0,
      };
    },
  },
});

export const {
  updateTransactions,
  setLoading,
  updateFilterFrom,
  updateFilterTo,
  setIsFilterApplied,
  setBalanceDetails,
  resetTransactionSlice,
  updateTransaction,
} = transactionSlice.actions;

export default transactionSlice.reducer;
