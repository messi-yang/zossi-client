import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { LocationVo, MapRangeVo, OffsetVo, GameMapUnitVo, GameMapVo } from '@/models/valueObjects';

import GameMap from '.';

export default {
  title: 'Map/GameMap',
  component: GameMap,
  argTypes: {},
} as ComponentMeta<typeof GameMap>;

const Template: ComponentStory<typeof GameMap> = function Template(args) {
  const [, updateArgs] = useArgs();
  const { mapRange, gameMap } = args;
  const handleGameMapUnitClick = (location: LocationVo) => {
    if (!mapRange) {
      return;
    }
    if (!gameMap) {
      return;
    }

    const gameMapUnitMatrix = gameMap.getGameMapUnitMatrix();
    gameMapUnitMatrix[location.getX()][location.getY()] = GameMapUnitVo.new(null);

    updateArgs({
      gameMap: GameMapVo.new(gameMapUnitMatrix),
    });
  };

  return (
    <div className="inline-flex w-24 h-24">
      <GameMap {...args} onGameMapUnitClick={handleGameMapUnitClick} />
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
