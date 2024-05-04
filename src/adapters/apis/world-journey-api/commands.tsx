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
import { Command } from '@/services/world-journey-service/managers/command-manager/command';
import { PlayerActionDto, newPlayerActionDto, parsePlayerActionDto } from '../dtos/player-action-dto';
import { PositionDto, newPositionDto } from '../dtos/position-dto';
import { CreateFenceUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-fence-unit-command';
import { RemoveFenceUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-fence-unit-command';
import { CreateLinkUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-link-unit-command';
import { RemoveLinkUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-link-unit-command';
import { CreateEmbedUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-embed-unit-command';
import { RemoveEmbedUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-embed-unit-command';
import { PrecisePositionDto, newPrecisePositionDto } from '../dtos/precise-position-dto';
import { ChangePlayerPrecisePositionCommand } from '@/services/world-journey-service/managers/command-manager/commands/change-player-precise-position-command';
import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';

enum CommandNameEnum {
  MovePlayer = 'MOVE_PLAYER',
  ChangePlayerAction = 'CHANGE_PLAYER_ACTION',
  ChangePlayerPrecisePosition = 'CHANGE_PLAYER_PRECISE_POSITION',
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
  CreateEmbedUnit = 'CREATE_EMBED_UNIT',
  RemoveEmbedUnit = 'REMOVE_EMBED_UNIT',
  RotateUnit = 'ROTATE_UNIT',
}

type ChangePlayerActionCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.ChangePlayerAction;
  playerId: string;
  action: PlayerActionDto;
};

type ChangePlayerPrecisePositionCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.ChangePlayerPrecisePosition;
  playerId: string;
  precisePosition: PrecisePositionDto;
};

type SendPlayerIntoPortalCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.SendPlayerIntoPortal;
  playerId: string;
  unitId: string;
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
  unitId: string;
  itemId: string;
  position: PositionDto;
  direction: number;
};

type RemoveStaticUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemoveStaticUnit;
  unitId: string;
};

type CreateFenceUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreateFenceUnit;
  unitId: string;
  itemId: string;
  position: PositionDto;
  direction: number;
};

type RemoveFenceUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemoveFenceUnit;
  unitId: string;
};

type CreatePortalUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreatePortalUnit;
  unitId: string;
  itemId: string;
  position: PositionDto;
  direction: number;
};

type RemovePortalUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemovePortalUnit;
  unitId: string;
};

type CreateLinkUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreateLinkUnit;
  unitId: string;
  itemId: string;
  position: PositionDto;
  direction: number;
  label: string | null;
  url: string;
};

type RemoveLinkUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemoveLinkUnit;
  unitId: string;
};

type CreateEmbedUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreateEmbedUnit;
  unitId: string;
  itemId: string;
  position: PositionDto;
  direction: number;
  label: string | null;
  embedCode: string;
};

type RemoveEmbedUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemoveEmbedUnit;
  unitId: string;
};

type RotateUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RotateUnit;
  unitId: string;
};

function parseCreateStaticCommand(command: CreateStaticUnitCommandDto): CreateStaticUnitCommand {
  return CreateStaticUnitCommand.createRemote(
    command.id,
    command.timestamp,
    command.unitId,
    command.itemId,
    PositionVo.create(command.position.x, command.position.z),
    DirectionVo.create(command.direction)
  );
}

function parseRemoveStaticUnitCommand(command: RemoveStaticUnitCommandDto): RemoveStaticUnitCommand {
  return RemoveStaticUnitCommand.createRemote(command.id, command.timestamp, command.unitId);
}

function parseCreateFenceCommand(command: CreateFenceUnitCommandDto): CreateFenceUnitCommand {
  return CreateFenceUnitCommand.createRemote(
    command.id,
    command.timestamp,
    command.unitId,
    command.itemId,
    PositionVo.create(command.position.x, command.position.z),
    DirectionVo.create(command.direction)
  );
}

function parseRemoveFenceUnitCommand(command: RemoveFenceUnitCommandDto): RemoveFenceUnitCommand {
  return RemoveFenceUnitCommand.createRemote(command.id, command.timestamp, command.unitId);
}

function parseCreatePortalUnitCommand(command: CreatePortalUnitCommandDto): CreatePortalUnitCommand {
  return CreatePortalUnitCommand.createRemote(
    command.id,
    command.timestamp,
    command.unitId,
    command.itemId,
    PositionVo.create(command.position.x, command.position.z),
    DirectionVo.create(command.direction)
  );
}

function parseRemovePortalUnitCommand(command: RemovePortalUnitCommandDto): RemovePortalUnitCommand {
  return RemovePortalUnitCommand.createRemote(command.id, command.timestamp, command.unitId);
}

function parseCreateLinkUnitCommand(command: CreateLinkUnitCommandDto): CreateLinkUnitCommand {
  return CreateLinkUnitCommand.createRemote(
    command.id,
    command.timestamp,
    command.unitId,
    command.itemId,
    PositionVo.create(command.position.x, command.position.z),
    DirectionVo.create(command.direction),
    command.label,
    command.url
  );
}

function parseRemoveLinkUnitCommand(command: RemoveLinkUnitCommandDto): RemoveLinkUnitCommand {
  return RemoveLinkUnitCommand.createRemote(command.id, command.timestamp, command.unitId);
}

function parseCreateEmbedUnitCommand(command: CreateEmbedUnitCommandDto): CreateEmbedUnitCommand {
  return CreateEmbedUnitCommand.createRemote(
    command.id,
    command.timestamp,
    command.unitId,
    command.itemId,
    PositionVo.create(command.position.x, command.position.z),
    DirectionVo.create(command.direction),
    command.label,
    command.embedCode
  );
}

