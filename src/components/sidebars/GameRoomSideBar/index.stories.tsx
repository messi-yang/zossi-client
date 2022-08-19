import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { UnitPatternVO } from '@/valueObjects';

import GameRoomSideBar from '.';

export default {
  title: 'Sidebar/GameRoomSideBar',
  component: GameRoomSideBar,
  argTypes: {},
} as ComponentMeta<typeof GameRoomSideBar>;

const Template: ComponentStory<typeof GameRoomSideBar> = function Template(args) {
  const { align } = args;
  const [, updateArgs] = useArgs();
  const handleUnitPatternUpdate = (unitPattern: UnitPatternVO) => {
    updateArgs({ unitPattern });
  };

  return (
    <section
      style={{
        height: align === 'column' ? '100vh' : undefined,
        width: align === 'row' ? '100vw' : undefined,
      }}
    >
      <GameRoomSideBar {...args} onUnitPatternUpdate={handleUnitPatternUpdate} />
    </section>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  align: 'column',
  unitPattern: [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, true, true, true, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ],
};
