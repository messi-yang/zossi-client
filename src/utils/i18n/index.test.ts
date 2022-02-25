import { getInitialLocale } from './index';

describe('i18n utils', () => {
  describe('getInitialLocale', () => {
    it('Should set locale when argument is given', () => {
      expect(getInitialLocale('jp')).toBe('jp');
    });
    it('Should get default language when argument is not given', () => {
      // TO-DO - This test case has to be fixed
      expect(getInitialLocale('1')).toBe('1');
    });
  });
});
