import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

describe('Home', () => {
  it('Has greetings', () => {
    render(<Home />);

    const greetingsDom = screen.getByText('index.greetings');

    expect(greetingsDom).toBeInTheDocument();
  });
});
