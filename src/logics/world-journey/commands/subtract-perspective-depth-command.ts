import { Command, Options } from '../command';

export class SubtractPerspectiveDepthCommand implements Command {
  static new() {
    return new SubtractPerspectiveDepthCommand();
  }

  public execute({ perspective }: Options) {
    perspective.subtractPerspectiveDepth();
    return true;
  }
}
