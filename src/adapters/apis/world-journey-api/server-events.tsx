import { PlayerDto } from '../dtos/player-dto';
import { UnitDto } from '../dtos/unit-dto';
import { WorldDto } from '../dtos/world-dto';
import { CommandDto } from './commands';

export enum ServerEventNameEnum {
  WorldEntered = 'WORLD_ENTERED',
  PlayerJoined = 'PLAYER_JOINED',
  PlayerLeft = 'PLAYER_LEFT',
  CommandReceived = 'COMMAND_RECEIVED',
  CommandFailed = 'COMMAND_FAILED',
  P2pOfferReceived = 'P2P_OFFER_RECEIVED',
  P2pAnswerReceived = 'P2P_ANSWER_RECEIVED',
  Errored = 'ERRORED',
}

export type WorldEnteredServerEvent = {
  name: ServerEventNameEnum.WorldEntered;
  world: WorldDto;
  units: UnitDto[];
  myPlayerId: string;
  players: PlayerDto[];
};

export type PlayerJoinedServerEvent = {
  name: ServerEventNameEnum.PlayerJoined;
  player: PlayerDto;
};

export type PlayerLeftServerEvent = {
  name: ServerEventNameEnum.PlayerLeft;
  playerId: string;
};

export type CommandReceivedServerEvent = {
  name: ServerEventNameEnum.CommandReceived;
  command: CommandDto;
};

export type CommandFailedServerEvent = {
  name: ServerEventNameEnum.CommandFailed;
  commandId: string;
  errorMessage: string;
};

export type P2pOfferReceivedServerEvent = {
  name: ServerEventNameEnum.P2pOfferReceived;
  peerPlayerId: string;
  iceCandidates: RTCIceCandidate[];
  offer: RTCSessionDescription;
};

export type P2pAnswerReceivedServerEvent = {
  name: ServerEventNameEnum.P2pAnswerReceived;
  peerPlayerId: string;
  iceCandidates: RTCIceCandidate[];
  answer: RTCSessionDescription;
};

export type ErroredServerEvent = {
  name: ServerEventNameEnum.Errored;
  message: string;
};

export type ServerEvent =
  | WorldEnteredServerEvent
  | PlayerJoinedServerEvent
  | PlayerLeftServerEvent
  | CommandReceivedServerEvent
  | CommandFailedServerEvent
  | P2pOfferReceivedServerEvent
  | P2pAnswerReceivedServerEvent
  | ErroredServerEvent;
