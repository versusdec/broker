import {combineReducers} from '@reduxjs/toolkit';
import {reducer as authReducer} from "../slices/authSlice";
import {reducer as usersReducer} from "../slices/usersSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer
});
