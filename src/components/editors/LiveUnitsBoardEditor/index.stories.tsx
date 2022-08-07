import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';

import LiveUnitsBoardEditor from '.';
import type { LiveUnitsBoard } from '.';

export default {
  title: 'Editor/LiveUnitsBoardEditor',
  component: LiveUnitsBoardEditor,
  argTypes: {},
} as ComponentMeta<typeof LiveUnitsBoardEditor>;

const Template: ComponentStory<typeof LiveUnitsBoardEditor> = function Template(args) {
  const [, updateArgs] = useArgs();
  const handleLiveUnitsBoardUpdate = (liveUnitsBoard: LiveUnitsBoard) => {
    updateArgs({
      liveUnitsBoard,
    });
  };

  return (
    <div style={{ display: 'inline-flex' }}>
      <LiveUnitsBoardEditor {...args} onUpdate={handleLiveUnitsBoardUpdate} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  liveUnitsBoard: [
    [true, true, true],
    [true, false, true],
    [true, true, true],
  ],
};
