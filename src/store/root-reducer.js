import {combineReducers} from '@reduxjs/toolkit';
import {reducer as authReducer} from "../slices/authSlice";
import {reducer as usersReducer} from "../slices/usersSlice";
import {reducer as projectsReducer} from "../slices/projectsSlice";
import {reducer as fieldsReducer} from "../slices/fieldsSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  projects: projectsReducer,
  fields: fieldsReducer,
});
