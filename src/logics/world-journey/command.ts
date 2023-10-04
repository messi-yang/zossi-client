import { ItemStorage } from './item-storage';
import { PlayerStorage } from './player-storage';
import { UnitStorage } from './unit-storage';
import { Perspective } from './perspective';
import { WorldModel } from '@/models/world/world-model';

export type Options = {
  world: WorldModel;
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
