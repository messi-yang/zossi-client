import { parsePlayerDto, parseUnitDto, parseWorldDto, newPositionDto } from '@/apis/dtos';
import {
  EventTypeEnum,
  WorldEnteredEvent,
  UnitCreatedEvent,
  UnitRotatedEvent,
  UnitRemovedEvent,
  PlayerJoinedEvent,
  PlayerMovedEvent,
  PlayerHeldItemChangedEvent,
  PlayerLeftEvent,
} from './events';
import type { Event } from './events';
import { CommandTypeEnum } from './commands';
import type {
  PingCommand,
  MoveCommand,
  ChangePlayerHeldItemCommandDto,
  CreateStaticUnitCommand,
  CreatePortalUnitCommand,
  RemoveUnitCommandDto,
  RotateUnitCommandDto,
} from './commands';
import { DirectionModel } from '@/models/world/direction-model';
import { PositionModel } from '@/models/world/position-model';
import { WorldModel } from '@/models/world/world-model';
import { PlayerModel } from '@/models/world/player-model';
import { UnitModel } from '@/models/world/unit-model';
import { LocalStorage } from '@/storages/local-storage';
import { RotateUnitCommand } from '@/logics/world-journey/commands/rotate-unit-command';
import { AddPlayerCommand, RemovePlayerCommand, RemoveUnitCommand } from '@/logics/world-journey/commands';
import { WorldJourney } from '@/logics/world-journey';
import { ChangePlayerHeldItemCommand } from '@/logics/world-journey/commands/change-player-held-item-command';

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

function parseUnitRotatedEvent(event: UnitRotatedEvent): RotateUnitCommand {
  const pos = PositionModel.new(event.position.x, event.position.z);
  const commnad = RotateUnitCommand.new(pos);

  return commnad;
}

function parseUnitRemovedEvent(event: UnitRemovedEvent): RemoveUnitCommand {
  const pos = PositionModel.new(event.position.x, event.position.z);
  const commnad = RemoveUnitCommand.new(pos);

  return commnad;
}

function parsePlayerJoinedEvent(event: PlayerJoinedEvent): AddPlayerCommand {
  const player = parsePlayerDto(event.player);
  const command = AddPlayerCommand.new(player);
  return command;
}

function parsePlayerMovedEvent(event: PlayerMovedEvent): [PlayerModel] {
  return [parsePlayerDto(event.player)];
}

function parsePlayerHeldItemChangedEvent(event: PlayerHeldItemChangedEvent): ChangePlayerHeldItemCommand {
  const command = ChangePlayerHeldItemCommand.new(event.playerId, event.itemId);
  return command;
}

function parsePlayerLeftEvent(event: PlayerLeftEvent): RemovePlayerCommand {
  const command = RemovePlayerCommand.new(event.playerId);
  return command;
}

export class WorldJourneyApiService {
  private socket: WebSocket;

  constructor(
    worldId: string,
    params: {
      onWorldEntered: (worldJourney: WorldJourney) => void;
      onUnitCreated: (unit: UnitModel) => void;
      onUnitRotated: (command: RotateUnitCommand) => void;
      onUnitRemoved: (command: RemoveUnitCommand) => void;
      onPlayerJoined: (command: AddPlayerCommand) => void;
      onPlayerMoved: (player: PlayerModel) => void;
      onPlayerHeldItemChanged: (command: ChangePlayerHeldItemCommand) => void;
      onPlayerLeft: (command: RemovePlayerCommand) => void;
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
        const worldJourney = WorldJourney.new(world, players, myPlayerId, units);
        params.onWorldEntered(worldJourney);
      } else if (newMsg.type === EventTypeEnum.UnitCreated) {
        const [unit] = parseUnitCreatedEvent(newMsg);
        params.onUnitCreated(unit);
      } else if (newMsg.type === EventTypeEnum.UnitRotated) {
        const command = parseUnitRotatedEvent(newMsg);
        params.onUnitRotated(command);
      } else if (newMsg.type === EventTypeEnum.UnitRemoved) {
        const command = parseUnitRemovedEvent(newMsg);
        params.onUnitRemoved(command);
      } else if (newMsg.type === EventTypeEnum.PlayerJoined) {
        const command = parsePlayerJoinedEvent(newMsg);
        params.onPlayerJoined(command);
      } else if (newMsg.type === EventTypeEnum.PlayerMoved) {
        const [player] = parsePlayerMovedEvent(newMsg);
        params.onPlayerMoved(player);
      } else if (newMsg.type === EventTypeEnum.PlayerHeldItemChanged) {
        const command = parsePlayerHeldItemChangedEvent(newMsg);
        params.onPlayerHeldItemChanged(command);
      } else if (newMsg.type === EventTypeEnum.PlayerLeft) {
        const command = parsePlayerLeftEvent(newMsg);
        params.onPlayerLeft(command);
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
      onWorldEntered: (worldJourney: WorldJourney) => void;
      onUnitCreated: (unit: UnitModel) => void;
      onUnitRotated: (command: RotateUnitCommand) => void;
      onUnitRemoved: (command: RemoveUnitCommand) => void;
      onPlayerJoined: (command: AddPlayerCommand) => void;
      onPlayerMoved: (player: PlayerModel) => void;
      onPlayerHeldItemChanged: (command: ChangePlayerHeldItemCommand) => void;
      onPlayerLeft: (command: RemovePlayerCommand) => void;
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

  public changePlayerHeldItem(command: ChangePlayerHeldItemCommand) {
    const action: ChangePlayerHeldItemCommandDto = {
      type: CommandTypeEnum.ChangePlayerHeldItem,
      playerId: command.getPlayerId(),
      itemId: command.getItemId(),
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

  public removeUnit(command: RemoveUnitCommand) {
    const action: RemoveUnitCommandDto = {
      type: CommandTypeEnum.RemoveUnit,
      position: newPositionDto(command.getPosition()),
    };
    this.sendMessage(action);
  }

  public rotateUnit(command: RotateUnitCommand) {
    const action: RotateUnitCommandDto = {
      type: CommandTypeEnum.RotateUnit,
      position: newPositionDto(command.getPosition()),
    };
    this.sendMessage(action);
  }
}
