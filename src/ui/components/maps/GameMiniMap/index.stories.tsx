import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { AreaVo, LocationVo, DimensionVo } from '@/models/valueObjects';

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
  dimension: DimensionVo.new(300, 300),
  area: AreaVo.new(LocationVo.new(0, 0), LocationVo.new(30, 30)),
};
