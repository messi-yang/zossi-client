import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { Field } from '.';

function renderField(): RenderResult {
  return render(<Field label="Hello">{null}</Field>);
}

describe('Field', () => {
  it('Should render component successfully.', () => {
    try {
      renderField();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
