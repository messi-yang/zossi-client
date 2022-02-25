import { pause } from './index';

describe('common utils', () => {
  describe('pause', () => {
    it('Should pause the process by slightly above 1000 mini sec', async () => {
      const time = new Date().getTime();
      await pause(1000);
      const newTime = new Date().getTime();
      expect(newTime - time).toBeGreaterThan(1000);
      expect(newTime - time).toBeLessThan(1050);
    });
  });
});
