import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../api";

export const transactionsList = createAsyncThunk('transactions/list', async (params) => {
  const {result, error} = await api.transactions.list(params);
  return {result, error}
})

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    list: {
      data: null,
      loading: false,
      error: false
    }
  },
  reducers: {
    fillTransactions: (state, action) => {
      state.list.data.items = action.payload;
    },
    
  },
  extraReducers(builder) {
    builder
      .addCase(transactionsList.pending, (state, action) => {
        state.list.loading = true;
      })
      .addCase(transactionsList.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.result
      })
      .addCase(transactionsList.rejected, (state, action) => {
        state.list.loading = false;
        state.list.data = null;
        state.list.error = action.payload.error;
      })
      
    
  }
})

export const thunks = {
  transactionsList
}

export const {actions, reducer} = transactionsSlice;