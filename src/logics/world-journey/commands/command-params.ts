import { WorldModel } from '@/models/world/world-model';
import { PlayerStorage } from '../player-storage';
import { UnitStorage } from '../unit-storage';
import { ItemStorage } from '../item-storage';
import { Perspective } from '../perspective';

export type CommandParams = {
  world: WorldModel;
  playerStorage: PlayerStorage;
  unitStorage: UnitStorage;
  itemStorage: ItemStorage;
  perspective: Perspective;
};
