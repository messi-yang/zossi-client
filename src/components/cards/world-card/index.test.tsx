import { render, RenderResult, screen } from '@testing-library/react';
import { WorldModel } from '@/models';
import { dataTestids } from './data-test-ids';
import { WorldCard } from '.';

function renderWorldCard(): RenderResult {
  return render(<WorldCard world={WorldModel.newMockupWorld()} />);
}

describe('WorldCard', () => {
  it('Should render component successfully.', () => {
    try {
      renderWorldCard();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
