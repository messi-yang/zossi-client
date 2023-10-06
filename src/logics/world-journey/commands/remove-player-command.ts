import { v4 as uuidv4 } from 'uuid';
import { Command, Options } from '../command';
import { DateModel } from '@/models/general/date-model';

export class RemovePlayerCommand implements Command {
  private id: string;

  private timestamp: number;

  private playerId: string;

  constructor(id: string, timestamp: number, playerId: string) {
    this.id = id;
    this.timestamp = timestamp;
    this.playerId = playerId;
  }

  static new(playerId: string) {
    return new RemovePlayerCommand(uuidv4(), DateModel.now().getTimestampe(), playerId);
  }

  static load(id: string, timestamp: number, playerId: string) {
    return new RemovePlayerCommand(id, timestamp, playerId);
  }

  public execute({ playerStorage }: Options) {
    return playerStorage.removePlayer(this.playerId);
  }

  public getId() {
    return this.id;
  }

  public getTimestampe() {
    return this.timestamp;
  }

  public getPlayerId() {
    return this.playerId;
  }
}
