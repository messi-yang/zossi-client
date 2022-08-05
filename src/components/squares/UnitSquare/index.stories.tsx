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
    <div style={{ display: 'inline-flex', width: '50px', height: '50px' }}>
      <UnitSquare {...args} onClick={handleClick} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  coordinate: { x: 0, y: 0 },
};
