import { BoundModel } from '@/models/world/bound-model';
import { PlayerModel } from '../models/world/player-model';
import { UnitModel } from '../models/world/unit-model';
import { WorldModel } from '../models/world/world-model';

type CameraDistanceChangeSubsriber = (newCameraDistance: number) => void;

export class WorldJourneyManager {
  private cameraDistance: number;

  private cameraDistanceChangeSubsribers: CameraDistanceChangeSubsriber[] = [];

  private world: WorldModel;

  private otherPlayers: PlayerModel[];

  private myPlayer: PlayerModel;

  private units: UnitModel[];

  private unitMapByItemId: Record<string, UnitModel[]>;

  constructor(world: WorldModel, otherPlayers: PlayerModel[], myPlayer: PlayerModel, units: UnitModel[]) {
    this.cameraDistance = 30;
    this.world = world;
    this.otherPlayers = otherPlayers;
    this.myPlayer = myPlayer;
    this.units = units;
    this.unitMapByItemId = {};
  }

  static new(world: WorldModel, otherPlayers: PlayerModel[], myPlayer: PlayerModel, units: UnitModel[]) {
    return new WorldJourneyManager(world, otherPlayers, myPlayer, units);
  }

  public getCameraDistance() {
    return this.cameraDistance;
  }

  public addChangeCameraDistance() {
    if (this.cameraDistance <= 10) return;
    this.cameraDistance -= 10;
    this.cameraDistanceChangeSubsribers.forEach((sub) => {
      sub(this.cameraDistance);
    });
  }

  public subtractChangeCameraDistance() {
    if (this.cameraDistance >= 200) return;
    this.cameraDistance += 10;
    this.cameraDistanceChangeSubsribers.forEach((sub) => {
      sub(this.cameraDistance);
    });
  }

  public subscribeCameraDistanceChange(subscriber: CameraDistanceChangeSubsriber): () => void {
    this.cameraDistanceChangeSubsribers.push(subscriber);

    return () => {
      this.cameraDistanceChangeSubsribers = this.cameraDistanceChangeSubsribers.filter((sub) => sub !== subscriber);
    };
  }

  public getWorld(): WorldModel {
    return this.world;
  }

  public getWorldBound(): BoundModel {
    return this.world.getBound();
  }

  public getOtherPlayers() {
    return this.otherPlayers;
  }

  public getMyPlayer() {
    return this.myPlayer;
  }

  public getUnits() {
    return this.units;
  }
}
