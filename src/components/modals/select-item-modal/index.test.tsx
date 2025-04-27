import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { SelectItemModal } from '.';

function renderSelectItemModal(): RenderResult {
  return render(<SelectItemModal opened items={[]} selectedItemId={null} onItemSelect={() => {}} onClose={() => {}} />);
}

describe('SelectItemModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderSelectItemModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
