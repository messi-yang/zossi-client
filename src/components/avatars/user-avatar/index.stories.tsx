import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { UserModel } from '@/models/iam/user-model';

import { UserAvatar } from '.';

export default {
  title: 'Avatar/UserAvatar',
  component: UserAvatar,
  argTypes: {},
} as Meta<typeof UserAvatar>;

const Template: StoryFn<typeof UserAvatar> = function Template(args) {
  return <UserAvatar {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  user: UserModel.createMock(),
};
