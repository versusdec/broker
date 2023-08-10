import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../api";

export const ticketsList = createAsyncThunk('tickets/list', async (params) => {
  const {result, error} = await api.support.list(params);
  return {result, error}
})

export const ticketsGet = createAsyncThunk('tickets/get', async (id) => {
  const {result, error} = await api.support.get(id);
  return {result, error}
})

export const ticketsSlice = createSlice({
  name: 'tickets',
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
    },
    
  },
  reducers: {
    fillTicket: (state, action) => {
      state.get.data = action.payload;
    },
    fillTickets: (state, action) => {
      state.list.data.items = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(ticketsList.pending, (state, action) => {
        state.list.loading = true;
      })
      .addCase(ticketsList.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.result;
      })
      .addCase(ticketsList.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload?.error;
        state.list.data = null
      })
      .addCase(ticketsGet.pending, (state, action) => {
        state.get.loading = true;
      })
      .addCase(ticketsGet.fulfilled, (state, action) => {
        state.get.loading = false;
        state.get.data = action.payload.result;
      })
      .addCase(ticketsGet.rejected, (state, action) => {
        state.get.loading = false;
        state.get.error = action.payload.error;
        state.get.data = null
      })
    
  }
})

export const {actions, reducer} = ticketsSlice;