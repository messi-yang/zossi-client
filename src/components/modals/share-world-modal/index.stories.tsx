import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { ShareWorldModal } from '.';
import { WorldMemberModel } from '@/models/iam/world-member-model';
import { WorldModel } from '@/models/world/world-model';

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
  world: WorldModel.mockup(),
  worldMembes: [WorldMemberModel.mockup(), WorldMemberModel.mockup(), WorldMemberModel.mockup()],
};
