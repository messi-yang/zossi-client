import { AnyAction } from 'redux';

export type State = {
  nickname: string;
};

export const createInitialState = (): State => ({
  nickname: 'Anonymous',
});

// TO-DO - Make this action work
// type Action =
//   | { type: 'SET_NICKNAME'; payload: string }
//   | { type: typeof HYDRATE; payload: any };

// create your reducer
export default function reducer(
  state: State = createInitialState(),
  action: AnyAction
): State {
  switch (action.type) {
    case 'SET_NICKNAME':
      return { ...state, nickname: action.payload };
    default:
      return state;
  }
}
