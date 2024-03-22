import { createSlice } from "@reduxjs/toolkit";

const netInfoSlice = createSlice({
  name: "netInfo",
  initialState: {
    connected: false,
    currency: {
      name: "United States Dollar",
      code: "USD",
      symbol: "$",
      country: "US",
    },
  },
  reducers: {
    updateNetConnection: (state, action) => {
      state.connected = action?.payload;
    },
    updateCurrency: (state, action) => {
      state.currency = action?.payload;
    },
  },
});

export const { updateNetConnection, updateCurrency } = netInfoSlice.actions;
export default netInfoSlice.reducer;
