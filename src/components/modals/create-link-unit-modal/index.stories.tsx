import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { CreateLinkUnitModal } from '.';

export default {
  title: 'Modal/CreateLinkUnitModal',
  component: CreateLinkUnitModal,
  argTypes: {},
} as Meta<typeof CreateLinkUnitModal>;

const Template: StoryFn<typeof CreateLinkUnitModal> = function Template(args) {
  return <CreateLinkUnitModal {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  opened: true,
};
