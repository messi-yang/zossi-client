import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { ShareWorldModal } from '.';
import { WorldMemberModel, WorldModel } from '@/models';

export default {
  title: 'Modal/ShareWorldModal',
  component: ShareWorldModal,
  argTypes: {},
} as Meta<typeof ShareWorldModal>;

const Template: StoryFn<typeof ShareWorldModal> = function Template(args) {
  return <ShareWorldModal {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  opened: true,
  world: WorldModel.newMockupWorld(),
  worldMembes: [WorldMemberModel.mockup(), WorldMemberModel.mockup(), WorldMemberModel.mockup()],
};
