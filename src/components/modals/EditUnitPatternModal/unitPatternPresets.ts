import { UnitPatternValueObject } from '@/valueObjects';

type UnitPatternPreset = {
  title: string;
  pattern: UnitPatternValueObject;
};

const unitPatternPresets: UnitPatternPreset[] = [
  {
    title: 'Block',
    pattern: new UnitPatternValueObject([
      [false, false, false, false],
      [false, true, true, false],
      [false, true, true, false],
      [false, false, false, false],
    ]),
  },
  {
    title: 'Bee Hive',
    pattern: new UnitPatternValueObject([
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
    pattern: new UnitPatternValueObject([
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
    pattern: new UnitPatternValueObject([
      [false, false, false, false, false],
      [false, true, true, false, false],
      [false, true, false, true, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Tub',
    pattern: new UnitPatternValueObject([
      [false, false, false, false, false],
      [false, false, true, false, false],
      [false, true, false, true, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Blinker1',
    pattern: new UnitPatternValueObject([
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, true, true, true, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Blinker2',
    pattern: new UnitPatternValueObject([
      [false, false, false, false, false],
      [false, false, true, false, false],
      [false, false, true, false, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Toad',
    pattern: new UnitPatternValueObject([
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
    pattern: new UnitPatternValueObject([
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
    pattern: new UnitPatternValueObject([
      [false, false, false, false, false],
      [false, true, false, false, false],
      [false, false, true, true, false],
      [false, true, true, false, false],
      [false, false, false, false, false],
    ]),
  },
  {
    title: 'Untitled',
    pattern: new UnitPatternValueObject([
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
    pattern: new UnitPatternValueObject([
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
