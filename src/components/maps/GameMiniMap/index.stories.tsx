import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { AreaValueObject, CoordinateValueObject, MapSizeValueObject } from '@/valueObjects';

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
  mapSize: new MapSizeValueObject(300, 300),
  area: new AreaValueObject(new CoordinateValueObject(0, 0), new CoordinateValueObject(30, 30)),
};
