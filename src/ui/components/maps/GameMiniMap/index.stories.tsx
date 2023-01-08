import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { RangeVo, LocationVo, MapSizeVo } from '@/models/valueObjects';

import GameMiniMap from '.';

export default {
  title: 'Map/GameMiniMap',
  component: GameMiniMap,
  argTypes: {},
} as ComponentMeta<typeof GameMiniMap>;

const Template: ComponentStory<typeof GameMiniMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const handleRangeUpdate = (newRange: RangeVo) => {
    updateArgs({
      range: newRange,
    });
  };

  return <GameMiniMap {...args} onRangeUpdate={handleRangeUpdate} />;
};

export const Primary = Template.bind({});
Primary.args = {
  width: 300,
  mapSize: MapSizeVo.new(300, 300),
  range: RangeVo.new(LocationVo.new(0, 0), LocationVo.new(30, 30)),
};
