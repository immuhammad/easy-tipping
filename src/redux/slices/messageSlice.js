import { createSlice } from "@reduxjs/toolkit";

export const messagesSlice = createSlice({
  name: "messagesSlice",
  initialState: {
    inbox: [],
  },
  reducers: {
    updateInbox: (state, action) => {
      return { ...state, inbox: action?.payload };
    },
  },
});

export const { updateInbox } = messagesSlice.actions;

export default messagesSlice.reducer;
