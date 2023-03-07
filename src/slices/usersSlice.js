import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../api";

export const usersMe = createAsyncThunk('users/me', async () => {
  const {result} = await api.users.me();
  return result
})

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    me: null
  },
  reducers: {
    fillMe: (state, action) => {
      state.me = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(usersMe.fulfilled, (state, action) => {
        state.me = action.payload
      })
      .addCase(usersMe.rejected, (state, action) => {
        state.me = null
      })
  }
})

export const thunks = {
  usersMe
}

export const {actions, reducer} = usersSlice;