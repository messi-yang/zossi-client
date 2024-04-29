import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class AddPerspectiveDepthCommand extends BaseCommand {
  static new() {
    return new AddPerspectiveDepthCommand(generateUuidV4(), DateVo.now().getTimestamp(), false);
  }

  static load(id: string, timestamp: number) {
    return new AddPerspectiveDepthCommand(id, timestamp, true);
  }

  public execute({ perspectiveManager }: CommandParams): void {
    const isDepthChanged = perspectiveManager.addPerspectiveDepth();

    this.setUndoAction(() => {
      if (isDepthChanged) {
        perspectiveManager.subtractPerspectiveDepth();
      }
    });
  }
}
