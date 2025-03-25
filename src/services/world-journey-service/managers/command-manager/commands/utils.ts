import { PositionVo } from '@/models/world/common/position-vo';
import { PlayerManager } from '../../player-manager';
import { UnitManager } from '../../unit-manager';

export function isPositionsOccupied(positions: PositionVo[], unitManager: UnitManager, playerManager: PlayerManager): boolean {
  return positions.some((position) => {
    const unitAtPos = unitManager.getUnitByPos(position);
    if (unitAtPos) return true;

    const playersAtPos = playerManager.getPlayersAtPos(position);
    if (playersAtPos) return true;

    return false;
  });
}
