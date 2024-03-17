import { CommandParams } from './command-params';

export interface Command {
  getId(): string;
  getTimestamp(): number;
  execute(params: CommandParams): void;
}

export abstract class BaseCommand implements Command {
  constructor(private id: string, private timestamp: number) {}

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public abstract execute(params: CommandParams): void;
}
