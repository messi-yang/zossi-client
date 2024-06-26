import { render, RenderResult, screen } from '@testing-library/react';
import { WorldMemberModel } from '@/models/iam/world-member-model';
import { dataTestids } from './data-test-ids';
import { WorldMemberCard } from '.';

function renderWorldMemberCard(): RenderResult {
  return render(<WorldMemberCard worldMember={WorldMemberModel.createMock()} />);
}

describe('WorldMemberCard', () => {
  it('Should render component successfully.', () => {
    try {
      renderWorldMemberCard();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
