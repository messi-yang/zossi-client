import { v4 as uuidv4 } from 'uuid';
import { parsePlayerDto, parseUnitDto, parseWorldDto, newPositionDto } from '@/apis/dtos';
import { CommandNameEnum } from './commands';
import type {
  PingCommandDto,
  EnterWorldCommandDto,
  AddPlayerCommandDto,
  MovePlayerCommandDto,
  ChangePlayerHeldItemCommandDto,
  RemovePlayerCommandDto,
  CreateStaticUnitCommandDto,
  CreatePortalUnitCommandDto,
  RotateUnitCommandDto,
  RemoveUnitCommandDto,
  Command,
} from './commands';
import { DirectionModel } from '@/models/world/direction-model';
import { PositionModel } from '@/models/world/position-model';
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

function parseEnterWorldCommand(command: EnterWorldCommandDto): [WorldModel, UnitModel[], string, PlayerModel[]] {
  return [
    parseWorldDto(command.world),
    command.units.map(parseUnitDto),
    command.myPlayerId,
    command.players.map(parsePlayerDto),
  ];
}

function parseCreateStaticCreateStaticUnitCommandDto(command: CreateStaticUnitCommandDto): CreateStaticUnitCommand {
  return CreateStaticUnitCommand.load(
    command.id,
    command.timestamp,
    command.itemId,
    PositionModel.new(command.position.x, command.position.z),
    DirectionModel.new(command.direction)
  );
}

function parseCreatePortalUnitCommand(command: CreatePortalUnitCommandDto): CreateStaticUnitCommand {
  return CreateStaticUnitCommand.load(
    command.id,
    command.timestamp,
    command.itemId,
    PositionModel.new(command.position.x, command.position.z),
    DirectionModel.new(command.direction)
  );
}

function parseRotateUnitCommand(command: RotateUnitCommandDto): RotateUnitCommand {
  return RotateUnitCommand.load(
    command.id,
    command.timestamp,
    PositionModel.new(command.position.x, command.position.z)
  );
}

function parseRemoveUnitCommand(command: RemoveUnitCommandDto): RemoveUnitCommand {
  return RemoveUnitCommand.load(
    command.id,
    command.timestamp,
    PositionModel.new(command.position.x, command.position.z)
  );
}

function parseAddPlayerAddPlayerCommand(command: AddPlayerCommandDto): AddPlayerCommand {
  return AddPlayerCommand.load(command.id, command.timestamp, parsePlayerDto(command.player));
}

function parseMovePlayerCommand(command: MovePlayerCommandDto): MovePlayerCommand {
  return MovePlayerCommand.load(
    command.id,
    command.timestamp,
    command.playerId,
    PositionModel.new(command.position.x, command.position.z),
    DirectionModel.new(command.direction)
  );
}

function parseChangeChangePlayerHeldItemCommand(command: ChangePlayerHeldItemCommandDto): ChangePlayerHeldItemCommand {
  return ChangePlayerHeldItemCommand.load(command.id, command.timestamp, command.playerId, command.itemId);
}

function parseRemoveRemovePlayerCommand(command: RemovePlayerCommandDto): RemovePlayerCommand {
  return RemovePlayerCommand.load(command.id, command.timestamp, command.playerId);
}

export class WorldJourneyApiService {
  private socket: WebSocket;

  constructor(
    worldId: string,
    params: {
      onWorldEntered: (worldJourney: WorldJourney) => void;
      onStaticUnitCreated: (command: CreateStaticUnitCommand) => void;
      onPortalUnitCreated: (command: CreateStaticUnitCommand) => void;
      onUnitRotated: (command: RotateUnitCommand) => void;
      onUnitRemoved: (command: RemoveUnitCommand) => void;
      onPlayerJoined: (command: AddPlayerCommand) => void;
      onPlayerMoved: (command: MovePlayerCommand) => void;
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
      const newMsg: Command = JSON.parse(eventJsonString);

      console.log(newMsg);
      if (newMsg.name === CommandNameEnum.EnterWorld) {
        const [world, units, myPlayerId, players] = parseEnterWorldCommand(newMsg);
        const worldJourney = WorldJourney.new(world, players, myPlayerId, units);
        params.onWorldEntered(worldJourney);
      } else if (newMsg.name === CommandNameEnum.CreateStaticUnit) {
        const command = parseCreateStaticCreateStaticUnitCommandDto(newMsg);
        params.onStaticUnitCreated(command);
      } else if (newMsg.name === CommandNameEnum.CreatePortalUnit) {
        const command = parseCreatePortalUnitCommand(newMsg);
        params.onPortalUnitCreated(command);
      } else if (newMsg.name === CommandNameEnum.RotateUnit) {
        const command = parseRotateUnitCommand(newMsg);
        params.onUnitRotated(command);
      } else if (newMsg.name === CommandNameEnum.RemoveUnit) {
        const command = parseRemoveUnitCommand(newMsg);
        params.onUnitRemoved(command);
      } else if (newMsg.name === CommandNameEnum.AddPlayer) {
        const command = parseAddPlayerAddPlayerCommand(newMsg);
        params.onPlayerJoined(command);
      } else if (newMsg.name === CommandNameEnum.MovePlayer) {
        const command = parseMovePlayerCommand(newMsg);
        params.onPlayerMoved(command);
      } else if (newMsg.name === CommandNameEnum.ChangePlayerHeldItem) {
        const command = parseChangeChangePlayerHeldItemCommand(newMsg);
        params.onPlayerHeldItemChanged(command);
      } else if (newMsg.name === CommandNameEnum.RemovePlayer) {
        const command = parseRemoveRemovePlayerCommand(newMsg);
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
      onStaticUnitCreated: (command: CreateStaticUnitCommand) => void;
      onPortalUnitCreated: (command: CreateStaticUnitCommand) => void;
      onUnitRotated: (command: RotateUnitCommand) => void;
      onUnitRemoved: (command: RemoveUnitCommand) => void;
      onPlayerJoined: (command: AddPlayerCommand) => void;
      onPlayerMoved: (command: MovePlayerCommand) => void;
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
