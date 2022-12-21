import { render } from '@testing-library/react';
import Home from '@/pages/index.page';

describe('Home', () => {
  it('Has greetings', () => {
    render(<Home />);

    expect(true).toBeTruthy();
  });
});
