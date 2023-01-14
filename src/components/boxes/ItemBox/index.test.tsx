import { render, RenderResult, screen } from '@testing-library/react';
import { ItemAgg } from '@/models/aggregates';
import ItemBox, { dataTestids } from '.';

function renderItemBox(): RenderResult {
  return render(<ItemBox item={ItemAgg.newItemAgg({ id: '123', name: 'stone', assetSrc: 'placeholder-item.png' })} />);
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
