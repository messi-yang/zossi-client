import { sleep } from '@/utils/general';
import { Command } from './command';
import { CommandParams } from './command-params';

export type CommandExecutedHandler = (command: Command) => void;

export class CommandManager {
  private executedCommands: Command[];

  private executedCommandMap: Record<string, Command | undefined>;

  private failedCommandMap: Record<string, true | undefined>;

  private commandExecutedHandlers: CommandExecutedHandler[] = [];

  constructor() {
    this.executedCommands = [];
    this.executedCommandMap = {};
    this.failedCommandMap = {};
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

  public async replayCommands(countOfCommands: number, params: CommandParams) {
    const commandsToReExecute: Command[] = [];
    let remainingCount = countOfCommands;
    while (remainingCount > 0) {
      const commandToReExecute = this.popExecutedCommand();
      if (!commandToReExecute) {
        break;
      }

      if (!commandToReExecute.getIsReplayable()) {
        continue;
      }

      remainingCount -= 1;
      commandToReExecute.undo();
      commandsToReExecute.push(commandToReExecute);

      await sleep(200);
    }

    for (let i = commandsToReExecute.length - 1; i >= 0; i -= 1) {
      const commandToReExecute = commandsToReExecute[i];
      this.executeCommand(commandToReExecute, params);
      await sleep(200);
    }
  }

  public executeCommand(command: Command, params: CommandParams) {
    const commandId = command.getId();
    const duplicatedCommand = this.getExecutedCommand(commandId);
    if (duplicatedCommand) return;

    const hasCommandAlreadyFailed = this.doesFailedCommandExist(commandId);
    if (hasCommandAlreadyFailed) return;

    command.execute(params);
    this.addExecutedCommand(command);
    this.publishCommandExecuted(command);
  }

  public subscribeCommandExecuted(handler: CommandExecutedHandler): () => void {
    this.commandExecutedHandlers.push(handler);

    return () => {
      this.commandExecutedHandlers = this.commandExecutedHandlers.filter((hdl) => hdl !== handler);
    };
  }

  private publishCommandExecuted(command: Command) {
    this.commandExecutedHandlers.forEach((hdl) => {
      hdl(command);
    });
  }
}
