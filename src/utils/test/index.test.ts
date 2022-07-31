import { generateDataTestid } from './index';

describe('test utils', () => {
  describe('generateDataTestid', () => {
    it('Should generate random uuid when NODE_ENV is "test"', async () => {
      const uuid = generateDataTestid();

      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBeGreaterThan(0);
    });
  });
});
