import {combineReducers} from '@reduxjs/toolkit';
import {reducer as authReducer} from "../slices/authSlice";
import {reducer as usersReducer} from "../slices/usersSlice";
import {reducer as projectsReducer} from "../slices/projectsSlice";
import {reducer as fieldsReducer} from "../slices/fieldsSlice";
import {reducer as transactionsReducer} from "../slices/transactionsSlice";
import {reducer as paymentsReducer} from "../slices/paymentsSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  projects: projectsReducer,
  fields: fieldsReducer,
  transactions: transactionsReducer,
  payments: paymentsReducer,
});
