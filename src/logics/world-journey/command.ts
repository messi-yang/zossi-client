import { ItemStorage } from './item-storage';
import { PlayerStorage } from './player-storage';
import { UnitStorage } from './unit-storage';
import { Perspective } from './perspective';

export type Options = {
  playerStorage: PlayerStorage;
  unitStorage: UnitStorage;
  itemStorage: ItemStorage;
  perspective: Perspective;
};

export interface Command {
  // The return value indicates if the command is executed or nothing happened
  execute(options: Options): boolean;
}
