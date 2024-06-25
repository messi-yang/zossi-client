import { render, RenderResult, screen } from '@testing-library/react';
import { ItemModel } from '@/models/world/item/item-model';
import { dataTestids } from './data-test-ids';
import { ItemSelect } from '.';

function renderItemSelect(): RenderResult {
  return render(<ItemSelect selectedItemId={null} items={[ItemModel.createMock()]} />);
}

describe('ItemSelect', () => {
  it('Should render component successfully.', () => {
    try {
      renderItemSelect();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
