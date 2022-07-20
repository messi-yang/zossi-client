import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import UnitMapIcon from '.';

export default {
  title: 'Icon/UnitMapIcon',
  component: UnitMapIcon,
  argTypes: {
    hovered: {
      control: 'boolean',
    },
    active: {
      control: 'boolean',
    },
  },
} as ComponentMeta<typeof UnitMapIcon>;

const Template: ComponentStory<typeof UnitMapIcon> = function Template(args) {
  return <UnitMapIcon {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
