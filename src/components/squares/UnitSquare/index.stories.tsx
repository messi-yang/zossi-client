import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

import UnitSquare from '.';

export default {
  title: 'Square/UnitSquare',
  component: UnitSquare,
  argTypes: {},
} as ComponentMeta<typeof UnitSquare>;

const Template: ComponentStory<typeof UnitSquare> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { alive } = args;

  const handleClick = () => {
    updateArgs({ alive: !alive });
  };

  return (
    <div className="inline-flex w-24 h-24">
      <UnitSquare {...args} onClick={handleClick} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
