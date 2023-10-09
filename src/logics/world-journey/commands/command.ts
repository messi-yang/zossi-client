import { CommandParams } from './command-params';

export interface Command {
  getId(): string;
  getTimestamp(): number;
  execute(params: CommandParams): void;
}
