import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { LocationVo, MapRangeVo, OffsetVo, MapUnitVo, GameMapVo } from '@/models/valueObjects';

import GameMap from '.';

export default {
  title: 'Map/GameMap',
  component: GameMap,
  argTypes: {},
} as ComponentMeta<typeof GameMap>;

const Template: ComponentStory<typeof GameMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { mapRange, gameMap } = args;
  const handleMapUnitClick = (location: LocationVo) => {
    if (!mapRange) {
      return;
    }
    if (!gameMap) {
      return;
    }

    const mapUnitMatrix = gameMap.getMapUnitMatrix();
    mapUnitMatrix[location.getX()][location.getY()] = MapUnitVo.new(null);

    updateArgs({
      gameMap: GameMapVo.new(mapUnitMatrix),
    });
  };

  return (
    <div className="inline-flex w-24 h-24">
      <GameMap {...args} onMapUnitClick={handleMapUnitClick} />
    </div>
  );
};

export const Primary = Template.bind({});
const mapRangeForPrimary = MapRangeVo.new(LocationVo.new(3, 3), LocationVo.new(9, 9));
Primary.args = {
  mapRange: mapRangeForPrimary,
  mapRangeOffset: OffsetVo.new(0, 0),
  gameMap: GameMapVo.newWithMapSize(mapRangeForPrimary.getMapSize()),
};
