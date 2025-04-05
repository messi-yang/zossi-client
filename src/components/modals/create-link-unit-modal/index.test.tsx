import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { CreateLinkUnitModal } from '.';

function renderCreateLinkUnitModal(): RenderResult {
  return render(<CreateLinkUnitModal opened onConfirm={() => {}} onCancel={() => {}} />);
}

describe('CreateWorldModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderCreateLinkUnitModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
