import reducer, { State } from '@/stores/profile';

describe('Profile Reducer', () => {
  describe('SET_NICKNAME', () => {
    it('Should correctly set nickname', () => {
      const previousState: State = {
        nickname: 'Your name',
      };
      const action = {
        type: 'SET_NICKNAME',
        payload: 'My name',
      };
      const newState = reducer(previousState, action);

      expect(newState.nickname).toBe('My name');
    });
  });
});
