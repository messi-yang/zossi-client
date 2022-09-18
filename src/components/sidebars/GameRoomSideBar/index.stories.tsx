import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { UnitPatternValueObject } from '@/valueObjects';

import GameRoomSideBar from '.';

export default {
  title: 'Sidebar/GameRoomSideBar',
  component: GameRoomSideBar,
  argTypes: {},
} as ComponentMeta<typeof GameRoomSideBar>;

const Template: ComponentStory<typeof GameRoomSideBar> = function Template(args) {
  const { align } = args;
  const [, updateArgs] = useArgs();
  const handleUnitPatternUpdate = (unitPattern: UnitPatternValueObject) => {
    updateArgs({ unitPattern });
  };

  return (
    <section className={[align === 'column' ? 'h-screen' : '', align === 'row' ? 'w-screen' : undefined].join(' ')}>
      <GameRoomSideBar {...args} onUnitPatternUpdate={handleUnitPatternUpdate} />
    </section>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  align: 'column',
  unitPattern: new UnitPatternValueObject([
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, true, true, true, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
  ]),
};
