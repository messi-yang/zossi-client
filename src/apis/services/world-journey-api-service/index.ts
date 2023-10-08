import { v4 as uuidv4 } from 'uuid';
import { parsePlayerDto, parseUnitDto, parseWorldDto, newPositionDto } from '@/apis/dtos';
import { CommandNameEnum, parseCommandDto } from './commands';
import type {
  PingCommandDto,
  MovePlayerCommandDto,
  ChangePlayerHeldItemCommandDto,
  CreateStaticUnitCommandDto,
  CreatePortalUnitCommandDto,
  RotateUnitCommandDto,
  RemoveUnitCommandDto,
} from './commands';
import { WorldModel } from '@/models/world/world-model';
import { PlayerModel } from '@/models/world/player-model';
import { UnitModel } from '@/models/world/unit-model';
import { LocalStorage } from '@/storages/local-storage';
import { RotateUnitCommand } from '@/logics/world-journey/commands/rotate-unit-command';
import {
  AddPlayerCommand,
  CreatePortalUnitCommand,
  CreateStaticUnitCommand,
  MovePlayerCommand,
  RemovePlayerCommand,
  RemoveUnitCommand,
} from '@/logics/world-journey/commands';
import { WorldJourney } from '@/logics/world-journey';
import { ChangePlayerHeldItemCommand } from '@/logics/world-journey/commands/change-player-held-item-command';
import { DateModel } from '@/models/general/date-model';
import { Event, EventNameEnum, WorldEnteredEvent } from './events';

function parseWorldEnteredEvent(event: WorldEnteredEvent): [WorldModel, UnitModel[], string, PlayerModel[]] {
  return [
    parseWorldDto(event.world),
    event.units.map(parseUnitDto),
    event.myPlayerId,
    event.players.map(parsePlayerDto),
  ];
}

export class WorldJourneyApiService {
  private socket: WebSocket;

  constructor(
    worldId: string,
    params: {
      onWorldEntered: (worldJourney: WorldJourney) => void;
      onStaticUnitCreated: (command: CreateStaticUnitCommand) => void;
      onPortalUnitCreated: (command: CreatePortalUnitCommand) => void;
      onUnitRotated: (command: RotateUnitCommand) => void;
      onUnitRemoved: (command: RemoveUnitCommand) => void;
      onPlayerJoined: (command: AddPlayerCommand) => void;
      onPlayerMoved: (command: MovePlayerCommand) => void;
      onPlayerHeldItemChanged: (command: ChangePlayerHeldItemCommand) => void;
      onPlayerLeft: (command: RemovePlayerCommand) => void;
      onErrored: (message: string) => void;
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
      const event: Event = JSON.parse(eventJsonString);

      console.log(event);
      if (event.name === EventNameEnum.WorldEntered) {
        const [world, units, myPlayerId, players] = parseWorldEnteredEvent(event);
        const worldJourney = WorldJourney.new(world, players, myPlayerId, units);
        params.onWorldEntered(worldJourney);
      } else if (event.name === EventNameEnum.CommandSucceeded) {
        const command = parseCommandDto(event.command);
        if (command instanceof CreateStaticUnitCommand) {
          params.onStaticUnitCreated(command);
        } else if (command instanceof CreatePortalUnitCommand) {
          params.onPortalUnitCreated(command);
        } else if (command instanceof RotateUnitCommand) {
          params.onUnitRotated(command);
        } else if (command instanceof RemoveUnitCommand) {
          params.onUnitRemoved(command);
        } else if (command instanceof AddPlayerCommand) {
          params.onPlayerJoined(command);
        } else if (command instanceof MovePlayerCommand) {
          params.onPlayerMoved(command);
        } else if (command instanceof ChangePlayerHeldItemCommand) {
          params.onPlayerHeldItemChanged(command);
        } else if (command instanceof RemovePlayerCommand) {
          params.onPlayerLeft(command);
        }
      } else if (event.name === EventNameEnum.Errored) {
        params.onErrored(event.message);
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
      onStaticUnitCreated: (command: CreateStaticUnitCommand) => void;
      onPortalUnitCreated: (command: CreatePortalUnitCommand) => void;
      onUnitRotated: (command: RotateUnitCommand) => void;
      onUnitRemoved: (command: RemoveUnitCommand) => void;
      onPlayerJoined: (command: AddPlayerCommand) => void;
      onPlayerMoved: (command: MovePlayerCommand) => void;
      onPlayerHeldItemChanged: (command: ChangePlayerHeldItemCommand) => void;
      onPlayerLeft: (command: RemovePlayerCommand) => void;
      onErrored: (message: string) => void;
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
    const commandDto: PingCommandDto = {
      id: uuidv4(),
      timestamp: DateModel.now().getTimestampe(),
      name: CommandNameEnum.Ping,
    };
    this.sendMessage(commandDto);
  }

  public movePlayer(command: MovePlayerCommand) {
    const commandDto: MovePlayerCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestampe(),
      name: CommandNameEnum.MovePlayer,
      playerId: command.getPlayerId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
    };
    this.sendMessage(commandDto);
  }

  public changePlayerHeldItem(command: ChangePlayerHeldItemCommand) {
    const commandDto: ChangePlayerHeldItemCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestampe(),
      name: CommandNameEnum.ChangePlayerHeldItem,
      playerId: command.getPlayerId(),
      itemId: command.getItemId(),
    };
    this.sendMessage(commandDto);
  }

  public createStaticUnit(command: CreateStaticUnitCommand) {
    const commandDto: CreateStaticUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestampe(),
      name: CommandNameEnum.CreateStaticUnit,
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
    };
    this.sendMessage(commandDto);
  }

  public createPortalUnit(command: CreatePortalUnitCommand) {
    const commandDto: CreatePortalUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestampe(),
      name: CommandNameEnum.CreatePortalUnit,
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
    };
    this.sendMessage(commandDto);
  }

  public removeUnit(command: RemoveUnitCommand) {
    const commandDto: RemoveUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestampe(),
      name: CommandNameEnum.RemoveUnit,
      position: newPositionDto(command.getPosition()),
    };
    this.sendMessage(commandDto);
  }

  public rotateUnit(command: RotateUnitCommand) {
    const commandDto: RotateUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestampe(),
      name: CommandNameEnum.RotateUnit,
      position: newPositionDto(command.getPosition()),
    };
    this.sendMessage(commandDto);
  }
}
