import { parseCommandDto, toCommandDto } from './commands';
import { WorldModel } from '@/models/world/world/world-model';
import { PlayerModel } from '@/models/world/player/player-model';
import { UnitModel } from '@/models/world/unit/unit-model';
import { AuthSessionStorage } from '@/adapters/storages/auth-session-storage';
import { WorldJourneyService } from '@/services/world-journey-service';
import { ServerEvent, ServerEventNameEnum, WorldEnteredServerEvent } from './server-events';
import { Command } from '@/services/world-journey-service/managers/command-manager/command';
import { parseWorldDto } from '../dtos/world-dto';
import { parseUnitDto } from '../dtos/unit-dto';
import { parsePlayerDto } from '../dtos/player-dto';
import {
  ClientEvent,
  ClientEventNameEnum,
  CommandRequestedClientEvent,
  CommandSentClientEvent,
  P2pAnswerSentClientEvent,
  P2pOfferSentClientEvent,
  PingClientEvent,
} from './client-events';
import { P2pConnection } from './p2p-connection';
import { CommandSentP2pEvent, P2pEvent, P2pEventNameEnum } from './p2p-events';
import { AddPlayerCommand } from '@/services/world-journey-service/managers/command-manager/commands/add-player-command';
import { RemovePlayerCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-player-command';

function parseWorldEnteredServerEvent(
  event: WorldEnteredServerEvent
): [WorldModel, UnitModel[], string, PlayerModel[]] {
  return [
    parseWorldDto(event.world),
    event.units.map(parseUnitDto),
    event.myPlayerId,
    event.players.map(parsePlayerDto),
  ];
}

export class WorldJourneyApi {
  private socket: WebSocket;

  private disconnectedByUser: boolean = false;

  private p2pConnectionMap = new Map<string, P2pConnection>();

  private worldJourneyService: WorldJourneyService | null = null;

  constructor(
    worldId: string,
    events: {
      onWorldEntered: (worldJourneyService: WorldJourneyService) => void;
      onCommandReceived: (command: Command) => void;
      onCommandFailed: (commandId: string) => void;
      onErrored: (message: string) => void;
      onDisconnect: () => void;
      onOpen: () => void;
    }
  ) {
    const authSessionStorage = AuthSessionStorage.get();
    const accessToken = authSessionStorage.getAccessToken();

    const socketUrl = `${process.env.API_SOCKET_URL}/api/world-journey/?id=${worldId}&access-token=${accessToken}`;
    const socket = new WebSocket(socketUrl, []);

    let pingServerInterval: NodeJS.Timer | null = null;

    const handleP2pMessage = (p2pEvent: P2pEvent) => {
      if (p2pEvent.name === P2pEventNameEnum.CommandSent) {
        const command = parseCommandDto(p2pEvent.command);
        if (!command) return;
        events.onCommandReceived(command);
      }
    };
    const handleP2pClose = (peerPlayerId: string) => {
      this.p2pConnectionMap.delete(peerPlayerId);
    };

    socket.onmessage = async ({ data }: any) => {
      const eventJsonString: string = await data.text();
      const event: ServerEvent = JSON.parse(eventJsonString);

      console.log(event.name, event);
      if (event.name === ServerEventNameEnum.WorldEntered) {
        const [world, units, myPlayerId, players] = parseWorldEnteredServerEvent(event);
        const worldJourneyService = WorldJourneyService.create(world, players, myPlayerId, units);
        events.onWorldEntered(worldJourneyService);
        this.worldJourneyService = worldJourneyService;
      } else if (event.name === ServerEventNameEnum.PlayerJoined) {
        if (!this.worldJourneyService) return;

        this.worldJourneyService.executeCommand(AddPlayerCommand.create(parsePlayerDto(event.player)));

        const newP2pConnection = P2pConnection.create({
          onMessage: handleP2pMessage,
          onClose: () => {
            handleP2pClose(event.player.id);
          },
        });
        const [offer, iceCandidates] = await newP2pConnection.createOffer();
        if (!offer || iceCandidates.length === 0) return;

        this.p2pConnectionMap.set(event.player.id, newP2pConnection);

        const clientEvent: P2pOfferSentClientEvent = {
          name: ClientEventNameEnum.P2pOfferSent,
          peerPlayerId: event.player.id,
          iceCandidates,
          offer,
        };

        this.sendMessage(clientEvent);
      } else if (event.name === ServerEventNameEnum.P2pOfferReceived) {
        const newP2pConnection = P2pConnection.create({
          onMessage: handleP2pMessage,
          onClose: () => {
            handleP2pClose(event.peerPlayerId);
          },
        });
        const [answer, iceCandidates] = await newP2pConnection.createAnswer(event.offer, event.iceCandidates);
        if (!answer || iceCandidates.length === 0) return;

        this.p2pConnectionMap.set(event.peerPlayerId, newP2pConnection);

        const clientEvent: P2pAnswerSentClientEvent = {
          name: ClientEventNameEnum.P2pAnswerSent,
          peerPlayerId: event.peerPlayerId,
          iceCandidates,
          answer,
        };

        this.sendMessage(clientEvent);
      } else if (event.name === ServerEventNameEnum.P2pAnswerReceived) {
        const p2pConnection = this.p2pConnectionMap.get(event.peerPlayerId);
        if (!p2pConnection) return;

        p2pConnection.acceptAnswer(event.answer, event.iceCandidates);
      } else if (event.name === ServerEventNameEnum.PlayerLeft) {
        if (!this.worldJourneyService) return;

        this.worldJourneyService.executeCommand(RemovePlayerCommand.create(event.playerId));
      } else if (event.name === ServerEventNameEnum.CommandReceived) {
        const command = parseCommandDto(event.command);
        if (!command) return;
        events.onCommandReceived(command);
      } else if (event.name === ServerEventNameEnum.CommandFailed) {
        events.onCommandFailed(event.commandId);
      } else if (event.name === ServerEventNameEnum.Errored) {
        events.onErrored(event.message);
      }
    };

    socket.onclose = () => {
      if (pingServerInterval) {
        clearInterval(pingServerInterval);
      }
      if (!this.disconnectedByUser) {
        events.onDisconnect();
      }
    };

    socket.onopen = () => {
      pingServerInterval = setInterval(() => {
        this.ping();
      }, 10000);
      events.onOpen();
    };

    this.socket = socket;

    // @ts-expect-error
    window.sendCommand = this.sendCommand.bind(this);
  }

  static create(
    worldId: string,
    events: {
      onWorldEntered: (worldJourneyService: WorldJourneyService) => void;
      onCommandReceived: (command: Command) => void;
      onCommandFailed: (commandId: string) => void;
      onErrored: (message: string) => void;
      onDisconnect: () => void;
      onOpen: () => void;
    }
  ): WorldJourneyApi {
    return new WorldJourneyApi(worldId, events);
  }

  public disconnect() {
    this.disconnectedByUser = true;
    this.socket.close();
  }

  private async sendMessage(clientEvent: ClientEvent) {
    const jsonString = JSON.stringify(clientEvent);
    const jsonBlob = new Blob([jsonString]);

    if (this.socket.readyState !== this.socket.OPEN) {
      return;
    }
    console.log('Send via Websocket', clientEvent.name, clientEvent);
    this.socket.send(jsonBlob);
  }

  public ping() {
    const clientEvent: PingClientEvent = {
      name: ClientEventNameEnum.Ping,
    };
    this.sendMessage(clientEvent);
  }

  public sendCommand(command: Command) {
    if (!this.worldJourneyService) return;

    const commandDto = toCommandDto(command);
    if (!commandDto) return;

    const clientEvent: CommandRequestedClientEvent = {
      name: ClientEventNameEnum.CommandRequested,
      command: commandDto,
    };
    this.sendMessage(clientEvent);

    this.worldJourneyService.getOtherPlayers().forEach((otherPlayer) => {
      const otherPlayerId = otherPlayer.getId();
      const p2pConnection = this.p2pConnectionMap.get(otherPlayerId);

      const commandSentClientEvent: CommandSentClientEvent = {
        name: ClientEventNameEnum.CommandSent,
        peerPlayerId: otherPlayerId,
        command: commandDto,
      };

      if (!p2pConnection) {
        this.sendMessage(commandSentClientEvent);
        return;
      }

      const p2pEvent: CommandSentP2pEvent = {
        name: P2pEventNameEnum.CommandSent,
        command: commandDto,
      };
      const succeeded = p2pConnection.sendMessage(p2pEvent);
      if (!succeeded) {
        this.sendMessage(commandSentClientEvent);
      }
    });
  }
}
