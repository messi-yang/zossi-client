import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { EmbedModal } from '.';

export default {
  title: 'Modal/EmbedModal',
  component: EmbedModal,
  argTypes: {},
} as Meta<typeof EmbedModal>;

const Template: StoryFn<typeof EmbedModal> = function Template(args) {
  return <EmbedModal {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  opened: true,
  embedCode:
    '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/3AhXZa8sUQht0UEdBJgpGc?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
};
