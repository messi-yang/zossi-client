import { render, RenderResult, screen } from '@testing-library/react';
import GameRoomSideBar, { dataTestids } from '.';

function renderGameRoomSideBar(): RenderResult {
  return render(
    <GameRoomSideBar
      align="column"
      onLogoClick={() => {}}
      isBuildItemActive
      onBuildItemClick={() => {}}
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