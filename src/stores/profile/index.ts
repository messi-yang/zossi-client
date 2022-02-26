import { HYDRATE } from 'next-redux-wrapper';
import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '@/stores';
import { pause } from '@/utils/common/';

export type State = {
  nickname: string;
};

const slice = createSlice({
  name: 'profile',
  initialState: {
    nickname: 'Anonymous',
  } as State,
  reducers: {
    setNickname(state: State, action: { type: string; payload: string }) {
      state.nickname = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state: State, action) => {
      state.nickname = action.payload.profile.nickname;
    },
  },
});

export default slice.reducer;

export const { setNickname } = slice.actions;

export function fetchNickname(name: string): AppThunk {
  return async (dispatch) => {
    await pause(1000);

    dispatch(slice.actions.setNickname(name));
  };
}
