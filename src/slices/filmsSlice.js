import {createSlice} from "@reduxjs/toolkit";

export const filmsSlice = createSlice({
  name: 'films',
  initialState: {
    data: []
  },
  reducers: {
    fill: (state,action)=>{
      state.films = action.payload
    }
  }
})