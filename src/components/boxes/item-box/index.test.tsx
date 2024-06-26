import { render, RenderResult, screen } from '@testing-library/react';
import { ItemModel } from '@/models/world/item/item-model';
import { dataTestids } from './data-test-ids';
import { ItemBox } from '.';

function renderItemBox(): RenderResult {
  return render(<ItemBox item={ItemModel.createMock()} />);
}

describe('ItemBox', () => {
  it('Should render component successfully.', () => {
    try {
      renderItemBox();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
