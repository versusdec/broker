import {combineReducers} from '@reduxjs/toolkit';
import {reducer as authReducer} from "../slices/authSlice";

export const rootReducer = combineReducers({
  auth: authReducer
});
