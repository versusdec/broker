import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../api";

export const login = createAsyncThunk('auth/login', async (values) => {
  const res = await api.auth.login(values);
  const {result, error} = await res.json()
  
  if (result) {
    return true
  } else if (error) {
    console.table(error)
    return false
  }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state, action) => {
      state.data = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state, action) => {
      state.loading = true;
    })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = action.payload;
      })
    
  }
})

export const {actions} = authSlice;

export const thunks = {
  login
}

export const {reducer} = authSlice;