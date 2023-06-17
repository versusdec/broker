import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../api";

export const scriptsList = createAsyncThunk('scripts/list', async (params) => {
  const {result, error} = await api.scripts.list(params);
  return {result, error}
})

export const scriptsSuggest = createAsyncThunk('scripts/suggest', async (params) => {
  const {result, error} = await api.scripts.suggest(params);
  return {result, error}
})

export const scriptsGet = createAsyncThunk('scripts/get', async (id) => {
  const {result, error} = await api.scripts.get(id);
  return {result, error}
})

export const scriptsSlice = createSlice({
  name: 'scripts',
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
    fillScript: (state, action) => {
      state.get.data = action.payload;
    },
    fillScripts: (state, action) => {
      state.list.data.items = action.payload;
    },
    
  },
  extraReducers(builder) {
    builder
      .addCase(scriptsList.pending, (state, action) => {
        state.list.loading = true;
      })
      .addCase(scriptsList.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.result
      })
      .addCase(scriptsList.rejected, (state, action) => {
        state.list.loading = false;
        state.list.data = null;
        state.list.error = action.payload.error;
      })
      .addCase(scriptsSuggest.pending, (state, action) => {
        state.list.loading = true;
      })
      .addCase(scriptsSuggest.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.result
      })
      .addCase(scriptsSuggest.rejected, (state, action) => {
        state.list.loading = false;
        state.list.data = null;
        state.list.error = action.payload.error;
      })
      
      .addCase(scriptsGet.pending, (state, action) => {
        state.get.loading = true;
      })
      .addCase(scriptsGet.fulfilled, (state, action) => {
        state.get.loading = false;
        state.get.data = action.payload.result
      })
      .addCase(scriptsGet.rejected, (state, action) => {
        state.get.loading = false;
        state.get.data = null;
        state.get.error = action.payload.error;
      })
    
    
  }
})
 
export const {actions, reducer} = scriptsSlice;