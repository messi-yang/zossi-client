import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { CreateEmbedUnitModal } from '.';

function renderCreateEmbedUnitModal(): RenderResult {
  return render(<CreateEmbedUnitModal opened onConfirm={() => {}} onCancel={() => {}} />);
}

describe('CreateWorldModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderCreateEmbedUnitModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
