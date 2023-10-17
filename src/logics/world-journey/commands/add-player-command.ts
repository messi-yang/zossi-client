import { v4 as uuidv4 } from 'uuid';
import { Command } from './command';
import { CommandParams } from './command-params';
import { PlayerModel } from '@/models/world/player/player-model';
import { DateModel } from '@/models/general/date-model';

export class AddPlayerCommand implements Command {
  private id: string;

  private timestamp: number;

  private player: PlayerModel;

  constructor(id: string, timestamp: number, player: PlayerModel) {
    this.id = id;
    this.timestamp = timestamp;
    this.player = player;
  }

  static new(player: PlayerModel) {
    return new AddPlayerCommand(uuidv4(), DateModel.now().getTimestamp(), player);
  }

  static load(id: string, timestamp: number, player: PlayerModel) {
    return new AddPlayerCommand(id, timestamp, player);
  }

  public execute({ playerStorage, itemStorage }: CommandParams): void {
    playerStorage.addPlayer(this.player);

    const playerHeldItemId = this.player.getHeldItemId();
    if (playerHeldItemId) {
      itemStorage.addPlaceholderItemId(playerHeldItemId);
    }
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getPlayer() {
    return this.player;
  }
}
