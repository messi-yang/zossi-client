import { render, RenderResult, screen } from '@testing-library/react';
import { UnitPatternVO } from '@/valueObjects';
import GameRoomSideBar, { dataTestids } from '.';

function renderGameRoomSideBar(): RenderResult {
  return render(
    <GameRoomSideBar
      align="column"
      unitPattern={new UnitPatternVO([[true]])}
      onUnitPatternUpdate={() => {}}
      onLogoClick={() => {}}
      isMiniMapActive
      onMiniMapClick={() => {}}
    />
  );
}

describe('GameRoomSideBar', () => {
  it('Should render component successfully.', () => {
    try {
      renderGameRoomSideBar();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
