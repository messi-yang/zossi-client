import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import UnitSquare from '.';

export default {
  title: 'Square/UnitSquare',
  component: UnitSquare,
  argTypes: {
    coordinateX: {
      control: 'number',
    },
    coordinateY: {
      control: 'number',
    },
    alive: {
      control: 'boolean',
    },
    hovered: {
      control: 'boolean',
    },
    hasTopBorder: {
      control: 'boolean',
    },
    hasRightBorder: {
      control: 'boolean',
    },
    hasBottomBorder: {
      control: 'boolean',
    },
    hasLeftBorder: {
      control: 'boolean',
    },
    onClick: { action: true },
    onHover: { action: true },
  },
} as ComponentMeta<typeof UnitSquare>;

const Template: ComponentStory<typeof UnitSquare> = function Template(args) {
  return (
    <div style={{ display: 'inline-flex', width: '50px', height: '50px' }}>
      <UnitSquare {...args} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
