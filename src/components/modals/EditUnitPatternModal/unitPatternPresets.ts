import { UnitPatternVo } from '@/models/valueObjects';
import { createUnitPattern } from '@/models/valueObjects/factories';

type UnitPatternPreset = {
  title: string;
  pattern: UnitPatternVo;
};

const unitPatternPresets: UnitPatternPreset[] = [
  {
    title: 'Block',
    pattern: createUnitPattern([
      [false, false, false, false],
      [false, true, true, false],
      [false, true, true, false],
      [false, false, false, false],
    ]),
  },
  {
    title: 'Bee Hive',
    pattern: createUnitPattern([
      [false, false, false, false, false],
      [false, false, true, false, false],
      [false, true, false, true, false],
      [false, true, false, true, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Loaf',
    pattern: createUnitPattern([
      [false, false, false, false, false, false],
      [false, false, true, false, false, false],
      [false, true, false, true, false, false],
      [false, true, false, false, true, false],
      [false, false, true, true, false, false],
      [false, false, false, false, false, false],
    ]),
  },
  {
    title: 'Boat',
    pattern: createUnitPattern([
      [false, false, false, false, false],
      [false, true, true, false, false],
      [false, true, false, true, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Tub',
    pattern: createUnitPattern([
      [false, false, false, false, false],
      [false, false, true, false, false],
      [false, true, false, true, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Blinker',
    pattern: createUnitPattern([
      [false, false, false, false, false],
      [false, true, true, true, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Toad',
    pattern: createUnitPattern([
      [false, false, false, false, false, false],
      [false, false, true, true, false, false],
      [false, false, false, false, true, false],
      [false, true, false, false, false, false],
      [false, false, true, true, false, false],
      [false, false, false, false, false, false],
    ]),
  },
  {
    title: 'Beacon',
    pattern: createUnitPattern([
      [false, false, false, false, false, false],
      [false, true, true, false, false, false],
      [false, true, false, false, false, false],
      [false, false, false, false, true, false],
      [false, false, false, true, true, false],
      [false, false, false, false, false, false],
    ]),
  },
  {
    title: 'Glider',
    pattern: createUnitPattern([
      [false, false, false, false, false],
      [false, true, false, false, false],
      [false, false, true, true, false],
      [false, true, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Untitled1',
    pattern: createUnitPattern([
      [false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, true, false, false, false, false, false],
      [false, false, false, false, true, false, true, false, false, false, false],
      [false, false, false, false, true, false, true, false, false, false, false],
      [false, false, true, true, false, false, false, true, true, false, false],
      [false, true, false, false, false, false, false, false, false, true, false],
      [false, false, true, true, false, false, false, true, true, false, false],
      [false, false, false, false, true, false, true, false, false, false, false],
      [false, false, false, false, true, false, true, false, false, false, false],
      [false, false, false, false, false, true, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false],
    ]),
  },
  {
    title: 'Untitled2',
    pattern: createUnitPattern([
      [false, false, false, false, false, false, false],
      [false, true, false, false, false, true, false],
      [false, false, true, false, false, true, false],
      [false, true, false, false, false, true, false],
      [false, false, true, false, false, true, false],
      [false, true, false, false, false, true, false],
      [false, false, false, false, false, false, false],
    ]),
  },
];

export default unitPatternPresets;
