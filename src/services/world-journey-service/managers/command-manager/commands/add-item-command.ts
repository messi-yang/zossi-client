import { Command } from '../command';
import { CommandParams } from '../command-params';
import { ItemModel } from '@/models/world/item/item-model';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class AddItemCommand implements Command {
  private id: string;

  private timestamp: number;

  private item: ItemModel;

  constructor(id: string, timestamp: number, item: ItemModel) {
    this.id = id;
    this.timestamp = timestamp;
    this.item = item;
  }

  static new(item: ItemModel) {
    return new AddItemCommand(generateUuidV4(), DateVo.now().getTimestamp(), item);
  }

  static load(id: string, timestamp: number, item: ItemModel) {
    return new AddItemCommand(id, timestamp, item);
  }

  public execute({ itemManager }: CommandParams): void {
    itemManager.addItem(this.item);
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getItem() {
    return this.item;
  }
}
