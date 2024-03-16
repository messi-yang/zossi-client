import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { EmbedModal } from '.';

function renderEmbedModal(): RenderResult {
  return render(
    <EmbedModal
      opened
      embedCode='<iframe src="<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/3AhXZa8sUQht0UEdBJgpGc?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>" height="500" width="100%" style="border:0"></iframe>'
    />
  );
}

describe('EmbedModal', () => {
  it('Should render component successfully.', () => {
    try {
      renderEmbedModal();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
