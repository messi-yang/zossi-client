import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { ControlUnitPanel } from '.';

function renderControlUnitPanel(): RenderResult {
  return render(<ControlUnitPanel onEngageClick={() => {}} onRotateClick={() => {}} onRemoveClick={() => {}} />);
}

describe('ControlUnitPanel', () => {
  it('Should render component successfully.', () => {
    try {
      renderControlUnitPanel();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
