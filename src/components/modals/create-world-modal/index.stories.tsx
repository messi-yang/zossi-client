import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { CreateWorldModal } from '.';

export default {
  title: 'Modal/CreateWorldModal',
  component: CreateWorldModal,
  argTypes: {},
} as Meta<typeof CreateWorldModal>;

const Template: StoryFn<typeof CreateWorldModal> = function Template(args) {
  return <CreateWorldModal {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  opened: true,
};
