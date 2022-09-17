import { UnitPatternVo } from '@/valueObjects';

type UnitPatternPreset = {
  title: string;
  pattern: UnitPatternVo;
};

const unitPatternPresets: UnitPatternPreset[] = [
  {
    title: 'Block',
    pattern: new UnitPatternVo([
      [false, false, false, false],
      [false, true, true, false],
      [false, true, true, false],
      [false, false, false, false],
    ]),
  },
  {
    title: 'Bee Hive',
    pattern: new UnitPatternVo([
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
    pattern: new UnitPatternVo([
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
    pattern: new UnitPatternVo([
      [false, false, false, false, false],
      [false, true, true, false, false],
      [false, true, false, true, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Tub',
    pattern: new UnitPatternVo([
      [false, false, false, false, false],
      [false, false, true, false, false],
      [false, true, false, true, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Blinker1',
    pattern: new UnitPatternVo([
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, true, true, true, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Blinker2',
    pattern: new UnitPatternVo([
      [false, false, false, false, false],
      [false, false, true, false, false],
      [false, false, true, false, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Toad',
    pattern: new UnitPatternVo([
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
    pattern: new UnitPatternVo([
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
    pattern: new UnitPatternVo([
      [false, false, false, false, false],
      [false, true, false, false, false],
      [false, false, true, true, false],
      [false, true, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Untitled',
    pattern: new UnitPatternVo([
      [false, false, false, false, false, false],
      [false, false, true, false, false, false],
      [false, true, false, true, false, false],
      [false, false, true, false, true, false],
      [false, false, false, true, false, false],
      [false, false, false, false, false, false],
    ]),
  },
  {
    title: 'Untitled',
    pattern: new UnitPatternVo([
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
];

export default unitPatternPresets;
