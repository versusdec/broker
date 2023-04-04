import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../api";

export const fieldsList = createAsyncThunk('fields/list', async (params) => {
  const {result, error} = await api.fields.list(params);
  return {result, error}
})

export const fieldsSuggest = createAsyncThunk('fields/suggest', async (params) => {
  const {result, error} = await api.fields.suggest(params);
  return {result, error}
})

export const fieldsGet = createAsyncThunk('fields/get', async (id) => {
  const {result, error} = await api.fields.get(id);
  return {result, error}
})

export const fieldsSlice = createSlice({
  name: 'fields',
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
    fillField: (state, action) => {
      state.get.data = action.payload;
    },
    fillFields: (state, action) => {
      state.list.data.items = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fieldsList.pending, (state, action) => {
        state.list.loading = true;
      })
      .addCase(fieldsList.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.result;
      })
      .addCase(fieldsList.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload.error;
        state.list.data = null
      })
      .addCase(fieldsGet.pending, (state, action) => {
        state.get.loading = true;
      })
      .addCase(fieldsGet.fulfilled, (state, action) => {
        state.get.loading = false;
        state.get.data = action.payload.result;
      })
      .addCase(fieldsGet.rejected, (state, action) => {
        state.get.loading = false;
        state.get.error = action.payload.error;
        state.get.data = null
      })
    
  }
})

export const thunks = {
  fieldsList
}

export const {actions, reducer} = fieldsSlice;