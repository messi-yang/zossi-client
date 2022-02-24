import { createStore, AnyAction, Store } from 'redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

export interface State {
  name: string;
}

const initialState: State = {
  name: 'Michael Jackson',
};

// create your reducer
export const reducer = (state: State = initialState, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      // Attention! This will overwrite client state! Real apps should use proper reconciliation.
      return { ...state, ...action.payload };
    case 'CHANGE_NAME':
      return { ...state, name: action.payload };
    default:
      return state;
  }
};

// create a makeStore function
const makeStore = () => createStore(reducer);

// export an assembled wrapper
export const wrapper = createWrapper<Store<State>>(makeStore, { debug: true });
