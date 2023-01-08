import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { ExtentVo, LocationVo, MapSizeVo } from '@/models/valueObjects';

import GameMiniMap from '.';

export default {
  title: 'Map/GameMiniMap',
  component: GameMiniMap,
  argTypes: {},
} as ComponentMeta<typeof GameMiniMap>;

const Template: ComponentStory<typeof GameMiniMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const handleExtentUpdate = (newExtent: ExtentVo) => {
    updateArgs({
      extent: newExtent,
    });
  };

  return <GameMiniMap {...args} onExtentUpdate={handleExtentUpdate} />;
};

export const Primary = Template.bind({});
Primary.args = {
  width: 300,
  mapSize: MapSizeVo.new(300, 300),
  extent: ExtentVo.new(LocationVo.new(0, 0), LocationVo.new(30, 30)),
};