function parseRemoveEmbedUnitCommand(command: RemoveEmbedUnitCommandDto): RemoveEmbedUnitCommand {
  return RemoveEmbedUnitCommand.createRemote(command.id, command.timestamp, command.unitId);
}

function parseRotateUnitCommand(command: RotateUnitCommandDto): RotateUnitCommand {
  return RotateUnitCommand.createRemote(command.id, command.timestamp, command.unitId);
}

function parseChangePlayerActionCommand(command: ChangePlayerActionCommandDto): ChangePlayerActionCommand {
  return ChangePlayerActionCommand.createRemote(
    command.id,
    command.timestamp,
    command.playerId,
    parsePlayerActionDto(command.action)
  );
}

function parseChangePlayerPrecisePositionCommand(
  command: ChangePlayerPrecisePositionCommandDto
): ChangePlayerPrecisePositionCommand {
  return ChangePlayerPrecisePositionCommand.createRemote(
    command.id,
    command.timestamp,
    command.playerId,
    PrecisePositionVo.create(command.precisePosition.x, command.precisePosition.z)
  );
}

function parseSendPlayerIntoPortalCommand(command: SendPlayerIntoPortalCommandDto): SendPlayerIntoPortalCommand {
  return SendPlayerIntoPortalCommand.createRemote(command.id, command.timestamp, command.playerId, command.unitId);
}

function parseChangePlayerHeldItemCommand(command: ChangePlayerHeldItemCommandDto): ChangePlayerHeldItemCommand {
  return ChangePlayerHeldItemCommand.createRemote(command.id, command.timestamp, command.playerId, command.itemId);
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
  } else if (commandDto.name === CommandNameEnum.CreateEmbedUnit) {
    return parseCreateEmbedUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.RemoveEmbedUnit) {
    return parseRemoveEmbedUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.RotateUnit) {
    return parseRotateUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.ChangePlayerAction) {
    return parseChangePlayerActionCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.ChangePlayerPrecisePosition) {
    return parseChangePlayerPrecisePositionCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.SendPlayerIntoPortal) {
    return parseSendPlayerIntoPortalCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.ChangePlayerHeldItem) {
    return parseChangePlayerHeldItemCommand(commandDto);
  }
  return null;
};

export const toCommandDto = (command: Command) => {
  if (command instanceof CreateStaticUnitCommand) {
    const commandDto: CreateStaticUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.CreateStaticUnit,
      unitId: command.getUnitId(),
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
      unitId: command.getUnitId(),
    };
    return commandDto;
  } else if (command instanceof CreateFenceUnitCommand) {
    const commandDto: CreateFenceUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.CreateFenceUnit,
      unitId: command.getUnitId(),
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
      unitId: command.getUnitId(),
    };
    return commandDto;
  } else if (command instanceof CreatePortalUnitCommand) {
    const commandDto: CreatePortalUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.CreatePortalUnit,
      unitId: command.getUnitId(),
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
      unitId: command.getUnitId(),
    };
    return commandDto;
  } else if (command instanceof CreateLinkUnitCommand) {
    const commandDto: CreateLinkUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.CreateLinkUnit,
      unitId: command.getUnitId(),
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
      label: command.getLabel(),
      url: command.getUrl(),
    };
    return commandDto;
  } else if (command instanceof RemoveLinkUnitCommand) {
    const commandDto: RemoveLinkUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.RemoveLinkUnit,
      unitId: command.getUnitId(),
    };
    return commandDto;
  } else if (command instanceof CreateEmbedUnitCommand) {
    const commandDto: CreateEmbedUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.CreateEmbedUnit,
      unitId: command.getUnitId(),
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
      label: command.getLabel(),
      embedCode: command.getEmbedCode(),
    };
    return commandDto;
  } else if (command instanceof RemoveEmbedUnitCommand) {
    const commandDto: RemoveEmbedUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.RemoveEmbedUnit,
      unitId: command.getUnitId(),
    };
    return commandDto;
  } else if (command instanceof RotateUnitCommand) {
    const commandDto: RotateUnitCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.RotateUnit,
      unitId: command.getUnitId(),
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
  } else if (command instanceof ChangePlayerPrecisePositionCommand) {
    const commandDto: ChangePlayerPrecisePositionCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.ChangePlayerPrecisePosition,
      playerId: command.getPlayerId(),
      precisePosition: newPrecisePositionDto(command.getPrecisePosition()),
    };
    return commandDto;
  } else if (command instanceof SendPlayerIntoPortalCommand) {
    const commandDto: SendPlayerIntoPortalCommandDto = {
      id: command.getId(),
      timestamp: command.getTimestamp(),
      name: CommandNameEnum.SendPlayerIntoPortal,
      playerId: command.getPlayerId(),
      unitId: command.getUnitId(),
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
  | ChangePlayerActionCommandDto
  | ChangePlayerPrecisePositionCommandDto
  | SendPlayerIntoPortalCommandDto
  | ChangePlayerHeldItemCommandDto
  | CreateStaticUnitCommandDto
  | RemoveStaticUnitCommandDto
  | CreateFenceUnitCommandDto
  | RemoveFenceUnitCommandDto
  | CreatePortalUnitCommandDto
  | RemovePortalUnitCommandDto
  | CreateLinkUnitCommandDto
  | RemoveLinkUnitCommandDto
  | CreateEmbedUnitCommandDto
  | RemoveEmbedUnitCommandDto
  | RotateUnitCommandDto;
