import { v4 as uuidv4 } from 'uuid';

export function generateDataTestid(): string {
  return process.env.NODE_ENV === 'test' ? uuidv4() : '';
}

export default {};
