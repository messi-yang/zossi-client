import { render, RenderResult, screen } from '@testing-library/react';
import { UserModel } from '@/models';
import { dataTestids } from './data-test-ids';
import { UserAvatar } from '.';

function renderUserAvatar(): RenderResult {
  return render(<UserAvatar user={UserModel.newMockupUser()} />);
}

describe('UserAvatar', () => {
  it('Should render component successfully.', () => {
    try {
      renderUserAvatar();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
