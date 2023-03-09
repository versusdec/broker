import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../api";

export const usersMe = createAsyncThunk('users/me', async () => {
  const {result, error} = await api.users.me();
  return {result, error}
})

export const usersList = createAsyncThunk('users/list', async (params) => {
  const {result, error} = await api.users.list(params);
  return {result, error}
})

export const usersSuggest = createAsyncThunk('users/suggest', async (params) => {
  const {result, error} = await api.users.suggest(params);
  return {result, error}
})

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    me: {
      data: null,
      loading: false,
      error: false
    },
    list: {
      data: null,
      loading: false,
      error: false
    }
  },
  reducers: {
    fillMe: (state, action) => {
      state.me.data = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(usersMe.pending, (state, action) => {
        state.me.loading = true;
      })
      .addCase(usersMe.fulfilled, (state, action) => {
        state.me.loading = false;
        state.me.data = action.payload.result
      })
      .addCase(usersMe.rejected, (state, action) => {
        state.me.loading = false;
        state.me.error = action.payload.error;
        state.me.data = null
      })
      .addCase(usersList.pending, (state, action) => {
        state.list.loading = true;
      })
      .addCase(usersList.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.result
      })
      .addCase(usersList.rejected, (state, action) => {
        state.list.loading = false;
        state.list.data = null;
        state.list.error = action.payload.error;
      })
      .addCase(usersSuggest.pending, (state, action) => {
        state.list.loading = true;
      })
      .addCase(usersSuggest.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.result
      })
      .addCase(usersSuggest.rejected, (state, action) => {
        state.list.loading = false;
        state.list.data = null;
        state.list.error = action.payload.error;
      })
    
  }
})

export const thunks = {
  usersMe
}

export const {actions, reducer} = usersSlice;