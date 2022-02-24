import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';
import { makeStore } from '@/stores';

describe('Home', () => {
  it('Has greetings', () => {
    render(
      <Provider store={makeStore()}>
        <Home />
      </Provider>
    );

    const greetingsDom = screen.getByText('index.greetings');

    expect(greetingsDom).toBeInTheDocument();
  });
});
