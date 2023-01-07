import { ungzipBlob, gzipBlob } from '@/apis/compression';
import type { MapUnitDto } from '@/apis/dtos';
import { MapRangeVo, MapUnitVo, GameMapVo, LocationVo, MapSizeVo } from '@/models/valueObjects';
import {
  EventTypeEnum,
  MapRangeObservedEvent,
  ObservedMapRangeUpdatedEvent,
  InformationUpdatedEvent,
  ItemsUpdatedEvent,
} from './eventTypes';
import type { Event } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type { PingAction, ObserveMapRangeAction, BuildItemAction, DestroyItemAction } from './actionTypes';
import { ItemAgg } from '@/models/aggregates';

function convertMapUnitDtoMatrixToGameMapVo(gameMap: MapUnitDto[][]): GameMapVo {
  const mapUnitMatrix = gameMap.map((mapUnitCol) => mapUnitCol.map((mapUnit) => MapUnitVo.new(mapUnit.itemId)));
  return GameMapVo.new(mapUnitMatrix);
}

function parseMapRangeObservedEvent(event: MapRangeObservedEvent): [MapRangeVo, GameMapVo] {
  const mapRange = MapRangeVo.new(
    LocationVo.new(event.payload.mapRange.from.x, event.payload.mapRange.from.y),
    LocationVo.new(event.payload.mapRange.to.x, event.payload.mapRange.to.y)
  );
  const gameMap = convertMapUnitDtoMatrixToGameMapVo(event.payload.gameMap);
  return [mapRange, gameMap];
}

function parseObservedMapRangeUpdatedEvent(event: ObservedMapRangeUpdatedEvent): [MapRangeVo, GameMapVo] {
  const mapRange = MapRangeVo.new(
    LocationVo.new(event.payload.mapRange.from.x, event.payload.mapRange.from.y),
    LocationVo.new(event.payload.mapRange.to.x, event.payload.mapRange.to.y)
  );
  const gameMap = convertMapUnitDtoMatrixToGameMapVo(event.payload.gameMap);
  return [mapRange, gameMap];
}

function parseInformationUpdatedEvent(event: InformationUpdatedEvent): [MapSizeVo] {
  return [MapSizeVo.new(event.payload.mapSize.width, event.payload.mapSize.height)];
}

function parseItemsUpdatedEvent(event: ItemsUpdatedEvent): [ItemAgg[]] {
  return [event.payload.items.map(({ id, name, assetSrc }) => ItemAgg.newItemAgg({ id, name, assetSrc }))];
}

export default class GameSocketConn {
  private socket: WebSocket;

  private disconnectedByClient: boolean = false;

  constructor(params: {
    onMapRangeObserved: (mapRange: MapRangeVo, gameMap: GameMapVo) => void;
    onObservedMapRangeUpdated: (mapRange: MapRangeVo, gameMap: GameMapVo) => void;
    onInformationUpdated: (mapSize: MapSizeVo) => void;
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
      if (newMsg.type === EventTypeEnum.MapRangeObserved) {
        const [mapRange, gameMap] = parseMapRangeObservedEvent(newMsg);
        params.onMapRangeObserved(mapRange, gameMap);
      } else if (newMsg.type === EventTypeEnum.ObservedMapRangeUpdated) {
        const [mapRange, gameMap] = parseObservedMapRangeUpdatedEvent(newMsg);
        params.onObservedMapRangeUpdated(mapRange, gameMap);
      } else if (newMsg.type === EventTypeEnum.InformationUpdated) {
        const [mapSize] = parseInformationUpdatedEvent(newMsg);
        params.onInformationUpdated(mapSize);
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
  }

  static newGameSocketConn(params: {
    onMapRangeObserved: (mapRange: MapRangeVo, gameMap: GameMapVo) => void;
    onObservedMapRangeUpdated: (mapRange: MapRangeVo, gameMap: GameMapVo) => void;
    onInformationUpdated: (mapSize: MapSizeVo) => void;
    onItemsUpdated: (items: ItemAgg[]) => void;
    onClose: (disconnectedByClient: boolean) => void;
    onOpen: () => void;
  }): GameSocketConn {
    return new GameSocketConn(params);
  }

  public disconnect() {
    this.disconnectedByClient = true;
    this.socket.close();
  }

  private async sendMessage(msg: object) {
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

  public observeMapRange(newMapRange: MapRangeVo) {
    const action: ObserveMapRangeAction = {
      type: ActionTypeEnum.ObserveMapRange,
      payload: {
        mapRange: {
          from: { x: newMapRange.getFrom().getX(), y: newMapRange.getFrom().getY() },
          to: { x: newMapRange.getTo().getX(), y: newMapRange.getTo().getY() },
        },
        actionedAt: new Date().toISOString(),
      },
    };
    this.sendMessage(action);
  }
}
