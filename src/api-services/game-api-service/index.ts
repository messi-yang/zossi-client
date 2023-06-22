import { convertPlayerDtoPlayer, convertUnitDtoToUnit } from '@/dtos';
import {
  EventTypeEnum,
  WorldEnteredEvent,
  UnitCreatedEvent,
  UnitDeletedEvent,
  PlayerJoinedEvent,
  PlayerMovedEvent,
  PlayerLeftEvent,
} from './events';
import type { Event } from './events';
import { CommandTypeEnum } from './commands';
import type { PingCommand, MoveCommand, ChangeHeldItemCommand, PlaceItemCommand, RemoveItemCommand } from './commands';
import { UnitModel, PlayerModel, DirectionModel, PositionModel } from '@/models';

function parseWorldEnteredEvent(event: WorldEnteredEvent): [UnitModel[], string, PlayerModel[]] {
  return [event.units.map(convertUnitDtoToUnit), event.myPlayerId, event.players.map(convertPlayerDtoPlayer)];
}

function parseUnitCreatedEvent(event: UnitCreatedEvent): [UnitModel] {
  return [convertUnitDtoToUnit(event.unit)];
}

function parseUnitDeletedEvent(event: UnitDeletedEvent): [PositionModel] {
  return [PositionModel.new(event.position.x, event.position.z)];
}

function parsePlayerJoinedEvent(event: PlayerJoinedEvent): [PlayerModel] {
  return [convertPlayerDtoPlayer(event.player)];
}

function parsePlayerMovedEvent(event: PlayerMovedEvent): [PlayerModel] {
  return [convertPlayerDtoPlayer(event.player)];
}

function parsePlayerLeftEvent(event: PlayerLeftEvent): [string] {
  return [event.playerId];
}

export class GameApiService {
  private socket: WebSocket;

  constructor(
    gameId: string,
    params: {
      onGameJoined: () => void;
      onWorldEntered: (units: UnitModel[], myPlayerId: string, players: PlayerModel[]) => void;
      onUnitCreated: (unit: UnitModel) => void;
      onUnitDeleted: (position: PositionModel) => void;
      onPlayerJoined: (player: PlayerModel) => void;
      onPlayerMoved: (player: PlayerModel) => void;
      onPlayerLeft: (playerId: string) => void;
      onClose: () => void;
      onOpen: () => void;
    }
  ) {
    const socketUrl = `${process.env.API_SOCKET_URL}/ws/game/?id=${gameId}`;
    const socket = new WebSocket(socketUrl);

    let pingServerInterval: NodeJS.Timer | null = null;

    socket.onmessage = async ({ data }: any) => {
      const eventJsonString: string = await data.text();
      const newMsg: Event = JSON.parse(eventJsonString);

      console.log(newMsg);
      if (newMsg.type === EventTypeEnum.WorldEntered) {
        const [units, myPlayerId, players] = parseWorldEnteredEvent(newMsg);
        params.onWorldEntered(units, myPlayerId, players);
      } else if (newMsg.type === EventTypeEnum.UnitCreated) {
        const [unit] = parseUnitCreatedEvent(newMsg);
        params.onUnitCreated(unit);
      } else if (newMsg.type === EventTypeEnum.UnitDeleted) {
        const [position] = parseUnitDeletedEvent(newMsg);
        params.onUnitDeleted(position);
      } else if (newMsg.type === EventTypeEnum.PlayerJoined) {
        const [player] = parsePlayerJoinedEvent(newMsg);
        params.onPlayerJoined(player);
      } else if (newMsg.type === EventTypeEnum.PlayerMoved) {
        const [player] = parsePlayerMovedEvent(newMsg);
        params.onPlayerMoved(player);
      } else if (newMsg.type === EventTypeEnum.PlayerLeft) {
        const [playerId] = parsePlayerLeftEvent(newMsg);
        params.onPlayerLeft(playerId);
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
      }, 10000);
      params.onOpen();
    };

    this.socket = socket;
  }

  static new(
    gameId: string,
    params: {
      onGameJoined: () => void;
      onWorldEntered: (units: UnitModel[], myPlayerId: string, players: PlayerModel[]) => void;
      onUnitCreated: (unit: UnitModel) => void;
      onUnitDeleted: (position: PositionModel) => void;
      onPlayerJoined: (player: PlayerModel) => void;
      onPlayerMoved: (player: PlayerModel) => void;
      onPlayerLeft: (playerId: string) => void;
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

    if (this.socket.readyState !== this.socket.OPEN) {
      return;
    }
    this.socket.send(jsonBlob);
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
