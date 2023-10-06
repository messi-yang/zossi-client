import { v4 as uuidv4 } from 'uuid';
import { Command, Options } from '../command';
import { DateModel } from '@/models/general/date-model';

export class AddPerspectiveDepthCommand implements Command {
  private id: string;

  private timestamp: number;

  constructor(id: string, timestamp: number) {
    this.id = id;
    this.timestamp = timestamp;
  }

  static new() {
    return new AddPerspectiveDepthCommand(uuidv4(), DateModel.now().getTimestampe());
  }

  static load(id: string, timestamp: number) {
    return new AddPerspectiveDepthCommand(id, timestamp);
  }

  public getId() {
    return this.id;
  }

  public getTimestampe() {
    return this.timestamp;
  }

  public execute({ perspective }: Options) {
    perspective.addPerspectiveDepth();
    return true;
  }
}
