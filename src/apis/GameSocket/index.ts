import { ungzipBlob, gzipBlob } from '@/libs/compression';
import { convertPlayerDtoPlayer, convertItemDtoToItem, convertUnitDtoToUnit, convertBoundDtoToBound } from '@/dtos';
import { LocationVo, DirectionVo, BoundVo } from '@/models/valueObjects';
import { EventTypeEnum, GameJoinedEvent, PlayersUpdatedEvent, UnitsUpdatedEvent } from './events';
import type { Event } from './events';
import { CommandTypeEnum } from './commands';
import type { PingCommand, MoveCommand, PlaceItemCommand, DestroyItemCommand } from './commands';
import { ItemAgg, UnitAgg, PlayerAgg } from '@/models/aggregates';

function parseGameJoinedEvent(event: GameJoinedEvent): [string, PlayerAgg[], BoundVo, UnitAgg[], ItemAgg[]] {
  const bound = convertBoundDtoToBound(event.visionBound);
  const units = event.units.map(convertUnitDtoToUnit);
  const players = event.players.map(convertPlayerDtoPlayer);
  const items = event.items.map(convertItemDtoToItem);
  return [event.playerId, players, bound, units, items];
}

function parsePlayersUpdatedEvent(event: PlayersUpdatedEvent): [PlayerAgg[]] {
  const otherPlayers = event.players.map(convertPlayerDtoPlayer);
  return [otherPlayers];
}

function parseUnitsUpdatedEvent(event: UnitsUpdatedEvent): [BoundVo, UnitAgg[]] {
  const bound = convertBoundDtoToBound(event.visionBound);
  const units = event.units.map(convertUnitDtoToUnit);
  return [bound, units];
}

export default class GameSocket {
  private socket: WebSocket;

  private disconnectedByClient: boolean = false;

  constructor(params: {
    onGameJoined: (playerId: string, players: PlayerAgg[], bound: BoundVo, units: UnitAgg[], items: ItemAgg[]) => void;
    onPlayersUpdated: (players: PlayerAgg[]) => void;
    onUnitsUpdated: (bound: BoundVo, units: UnitAgg[]) => void;
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
        const [playerId, players, bound, units, items] = parseGameJoinedEvent(newMsg);
        await Promise.all(items.map((item) => item.loadAsset()));
        params.onGameJoined(playerId, players, bound, units, items);
      } else if (newMsg.type === EventTypeEnum.PlayersUpdated) {
        const [players] = parsePlayersUpdatedEvent(newMsg);
        params.onPlayersUpdated(players);
      } else if (newMsg.type === EventTypeEnum.UnitsUpdated) {
        const [bound, units] = parseUnitsUpdatedEvent(newMsg);
        params.onUnitsUpdated(bound, units);
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
    onGameJoined: (playerId: string, players: PlayerAgg[], bound: BoundVo, units: UnitAgg[], items: ItemAgg[]) => void;
    onPlayersUpdated: (players: PlayerAgg[]) => void;
    onUnitsUpdated: (bound: BoundVo, units: UnitAgg[]) => void;
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

      direction: direction.toNumber(),
    };
    this.sendMessage(action);
  }

  public placeItem(itemId: number) {
    const action: PlaceItemCommand = {
      type: CommandTypeEnum.PlaceItem,
      itemId,
    };
    this.sendMessage(action);
  }

  public destroyItem(location: LocationVo) {
    const action: DestroyItemCommand = {
      type: CommandTypeEnum.DestroyItem,
      location: { x: location.getX(), z: location.getZ() },
    };
    this.sendMessage(action);
  }
}
