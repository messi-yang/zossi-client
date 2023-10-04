import { PositionModel } from '@/models/world/position-model';
import { Command, Options } from '../command';
import { DirectionModel } from '@/models/world/direction-model';

export class MovePlayerCommand implements Command {
  constructor(private playerId: string, private position: PositionModel, private direction: DirectionModel) {}

  static new(playerId: string, position: PositionModel, direction: DirectionModel) {
    return new MovePlayerCommand(playerId, position, direction);
  }

  public execute({ world, playerStorage, unitStorage, itemStorage }: Options) {
    const player = playerStorage.getPlayer(this.playerId);
    if (!player) return false;

    const clonedPlayer = player.clone();
    clonedPlayer.changePosition(this.position);

    const playerIsMovingFoward = clonedPlayer.getDirection().isEqual(this.direction);
    if (!playerIsMovingFoward) {
      clonedPlayer.changeDirection(this.direction);
      playerStorage.updatePlayer(clonedPlayer);
      return true;
    }

    const nextPosition = clonedPlayer.getPositionOneStepFoward();
    if (!world.getBound().doesContainPosition(nextPosition)) {
      return false;
    }

    const unitAtNextPosition = unitStorage.getUnit(nextPosition);
    if (unitAtNextPosition) {
      const item = itemStorage.getItem(unitAtNextPosition.getItemId());
      if (!item) return false;
      if (!item.getTraversable()) return false;
    }

    clonedPlayer.changePosition(nextPosition);
    clonedPlayer.changeDirection(this.direction);
    playerStorage.updatePlayer(clonedPlayer);

    return true;
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
