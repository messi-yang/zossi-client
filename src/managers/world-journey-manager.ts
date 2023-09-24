import { uniq } from 'lodash';
import { BoundModel } from '@/models/world/bound-model';
import { ItemModel } from '@/models/world/item-model';
import { PlayerModel } from '../models/world/player-model';
import { UnitModel } from '../models/world/unit-model';
import { WorldModel } from '../models/world/world-model';

type CameraDistanceChangeSubsriber = (newCameraDistance: number) => void;

export class WorldJourneyManager {
  private cameraDistance: number;

  private cameraDistanceChangeSubsribers: CameraDistanceChangeSubsriber[] = [];

  private world: WorldModel;

  private players: PlayerModel[];

  private myPlayerId: string;

  private playerMap: Record<string, PlayerModel> = {};

  private units: UnitModel[];

  private unitMapByItemId: Record<string, UnitModel[]>;

  private appearingItemIds: string[];

  private appearingItemMap: Record<string, ItemModel | undefined> = {};

  constructor(world: WorldModel, players: PlayerModel[], myPlayerId: string, units: UnitModel[]) {
    this.cameraDistance = 30;
    this.world = world;
    this.units = units;
    this.unitMapByItemId = {};

    this.players = players;
    this.myPlayerId = myPlayerId;

    this.playerMap = this.players.reduce(
      (prev, p) => ({
        ...prev,
        [p.getId()]: p,
      }),
      {}
    );

    // Collect all appearing item ids
    this.appearingItemIds = [];
    this.units
      .map((unit) => unit.getItemId())
      .forEach((itemId) => {
        this.appearingItemIds.push(itemId);
      });
    this.players.forEach((player) => {
      const playerHeldItemId = player.getHeldItemId();
      if (playerHeldItemId) {
        this.appearingItemIds.push(playerHeldItemId);
      }
    });
    this.appearingItemIds = uniq(this.appearingItemIds);
  }

  static new(world: WorldModel, players: PlayerModel[], myPlayerId: string, units: UnitModel[]) {
    return new WorldJourneyManager(world, players, myPlayerId, units);
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
    return this.players;
  }

  public getMyPlayer() {
    return this.playerMap[this.myPlayerId];
  }

  public updatePlayer(player: PlayerModel) {
    const otherPlayerIndex = this.players.findIndex((p) => p.getId() === player.getId());
    this.players[otherPlayerIndex] = player;

    this.playerMap[player.getId()] = player;
  }

  public getMyPlayerHeldItem(): ItemModel | null {
    const heldItemId = this.getMyPlayer().getHeldItemId();
    if (!heldItemId) return null;
    return this.appearingItemMap[heldItemId] || null;
  }

  public getUnits() {
    return this.units;
  }

  public getAppearingItemIds(): string[] {
    return this.appearingItemIds;
  }

  public getAppearingItem(itemId: string): ItemModel | null {
    return this.appearingItemMap[itemId] || null;
  }

  public addAppearingItem(item: ItemModel) {
    this.appearingItemMap[item.getId()] = item;
  }
}
