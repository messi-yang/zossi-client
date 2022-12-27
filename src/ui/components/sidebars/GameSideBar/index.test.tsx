import { render, RenderResult, screen } from '@testing-library/react';
import GameSideBar, { dataTestids } from '.';

function renderGameSideBar(): RenderResult {
  return render(
    <GameSideBar
      align="column"
      onLogoClick={() => {}}
      isBuildItemActive
      onBuildItemClick={() => {}}
      isMiniMapActive
      onMiniMapClick={() => {}}
    />
  );
}

describe('GameSideBar', () => {
  it('Should render component successfully.', () => {
    try {
      renderGameSideBar();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
