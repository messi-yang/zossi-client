import { render, RenderResult, screen } from '@testing-library/react';
import { ItemModel } from '@/models/world/item/item-model';
import { dataTestids } from './data-test-ids';
import { SelectItemsBar } from '.';

function renderSelectItemsBar(): RenderResult {
  return render(<SelectItemsBar selectedItemId={null} items={[ItemModel.mockup()]} />);
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
