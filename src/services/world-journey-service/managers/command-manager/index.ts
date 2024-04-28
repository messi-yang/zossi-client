import { Command } from './command';
import { CommandParams } from './command-params';

export class CommandManager {
  private executedCommands: Command[];

  private executedCommandMap: Record<string, Command>;

  constructor() {
    this.executedCommands = [];
    this.executedCommandMap = {};
  }

  static new() {
    return new CommandManager();
  }

  private getExecutedCommand(id: string): Command {
    return this.executedCommandMap[id];
  }

  private addExecutedCommand(command: Command) {
    this.executedCommands.push(command);
    this.executedCommandMap[command.getId()] = command;
  }

  private popExecutedCommand(): Command | null {
    const command = this.executedCommands.pop();
    if (!command) return null;

    delete this.executedCommandMap[command.getId()];
    return command;
  }

  public handleFailedCommand(commandId: string, params: CommandParams) {
    const executedCommand = this.getExecutedCommand(commandId);
    if (!executedCommand) return;

    const commandsToReExecute: Command[] = [];

    while (true) {
      const lastExecutedCommand = this.popExecutedCommand();
      if (!lastExecutedCommand) break;

      if (lastExecutedCommand.getId() !== commandId) {
        lastExecutedCommand.undo();
        commandsToReExecute.push(lastExecutedCommand);
      } else {
        lastExecutedCommand.undo();
        break;
      }
    }

    for (let i = commandsToReExecute.length - 1; i >= 0; i -= 1) {
      const commandToReExecute = commandsToReExecute[i];
      this.executeCommand(commandToReExecute, params);
    }
  }

  public executeCommand(command: Command, params: CommandParams) {
    const commandId = command.getId();
    const duplicatedCommand = this.getExecutedCommand(commandId);
    if (duplicatedCommand) return;

    command.execute(params);
    this.addExecutedCommand(command);
  }
}
