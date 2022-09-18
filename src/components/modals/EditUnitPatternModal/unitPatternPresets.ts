import { UnitPatternVO } from '@/valueObjects';

type UnitPatternPreset = {
  title: string;
  pattern: UnitPatternVO;
};

const unitPatternPresets: UnitPatternPreset[] = [
  {
    title: 'Block',
    pattern: new UnitPatternVO([
      [false, false, false, false],
      [false, true, true, false],
      [false, true, true, false],
      [false, false, false, false],
    ]),
  },
  {
    title: 'Bee Hive',
    pattern: new UnitPatternVO([
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
    pattern: new UnitPatternVO([
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
    pattern: new UnitPatternVO([
      [false, false, false, false, false],
      [false, true, true, false, false],
      [false, true, false, true, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Tub',
    pattern: new UnitPatternVO([
      [false, false, false, false, false],
      [false, false, true, false, false],
      [false, true, false, true, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Blinker1',
    pattern: new UnitPatternVO([
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, true, true, true, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Blinker2',
    pattern: new UnitPatternVO([
      [false, false, false, false, false],
      [false, false, true, false, false],
      [false, false, true, false, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Toad',
    pattern: new UnitPatternVO([
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
    pattern: new UnitPatternVO([
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
    pattern: new UnitPatternVO([
      [false, false, false, false, false],
      [false, true, false, false, false],
      [false, false, true, true, false],
      [false, true, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Untitled',
    pattern: new UnitPatternVO([
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
    pattern: new UnitPatternVO([
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
