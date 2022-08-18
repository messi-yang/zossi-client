import { HYDRATE } from 'next-redux-wrapper';
import { createSlice } from '@reduxjs/toolkit';
import type { UnitVO } from '@/valueObjects';

export type Status = 'OFFLINE' | 'ONLINE';

export type State = {
  status: Status;
  units: UnitVO[][];
};

const slice = createSlice({
  name: 'gameOfLife',
  initialState: {
    status: 'OFFLINE',
    units: [],
  } as State,
  reducers: {
    setUnits(state: State, action: { type: string; payload: UnitVO[][] }) {
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
