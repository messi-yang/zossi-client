import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { WorldMemberModel } from '@/models';

import { WorldMemberCard } from '.';

export default {
  title: 'Card/WorldMemberCard',
  component: WorldMemberCard,
  argTypes: {},
} as Meta<typeof WorldMemberCard>;

const Template: StoryFn<typeof WorldMemberCard> = function Template(args) {
  return (
    <div className="w-[400px] h-[200px] flex items-center justify-center">
      <WorldMemberCard {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  worldMember: WorldMemberModel.mockup(),
};
