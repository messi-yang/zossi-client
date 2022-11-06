import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useArgs } from '@storybook/client-api';
import { createUnitBlock, createUnit } from '@/valueObjects/factories';

import UnitBoard from '.';
import { UnitBlockValueObject } from '@/valueObjects';

export default {
  title: 'Editor/UnitBoard',
  component: UnitBoard,
  argTypes: {},
} as ComponentMeta<typeof UnitBoard>;

const Template: ComponentStory<typeof UnitBoard> = function Template(args) {
  const [currentArgs, updateArgs] = useArgs();
  const handleUnitClick = (colIdx: number, rowIdx: number) => {
    let newUnitBlock: UnitBlockValueObject = currentArgs.unitBlock;
    newUnitBlock = newUnitBlock.setUnitAlive(colIdx, rowIdx, true);
    updateArgs({
      uniMap: newUnitBlock,
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
  unitBlock: createUnitBlock([
    [createUnit(true), createUnit(true), createUnit(true)],
    [createUnit(true), createUnit(false), createUnit(true)],
    [createUnit(true), createUnit(true), createUnit(true)],
  ]),
  unitSize: 40,
};
