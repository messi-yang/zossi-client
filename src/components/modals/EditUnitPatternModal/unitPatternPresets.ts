import { UnitPatternVo } from '@/valueObjects';

type UnitPatternPreset = {
  title: string;
  pattern: UnitPatternVo;
};

const unitPatternPresets: UnitPatternPreset[] = [
  {
    title: 'Block',
    pattern: [
      [null, null, null, null],
      [null, true, true, null],
      [null, true, true, null],
      [null, null, null, null],
    ],
  },
  {
    title: 'Bee Hive',
    pattern: [
      [null, null, null, null, null],
      [null, null, true, null, null],
      [null, true, null, true, null],
      [null, true, null, true, null],
      [null, null, true, null, null],
      [null, null, null, null, null],
    ],
  },
  {
    title: 'Loaf',
    pattern: [
      [null, null, null, null, null, null],
      [null, null, true, null, null, null],
      [null, true, null, true, null, null],
      [null, true, null, null, true, null],
      [null, null, true, true, null, null],
      [null, null, null, null, null, null],
    ],
  },
  {
    title: 'Boat',
    pattern: [
      [null, null, null, null, null],
      [null, true, true, null, null],
      [null, true, null, true, null],
      [null, null, true, null, null],
      [null, null, null, null, null],
    ],
  },
  {
    title: 'Tub',
    pattern: [
      [null, null, null, null, null],
      [null, null, true, null, null],
      [null, true, null, true, null],
      [null, null, true, null, null],
      [null, null, null, null, null],
    ],
  },
  {
    title: 'Blinker1',
    pattern: [
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, true, true, true, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
    ],
  },
  {
    title: 'Blinker2',
    pattern: [
      [null, null, null, null, null],
      [null, null, true, null, null],
      [null, null, true, null, null],
      [null, null, true, null, null],
      [null, null, null, null, null],
    ],
  },
  {
    title: 'Toad',
    pattern: [
      [null, null, null, null, null, null],
      [null, null, true, true, null, null],
      [null, null, null, null, true, null],
      [null, true, null, null, null, null],
      [null, null, true, true, null, null],
      [null, null, null, null, null, null],
    ],
  },
  {
    title: 'Beacon',
    pattern: [
      [null, null, null, null, null, null],
      [null, true, true, null, null, null],
      [null, true, null, null, null, null],
      [null, null, null, null, true, null],
      [null, null, null, true, true, null],
      [null, null, null, null, null, null],
    ],
  },
  {
    title: 'Glider',
    pattern: [
      [null, null, null, null, null],
      [null, true, null, null, null],
      [null, null, true, true, null],
      [null, true, true, null, null],
      [null, null, null, null, null],
    ],
  },
  {
    title: 'Untitled',
    pattern: [
      [null, null, null, null, null, null],
      [null, null, true, null, null, null],
      [null, true, null, true, null, null],
      [null, null, true, null, true, null],
      [null, null, null, true, null, null],
      [null, null, null, null, null, null],
    ],
  },
  {
    title: 'Untitled',
    pattern: [
      [null, null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, true, null, null, null, null, null],
      [null, null, null, null, true, null, true, null, null, null, null],
      [null, null, null, null, true, null, true, null, null, null, null],
      [null, null, true, true, null, null, null, true, true, null, null],
      [null, true, null, null, null, null, null, null, null, true, null],
      [null, null, true, true, null, null, null, true, true, null, null],
      [null, null, null, null, true, null, true, null, null, null, null],
      [null, null, null, null, true, null, true, null, null, null, null],
      [null, null, null, null, null, true, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null, null],
    ],
  },
];

export default unitPatternPresets;
