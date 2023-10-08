import { v4 as uuidv4 } from 'uuid';
import { PositionModel } from '@/models/world/position-model';
import { Command } from './command';
import { DateModel } from '@/models/general/date-model';

export class SendPlayerIntoPortalCommand implements Command {
  private id: string;

  private timestamp: number;

  private playerId: string;

  private position: PositionModel;

  constructor(id: string, timestamp: number, playerId: string, position: PositionModel) {
    this.id = id;
    this.timestamp = timestamp;
    this.playerId = playerId;
    this.position = position;
  }

  static new(playerId: string, position: PositionModel) {
    return new SendPlayerIntoPortalCommand(uuidv4(), DateModel.now().getTimestamp(), playerId, position);
  }

  static load(id: string, timestamp: number, playerId: string, position: PositionModel) {
    return new SendPlayerIntoPortalCommand(id, timestamp, playerId, position);
  }

  public execute() {
    return true;
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getPlayerId() {
    return this.playerId;
  }

  public getPosition() {
    return this.position;
  }
}
