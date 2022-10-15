import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { createUnitMap, createUnit } from '@/valueObjects/factories';

import UnitBoard from '.';
import { UnitMapValueObject } from '@/valueObjects';

export default {
  title: 'Editor/UnitBoard',
  component: UnitBoard,
  argTypes: {},
} as ComponentMeta<typeof UnitBoard>;

const Template: ComponentStory<typeof UnitBoard> = function Template(args) {
  const [currentArgs, updateArgs] = useArgs();
  const handleUnitClick = (colIdx: number, rowIdx: number) => {
    let newUnitMap: UnitMapValueObject = currentArgs.unitMap;
    newUnitMap = newUnitMap.setUnitAlive(colIdx, rowIdx, true);
    updateArgs({
      uniMap: newUnitMap,
    });
  };

  return (
    <div className="w-32 h-32 inline-flex">
      <UnitBoard {...args} onUnitClick={handleUnitClick} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  unitMap: createUnitMap([
    [createUnit(true, 0), createUnit(true, 0), createUnit(true, 0)],
    [createUnit(true, 0), createUnit(false, 0), createUnit(true, 0)],
    [createUnit(true, 0), createUnit(true, 0), createUnit(true, 0)],
  ]),
  unitSize: 40,
};
