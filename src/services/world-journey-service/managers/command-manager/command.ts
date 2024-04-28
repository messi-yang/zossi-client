import { CommandParams } from './command-params';

export interface Command {
  getId(): string;
  getTimestamp(): number;
  execute(params: CommandParams): void;
  /**
   * Undo the command after execution
   */
  undo(): void;
}

const emptyUndoAction = () => {};

export abstract class BaseCommand implements Command {
  private undoAction: () => void = emptyUndoAction;

  constructor(private id: string, private timestamp: number) {}

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public abstract execute(params: CommandParams): void;

  protected getEmptyUndoAction() {
    return emptyUndoAction;
  }

  protected setUndoAction(newUndoAction: () => void) {
    this.undoAction = newUndoAction;
  }

  public undo(): void {
    this.undoAction();
    this.undoAction = emptyUndoAction;
  }
}
