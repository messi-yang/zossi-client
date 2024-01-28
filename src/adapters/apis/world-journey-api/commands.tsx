import { ChangePlayerActionCommand } from '@/services/world-journey-service/managers/command-manager/commands/change-player-action-command';
import { SendPlayerIntoPortalCommand } from '@/services/world-journey-service/managers/command-manager/commands/send-player-into-portal-command';
import { CreateStaticUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-static-unit-command';
import { ChangePlayerHeldItemCommand } from '@/services/world-journey-service/managers/command-manager/commands/change-player-held-item-command';
import { CreatePortalUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-portal-unit-command';
import { RemoveStaticUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-static-unit-command';
import { RemovePortalUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-portal-unit-command';
import { RotateUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/rotate-unit-command';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { PositionVo } from '@/models/world/common/position-vo';
import { AddPlayerCommand } from '@/services/world-journey-service/managers/command-manager/commands/add-player-command';
import { RemovePlayerCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-player-command';
import { Command } from '@/services/world-journey-service/managers/command-manager/command';
import { PlayerDto, parsePlayerDto } from '../dtos/player-dto';
import { PlayerActionDto, newPlayerActionDto, parsePlayerActionDto } from '../dtos/player-action-dto';
import { PositionDto, newPositionDto } from '../dtos/position-dto';
import { CreateFenceUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-fence-unit-command';
import { RemoveFenceUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-fence-unit-command';
import { CreateLinkUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-link-unit-command';
import { RemoveLinkUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-link-unit-command';

enum CommandNameEnum {
  Ping = 'PING',
  AddPlayer = 'ADD_PLAYER',
  RemovePlayer = 'REMOVE_PLAYER',
  MovePlayer = 'MOVE_PLAYER',
  ChangePlayerAction = 'CHANGE_PLAYER_ACTION',
  SendPlayerIntoPortal = 'SEND_PLAYER_INTO_PORTAL',
  ChangePlayerHeldItem = 'CHANGE_PLAYER_HELD_ITEM',
  CreateStaticUnit = 'CREATE_STATIC_UNIT',
  RemoveStaticUnit = 'REMOVE_STATIC_UNIT',
  CreateFenceUnit = 'CREATE_FENCE_UNIT',
  RemoveFenceUnit = 'REMOVE_FENCE_UNIT',
  CreatePortalUnit = 'CREATE_PORTAL_UNIT',
  RemovePortalUnit = 'REMOVE_PORTAL_UNIT',
  CreateLinkUnit = 'CREATE_LINK_UNIT',
  RemoveLinkUnit = 'REMOVE_LINK_UNIT',
  RotateUnit = 'ROTATE_UNIT',
}

export type PingCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.Ping;
};

type AddPlayerCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.AddPlayer;
  player: PlayerDto;
};

type ChangePlayerActionCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.ChangePlayerAction;
  playerId: string;
  action: PlayerActionDto;
};

type SendPlayerIntoPortalCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.SendPlayerIntoPortal;
  playerId: string;
  position: PositionDto;
};

type RemovePlayerCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemovePlayer;
  playerId: string;
};

type ChangePlayerHeldItemCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.ChangePlayerHeldItem;
  playerId: string;
  itemId: string;
};

type CreateStaticUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreateStaticUnit;
  itemId: string;
  position: PositionDto;
  direction: number;
};

type RemoveStaticUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemoveStaticUnit;
  position: PositionDto;
};

type CreateFenceUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreateFenceUnit;
  itemId: string;
  position: PositionDto;
  direction: number;
};

type RemoveFenceUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemoveFenceUnit;
  position: PositionDto;
};

type CreatePortalUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreatePortalUnit;
  itemId: string;
  position: PositionDto;
  direction: number;
};

type RemovePortalUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemovePortalUnit;
  position: PositionDto;
};

type CreateLinkUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreateLinkUnit;
  itemId: string;
  position: PositionDto;
  direction: number;
  url: string;
};

type RemoveLinkUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemoveLinkUnit;
  position: PositionDto;
};

type RotateUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RotateUnit;
  position: PositionDto;
};

