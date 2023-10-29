import { v4 as uuidv4 } from 'uuid';
import { PositionVo } from '@/models/world/common/position-vo';
import { Command } from './command';
import { CommandParams } from './command-params';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { DateVo } from '@/models/general/date-vo';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';

export class MakePlayerWalkCommand implements Command {
  private id: string;

  private timestamp: number;

  private playerId: string;

  private position: PositionVo;

  private direction: DirectionVo;

  constructor(id: string, timestamp: number, playerId: string, position: PositionVo, direction: DirectionVo) {
    this.id = id;
    this.timestamp = timestamp;
    this.playerId = playerId;
    this.position = position;
    this.direction = direction;
  }

  static new(playerId: string, position: PositionVo, direction: DirectionVo) {
    return new MakePlayerWalkCommand(uuidv4(), DateVo.now().getTimestamp(), playerId, position, direction);
  }

  static load(id: string, timestamp: number, playerId: string, position: PositionVo, direction: DirectionVo) {
    return new MakePlayerWalkCommand(id, timestamp, playerId, position, direction);
  }

  public execute({ playerStorage }: CommandParams): void {
    const player = playerStorage.getPlayer(this.playerId);
    if (!player) return;

    const clonedPlayer = player.clone();
    clonedPlayer.changePosition(this.position);
    clonedPlayer.changeDirection(this.direction);
    clonedPlayer.updateAction(PlayerActionVo.newWalk());
    clonedPlayer.changeActionPosition(this.position);
    clonedPlayer.updateActedAt(DateVo.fromTimestamp(this.timestamp));
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
