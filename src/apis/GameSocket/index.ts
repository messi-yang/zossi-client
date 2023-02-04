import { ungzipBlob, gzipBlob } from '@/libs/compression';
import { mapMatrix } from '@/libs/common';
import type { UnitDto, PlayerDto } from '@/dtos';
import { BoundVo, UnitVo, MapVo, LocationVo, SizeVo, ViewVo, DirectionVo } from '@/models/valueObjects';
import { PlayerEntity } from '@/models/entities';
import { EventTypeEnum, GameJoinedEvent, PlayersUpdatedEvent, ViewUpdatedEvent, ItemsUpdatedEvent } from './eventTypes';
import type { Event } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type { PingAction, MoveAction, BuildItemAction, DestroyItemAction } from './actionTypes';
import { ItemAgg } from '@/models/aggregates';

function convertUnitDtoMatrixToMapVo(unitDtoMatrix: UnitDto[][]): MapVo {
  const unitMatrix = mapMatrix(unitDtoMatrix, (uint) => UnitVo.new(uint.itemId));
  return MapVo.new(unitMatrix);
}

function convertPlayerDtoPlayerEntity(playerDto: PlayerDto): PlayerEntity {
  return PlayerEntity.new({
    id: playerDto.id,
    name: playerDto.name,
    location: LocationVo.new(playerDto.location.x, playerDto.location.y),
  });
}

function parseGameJoinedEvent(event: GameJoinedEvent): [PlayerEntity, PlayerEntity[], SizeVo, ViewVo] {
  const mapSize = SizeVo.new(event.payload.mapSize.width, event.payload.mapSize.height);
  const bound = BoundVo.new(
    LocationVo.new(event.payload.view.bound.from.x, event.payload.view.bound.from.y),
    LocationVo.new(event.payload.view.bound.to.x, event.payload.view.bound.to.y)
  );
  const map = convertUnitDtoMatrixToMapVo(event.payload.view.map);
  const view = ViewVo.new(bound, map);
  const myPlayer = convertPlayerDtoPlayerEntity(event.payload.myPlayer);
  const otherPlayers = event.payload.otherPlayers.map(convertPlayerDtoPlayerEntity);
  return [myPlayer, otherPlayers, mapSize, view];
}

function parsePlayersUpdatedEvent(event: PlayersUpdatedEvent): [PlayerEntity, PlayerEntity[]] {
  const myPlayer = convertPlayerDtoPlayerEntity(event.payload.myPlayer);
  const otherPlayers = event.payload.otherPlayers.map(convertPlayerDtoPlayerEntity);
  return [myPlayer, otherPlayers];
}

function parseViewUpdatedEvent(event: ViewUpdatedEvent): [ViewVo] {
  const bound = BoundVo.new(
    LocationVo.new(event.payload.view.bound.from.x, event.payload.view.bound.from.y),
    LocationVo.new(event.payload.view.bound.to.x, event.payload.view.bound.to.y)
  );
  const map = convertUnitDtoMatrixToMapVo(event.payload.view.map);
  const view = ViewVo.new(bound, map);
  return [view];
}

function parseItemsUpdatedEvent(event: ItemsUpdatedEvent): [ItemAgg[]] {
  return [
    event.payload.items.map(({ id, name, traversable, assetSrc }) => ItemAgg.new({ id, name, traversable, assetSrc })),
  ];
}

export default class GameSocket {
  private socket: WebSocket;

  private disconnectedByClient: boolean = false;

