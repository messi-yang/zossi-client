import { ungzipBlob, gzipBlob } from '@/libs/compression';
import { convertSizeDtoToSize, convertPlayerDtoPlayer, convertItemDtoToItem, convertViewDtoToView } from '@/dtos';
import { LocationVo, SizeVo, ViewVo, DirectionVo } from '@/models/valueObjects';
import { PlayerEntity } from '@/models/entities';
import { EventTypeEnum, GameJoinedEvent, PlayersUpdatedEvent, ViewUpdatedEvent, ItemsUpdatedEvent } from './events';
import type { Event } from './events';
import { CommandTypeEnum } from './commands';
import type { PingCommand, MoveCommand, BuildItemCommand, DestroyItemCommand } from './commands';
import { ItemAgg } from '@/models/aggregates';

function parseGameJoinedEvent(event: GameJoinedEvent): [PlayerEntity, PlayerEntity[], SizeVo, ViewVo] {
  const mapSize = convertSizeDtoToSize(event.payload.mapSize);
  const view = convertViewDtoToView(event.payload.view);
  const myPlayer = convertPlayerDtoPlayer(event.payload.myPlayer);
  const otherPlayers = event.payload.otherPlayers.map(convertPlayerDtoPlayer);
  return [myPlayer, otherPlayers, mapSize, view];
}

function parsePlayersUpdatedEvent(event: PlayersUpdatedEvent): [PlayerEntity, PlayerEntity[]] {
  const myPlayer = convertPlayerDtoPlayer(event.payload.myPlayer);
  const otherPlayers = event.payload.otherPlayers.map(convertPlayerDtoPlayer);
  return [myPlayer, otherPlayers];
}

function parseViewUpdatedEvent(event: ViewUpdatedEvent): [ViewVo] {
  const view = convertViewDtoToView(event.payload.view);
  return [view];
}

function parseItemsUpdatedEvent(event: ItemsUpdatedEvent): [ItemAgg[]] {
  return [event.payload.items.map(convertItemDtoToItem)];
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
    const action: PingCommand = {
      type: CommandTypeEnum.Ping,
    };
    this.sendMessage(action);
  }

  public move(direction: DirectionVo) {
    const action: MoveCommand = {
      type: CommandTypeEnum.Move,
      payload: {
        direction: direction.toNumber(),
      },
    };
    this.sendMessage(action);
  }

  public buildItem(location: LocationVo, itemId: string) {
    const action: BuildItemCommand = {
      type: CommandTypeEnum.BuildItem,
      payload: {
        location: { x: location.getX(), y: location.getY() },
        itemId,
        actionedAt: new Date().toISOString(),
      },
    };
    this.sendMessage(action);
  }

  public destroyItem(location: LocationVo) {
    const action: DestroyItemCommand = {
      type: CommandTypeEnum.DestroyItem,
      payload: {
        location: { x: location.getX(), y: location.getY() },
        actionedAt: new Date().toISOString(),
      },
    };
    this.sendMessage(action);
  }
}
