import { Command, Options } from './command';
import { ItemModel } from '@/models/world/item-model';

export class AddItemCommand implements Command {
  constructor(private item: ItemModel) {}

  static new(item: ItemModel) {
    return new AddItemCommand(item);
  }

  public execute({ itemStorage }: Options) {
    return itemStorage.addItem(this.item);
  }

  public getItem() {
    return this.item;
  }
}
