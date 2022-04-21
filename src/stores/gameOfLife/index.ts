import { HYDRATE } from 'next-redux-wrapper';
import { createSlice } from '@reduxjs/toolkit';

export type Unit = {
  alive: boolean;
  age: number;
};

export type Status = 'NOT_ESTABLISHED' | 'ESTABLISHED';

export type State = {
  status: Status;
  units: Unit[][];
};

const slice = createSlice({
  name: 'gameOfLife',
  initialState: {
    status: 'NOT_ESTABLISHED',
    units: [],
  } as State,
  reducers: {
    setUnits(state: State, action: { type: string; payload: Unit[][] }) {
      state.units = action.payload;
    },
    setStatus(state: State, action: { type: string; payload: Status }) {
      state.status = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state: State, action) => {
      state.units = action.payload.gameOfLife.units;
      state.status = action.payload.gameOfLife.status;
    },
  },
});

export default slice.reducer;

export const { setUnits, setStatus } = slice.actions;
