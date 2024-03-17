import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class SubtractPerspectiveDepthCommand extends BaseCommand {
  static new() {
    return new SubtractPerspectiveDepthCommand(generateUuidV4(), DateVo.now().getTimestamp());
  }

  static load(id: string, timestamp: number) {
    return new SubtractPerspectiveDepthCommand(id, timestamp);
  }

  public execute({ perspectiveManager }: CommandParams): void {
    perspectiveManager.subtractPerspectiveDepth();
  }
}
