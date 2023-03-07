import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV  === 'development'
});

export const useSelector = useReduxSelector;

export const useDispatch = () => useReduxDispatch();
