import { makeStore } from '@/stores';
import { pause } from '@/utils/common';
import { setNickname, fetchNickname } from './index';

describe('Profile Reducer', () => {
  describe('setNickname', () => {
    it('Should correctly set nickname', () => {
      const store = makeStore();
      store.dispatch(setNickname('My name'));

      expect(store.getState().profile.nickname).toBe('My name');
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
