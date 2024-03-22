import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

import netInfoSlice from "./slices/netInfoSlice";
import userSlice from "./slices/userSlice";
import transactionSlice from "./slices/transactionSlice";
import messageSlice from "./slices/messageSlice";
const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
};
const rootReducer = combineReducers({
  netInfoReducer: netInfoSlice,
  userReducer: userSlice,
  transactionReducer: transactionSlice,
  messagesReducer: messageSlice,
});
const persistedRootReducer = persistReducer(persistConfig, rootReducer);
export default persistedRootReducer;
