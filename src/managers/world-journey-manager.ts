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

  private otherPlayers: PlayerModel[];

  private myPlayer: PlayerModel;

  private playerMap: Record<string, PlayerModel> = {};

  private units: UnitModel[];

  private unitMapByItemId: Record<string, UnitModel[]>;

  private appearingItemIds: string[];

  private appearingItemMap: Record<string, ItemModel | undefined> = {};

  constructor(world: WorldModel, otherPlayers: PlayerModel[], myPlayer: PlayerModel, units: UnitModel[]) {
    this.cameraDistance = 30;
    this.world = world;
    this.units = units;
    this.unitMapByItemId = {};

    this.otherPlayers = otherPlayers;
    this.myPlayer = myPlayer;

    const players = [this.myPlayer, ...otherPlayers];
    this.playerMap = players.reduce(
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
    const playerHeldItem = this.myPlayer.getHeldItemId();
    if (playerHeldItem) {
      this.appearingItemIds.push(playerHeldItem);
    }
    this.otherPlayers.forEach((otherPlayer) => {
      const otherPlayerHeldItemId = otherPlayer.getHeldItemId();
      if (otherPlayerHeldItemId) {
        this.appearingItemIds.push(otherPlayerHeldItemId);
      }
    });
    this.appearingItemIds = uniq(this.appearingItemIds);
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

  public updatePlayer(player: PlayerModel) {
    if (player.getId() === this.myPlayer.getId()) {
      this.myPlayer = player;
    } else {
      const otherPlayerIndex = this.otherPlayers.findIndex((p) => p.getId() === player.getId());
      this.otherPlayers[otherPlayerIndex] = player;
    }

    this.playerMap[player.getId()] = player;
  }

  public getMyPlayerHeldItem(): ItemModel | null {
    const heldItemId = this.myPlayer.getHeldItemId();
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
