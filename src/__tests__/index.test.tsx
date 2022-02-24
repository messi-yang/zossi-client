import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';
import { reducer } from '@/stores';

describe('Home', () => {
  it('Has greetings', () => {
    render(
      <Provider store={createStore(reducer)}>
        <Home />
      </Provider>
    );

    const greetingsDom = screen.getByText('index.greetings');

    expect(greetingsDom).toBeInTheDocument();
  });
});