function parseCreateStaticCommand(command: CreateStaticUnitCommandDto): CreateStaticUnitCommand {
  return CreateStaticUnitCommand.load(
    command.id,
    command.timestamp,
    command.itemId,
    PositionVo.new(command.position.x, command.position.z),
    DirectionVo.new(command.direction)
  );
}

function parseRemoveStaticUnitCommand(command: RemoveStaticUnitCommandDto): RemoveStaticUnitCommand {
  return RemoveStaticUnitCommand.load(
    command.id,
    command.timestamp,
    PositionVo.new(command.position.x, command.position.z)
  );
}

function parseCreateFenceCommand(command: CreateFenceUnitCommandDto): CreateFenceUnitCommand {
  return CreateFenceUnitCommand.load(
    command.id,
    command.timestamp,
    command.itemId,
    PositionVo.new(command.position.x, command.position.z),
    DirectionVo.new(command.direction)
  );
}

function parseRemoveFenceUnitCommand(command: RemoveFenceUnitCommandDto): RemoveFenceUnitCommand {
  return RemoveFenceUnitCommand.load(
    command.id,
    command.timestamp,
    PositionVo.new(command.position.x, command.position.z)
  );
}

function parseCreatePortalUnitCommand(command: CreatePortalUnitCommandDto): CreatePortalUnitCommand {
  return CreatePortalUnitCommand.load(
    command.id,
    command.timestamp,
    command.itemId,
    PositionVo.new(command.position.x, command.position.z),
    DirectionVo.new(command.direction)
  );
}

function parseRemovePortalUnitCommand(command: RemovePortalUnitCommandDto): RemovePortalUnitCommand {
  return RemovePortalUnitCommand.load(
    command.id,
    command.timestamp,
    PositionVo.new(command.position.x, command.position.z)
  );
}

function parseCreateLinkUnitCommand(command: CreateLinkUnitCommandDto): CreateLinkUnitCommand {
  return CreateLinkUnitCommand.load(
    command.id,
    command.timestamp,
    command.itemId,
    PositionVo.new(command.position.x, command.position.z),
    DirectionVo.new(command.direction),
    command.url
  );
}

function parseRemoveLinkUnitCommand(command: RemoveLinkUnitCommandDto): RemoveLinkUnitCommand {
  return RemoveLinkUnitCommand.load(
    command.id,
    command.timestamp,
    PositionVo.new(command.position.x, command.position.z)
  );
}

function parseRotateUnitCommand(command: RotateUnitCommandDto): RotateUnitCommand {
  return RotateUnitCommand.load(command.id, command.timestamp, PositionVo.new(command.position.x, command.position.z));
}

function parseAddPlayerAddPlayerCommand(command: AddPlayerCommandDto): AddPlayerCommand {
  return AddPlayerCommand.load(command.id, command.timestamp, parsePlayerDto(command.player));
}

function parseChangePlayerActionCommand(command: ChangePlayerActionCommandDto): ChangePlayerActionCommand {
  return ChangePlayerActionCommand.load(
    command.id,
    command.timestamp,
    command.playerId,
    parsePlayerActionDto(command.action)
  );
}

function parseSendPlayerIntoPortalCommand(command: SendPlayerIntoPortalCommandDto): SendPlayerIntoPortalCommand {
  return SendPlayerIntoPortalCommand.load(
    command.id,
    command.timestamp,
    command.playerId,
    PositionVo.new(command.position.x, command.position.z)
  );
}

function parseChangePlayerHeldItemCommand(command: ChangePlayerHeldItemCommandDto): ChangePlayerHeldItemCommand {
  return ChangePlayerHeldItemCommand.load(command.id, command.timestamp, command.playerId, command.itemId);
}

function parseRemoveRemovePlayerCommand(command: RemovePlayerCommandDto): RemovePlayerCommand {
  return RemovePlayerCommand.load(command.id, command.timestamp, command.playerId);
}

