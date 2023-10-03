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
  /**
   * Execute the command
   * @param options
   *
   * @returns {boolean} Indicating the success of the command, if false is returned, it means no states were changed.
   */
  execute(options: Options): boolean;
}
