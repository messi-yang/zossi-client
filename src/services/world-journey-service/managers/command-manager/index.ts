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

  public executeCommand(command: Command, params: CommandParams) {
    const commandId = command.getId();
    const duplicatedCommand = this.getExecutedCommand(commandId);
    if (duplicatedCommand) return;

    command.execute(params);
    this.addExecutedCommand(command);
  }
}
