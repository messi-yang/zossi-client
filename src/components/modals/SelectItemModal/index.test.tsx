import range from 'lodash/range';
import { render, RenderResult, screen } from '@testing-library/react';
import { ItemAgg } from '@/models/aggregates';
import SelectItemModal, { dataTestids } from '.';

function renderSelectItemModal(): RenderResult {
  const items = range(10).map(() => ItemAgg.newMockupItem());
  return render(<SelectItemModal opened width={100} selectedItem={null} items={items} />);
}

describe('SelectItemModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderSelectItemModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      console.error(e);
      expect(true).toBe(false);
    }
  });
});
