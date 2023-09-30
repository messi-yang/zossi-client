import { Command, Options } from './command';

export class AddPerspectiveDepthCommand implements Command {
  static new() {
    return new AddPerspectiveDepthCommand();
  }

  public execute({ perspective }: Options) {
    perspective.addPerspectiveDepth();
    return true;
  }
}
