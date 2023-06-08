import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api} from "../api";

export const projectsList = createAsyncThunk('projects/list', async (params) => {
  const {result, error} = await api.projects.list(params);
  return {result, error}
})

export const projectsSuggest = createAsyncThunk('projects/suggest', async (params) => {
  const {result, error} = await api.projects.suggest(params);
  return {result, error}
})

export const projectsGet = createAsyncThunk('projects/get', async (id) => {
  const {result, error} = await api.projects.get(id);
  return {result, error}
})

export const projectsSlice = createSlice({
  name: 'projects',
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
    fillProject: (state, action) => {
      state.get.data = action.payload;
    },
    fillProjects: (state, action) => {
      state.list.data.items = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(projectsList.pending, (state, action) => {
        state.list.loading = true;
      })
      .addCase(projectsList.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.result;
      })
      .addCase(projectsList.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload.error;
        state.list.data = null
      })
      .addCase(projectsSuggest.pending, (state, action) => {
        state.list.loading = true;
      })
      .addCase(projectsSuggest.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.data = action.payload.result;
      })
      .addCase(projectsSuggest.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload.error;
        state.list.data = null
      })
      .addCase(projectsGet.pending, (state, action) => {
        state.get.loading = true;
      })
      .addCase(projectsGet.fulfilled, (state, action) => {
        state.get.loading = false;
        state.get.data = action.payload.result;
      })
      .addCase(projectsGet.rejected, (state, action) => {
        state.get.loading = false;
        state.get.error = action.payload.error;
        state.get.data = null
      })
    
  }
})

export const {actions, reducer} = projectsSlice;