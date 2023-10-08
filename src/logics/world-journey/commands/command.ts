import { CommandParams } from './command-params';

export interface Command {
  getId(): string;
  getTimestamp(): number;
  /**
   * Execute the command
   * @param options
   *
   * @returns {boolean} Indicating the success of the command, if false is returned, it means no states were changed.
   */
  execute(params: CommandParams): boolean;
}
