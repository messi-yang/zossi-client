import range from 'lodash/range';
import { render, RenderResult, screen } from '@testing-library/react';
import { ItemAgg } from '@/models/aggregates';
import SelectItemModal, { dataTestids } from '.';

function renderSelectItemModal(): RenderResult {
  return render(
    <SelectItemModal
      opened
      width={100}
      selectedItemId="sample-1"
      items={range(10).map((num) => ItemAgg.newItemAgg({ id: `sample-${num + 1}`, name: `Sample ${num + 1}` }))}
    />
  );
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
