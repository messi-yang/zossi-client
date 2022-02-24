import { HYDRATE } from 'next-redux-wrapper';
import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '@/stores';
import { pause } from '@/utils/tests';

export type State = {
  nickname: string;
};

const slice = createSlice({
  name: 'profile',
  initialState: {
    nickname: 'Anonymous',
  } as State,
  reducers: {
    setNickname(state, action: { type: string; payload: string }): State {
      return {
        ...state,
        nickname: action.payload,
      };
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => ({
      ...state,
      ...action.payload.profile,
    }),
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
