import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class RemoveEmbedUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private unitId: string;

  constructor(id: string, timestamp: number, unitId: string) {
    this.id = id;
    this.timestamp = timestamp;
    this.unitId = unitId;
  }

  static new(unitId: string) {
    return new RemoveEmbedUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), unitId);
  }

  static load(id: string, timestamp: number, unitId: string) {
    return new RemoveEmbedUnitCommand(id, timestamp, unitId);
  }

  public execute({ unitManager }: CommandParams): void {
    unitManager.removeUnit(this.unitId);
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getUnitId() {
    return this.unitId;
  }
}
