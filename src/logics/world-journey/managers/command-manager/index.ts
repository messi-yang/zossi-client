import { Command } from './command';
import { CommandParams } from './command-params';

export class CommandManager {
  private commandMap: Record<string, Command>;

  constructor() {
    this.commandMap = {};
  }

  static new() {
    return new CommandManager();
  }

  public getCommand(id: string): Command {
    return this.commandMap[id];
  }

  public addCommand(command: Command) {
    this.commandMap[command.getId()] = command;
  }

  public executeCommand(command: Command, params: CommandParams) {
    const commandId = command.getId();
    const duplicatedCommand = this.getCommand(commandId);
    if (duplicatedCommand) return;

    command.execute(params);
    this.addCommand(command);
  }
}
