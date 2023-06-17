import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../api";

export const paymentsList = createAsyncThunk('payments/list', async (params) => {
  const {result, error} = await api.payments.list(params);
  return {result, error}
})

export const paymentsSlice = createSlice({
  name: 'payments',
  initialState: {
    list: {
      data: null,
      loading: false,
      error: false
    }
  },
  reducers: {
    fillPayments: (state, action) => {
      state.list.data.items = action.payload;
    },
    
  },
  extraReducers(builder) {
    builder
      .addCase(paymentsList.pending, (state, action) => {
        state.list.loading = true;
      })
      .addCase(paymentsList.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.result
      })
      .addCase(paymentsList.rejected, (state, action) => {
        state.list.loading = false;
        state.list.data = null;
        state.list.error = action.payload.error;
      })
      
    
  }
})

export const thunks = {
  paymentsList
}

export const {actions, reducer} = paymentsSlice;