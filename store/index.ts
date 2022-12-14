import { AnyAction, combineReducers, configureStore, Reducer } from "@reduxjs/toolkit";
import tokenTypeStatus from './tokenTypeStatusState';
import themeTokenSetState from "./themeTokenSetState";

const combinedReducer = combineReducers({
  tokenType: tokenTypeStatus.reducer,
  themeTokenSet: themeTokenSetState.reducer,
});

export type RootState = ReturnType<typeof combinedReducer>;

const rootReducer: Reducer = (state: ReturnType<typeof store.getState>, action: AnyAction) => { 
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});
  
export default store;