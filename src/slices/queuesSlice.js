import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../api";

export const queuesList = createAsyncThunk('queues/list', async (params) => {
  const {result, error} = await api.queues.list(params);
  return {result, error}
})

export const queuesSuggest = createAsyncThunk('queues/suggest', async (params) => {
  const {result, error} = await api.queues.suggest(params);
  return {result, error}
})

export const queuesGet = createAsyncThunk('queues/get', async (id) => {
  const {result, error} = await api.queues.get(id);
  return {result, error}
})

export const queuesSlice = createSlice({
  name: 'queues',
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
    fillQueue: (state, action) => {
      state.get.data = action.payload;
    },
    fillQueues: (state, action) => {
      state.list.data.items = action.payload;
    },
    
  },
  extraReducers(builder) {
    builder
      .addCase(queuesList.pending, (state, action) => {
        state.list.loading = true;
      })
      .addCase(queuesList.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.result
      })
      .addCase(queuesList.rejected, (state, action) => {
        state.list.loading = false;
        state.list.data = null;
        state.list.error = action.payload.error;
      })
      .addCase(queuesGet.pending, (state, action) => {
        state.get.loading = true;
      })
      .addCase(queuesGet.fulfilled, (state, action) => {
        state.get.loading = false;
        state.get.data = action.payload.result
      })
      .addCase(queuesGet.rejected, (state, action) => {
        state.get.loading = false;
        state.get.data = null;
        state.get.error = action.payload.error;
      })
    
    
  }
})

export const {actions, reducer} = queuesSlice;