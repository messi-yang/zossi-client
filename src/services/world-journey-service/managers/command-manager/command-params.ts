import { WorldModel } from '@/models/world/world/world-model';
import { PlayerManager } from '../player-manager';
import { UnitManager } from '../unit-manager';
import { ItemManager } from '../item-manager';
import { PerspectiveManager } from '../perspective-manager';

export type CommandParams = {
  world: WorldModel;
  playerManager: PlayerManager;
  unitManager: UnitManager;
  itemManager: ItemManager;
  perspectiveManager: PerspectiveManager;
};
