import { makeStore } from '@/stores';
import reducer, { setNickname, fetchNickname, State } from '@/stores/profile';
import { pause } from '@/utils/tests';

describe('Profile Reducer', () => {
  describe('setNickname', () => {
    it('Should correctly set nickname', () => {
      const previousState: State = {
        nickname: 'Your name',
      };
      const newState = reducer(previousState, setNickname('My name'));

      expect(newState.nickname).toBe('My name');
    });
  });
  describe('fetchNickname', () => {
    it('Should fetch nickname after 1 sec', async () => {
      const store = makeStore();
      store.dispatch(fetchNickname('My name'));
      await pause(1100);

      expect(store.getState().profile.nickname).toBe('My name');
    });
  });
});
