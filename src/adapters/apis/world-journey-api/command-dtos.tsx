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
import { DateVo } from '@/models/global/date-vo';
import { CommandNameEnum } from '@/services/world-journey-service/managers/command-manager/command-name-enum';
import { dispatchCommand } from '@/services/world-journey-service/managers/command-manager/utils';

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

// Hello

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
    DateVo.fromTimestamp(command.timestamp),
    command.unitId,
    command.itemId,
    PositionVo.create(command.position.x, command.position.z),
    DirectionVo.create(command.direction)
  );
}

function parseRemoveStaticUnitCommand(command: RemoveStaticUnitCommandDto): RemoveStaticUnitCommand {
  return RemoveStaticUnitCommand.createRemote(command.id, DateVo.fromTimestamp(command.timestamp), command.unitId);
}

function parseCreateFenceCommand(command: CreateFenceUnitCommandDto): CreateFenceUnitCommand {
  return CreateFenceUnitCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.unitId,
    command.itemId,
    PositionVo.create(command.position.x, command.position.z),
    DirectionVo.create(command.direction)
  );
}

function parseRemoveFenceUnitCommand(command: RemoveFenceUnitCommandDto): RemoveFenceUnitCommand {
  return RemoveFenceUnitCommand.createRemote(command.id, DateVo.fromTimestamp(command.timestamp), command.unitId);
}

function parseCreatePortalUnitCommand(command: CreatePortalUnitCommandDto): CreatePortalUnitCommand {
  return CreatePortalUnitCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.unitId,
    command.itemId,
    PositionVo.create(command.position.x, command.position.z),
    DirectionVo.create(command.direction)
  );
}

function parseRemovePortalUnitCommand(command: RemovePortalUnitCommandDto): RemovePortalUnitCommand {
  return RemovePortalUnitCommand.createRemote(command.id, DateVo.fromTimestamp(command.timestamp), command.unitId);
}

function parseCreateLinkUnitCommand(command: CreateLinkUnitCommandDto): CreateLinkUnitCommand {
  return CreateLinkUnitCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.unitId,
    command.itemId,
    PositionVo.create(command.position.x, command.position.z),
    DirectionVo.create(command.direction),
    command.label,
    command.url
  );
}

function parseRemoveLinkUnitCommand(command: RemoveLinkUnitCommandDto): RemoveLinkUnitCommand {
  return RemoveLinkUnitCommand.createRemote(command.id, DateVo.fromTimestamp(command.timestamp), command.unitId);
}

function parseCreateEmbedUnitCommand(command: CreateEmbedUnitCommandDto): CreateEmbedUnitCommand {
  return CreateEmbedUnitCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.unitId,
    command.itemId,
    PositionVo.create(command.position.x, command.position.z),
    DirectionVo.create(command.direction),
    command.label,
    command.embedCode
  );
}

function parseRemoveEmbedUnitCommand(command: RemoveEmbedUnitCommandDto): RemoveEmbedUnitCommand {
  return RemoveEmbedUnitCommand.createRemote(command.id, DateVo.fromTimestamp(command.timestamp), command.unitId);
}

function parseRotateUnitCommand(command: RotateUnitCommandDto): RotateUnitCommand {
  return RotateUnitCommand.createRemote(command.id, DateVo.fromTimestamp(command.timestamp), command.unitId);
}

function parseChangePlayerActionCommand(command: ChangePlayerActionCommandDto): ChangePlayerActionCommand {
  return ChangePlayerActionCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.playerId,
    parsePlayerActionDto(command.action)
  );
}

function parseChangePlayerPrecisePositionCommand(command: ChangePlayerPrecisePositionCommandDto): ChangePlayerPrecisePositionCommand {
  return ChangePlayerPrecisePositionCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.playerId,
    PrecisePositionVo.create(command.precisePosition.x, command.precisePosition.z)
  );
}

function parseSendPlayerIntoPortalCommand(command: SendPlayerIntoPortalCommandDto): SendPlayerIntoPortalCommand {
  return SendPlayerIntoPortalCommand.createRemote(command.id, DateVo.fromTimestamp(command.timestamp), command.playerId, command.unitId);
}

function parseChangePlayerHeldItemCommand(command: ChangePlayerHeldItemCommandDto): ChangePlayerHeldItemCommand {
  return ChangePlayerHeldItemCommand.createRemote(command.id, DateVo.fromTimestamp(command.timestamp), command.playerId, command.itemId);
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

export const toCommandDto = (sourceCommand: Command) => {
  return dispatchCommand<CommandDto | null>(sourceCommand, {
    [CommandNameEnum.CreateStaticUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.CreateStaticUnit,
      unitId: command.getUnitId(),
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
    }),
    [CommandNameEnum.RemoveStaticUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.RemoveStaticUnit,
      unitId: command.getUnitId(),
    }),
    [CommandNameEnum.CreateFenceUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.CreateFenceUnit,
      unitId: command.getUnitId(),
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
    }),
    [CommandNameEnum.RemoveFenceUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.RemoveFenceUnit,
      unitId: command.getUnitId(),
    }),
    [CommandNameEnum.CreatePortalUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.CreatePortalUnit,
      unitId: command.getUnitId(),
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
    }),
    [CommandNameEnum.RemovePortalUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.RemovePortalUnit,
      unitId: command.getUnitId(),
    }),
    [CommandNameEnum.CreateLinkUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.CreateLinkUnit,
      unitId: command.getUnitId(),
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
      label: command.getLabel(),
      url: command.getUrl(),
    }),
    [CommandNameEnum.RemoveLinkUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.RemoveLinkUnit,
      unitId: command.getUnitId(),
    }),
    [CommandNameEnum.CreateEmbedUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.CreateEmbedUnit,
      unitId: command.getUnitId(),
      itemId: command.getItemId(),
      position: newPositionDto(command.getPosition()),
      direction: command.getDirection().toNumber(),
      label: command.getLabel(),
      embedCode: command.getEmbedCode(),
    }),
    [CommandNameEnum.RemoveEmbedUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.RemoveEmbedUnit,
      unitId: command.getUnitId(),
    }),
    [CommandNameEnum.RotateUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.RotateUnit,
      unitId: command.getUnitId(),
    }),
    [CommandNameEnum.ChangePlayerAction]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.ChangePlayerAction,
      playerId: command.getPlayerId(),
      action: newPlayerActionDto(command.getAction()),
    }),
    [CommandNameEnum.ChangePlayerPrecisePosition]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.ChangePlayerPrecisePosition,
      playerId: command.getPlayerId(),
      precisePosition: newPrecisePositionDto(command.getPrecisePosition()),
    }),
    [CommandNameEnum.SendPlayerIntoPortal]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.SendPlayerIntoPortal,
      playerId: command.getPlayerId(),
      unitId: command.getUnitId(),
    }),
    [CommandNameEnum.ChangePlayerHeldItem]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.ChangePlayerHeldItem,
      playerId: command.getPlayerId(),
      itemId: command.getItemId(),
    }),
    [CommandNameEnum.AddPlayer]: () => null,
    [CommandNameEnum.RemovePlayer]: () => null,
  });
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
