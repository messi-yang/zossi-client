import { generateUuidV4 } from '../uuid';

export const generateDataTestId = () => {
  return process.env.NODE_ENV === 'test' ? generateUuidV4() : '';
};
