import { HYDRATE } from 'next-redux-wrapper';
import { createSlice } from '@reduxjs/toolkit';

export type State = {};

const slice = createSlice({
  name: 'gameRoom',
  initialState: {} as State,
  reducers: {},
  extraReducers: {
    [HYDRATE]: () => {},
  },
});

export default slice.reducer;
