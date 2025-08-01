import { Command } from '../command';
import { DateVo } from '@/models/global/date-vo';
import { CommandParams } from '../command-params';
import { generateUuidV4 } from '@/utils/uuid';
import { CommandNameEnum } from '../command-name-enum';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';

export class SendPlayerIntoPortalCommand extends Command {
  constructor(id: string, createdAt: DateVo, isRemote: boolean, private playerId: string, private unitId: string) {
    super(CommandNameEnum.SendPlayerIntoPortal, id, createdAt, isRemote);
  }

  static create(playerId: string, unitId: string) {
    return new SendPlayerIntoPortalCommand(generateUuidV4(), DateVo.now(), false, playerId, unitId);
  }

  static createRemote(id: string, createdAt: DateVo, playerId: string, unitId: string) {
    return new SendPlayerIntoPortalCommand(id, createdAt, true, playerId, unitId);
  }

  public getIsClientOnly = () => true;

  public getRequiredItemId = () => null;

  public execute({ unitManager, playerManager }: CommandParams): boolean {
    const portalUnit = unitManager.getUnit(this.unitId);
    if (!portalUnit || portalUnit.getType() !== UnitTypeEnum.Portal) return false;

    const currentPlayer = playerManager.getPlayer(this.playerId);
    if (!currentPlayer) return false;

    const clonedPlayer = currentPlayer.clone();
    clonedPlayer.updateAction(PlayerActionVo.newTeleport(clonedPlayer.getDirection()));
    clonedPlayer.freeze();

    const isPlayerUpdated = playerManager.updatePlayer(clonedPlayer);
    if (!isPlayerUpdated) return false;

    this.setUndoAction(() => {
      playerManager.updatePlayer(currentPlayer);
    });

    return true;
  }

  public getPlayerId() {
    return this.playerId;
  }

  public getUnitId() {
    return this.unitId;
  }
}
