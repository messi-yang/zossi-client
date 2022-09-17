import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { AreaVo } from '@/valueObjects';

import GameMiniMap from '.';

export default {
  title: 'Map/GameMiniMap',
  component: GameMiniMap,
  argTypes: {},
} as ComponentMeta<typeof GameMiniMap>;

const Template: ComponentStory<typeof GameMiniMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const handleAreaUpdate = (newArea: AreaVo) => {
    updateArgs({
      area: newArea,
    });
  };

  return <GameMiniMap {...args} onAreaUpdate={handleAreaUpdate} />;
};

export const Primary = Template.bind({});
Primary.args = {
  width: 300,
  mapSize: { width: 300, height: 300 },
  area: { from: { x: 0, y: 0 }, to: { x: 50, y: 50 } },
};
