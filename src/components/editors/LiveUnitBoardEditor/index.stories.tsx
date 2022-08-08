import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

import LiveUnitBoardEditor from '.';
import type { LiveUnitBoardEntity } from '@/entities/';

export default {
  title: 'Editor/LiveUnitBoardEditor',
  component: LiveUnitBoardEditor,
  argTypes: {},
} as ComponentMeta<typeof LiveUnitBoardEditor>;

const Template: ComponentStory<typeof LiveUnitBoardEditor> = function Template(args) {
  const [, updateArgs] = useArgs();
  const handleLiveUnitBoardUpdate = (liveUnitBoard: LiveUnitBoardEntity) => {
    updateArgs({
      liveUnitBoard,
    });
  };

  return (
    <div style={{ display: 'inline-flex' }}>
      <LiveUnitBoardEditor {...args} onUpdate={handleLiveUnitBoardUpdate} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  liveUnitBoard: [
    [true, true, true],
    [true, false, true],
    [true, true, true],
  ],
};
