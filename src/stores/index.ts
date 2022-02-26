import { createWrapper } from 'next-redux-wrapper';
import { Action } from 'redux';
import { configureStore, ThunkAction } from '@reduxjs/toolkit';

import profileReducer from './profile';

export const reducer = {
  profile: profileReducer,
};

export const makeStore = () =>
  configureStore({
    reducer,
    devTools: process.env.NODE_ENV === 'development',
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

// export an assembled wrapper
export const wrapper = createWrapper<AppStore>(makeStore);
