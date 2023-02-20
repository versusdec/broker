import {createSlice} from "@reduxjs/toolkit";

export const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    status: 'idle',
    error: null
  },
  reducers: {
    postsAdded: (state,action)=>{
      state.posts.posts.push(action.payload)
    },

  }
})