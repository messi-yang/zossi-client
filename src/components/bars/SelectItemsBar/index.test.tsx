import { render, RenderResult, screen } from '@testing-library/react';
import { ItemModel } from '@/models';
import SelectItemsBar, { dataTestids } from '.';

function renderSelectItemsBar(): RenderResult {
  return render(<SelectItemsBar selectedItemId={null} items={[ItemModel.newMockupItem()]} />);
}

describe('SelectItemsBar', () => {
  it('Should render component successfully.', () => {
    try {
      renderSelectItemsBar();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
