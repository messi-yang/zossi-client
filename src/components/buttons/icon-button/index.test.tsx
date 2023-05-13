import { render, RenderResult, screen, fireEvent } from '@testing-library/react';
import { dataTestids } from './dataTestids';
import { IconButton } from '.';
import type { Icon } from '.';

type RenderButtonProps = {
  icon?: Icon;
  onClick?: () => void;
};

function renderButton({ icon = 'cross', onClick = () => {} }: RenderButtonProps): RenderResult {
  return render(<IconButton icon={icon} onClick={onClick} />);
}

describe('IconButton', () => {
  it('Should render component successfully.', () => {
    try {
      renderButton({ icon: 'cross' });
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
  it('Should trigger onClick when gets clicked', () => {
    const onClickMockup = jest.fn();
    renderButton({ onClick: onClickMockup });

    const iconButtonElem = screen.getByTestId(dataTestids.root);
    fireEvent.click(iconButtonElem);
    expect(onClickMockup).toBeCalledTimes(1);
  });
});
