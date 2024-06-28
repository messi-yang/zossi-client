import { CommandParams } from './command-params';

// export interface Command {
//   getId(): string;
//   /**
//    * Get the command execution timestamp
//    */
//   getTimestamp(): number;
//   /**
//    * Check if the command was from local or remote
//    */
//   getIsRemote(): boolean;
//   /**
//    * Check if the command only executes on client
//    */
//   getIsClientOnly(): boolean;
//   /**
//    * Is the command replayable while replaying commands?
//    */
//   getIsReplayable(): boolean;
//   /**
//    * Execute the command
//    */
//   execute(params: CommandParams): void;
//   /**
//    * Undo the executed command
//    */
//   undo(): void;
// }

const emptyUndoAction = () => {};

export abstract class Command {
  protected undoAction: () => void = emptyUndoAction;

  constructor(protected id: string, protected timestamp: number, protected isRemote: boolean) {}

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getIsRemote() {
    return this.isRemote;
  }

  public abstract getIsClientOnly(): boolean;

  public abstract getIsReplayable(): boolean;

  public abstract execute(params: CommandParams): void;

  protected setUndoAction(newUndoAction: () => void) {
    this.undoAction = newUndoAction;
  }

  public undo(): void {
    this.undoAction();
    this.undoAction = emptyUndoAction;
  }
}
