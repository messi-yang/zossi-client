import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class SubtractPerspectiveDepthCommand extends BaseCommand {
  static new() {
    return new SubtractPerspectiveDepthCommand(generateUuidV4(), DateVo.now().getTimestamp(), false);
  }

  static load(id: string, timestamp: number) {
    return new SubtractPerspectiveDepthCommand(id, timestamp, true);
  }

  public execute({ perspectiveManager }: CommandParams): void {
    const isDepthChanged = perspectiveManager.subtractPerspectiveDepth();

    this.setUndoAction(() => {
      if (isDepthChanged) {
        perspectiveManager.addPerspectiveDepth();
      }
    });
  }
}
