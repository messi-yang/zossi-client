import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class SubtractPerspectiveDepthCommand extends BaseCommand {
  static create() {
    return new SubtractPerspectiveDepthCommand(generateUuidV4(), DateVo.now().getTimestamp(), false);
  }

  static createRemote(id: string, timestamp: number) {
    return new SubtractPerspectiveDepthCommand(id, timestamp, true);
  }

  public getIsClientOnly = () => true;

  public getIsReplayable = () => false;

  public execute({ perspectiveManager }: CommandParams): void {
    const isDepthChanged = perspectiveManager.subtractPerspectiveDepth();

    this.setUndoAction(() => {
      if (isDepthChanged) {
        perspectiveManager.addPerspectiveDepth();
      }
    });
  }
}
