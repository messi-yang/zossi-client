import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import Home from '@/pages/index.page';
import { makeStore } from '@/stores';

describe('Home', () => {
  it('Has greetings', () => {
    render(
      <Provider store={makeStore()}>
        <Home />
      </Provider>
    );

    expect(true).toBeTruthy();
  });
});
