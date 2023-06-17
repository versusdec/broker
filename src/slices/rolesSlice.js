import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../api";

export const rolesList = createAsyncThunk('roles/list', async (params) => {
  const {result, error} = await api.roles.list(params);
  return {result, error}
})

export const rolesSuggest = createAsyncThunk('roles/suggest', async (params) => {
  const {result, error} = await api.roles.suggest(params);
  return {result, error}
})

export const rolesGet = createAsyncThunk('roles/get', async (params) => {
  const {result, error} = await api.roles.get(params);
  return {result, error}
})

export const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    list: {
      data: null,
      loading: false,
      error: false
    },
    get: {
      data: null,
      loading: false,
      error: false
    }
  },
  reducers: {
    fillRole: (state, action) => {
      state.get.data = action.payload;
    },
    fillRoles: (state, action) => {
      state.list.data.items = action.payload;
    },
    
  },
  extraReducers(builder) {
    builder
      .addCase(rolesList.pending, (state, action) => {
        state.list.loading = true;
      })
      .addCase(rolesList.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.result
      })
      .addCase(rolesList.rejected, (state, action) => {
        state.list.loading = false;
        state.list.data = null;
        state.list.error = action.payload.error;
      })
      .addCase(rolesSuggest.pending, (state, action) => {
        state.list.loading = true;
      })
      .addCase(rolesSuggest.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.result
      })
      .addCase(rolesSuggest.rejected, (state, action) => {
        state.list.loading = false;
        state.list.data = null;
        state.list.error = action.payload.error;
      })
      .addCase(rolesGet.pending, (state, action) => {
        state.get.loading = true;
      })
      .addCase(rolesGet.fulfilled, (state, action) => {
        state.get.loading = false;
        state.get.data = action.payload.result
      })
      .addCase(rolesGet.rejected, (state, action) => {
        state.get.loading = false;
        state.get.data = null;
        state.get.error = action.payload.error;
      })
    
  }
})

export const {actions, reducer} = rolesSlice;