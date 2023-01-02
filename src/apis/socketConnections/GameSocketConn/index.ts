import { ungzipBlob, gzipBlob } from '@/apis/compression';
import type { UnitDto } from '@/apis/dtos';
import { AreaVo, UnitVo, UnitBlockVo, CoordinateVo, DimensionVo } from '@/models/valueObjects';
import {
  EventTypeEnum,
  AreaZoomedEvent,
  ZoomedAreaUpdatedEvent,
  InformationUpdatedEvent,
  ItemsUpdatedEvent,
} from './eventTypes';
import type { Event } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type { ZoomAreaAction, BuildItemAction, DestroyItemAction } from './actionTypes';
import { ItemAgg } from '@/models/aggregates';

function convertUnitDtoMatrixToUnitBlockVo(unitBlock: UnitDto[][]): UnitBlockVo {
  const unitMatrix = unitBlock.map((unitCol) => unitCol.map((unit) => UnitVo.new(unit.itemId)));
  return UnitBlockVo.new(unitMatrix);
}

function parseAreaZoomedEvent(event: AreaZoomedEvent): [AreaVo, UnitBlockVo] {
  const area = AreaVo.new(
    CoordinateVo.new(event.payload.area.from.x, event.payload.area.from.y),
    CoordinateVo.new(event.payload.area.to.x, event.payload.area.to.y)
  );
  const unitBlock = convertUnitDtoMatrixToUnitBlockVo(event.payload.unitBlock);
  return [area, unitBlock];
}

function parseZoomedAreaUpdatedEvent(event: ZoomedAreaUpdatedEvent): [AreaVo, UnitBlockVo] {
  const area = AreaVo.new(
    CoordinateVo.new(event.payload.area.from.x, event.payload.area.from.y),
    CoordinateVo.new(event.payload.area.to.x, event.payload.area.to.y)
  );
  const unitBlock = convertUnitDtoMatrixToUnitBlockVo(event.payload.unitBlock);
  return [area, unitBlock];
}

function parseInformationUpdatedEvent(event: InformationUpdatedEvent): [DimensionVo] {
  return [DimensionVo.new(event.payload.dimension.width, event.payload.dimension.height)];
}

function parseItemsUpdatedEvent(event: ItemsUpdatedEvent): [ItemAgg[]] {
  return [event.payload.items.map(({ id, name }) => ItemAgg.newItemAgg({ id, name }))];
}

export default class GameSocketConn {
  private socket: WebSocket;

  constructor(params: {
    onAreaZoomed: (area: AreaVo, unitBlock: UnitBlockVo) => void;
    onZoomedAreaUpdated: (area: AreaVo, unitBlock: UnitBlockVo) => void;
    onInformationUpdated: (dimension: DimensionVo) => void;
    onItemsUpdated: (items: ItemAgg[]) => void;
    onClose: () => void;
    onOpen: () => void;
  }) {
    const schema = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
    const socketUrl = `${schema}://${process.env.API_DOMAIN}/ws/game/`;
    const socket = new WebSocket(socketUrl);

    socket.onmessage = async ({ data }: any) => {
      const decompressedBlob = await ungzipBlob(data as Blob);
      const eventJsonString = await decompressedBlob.text();
      const newMsg: Event = JSON.parse(eventJsonString);

      console.log(newMsg);
      if (newMsg.type === EventTypeEnum.AreaZoomed) {
        const [area, unitBlock] = parseAreaZoomedEvent(newMsg);
        params.onAreaZoomed(area, unitBlock);
      } else if (newMsg.type === EventTypeEnum.ZoomedAreaUpdated) {
        const [area, unitBlock] = parseZoomedAreaUpdatedEvent(newMsg);
        params.onZoomedAreaUpdated(area, unitBlock);
      } else if (newMsg.type === EventTypeEnum.InformationUpdated) {
        const [dimension] = parseInformationUpdatedEvent(newMsg);
        params.onInformationUpdated(dimension);
      } else if (newMsg.type === EventTypeEnum.ItemsUpdated) {
        const [items] = parseItemsUpdatedEvent(newMsg);
        params.onItemsUpdated(items);
      }
    };

    socket.onclose = () => {
      params.onClose();
    };

    socket.onopen = () => {
      params.onOpen();
    };

    this.socket = socket;
  }

  static newGameSocketConn(params: {
    onAreaZoomed: (area: AreaVo, unitBlock: UnitBlockVo) => void;
    onZoomedAreaUpdated: (area: AreaVo, unitBlock: UnitBlockVo) => void;
    onInformationUpdated: (dimension: DimensionVo) => void;
    onItemsUpdated: (items: ItemAgg[]) => void;
    onClose: () => void;
    onOpen: () => void;
  }): GameSocketConn {
    return new GameSocketConn(params);
  }

  public disconnect() {
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

  public buildItem(coordinate: CoordinateVo, itemId: string) {
    const action: BuildItemAction = {
      type: ActionTypeEnum.BuildItem,
      payload: {
        coordinate: { x: coordinate.getX(), y: coordinate.getY() },
        itemId,
        actionedAt: new Date().toISOString(),
      },
    };
    this.sendMessage(action);
  }

  public destroyItem(coordinate: CoordinateVo) {
    const action: DestroyItemAction = {
      type: ActionTypeEnum.DestroyItem,
      payload: {
        coordinate: { x: coordinate.getX(), y: coordinate.getY() },
        actionedAt: new Date().toISOString(),
      },
    };
    this.sendMessage(action);
  }

  public zoomArea(newArea: AreaVo) {
    const action: ZoomAreaAction = {
      type: ActionTypeEnum.ZoomArea,
      payload: {
        area: {
          from: { x: newArea.getFrom().getX(), y: newArea.getFrom().getY() },
          to: { x: newArea.getTo().getX(), y: newArea.getTo().getY() },
        },
        actionedAt: new Date().toISOString(),
      },
    };
    this.sendMessage(action);
  }
}
