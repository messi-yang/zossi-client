import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import UnitPatternIcon from '.';

export default {
  title: 'Icon/UnitPatternIcon',
  component: UnitPatternIcon,
  argTypes: {
    highlighted: {
      control: 'boolean',
    },
    active: {
      control: 'boolean',
    },
  },
} as ComponentMeta<typeof UnitPatternIcon>;

const Template: ComponentStory<typeof UnitPatternIcon> = function Template(
  args
) {
  return <UnitPatternIcon {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {};
