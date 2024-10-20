import { Command } from '../command';
import { DateVo } from '@/models/global/date-vo';
import { CommandParams } from '../command-params';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { generateUuidV4 } from '@/utils/uuid';
import { CommandNameEnum } from '../command-name-enum';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';

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

  public execute({ unitManager, playerManager }: CommandParams): void {
    const portalUnit = unitManager.getUnit(this.unitId);
    if (!portalUnit || !(portalUnit instanceof PortalUnitModel)) return;

    const currentPlayer = playerManager.getPlayer(this.playerId);
    if (!currentPlayer) return;

    const clonedPlayer = currentPlayer.clone();
    clonedPlayer.updateAction(PlayerActionVo.newTeleport(clonedPlayer.getDirection()));
    clonedPlayer.freeze();

    const isPlayerUpdated = playerManager.updatePlayer(clonedPlayer);

    this.setUndoAction(() => {
      if (isPlayerUpdated) {
        playerManager.updatePlayer(currentPlayer);
      }
    });
  }

  public getPlayerId() {
    return this.playerId;
  }

  public getUnitId() {
    return this.unitId;
  }
}
