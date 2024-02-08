import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class SubtractPerspectiveDepthCommand implements Command {
  private id: string;

  private timestamp: number;

  constructor(id: string, timestamp: number) {
    this.id = id;
    this.timestamp = timestamp;
  }

  static new() {
    return new SubtractPerspectiveDepthCommand(generateUuidV4(), DateVo.now().getTimestamp());
  }

  static load(id: string, timestamp: number) {
    return new SubtractPerspectiveDepthCommand(id, timestamp);
  }

  public execute({ perspectiveManager }: CommandParams): void {
    perspectiveManager.subtractPerspectiveDepth();
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }
}
