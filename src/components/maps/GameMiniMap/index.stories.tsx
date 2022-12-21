import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { AreaValueObject } from '@/models/valueObjects';
import { createCoordinate, createArea, createDimension } from '@/models/valueObjects/factories';

import GameMiniMap from '.';

export default {
  title: 'Map/GameMiniMap',
  component: GameMiniMap,
  argTypes: {},
} as ComponentMeta<typeof GameMiniMap>;

const Template: ComponentStory<typeof GameMiniMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const handleAreaUpdate = (newArea: AreaValueObject) => {
    updateArgs({
      area: newArea,
    });
  };

  return <GameMiniMap {...args} onAreaUpdate={handleAreaUpdate} />;
};

export const Primary = Template.bind({});
Primary.args = {
  width: 300,
  dimension: createDimension(300, 300),
  area: createArea(createCoordinate(0, 0), createCoordinate(30, 30)),
};
