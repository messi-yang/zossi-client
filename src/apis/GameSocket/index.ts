import { ungzipBlob, gzipBlob } from '@/lib/compression';
import type { UnitDto } from '@/dtos';
import { BoundVo, UnitVo, MapVo, LocationVo, SizeVo, ViewVo, CameraVo } from '@/models/valueObjects';
import { EventTypeEnum, GameJoinedEvent, CameraChangedEvent, ViewUpdatedEvent, ItemsUpdatedEvent } from './eventTypes';
import type { Event } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type { PingAction, ChangeCameraAction, BuildItemAction, DestroyItemAction } from './actionTypes';
import { ItemAgg } from '@/models/aggregates';

function convertUnitDtoMatrixToMapVo(map: UnitDto[][]): MapVo {
  const unitMatrix = map.map((unitCol) => unitCol.map((unit) => UnitVo.new(unit.itemId)));
  return MapVo.new(unitMatrix);
}

function parseGameJoinedEvent(event: GameJoinedEvent): [string, SizeVo, ViewVo, CameraVo] {
  const size = SizeVo.new(event.payload.size.width, event.payload.size.height);
  const bound = BoundVo.new(
    LocationVo.new(event.payload.view.bound.from.x, event.payload.view.bound.from.y),
    LocationVo.new(event.payload.view.bound.to.x, event.payload.view.bound.to.y)
  );
  const map = convertUnitDtoMatrixToMapVo(event.payload.view.map);
  const view = ViewVo.new(bound, map);
  const camera = CameraVo.new(LocationVo.new(event.payload.camera.center.x, event.payload.camera.center.y));
  return [event.payload.playerId, size, view, camera];
}

function parseCameraChangedEvent(event: CameraChangedEvent): [CameraVo, ViewVo] {
  const camera = CameraVo.new(LocationVo.new(event.payload.camera.center.x, event.payload.camera.center.y));
  const bound = BoundVo.new(
    LocationVo.new(event.payload.view.bound.from.x, event.payload.view.bound.from.y),
    LocationVo.new(event.payload.view.bound.to.x, event.payload.view.bound.to.y)
  );
  const map = convertUnitDtoMatrixToMapVo(event.payload.view.map);
  const view = ViewVo.new(bound, map);
  return [camera, view];
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
  return [event.payload.items.map(({ id, name, assetSrc }) => ItemAgg.newItemAgg({ id, name, assetSrc }))];
}

export default class GameSocket {
  private socket: WebSocket;

  private disconnectedByClient: boolean = false;

  constructor(params: {
    onGameJoined: (size: SizeVo, camera: CameraVo, view: ViewVo) => void;
    onCameraChanged: (cameraVo: CameraVo, view: ViewVo) => void;
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
        const [, size, view, camera] = parseGameJoinedEvent(newMsg);
        params.onGameJoined(size, camera, view);
      } else if (newMsg.type === EventTypeEnum.CameraChanged) {
        const [camera, view] = parseCameraChangedEvent(newMsg);
        params.onCameraChanged(camera, view);
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
  }

  static newGameSocket(params: {
    onGameJoined: (size: SizeVo, camera: CameraVo, view: ViewVo) => void;
    onCameraChanged: (camera: CameraVo, view: ViewVo) => void;
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

  public changeCamera(camera: CameraVo) {
    const action: ChangeCameraAction = {
      type: ActionTypeEnum.ChangeCamera,
      payload: {
        camera: {
          center: {
            x: camera.getCenter().getX(),
            y: camera.getCenter().getY(),
          },
        },
      },
    };
    this.sendMessage(action);
  }
}
