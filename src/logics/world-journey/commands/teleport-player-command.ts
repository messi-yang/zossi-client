import { v4 as uuidv4 } from 'uuid';
import { PositionModel } from '@/models/world/position-model';
import { Command, Options } from '../command';
import { DateModel } from '@/models/general/date-model';
import { DirectionModel } from '@/models/world/direction-model';

export class TeleportPlayerCommand implements Command {
  private id: string;

  private timestamp: number;

  private playerId: string;

  private position: PositionModel;

  private direction: DirectionModel;

  constructor(id: string, timestamp: number, playerId: string, position: PositionModel, direction: DirectionModel) {
    this.id = id;
    this.timestamp = timestamp;
    this.playerId = playerId;
    this.position = position;
    this.direction = direction;
  }

  static new(playerId: string, position: PositionModel, direction: DirectionModel) {
    return new TeleportPlayerCommand(uuidv4(), DateModel.now().getTimestampe(), playerId, position, direction);
  }

  static load(id: string, timestamp: number, playerId: string, position: PositionModel, direction: DirectionModel) {
    return new TeleportPlayerCommand(id, timestamp, playerId, position, direction);
  }

  public execute({ playerStorage }: Options) {
    const player = playerStorage.getPlayer(this.playerId);
    if (!player) return false;

    const clonedPlayer = player.clone();
    clonedPlayer.changePosition(this.position);
    clonedPlayer.changeDirection(this.direction);

    playerStorage.updatePlayer(clonedPlayer);

    return true;
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

  public getPosition() {
    return this.position;
  }

  public getDirection() {
    return this.direction;
  }
}
