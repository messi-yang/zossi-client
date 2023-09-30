import { Command, Options } from '../command';

export class RemovePlayerCommand implements Command {
  constructor(private playerId: string) {}

  static new(playerId: string) {
    return new RemovePlayerCommand(playerId);
  }

  public execute({ playerStorage }: Options) {
    return playerStorage.removePlayer(this.playerId);
  }

  public getPlayerId() {
    return this.playerId;
  }
}
