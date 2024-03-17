import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { PlayerModel } from '@/models/world/player/player-model';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class AddPlayerCommand extends BaseCommand {
  private player: PlayerModel;

  constructor(id: string, timestamp: number, player: PlayerModel) {
    super(id, timestamp);
    this.player = player;
  }

  static new(player: PlayerModel) {
    return new AddPlayerCommand(generateUuidV4(), DateVo.now().getTimestamp(), player);
  }

  static load(id: string, timestamp: number, player: PlayerModel) {
    return new AddPlayerCommand(id, timestamp, player);
  }

  public execute({ playerManager, itemManager }: CommandParams): void {
    playerManager.addPlayer(this.player);

    const playerHeldItemId = this.player.getHeldItemId();
    if (playerHeldItemId) {
      itemManager.addPlaceholderItemId(playerHeldItemId);
    }
  }

  public getPlayer() {
    return this.player;
  }
}
