import { sleep } from '@/utils/general';
import { Command } from './command';
import { CommandParams } from './command-params';
import { EventHandler, EventHandlerSubscriber } from '../common/event-handler';
import { DateVo } from '@/models/global/date-vo';

export class CommandManager {
  private executedCommands: Command[];

  private executedCommandMap: Record<string, Command | undefined>;

  private failedCommandMap: Record<string, true | undefined>;

  private commandExecutedEventHandler = EventHandler.create<Command>();

  private isBufferingNewCommands = false;

  private bufferedCommands: Command[];

  constructor() {
    this.executedCommands = [];
    this.executedCommandMap = {};
    this.failedCommandMap = {};
    this.bufferedCommands = [];
  }

  static create() {
    return new CommandManager();
  }

  private getExecutedCommand(id: string): Command | null {
    return this.executedCommandMap[id] ?? null;
  }

  private addExecutedCommand(command: Command) {
    this.executedCommands.push(command);
    this.executedCommandMap[command.getId()] = command;
  }

  private doesFailedCommandExist(id: string): boolean {
    return this.failedCommandMap[id] ?? false;
  }

  private addFailedCommandId(commandId: string) {
    this.failedCommandMap[commandId] = true;
  }

  private popExecutedCommand(): Command | null {
    const command = this.executedCommands.pop();
    if (!command) return null;

    delete this.executedCommandMap[command.getId()];
    return command;
  }

  public removeFailedCommand(commandId: string, params: CommandParams) {
    this.addFailedCommandId(commandId);

    const executedCommand = this.getExecutedCommand(commandId);
    if (!executedCommand) return;

    const commandsToReExecute: Command[] = [];

    while (true) {
      const lastExecutedCommand = this.popExecutedCommand();
      if (!lastExecutedCommand) break;

      const lastExecutedCommandId = lastExecutedCommand.getId();
      const isLastExecutedCommandFailedCommand = lastExecutedCommandId === commandId;

      if (isLastExecutedCommandFailedCommand) {
        lastExecutedCommand.undo();
        this.addFailedCommandId(lastExecutedCommandId);
        break;
      } else {
        lastExecutedCommand.undo();
        commandsToReExecute.push(lastExecutedCommand);
      }
    }

    for (let i = commandsToReExecute.length - 1; i >= 0; i -= 1) {
      const commandToReExecute = commandsToReExecute[i];
      this.executeCommand(commandToReExecute, params);
    }
  }

  /**
   * New local commands will be disallowed and new remote commands will be buffered
   */
  private startBufferingNewCommands() {
    this.isBufferingNewCommands = true;
  }

  private stopBufferingNewCommands(params: CommandParams) {
    this.bufferedCommands.forEach((command) => {
      this.executeCommand(command, params);
    });
    this.isBufferingNewCommands = false;
  }

  /**
   * Replays commands executed within the specified duration.
   * @param duration miliseconds
   * @param speed 1 means normal speed
   * @param params
   */
  public async replayCommands(duration: number, speed: number, params: CommandParams) {
    this.startBufferingNewCommands();

    const now = DateVo.now();
    const milisecondsAgo = DateVo.fromTimestamp(now.getTimestamp() - duration);

    const commandsToReExecute: Command[] = [];
    let command: Command | null = this.popExecutedCommand();
    let lastCommandCreatedTimestamp = now.getTimestamp();
    while (command && command.isCreatedBetween(milisecondsAgo, now)) {
      await sleep((lastCommandCreatedTimestamp - command.getCreatedAtTimestamp()) / speed);
      lastCommandCreatedTimestamp = command.getCreatedAtTimestamp();

      command.undo();
      commandsToReExecute.push(command);

      command = this.popExecutedCommand();
    }

    lastCommandCreatedTimestamp = now.getTimestamp();
    for (let i = commandsToReExecute.length - 1; i >= 0; i -= 1) {
      const commandToReExecute = commandsToReExecute[i];
      await sleep((commandToReExecute.getCreatedAtTimestamp() - lastCommandCreatedTimestamp) / speed);
      lastCommandCreatedTimestamp = commandToReExecute.getCreatedAtTimestamp();

      this.executeCommand(commandToReExecute, params);
    }

    this.stopBufferingNewCommands(params);
  }

  public executeRemoteCommand(command: Command, params: CommandParams) {
    if (this.isBufferingNewCommands) {
      this.bufferedCommands.push(command);
      return;
    }

    this.executeCommand(command, params);
  }

  public executeLocalCommand(command: Command, params: CommandParams) {
    if (this.isBufferingNewCommands) return;

    const isExecuted = this.executeCommand(command, params);
    if (isExecuted) this.publishLocalCommandExecutedEvent(command);
  }

  private executeCommand(command: Command, params: CommandParams): boolean {
    const commandId = command.getId();
    const duplicatedCommand = this.getExecutedCommand(commandId);
    if (duplicatedCommand) return false;

    const hasCommandAlreadyFailed = this.doesFailedCommandExist(commandId);
    if (hasCommandAlreadyFailed) return false;

    command.execute(params);
    this.addExecutedCommand(command);

    return true;
  }

  public subscribeLocalCommandExecutedEvent(subscriber: EventHandlerSubscriber<Command>): () => void {
    return this.commandExecutedEventHandler.subscribe(subscriber);
  }

  private publishLocalCommandExecutedEvent(command: Command) {
    this.commandExecutedEventHandler.publish(command);
  }
}
