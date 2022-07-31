import { generateKeyFromIndex } from './index';

describe('component utils', () => {
  describe('generateKeyFromIndex', () => {
    it('Should just convert number to string', async () => {
      const key = generateKeyFromIndex(1);
      expect(key).toBe('1');
    });
  });
});
