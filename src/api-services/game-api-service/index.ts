import { ungzipBlob, gzipBlob } from '@/libs/compression';
import { convertPlayerDtoPlayer, convertUnitDtoToUnit } from '@/dtos';
import { EventTypeEnum, PlayersUpdatedEvent, UnitsUpdatedEvent } from './events';
import type { Event } from './events';
import { CommandTypeEnum } from './commands';
import type { PingCommand, MoveCommand, ChangeHeldItemCommand, PlaceItemCommand, RemoveItemCommand } from './commands';
import { UnitModel, PlayerModel, DirectionModel } from '@/models';

function parsePlayersUpdatedEvent(event: PlayersUpdatedEvent): [PlayerModel, PlayerModel[]] {
  return [convertPlayerDtoPlayer(event.myPlayer), event.otherPlayers.map(convertPlayerDtoPlayer)];
}

function parseUnitsUpdatedEvent(event: UnitsUpdatedEvent): [UnitModel[]] {
  const units = event.units.map(convertUnitDtoToUnit);
  return [units];
}

export class GameApiService {
  private socket: WebSocket;

  constructor(
    gameId: string,
    params: {
      onGameJoined: () => void;
      onPlayersUpdated: (myPlayer: PlayerModel, otherPlayers: PlayerModel[]) => void;
      onUnitsUpdated: (units: UnitModel[]) => void;
      onClose: () => void;
      onOpen: () => void;
    }
  ) {
    const socketUrl = `${process.env.API_SOCKET_URL}/ws/game/?id=${gameId}`;
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
      params.onClose();
    };

    socket.onopen = () => {
      pingServerInterval = setInterval(() => {
        this.ping();
      }, 3000);
      params.onOpen();
    };

    this.socket = socket;
  }

  static new(
    gameId: string,
    params: {
      onGameJoined: () => void;
      onPlayersUpdated: (myPlayer: PlayerModel, otherPlayers: PlayerModel[]) => void;
      onUnitsUpdated: (units: UnitModel[]) => void;
      onClose: () => void;
      onOpen: () => void;
    }
  ): GameApiService {
    return new GameApiService(gameId, params);
  }

  public disconnect() {
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

  public move(direction: DirectionModel) {
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
