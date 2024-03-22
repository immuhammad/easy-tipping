import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    token: "",
    user: null,
    isTooltipViewed: true,
  },
  reducers: {
    saveToken: (state, action) => {
      return { ...state, token: action?.payload };
    },
    saveUser: (state, action) => {
      return { ...state, user: action?.payload };
    },
    toolTip: (state, action) => {
      return { ...state, isTooltipViewed: action?.payload };
    },
    removeUser: (state, action) => {
      return {
        token: "",
        user: null,
      };
    },
  },
});

export const { saveToken, saveUser, removeUser, toolTip } = userSlice.actions;

export default userSlice.reducer;
