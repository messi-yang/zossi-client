import { v4 as uuidv4 } from 'uuid';
import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/general/date-vo';

export class AddPerspectiveDepthCommand implements Command {
  private id: string;

  private timestamp: number;

  constructor(id: string, timestamp: number) {
    this.id = id;
    this.timestamp = timestamp;
  }

  static new() {
    return new AddPerspectiveDepthCommand(uuidv4(), DateVo.now().getTimestamp());
  }

  static load(id: string, timestamp: number) {
    return new AddPerspectiveDepthCommand(id, timestamp);
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public execute({ perspectiveManager }: CommandParams): void {
    perspectiveManager.addPerspectiveDepth();
  }
}
