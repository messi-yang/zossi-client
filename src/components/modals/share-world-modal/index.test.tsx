import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { ShareWorldModal } from '.';
import { WorldMemberModel } from '@/models/iam/world-member-model';
import { WorldModel } from '@/models/world/world/world-model';

function renderShareWorldModal(): RenderResult {
  return render(
    <ShareWorldModal
      opened
      world={WorldModel.createMock()}
      worldMembes={[WorldMemberModel.createMock(), WorldMemberModel.createMock(), WorldMemberModel.createMock()]}
    />
  );
}

describe('ShareWorldModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderShareWorldModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
