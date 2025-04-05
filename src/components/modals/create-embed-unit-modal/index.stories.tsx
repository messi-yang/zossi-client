import React from 'react';
import { StoryFn, Meta } from '@storybook/react';

import { CreateEmbedUnitModal } from '.';

export default {
  title: 'Modal/CreateEmbedUnitModal',
  component: CreateEmbedUnitModal,
  argTypes: {},
} as Meta<typeof CreateEmbedUnitModal>;

const Template: StoryFn<typeof CreateEmbedUnitModal> = function Template(args) {
  return <CreateEmbedUnitModal {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  opened: true,
};
