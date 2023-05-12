import { ungzipBlob, gzipBlob } from '@/libs/compression';
import { convertPlayerDtoPlayer, convertUnitDtoToUnit } from '@/dtos';
import { DirectionVo } from '@/models/valueObjects';
import { EventTypeEnum, PlayersUpdatedEvent, UnitsUpdatedEvent } from './events';
import type { Event } from './events';
import { CommandTypeEnum } from './commands';
import type { PingCommand, MoveCommand, ChangeHeldItemCommand, PlaceItemCommand, RemoveItemCommand } from './commands';
import { UnitAgg, PlayerAgg } from '@/models/aggregates';

function parsePlayersUpdatedEvent(event: PlayersUpdatedEvent): [PlayerAgg, PlayerAgg[]] {
  return [convertPlayerDtoPlayer(event.myPlayer), event.otherPlayers.map(convertPlayerDtoPlayer)];
}

function parseUnitsUpdatedEvent(event: UnitsUpdatedEvent): [UnitAgg[]] {
  const units = event.units.map(convertUnitDtoToUnit);
  return [units];
}

export default class GameSocket {
  private socket: WebSocket;

  private disconnectedByClient: boolean = false;

  constructor(
    gameId: string,
    params: {
      onGameJoined: () => void;
      onPlayersUpdated: (myPlayer: PlayerAgg, otherPlayers: PlayerAgg[]) => void;
      onUnitsUpdated: (units: UnitAgg[]) => void;
      onClose: (disconnectedByClient: boolean) => void;
      onOpen: () => void;
    }
  ) {
    const schema = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
    const socketUrl = `${schema}://${process.env.API_DOMAIN}/ws/game/?id=${gameId}`;
    const socket = new WebSocket(socketUrl);

    let pingServerInterval: NodeJS.Timer | null = null;

    socket.onmessage = async ({ data }: any) => {
      const decompressedBlob = await ungzipBlob(data as Blob);
      const eventJsonString = await decompressedBlob.text();
      const newMsg: Event = JSON.parse(eventJsonString);

      console.log(newMsg);
      if (newMsg.type === EventTypeEnum.PlayersUpdated) {
        const [myPlayer, otherPlayers] = parsePlayersUpdatedEvent(newMsg);
        params.onPlayersUpdated(myPlayer, otherPlayers);
      } else if (newMsg.type === EventTypeEnum.UnitsUpdated) {
        const [units] = parseUnitsUpdatedEvent(newMsg);
        params.onUnitsUpdated(units);
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

  static newGameSocket(
    gameId: string,
    params: {
      onGameJoined: () => void;
      onPlayersUpdated: (myPlayer: PlayerAgg, otherPlayers: PlayerAgg[]) => void;
      onUnitsUpdated: (units: UnitAgg[]) => void;
      onClose: (disconnectedByClient: boolean) => void;
      onOpen: () => void;
    }
  ): GameSocket {
    return new GameSocket(gameId, params);
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

  public changeHeldItem(itemId: string) {
    const action: ChangeHeldItemCommand = {
      type: CommandTypeEnum.ChangeHeldItem,
      itemId,
    };
    this.sendMessage(action);
  }

  public placeItem() {
    const action: PlaceItemCommand = {
      type: CommandTypeEnum.PlaceItem,
    };
    this.sendMessage(action);
  }

  public removeItem() {
    const action: RemoveItemCommand = {
      type: CommandTypeEnum.RemoveItem,
    };
    this.sendMessage(action);
  }
}