  constructor(params: {
    onGameJoined: (myPlayer: PlayerEntity, otherPlayers: PlayerEntity[], mapSize: SizeVo, view: ViewVo) => void;
    onPlayersUpdated: (myPlayer: PlayerEntity, otherPlayers: PlayerEntity[]) => void;
    onViewUpdated: (view: ViewVo) => void;
    onItemsUpdated: (items: ItemAgg[]) => void;
    onClose: (disconnectedByClient: boolean) => void;
    onOpen: () => void;
  }) {
    const schema = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
    const socketUrl = `${schema}://${process.env.API_DOMAIN}/ws/game/`;
    const socket = new WebSocket(socketUrl);

    let pingServerInterval: NodeJS.Timer | null = null;

    socket.onmessage = async ({ data }: any) => {
      const decompressedBlob = await ungzipBlob(data as Blob);
      const eventJsonString = await decompressedBlob.text();
      const newMsg: Event = JSON.parse(eventJsonString);

      console.log(newMsg);
      if (newMsg.type === EventTypeEnum.GameJoined) {
        const [myPlayer, otherPlayers, mapSize, view] = parseGameJoinedEvent(newMsg);
        await Promise.all([myPlayer, ...otherPlayers].map((player) => player.loadAsset()));
        params.onGameJoined(myPlayer, otherPlayers, mapSize, view);
      } else if (newMsg.type === EventTypeEnum.PlayersUpdated) {
        const [myPlayer, otherPlayers] = parsePlayersUpdatedEvent(newMsg);
        await Promise.all([myPlayer, ...otherPlayers].map((player) => player.loadAsset()));
        params.onPlayersUpdated(myPlayer, otherPlayers);
      } else if (newMsg.type === EventTypeEnum.ViewUpdated) {
        const [view] = parseViewUpdatedEvent(newMsg);
        params.onViewUpdated(view);
      } else if (newMsg.type === EventTypeEnum.ItemsUpdated) {
        const [items] = parseItemsUpdatedEvent(newMsg);
        await Promise.all(items.map((item) => item.loadAsset()));
        params.onItemsUpdated(items);
      }
    };

    socket.onclose = () => {
      if (pingServerInterval) {
        clearInterval(pingServerInterval);
      }
      params.onClose(this.disconnectedByClient);
    };

    socket.onopen = () => {
      pingServerInterval = setInterval(() => {
        this.ping();
      }, 3000);
      params.onOpen();
    };

    this.socket = socket;

    // @ts-ignore
    globalThis.sendMessage = this.sendMessage.bind(this);
  }

  static newGameSocket(params: {
    onGameJoined: (myPlayer: PlayerEntity, otherPlayers: PlayerEntity[], mapSize: SizeVo, view: ViewVo) => void;
    onPlayersUpdated: (myPlayer: PlayerEntity, otherPlayers: PlayerEntity[]) => void;
    onViewUpdated: (view: ViewVo) => void;
    onItemsUpdated: (items: ItemAgg[]) => void;
    onClose: (disconnectedByClient: boolean) => void;
    onOpen: () => void;
  }): GameSocket {
    return new GameSocket(params);
  }

  public disconnect() {
    this.disconnectedByClient = true;
    this.socket.close();
  }

  private async sendMessage(msg: object) {
    console.log(msg);
    const jsonString = JSON.stringify(msg);
    const jsonBlob = new Blob([jsonString]);
    const compressedJsonBlob = await gzipBlob(jsonBlob);

    if (this.socket.readyState !== this.socket.OPEN) {
      return;
    }
    this.socket.send(compressedJsonBlob);
  }

  public ping() {
    const action: PingAction = {
      type: ActionTypeEnum.Ping,
    };
    this.sendMessage(action);
  }

  public move(direction: DirectionVo) {
    const action: MoveAction = {
      type: ActionTypeEnum.Move,
      payload: {
        direction: direction.toNumber(),
      },
    };
    this.sendMessage(action);
  }

  public buildItem(location: LocationVo, itemId: string) {
    const action: BuildItemAction = {
      type: ActionTypeEnum.BuildItem,
      payload: {
        location: { x: location.getX(), y: location.getY() },
        itemId,
        actionedAt: new Date().toISOString(),
      },
    };
    this.sendMessage(action);
  }

  public destroyItem(location: LocationVo) {
    const action: DestroyItemAction = {
      type: ActionTypeEnum.DestroyItem,
      payload: {
        location: { x: location.getX(), y: location.getY() },
        actionedAt: new Date().toISOString(),
      },
    };
    this.sendMessage(action);
  }
}
