import {configureStore} from '@reduxjs/toolkit';
import persistedRootReducer from './rootReducer';
import {persistStore} from 'redux-persist';
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from 'react-redux';
const store = configureStore({
  reducer: persistedRootReducer,
  //
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {ignoredActions: ['persist/PERSIST']},
    }),
});

const {dispatch} = store;

const useSelector = useAppSelector;

const useDispatch = () => useAppDispatch();

export {dispatch, useSelector, useDispatch};
export default store;
export const persistor = persistStore(store);
