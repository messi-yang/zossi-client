import { v4 as uuidv4 } from 'uuid';
import { Command } from './command';
import { CommandParams } from './command-params';
import { ItemModel } from '@/models/world/item/item-model';
import { DateModel } from '@/models/general/date-model';

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
    return new AddItemCommand(uuidv4(), DateModel.now().getTimestamp(), item);
  }

  static load(id: string, timestamp: number, item: ItemModel) {
    return new AddItemCommand(id, timestamp, item);
  }

  public execute({ itemStorage }: CommandParams): void {
    itemStorage.addItem(this.item);
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
