import { ungzipBlob, gzipBlob } from '@/apis/compression';
import type { UnitDto } from '@/apis/dtos';
import { RangeVo, UnitVo, MapVo, LocationVo, DimensionVo } from '@/models/valueObjects';
import {
  EventTypeEnum,
  GameJoinedEvent,
  RangeObservedEvent,
  ObservedRangeUpdatedEvent,
  ItemsUpdatedEvent,
} from './eventTypes';
import type { Event } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type {
  PingAction,
  ChangeCameraAction,
  ObserveRangeAction,
  BuildItemAction,
  DestroyItemAction,
} from './actionTypes';
import { ItemAgg } from '@/models/aggregates';

function convertUnitDtoMatrixToMapVo(map: UnitDto[][]): MapVo {
  const unitMatrix = map.map((unitCol) => unitCol.map((unit) => UnitVo.new(unit.itemId)));
  return MapVo.new(unitMatrix);
}

function parseGameJoinedEvent(event: GameJoinedEvent): [string, DimensionVo] {
  const dimension = DimensionVo.new(event.payload.dimension.width, event.payload.dimension.height);
  return [event.payload.playerId, dimension];
}

function parseRangeObservedEvent(event: RangeObservedEvent): [RangeVo, MapVo] {
  const range = RangeVo.new(
    LocationVo.new(event.payload.range.from.x, event.payload.range.from.y),
    LocationVo.new(event.payload.range.to.x, event.payload.range.to.y)
  );
  const map = convertUnitDtoMatrixToMapVo(event.payload.map);
  return [range, map];
}

function parseObservedRangeUpdatedEvent(event: ObservedRangeUpdatedEvent): [RangeVo, MapVo] {
  const range = RangeVo.new(
    LocationVo.new(event.payload.range.from.x, event.payload.range.from.y),
    LocationVo.new(event.payload.range.to.x, event.payload.range.to.y)
  );
  const map = convertUnitDtoMatrixToMapVo(event.payload.map);
  return [range, map];
}

function parseItemsUpdatedEvent(event: ItemsUpdatedEvent): [ItemAgg[]] {
  return [event.payload.items.map(({ id, name, assetSrc }) => ItemAgg.newItemAgg({ id, name, assetSrc }))];
}

export default class GameSocketConn {
  private socket: WebSocket;

  private disconnectedByClient: boolean = false;

  constructor(params: {
    onRangeObserved: (range: RangeVo, map: MapVo) => void;
    onGameJoined: (dimension: DimensionVo) => void;
    onObservedRangeUpdated: (range: RangeVo, map: MapVo) => void;
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
        const [, dimension] = parseGameJoinedEvent(newMsg);
        this.observeRange(
          RangeVo.newWithLocationAndDimension(
            LocationVo.new(0, 0),
            DimensionVo.newWithResolutionAndUnitSize({ width: window.innerWidth, height: window.innerHeight }, 30)
          )
        );
        params.onGameJoined(dimension);
      } else if (newMsg.type === EventTypeEnum.RangeObserved) {
        const [range, map] = parseRangeObservedEvent(newMsg);
        params.onRangeObserved(range, map);
      } else if (newMsg.type === EventTypeEnum.ObservedRangeUpdated) {
        const [range, map] = parseObservedRangeUpdatedEvent(newMsg);
        params.onObservedRangeUpdated(range, map);
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
    onRangeObserved: (range: RangeVo, map: MapVo) => void;
    onGameJoined: (dimension: DimensionVo) => void;
    onObservedRangeUpdated: (range: RangeVo, map: MapVo) => void;
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

  public changeCamera(center: LocationVo) {
    const action: ChangeCameraAction = {
      type: ActionTypeEnum.ChangeCamera,
      payload: {
        camera: {
          center: {
            x: center.getX(),
            y: center.getY(),
          },
        },
      },
    };
    this.sendMessage(action);
  }

  public observeRange(newRange: RangeVo) {
    const action: ObserveRangeAction = {
      type: ActionTypeEnum.ObserveRange,
      payload: {
        range: {
          from: { x: newRange.getFrom().getX(), y: newRange.getFrom().getY() },
          to: { x: newRange.getTo().getX(), y: newRange.getTo().getY() },
        },
        actionedAt: new Date().toISOString(),
      },
    };
    this.sendMessage(action);
  }
}
