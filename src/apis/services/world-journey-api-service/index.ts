import { parsePlayerDto, parseUnitDto, parseWorldDto, newPositionDto } from '@/apis/dtos';
import {
  EventTypeEnum,
  WorldEnteredEvent,
  UnitCreatedEvent,
  UnitUpdatedEvent,
  UnitDeletedEvent,
  PlayerJoinedEvent,
  PlayerMovedEvent,
  PlayerLeftEvent,
} from './events';
import type { Event } from './events';
import { CommandTypeEnum } from './commands';
import type {
  PingCommand,
  MoveCommand,
  ChangeHeldItemCommand,
  CreateStaticUnitCommand,
  CreatePortalUnitCommand,
  RemoveUnitCommand,
  RotateUnitCommand,
} from './commands';
import { DirectionModel } from '@/models/world/direction-model';
import { PositionModel } from '@/models/world/position-model';
import { WorldModel } from '@/models/world/world-model';
import { PlayerModel } from '@/models/world/player-model';
import { UnitModel } from '@/models/world/unit-model';
import { LocalStorage } from '@/storages/local-storage';

function parseWorldEnteredEvent(event: WorldEnteredEvent): [WorldModel, UnitModel[], string, PlayerModel[]] {
  return [
    parseWorldDto(event.world),
    event.units.map(parseUnitDto),
    event.myPlayerId,
    event.players.map(parsePlayerDto),
  ];
}

function parseUnitCreatedEvent(event: UnitCreatedEvent): [UnitModel] {
  return [parseUnitDto(event.unit)];
}

function parseUnitUpdatedEvent(event: UnitUpdatedEvent): [UnitModel] {
  return [parseUnitDto(event.unit)];
}

function parseUnitDeletedEvent(event: UnitDeletedEvent): [PositionModel] {
  return [PositionModel.new(event.position.x, event.position.z)];
}

function parsePlayerJoinedEvent(event: PlayerJoinedEvent): [PlayerModel] {
  return [parsePlayerDto(event.player)];
}

function parsePlayerMovedEvent(event: PlayerMovedEvent): [PlayerModel] {
  return [parsePlayerDto(event.player)];
}

function parsePlayerLeftEvent(event: PlayerLeftEvent): [string] {
  return [event.playerId];
}

export class WorldJourneyApiService {
  private socket: WebSocket;

  constructor(
    worldId: string,
    params: {
      onWorldEntered: (world: WorldModel, units: UnitModel[], myPlayerId: string, players: PlayerModel[]) => void;
      onUnitCreated: (unit: UnitModel) => void;
      onUnitUpdated: (unit: UnitModel) => void;
      onUnitDeleted: (position: PositionModel) => void;
      onPlayerJoined: (player: PlayerModel) => void;
      onPlayerMoved: (player: PlayerModel) => void;
      onPlayerLeft: (playerId: string) => void;
      onClose: () => void;
      onOpen: () => void;
    }
  ) {
    const localStorage = LocalStorage.get();
    const accessToken = localStorage.getAccessToken();

    const socketUrl = `${process.env.API_SOCKET_URL}/api/world-journey/?id=${worldId}&access-token=${accessToken}`;
    const socket = new WebSocket(socketUrl, []);

    let pingServerInterval: NodeJS.Timer | null = null;

    socket.onmessage = async ({ data }: any) => {
      const eventJsonString: string = await data.text();
      const newMsg: Event = JSON.parse(eventJsonString);

      console.log(newMsg);
      if (newMsg.type === EventTypeEnum.WorldEntered) {
        const [world, units, myPlayerId, players] = parseWorldEnteredEvent(newMsg);
        params.onWorldEntered(world, units, myPlayerId, players);
      } else if (newMsg.type === EventTypeEnum.UnitCreated) {
        const [unit] = parseUnitCreatedEvent(newMsg);
        params.onUnitCreated(unit);
      } else if (newMsg.type === EventTypeEnum.UnitUpdated) {
        const [unit] = parseUnitUpdatedEvent(newMsg);
        params.onUnitUpdated(unit);
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
    worldId: string,
    params: {
      onWorldEntered: (world: WorldModel, units: UnitModel[], myPlayerId: string, players: PlayerModel[]) => void;
      onUnitCreated: (unit: UnitModel) => void;
      onUnitUpdated: (unit: UnitModel) => void;
      onUnitDeleted: (position: PositionModel) => void;
      onPlayerJoined: (player: PlayerModel) => void;
      onPlayerMoved: (player: PlayerModel) => void;
      onPlayerLeft: (playerId: string) => void;
      onUnitsUpdated: (units: UnitModel[]) => void;
      onClose: () => void;
      onOpen: () => void;
    }
  ): WorldJourneyApiService {
    return new WorldJourneyApiService(worldId, params);
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

  public createStaticUnit(itemId: string, position: PositionModel, direction: DirectionModel) {
    const action: CreateStaticUnitCommand = {
      type: CommandTypeEnum.CreateStaticUnit,
      itemId,
      position: newPositionDto(position),
      direction: direction.toNumber(),
    };
    this.sendMessage(action);
  }

  public createPortalUnit(itemId: string, position: PositionModel, direction: DirectionModel) {
    const action: CreatePortalUnitCommand = {
      type: CommandTypeEnum.CreatePortalUnit,
      itemId,
      position: newPositionDto(position),
      direction: direction.toNumber(),
    };
    this.sendMessage(action);
  }

  public removeUnit(position: PositionModel) {
    const action: RemoveUnitCommand = {
      type: CommandTypeEnum.RemoveUnit,
      position: newPositionDto(position),
    };
    this.sendMessage(action);
  }

  public rotateUnit(position: PositionModel) {
    const action: RotateUnitCommand = {
      type: CommandTypeEnum.RotateUnit,
      position: newPositionDto(position),
    };
    this.sendMessage(action);
  }
}
