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
import { TeleportPlayerCommand } from '@/services/world-journey-service/managers/command-manager/commands/teleport-player-command';

type ChangePlayerActionCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.ChangePlayerAction;
  payload: {
    playerId: string;
    playerAction: PlayerActionDto;
  };
};

type ChangePlayerPrecisePositionCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.ChangePlayerPrecisePosition;
  playerId: string;
  payload: {
    precisePosition: PrecisePositionDto;
  };
};

type SendPlayerIntoPortalCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.SendPlayerIntoPortal;
  payload: {
    playerId: string;
    unitId: string;
  };
};

type TeleportPlayerCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.TeleportPlayer;
  payload: {
    playerId: string;
    position: PositionDto;
  };
};

type ChangePlayerHeldItemCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.ChangePlayerHeldItem;
  payload: {
    playerId: string;
    itemId: string;
  };
};

type CreateStaticUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreateStaticUnit;
  payload: {
    unitId: string;
    itemId: string;
    unitPosition: PositionDto;
    unitDirection: number;
  };
};

type RemoveStaticUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemoveStaticUnit;
  payload: {
    unitId: string;
  };
};

type CreateFenceUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreateFenceUnit;
  payload: {
    unitId: string;
    itemId: string;
    unitPosition: PositionDto;
    unitDirection: number;
  };
};

// Hello

type RemoveFenceUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemoveFenceUnit;
  payload: {
    unitId: string;
  };
};

type CreatePortalUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreatePortalUnit;
  payload: {
    unitId: string;
    itemId: string;
    unitPosition: PositionDto;
    unitDirection: number;
  };
};

type RemovePortalUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemovePortalUnit;
  payload: {
    unitId: string;
  };
};

type CreateLinkUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreateLinkUnit;
  payload: {
    unitId: string;
    itemId: string;
    unitPosition: PositionDto;
    unitDirection: number;
    unitLabel: string | null;
    unitUrl: string;
  };
};

type RemoveLinkUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemoveLinkUnit;
  payload: {
    unitId: string;
  };
};

type CreateEmbedUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreateEmbedUnit;
  payload: {
    unitId: string;
    itemId: string;
    unitPosition: PositionDto;
    unitDirection: number;
    unitLabel: string | null;
    unitEmbedCode: string;
  };
};

type RemoveEmbedUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemoveEmbedUnit;
  payload: {
    unitId: string;
  };
};

type CreateColorUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreateColorUnit;
  payload: {
    unitId: string;
    itemId: string;
    unitPosition: PositionDto;
    unitDirection: number;
    unitLabel: null;
    unitColor: string;
  };
};

type RemoveColorUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemoveColorUnit;
  payload: {
    unitId: string;
  };
};

type RotateUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RotateUnit;
  payload: {
    unitId: string;
  };
};

function parseCreateStaticCommand(command: CreateStaticUnitCommandDto): CreateStaticUnitCommand {
  return CreateStaticUnitCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.payload.unitId,
    command.payload.itemId,
    PositionVo.create(command.payload.unitPosition.x, command.payload.unitPosition.z),
    DirectionVo.create(command.payload.unitDirection)
  );
}

function parseRemoveStaticUnitCommand(command: RemoveStaticUnitCommandDto): RemoveStaticUnitCommand {
  return RemoveStaticUnitCommand.createRemote(command.id, DateVo.fromTimestamp(command.timestamp), command.payload.unitId);
}

function parseCreateFenceCommand(command: CreateFenceUnitCommandDto): CreateFenceUnitCommand {
  return CreateFenceUnitCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.payload.unitId,
    command.payload.itemId,
    PositionVo.create(command.payload.unitPosition.x, command.payload.unitPosition.z),
    DirectionVo.create(command.payload.unitDirection)
  );
}

function parseRemoveFenceUnitCommand(command: RemoveFenceUnitCommandDto): RemoveFenceUnitCommand {
  return RemoveFenceUnitCommand.createRemote(command.id, DateVo.fromTimestamp(command.timestamp), command.payload.unitId);
}

