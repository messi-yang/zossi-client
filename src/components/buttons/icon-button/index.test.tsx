import { render, RenderResult, screen, fireEvent } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { IconButton } from '.';

type RenderButtonProps = {
  iconName?: string;
  onClick?: () => void;
};

function renderButton({ iconName = 'material-symbols:close-rounded', onClick = () => {} }: RenderButtonProps): RenderResult {
  return render(<IconButton iconName={iconName} onClick={onClick} />);
}

describe('IconButton', () => {
  it('Should render component successfully.', () => {
    try {
      renderButton({ iconName: 'material-symbols:close-rounded' });
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
