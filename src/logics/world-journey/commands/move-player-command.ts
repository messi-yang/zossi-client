import { v4 as uuidv4 } from 'uuid';
import { PositionModel } from '@/models/world/common/position-model';
import { Command } from './command';
import { CommandParams } from './command-params';
import { DirectionModel } from '@/models/world/common/direction-model';
import { DateModel } from '@/models/general/date-model';

export class MovePlayerCommand implements Command {
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
    return new MovePlayerCommand(uuidv4(), DateModel.now().getTimestamp(), playerId, position, direction);
  }

  static load(id: string, timestamp: number, playerId: string, position: PositionModel, direction: DirectionModel) {
    return new MovePlayerCommand(id, timestamp, playerId, position, direction);
  }

  public execute({ world, playerStorage, unitStorage, itemStorage }: CommandParams): void {
    const player = playerStorage.getPlayer(this.playerId);
    if (!player) return;

    const clonedPlayer = player.clone();
    clonedPlayer.changePosition(this.position);

    const playerIsMovingFoward = clonedPlayer.getDirection().isEqual(this.direction);
    if (!playerIsMovingFoward) {
      clonedPlayer.changeDirection(this.direction);
      playerStorage.updatePlayer(clonedPlayer);
      return;
    }

    const nextPosition = clonedPlayer.getFowardPos();
    if (!world.getBound().doesContainPosition(nextPosition)) {
      return;
    }

    const unitAtNextPosition = unitStorage.getUnit(nextPosition);
    if (unitAtNextPosition) {
      const item = itemStorage.getItem(unitAtNextPosition.getItemId());
      if (!item) return;
      if (!item.getTraversable()) return;
    }

    clonedPlayer.changePosition(nextPosition);
    clonedPlayer.changeDirection(this.direction);
    playerStorage.updatePlayer(clonedPlayer);
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

  public getDirection() {
    return this.direction;
  }
}