function parseCreatePortalUnitCommand(command: CreatePortalUnitCommandDto): CreatePortalUnitCommand {
  return CreatePortalUnitCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.payload.unitId,
    command.payload.itemId,
    PositionVo.create(command.payload.unitPosition.x, command.payload.unitPosition.z),
    DirectionVo.create(command.payload.unitDirection)
  );
}

function parseRemovePortalUnitCommand(command: RemovePortalUnitCommandDto): RemovePortalUnitCommand {
  return RemovePortalUnitCommand.createRemote(command.id, DateVo.fromTimestamp(command.timestamp), command.payload.unitId);
}

function parseCreateLinkUnitCommand(command: CreateLinkUnitCommandDto): CreateLinkUnitCommand {
  return CreateLinkUnitCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.payload.unitId,
    command.payload.itemId,
    PositionVo.create(command.payload.unitPosition.x, command.payload.unitPosition.z),
    DirectionVo.create(command.payload.unitDirection),
    command.payload.unitLabel,
    command.payload.unitUrl
  );
}

function parseRemoveLinkUnitCommand(command: RemoveLinkUnitCommandDto): RemoveLinkUnitCommand {
  return RemoveLinkUnitCommand.createRemote(command.id, DateVo.fromTimestamp(command.timestamp), command.payload.unitId);
}

function parseCreateEmbedUnitCommand(command: CreateEmbedUnitCommandDto): CreateEmbedUnitCommand {
  return CreateEmbedUnitCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.payload.unitId,
    command.payload.itemId,
    PositionVo.create(command.payload.unitPosition.x, command.payload.unitPosition.z),
    DirectionVo.create(command.payload.unitDirection),
    command.payload.unitLabel,
    command.payload.unitEmbedCode
  );
}

function parseRemoveEmbedUnitCommand(command: RemoveEmbedUnitCommandDto): RemoveEmbedUnitCommand {
  return RemoveEmbedUnitCommand.createRemote(command.id, DateVo.fromTimestamp(command.timestamp), command.payload.unitId);
}

function parseRotateUnitCommand(command: RotateUnitCommandDto): RotateUnitCommand {
  return RotateUnitCommand.createRemote(command.id, DateVo.fromTimestamp(command.timestamp), command.payload.unitId);
}

function parseChangePlayerActionCommand(command: ChangePlayerActionCommandDto): ChangePlayerActionCommand {
  return ChangePlayerActionCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.payload.playerId,
    parsePlayerActionDto(command.payload.playerAction)
  );
}

function parseChangePlayerPrecisePositionCommand(command: ChangePlayerPrecisePositionCommandDto): ChangePlayerPrecisePositionCommand {
  return ChangePlayerPrecisePositionCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.playerId,
    PrecisePositionVo.create(command.payload.precisePosition.x, command.payload.precisePosition.z)
  );
}

function parseSendPlayerIntoPortalCommand(command: SendPlayerIntoPortalCommandDto): SendPlayerIntoPortalCommand {
  return SendPlayerIntoPortalCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.payload.playerId,
    command.payload.unitId
  );
}

function parseTeleportPlayerCommand(command: TeleportPlayerCommandDto): TeleportPlayerCommand {
  return TeleportPlayerCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.payload.playerId,
    PositionVo.create(command.payload.position.x, command.payload.position.z)
  );
}

