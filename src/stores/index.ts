import { createStore, AnyAction, Store, combineReducers } from 'redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import profileReducer, {
  createInitialState as createProfileInitialState,
} from './profile';

const initState = {
  profile: createProfileInitialState(),
};

const subReducers = combineReducers({
  profile: profileReducer,
});

export type State = ReturnType<typeof subReducers>;

export const reducer = (state: State = initState, action: AnyAction) => {
  if (action.type === HYDRATE) {
    const nextState: State = {
      ...state,
      ...action.payload,
    };
    return nextState;
  }
  return subReducers(state, action);
};

const makeStore = () => createStore(reducer);

// export an assembled wrapper
export const wrapper = createWrapper<Store<State>>(makeStore, { debug: true });