export const parseCommandDto = (commandDto: CommandDto) => {
  if (commandDto.name === CommandNameEnum.CreateStaticUnit) {
    return parseCreateStaticCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.RemoveStaticUnit) {
    return parseRemoveStaticUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.CreateFenceUnit) {
    return parseCreateFenceCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.RemoveFenceUnit) {
    return parseRemoveFenceUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.CreatePortalUnit) {
    return parseCreatePortalUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.RemovePortalUnit) {
    return parseRemovePortalUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.CreateLinkUnit) {
    return parseCreateLinkUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.RemoveLinkUnit) {
    return parseRemoveLinkUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.RotateUnit) {
    return parseRotateUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.AddPlayer) {
    return parseAddPlayerAddPlayerCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.ChangePlayerAction) {
    return parseChangePlayerActionCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.SendPlayerIntoPortal) {
    return parseSendPlayerIntoPortalCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.ChangePlayerHeldItem) {
    return parseChangePlayerHeldItemCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.RemovePlayer) {
    return parseRemoveRemovePlayerCommand(commandDto);
  }
  return null;
};

export const toCommandDto = (command: Command) => {
  if (command instanceof CreateStaticUnitCommand) {
    const commandDto: CreateStaticUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.CreateStaticUnit,
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
    };
    return commandDto;
  } else if (command instanceof RemoveStaticUnitCommand) {
    const commandDto: RemoveStaticUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.RemoveStaticUnit,
      position: newPositionDto(command.getPosition()),
    };
    return commandDto;
  } else if (command instanceof CreateFenceUnitCommand) {
    const commandDto: CreateFenceUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.CreateFenceUnit,
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
    };
    return commandDto;
  } else if (command instanceof RemoveFenceUnitCommand) {
    const commandDto: RemoveFenceUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.RemoveFenceUnit,
      position: newPositionDto(command.getPosition()),
    };
    return commandDto;
  } else if (command instanceof CreatePortalUnitCommand) {
    const commandDto: CreatePortalUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.CreatePortalUnit,
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
    };
    return commandDto;
  } else if (command instanceof RemovePortalUnitCommand) {
    const commandDto: RemovePortalUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.RemovePortalUnit,
      position: newPositionDto(command.getPosition()),
    };
    return commandDto;
  } else if (command instanceof CreateLinkUnitCommand) {
    const commandDto: CreateLinkUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.CreateLinkUnit,
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
      url: command.getUrl(),
    };
    return commandDto;
  } else if (command instanceof RemoveLinkUnitCommand) {
    const commandDto: RemoveLinkUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.RemoveLinkUnit,
      position: newPositionDto(command.getPosition()),
    };
    return commandDto;
  } else if (command instanceof RotateUnitCommand) {
    const commandDto: RotateUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.RotateUnit,
      position: newPositionDto(command.getPosition()),
    };
    return commandDto;
  } else if (command instanceof ChangePlayerActionCommand) {
    const commandDto: ChangePlayerActionCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.ChangePlayerAction,
      playerId: command.getPlayerId(),
      action: newPlayerActionDto(command.getAction()),
    };
    return commandDto;
  } else if (command instanceof SendPlayerIntoPortalCommand) {
    const commandDto: SendPlayerIntoPortalCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.SendPlayerIntoPortal,
      playerId: command.getPlayerId(),
      position: newPositionDto(command.getPosition()),
    };
    return commandDto;
  } else if (command instanceof ChangePlayerHeldItemCommand) {
    const commandDto: ChangePlayerHeldItemCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.ChangePlayerHeldItem,
      playerId: command.getPlayerId(),
      itemId: command.getItemId(),
    };
    return commandDto;
  }
  return null;
};

export { CommandNameEnum };

export type CommandDto =
  | PingCommandDto
  | AddPlayerCommandDto
  | ChangePlayerActionCommandDto
  | SendPlayerIntoPortalCommandDto
  | RemovePlayerCommandDto
  | ChangePlayerHeldItemCommandDto
  | CreateStaticUnitCommandDto
  | RemoveStaticUnitCommandDto
  | CreateFenceUnitCommandDto
  | RemoveFenceUnitCommandDto
  | CreatePortalUnitCommandDto
  | RemovePortalUnitCommandDto
  | CreateLinkUnitCommandDto
  | RemoveLinkUnitCommandDto
  | RotateUnitCommandDto;
