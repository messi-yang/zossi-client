import { v4 as uuidv4 } from 'uuid';
import { parsePlayerDto, parseUnitDto, parseWorldDto } from '@/apis/dtos';
import { CommandNameEnum, parseCommandDto, toCommandDto } from './commands';
import type { PingCommandDto } from './commands';
import { WorldModel } from '@/models/world/world/world-model';
import { PlayerModel } from '@/models/world/player/player-model';
import { UnitModel } from '@/models/world/unit/unit-model';
import { LocalStorage } from '@/storages/local-storage';
import { WorldJourney } from '@/logics/world-journey';
import { DateModel } from '@/models/general/date-model';
import { Event, EventNameEnum, WorldEnteredEvent } from './events';
import { Command } from '@/logics/world-journey/commands';

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
    events: {
      onWorldEntered: (worldJourney: WorldJourney) => void;
      onCommandSucceeded: (command: Command) => void;
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
        events.onWorldEntered(worldJourney);
      } else if (event.name === EventNameEnum.CommandSucceeded) {
        const command = parseCommandDto(event.command);
        if (!command) return;
        events.onCommandSucceeded(command);
      } else if (event.name === EventNameEnum.Errored) {
        events.onErrored(event.message);
      }
    };

    socket.onclose = () => {
      if (pingServerInterval) {
        clearInterval(pingServerInterval);
      }
      events.onClose();
    };

    socket.onopen = () => {
      pingServerInterval = setInterval(() => {
        this.ping();
      }, 10000);
      events.onOpen();
    };

    this.socket = socket;
  }

  static new(
    worldId: string,
    events: {
      onWorldEntered: (worldJourney: WorldJourney) => void;
      onCommandSucceeded: (command: Command) => void;
      onErrored: (message: string) => void;
      onClose: () => void;
      onOpen: () => void;
    }
  ): WorldJourneyApiService {
    return new WorldJourneyApiService(worldId, events);
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
      timestamp: DateModel.now().getTimestamp(),
      name: CommandNameEnum.Ping,
    };
    this.sendMessage(commandDto);
  }

  public sendCommand(command: Command) {
    const commandDto = toCommandDto(command);
    if (!commandDto) return;
    this.sendMessage(commandDto);
  }
}