function parseChangePlayerHeldItemCommand(command: ChangePlayerHeldItemCommandDto): ChangePlayerHeldItemCommand {
  return ChangePlayerHeldItemCommand.createRemote(
    command.id,
    DateVo.fromTimestamp(command.timestamp),
    command.payload.playerId,
    command.payload.itemId
  );
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
  } else if (commandDto.name === CommandNameEnum.TeleportPlayer) {
    return parseTeleportPlayerCommand(commandDto);
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
      payload: {
        unitId: command.getUnitId(),
        itemId: command.getItemId(),
        unitPosition: newPositionDto(command.getPosition()),
        unitDirection: command.getDirection().toNumber(),
      },
    }),
    [CommandNameEnum.RemoveStaticUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.RemoveStaticUnit,
      payload: {
        unitId: command.getUnitId(),
      },
    }),
    [CommandNameEnum.CreateFenceUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.CreateFenceUnit,
      payload: {
        unitId: command.getUnitId(),
        itemId: command.getItemId(),
        unitPosition: newPositionDto(command.getPosition()),
        unitDirection: command.getDirection().toNumber(),
      },
    }),
    [CommandNameEnum.RemoveFenceUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.RemoveFenceUnit,
      payload: {
        unitId: command.getUnitId(),
      },
    }),
    [CommandNameEnum.CreatePortalUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.CreatePortalUnit,
      payload: {
        unitId: command.getUnitId(),
        itemId: command.getItemId(),
        unitPosition: newPositionDto(command.getPosition()),
        unitDirection: command.getDirection().toNumber(),
      },
    }),
    [CommandNameEnum.RemovePortalUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.RemovePortalUnit,
      payload: {
        unitId: command.getUnitId(),
      },
    }),
    [CommandNameEnum.CreateLinkUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.CreateLinkUnit,
      payload: {
        unitId: command.getUnitId(),
        itemId: command.getItemId(),
        unitPosition: newPositionDto(command.getPosition()),
        unitDirection: command.getDirection().toNumber(),
        unitLabel: command.getLabel(),
        unitUrl: command.getUrl(),
      },
    }),
    [CommandNameEnum.RemoveLinkUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.RemoveLinkUnit,
      payload: {
        unitId: command.getUnitId(),
      },
    }),
    [CommandNameEnum.CreateEmbedUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.CreateEmbedUnit,
      payload: {
        unitId: command.getUnitId(),
        itemId: command.getItemId(),
        unitPosition: newPositionDto(command.getPosition()),
        unitDirection: command.getDirection().toNumber(),
        unitLabel: command.getLabel(),
        unitEmbedCode: command.getEmbedCode(),
      },
    }),
    [CommandNameEnum.RemoveEmbedUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.RemoveEmbedUnit,
      payload: {
        unitId: command.getUnitId(),
      },
    }),
    [CommandNameEnum.CreateColorUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.CreateColorUnit,
      payload: {
        unitId: command.getUnitId(),
        itemId: command.getItemId(),
        unitPosition: newPositionDto(command.getPosition()),
        unitDirection: command.getDirection().toNumber(),
        unitLabel: null,
        unitColor: command.getColor().toHex(),
      },
    }),
    [CommandNameEnum.RemoveColorUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.RemoveColorUnit,
      payload: {
        unitId: command.getUnitId(),
      },
    }),
    [CommandNameEnum.RotateUnit]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.RotateUnit,
      payload: {
        unitId: command.getUnitId(),
      },
    }),
    [CommandNameEnum.ChangePlayerAction]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.ChangePlayerAction,
      payload: {
        playerId: command.getPlayerId(),
        playerAction: newPlayerActionDto(command.getAction()),
      },
    }),
    [CommandNameEnum.ChangePlayerPrecisePosition]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.ChangePlayerPrecisePosition,
      playerId: command.getPlayerId(),
      payload: {
        precisePosition: newPrecisePositionDto(command.getPrecisePosition()),
      },
    }),
    [CommandNameEnum.SendPlayerIntoPortal]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.SendPlayerIntoPortal,
      payload: {
        playerId: command.getPlayerId(),
        unitId: command.getUnitId(),
      },
    }),
    [CommandNameEnum.TeleportPlayer]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.TeleportPlayer,
      payload: {
        playerId: command.getPlayerId(),
        position: newPositionDto(command.getPosition()),
      },
    }),
    [CommandNameEnum.ChangePlayerHeldItem]: (command) => ({
      id: command.getId(),
      timestamp: command.getCreatedAtTimestamp(),
      name: CommandNameEnum.ChangePlayerHeldItem,
      payload: {
        playerId: command.getPlayerId(),
        itemId: command.getItemId(),
      },
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
  | TeleportPlayerCommandDto
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
  | CreateColorUnitCommandDto
  | RemoveColorUnitCommandDto
  | RotateUnitCommandDto;
