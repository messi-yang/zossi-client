import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { ItemModel } from '@/models/world/item/item-model';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class AddItemCommand extends BaseCommand {
  private item: ItemModel;

  constructor(id: string, timestamp: number, isRemote: boolean, item: ItemModel) {
    super(id, timestamp, isRemote);
    this.item = item;
  }

  static create(item: ItemModel) {
    return new AddItemCommand(generateUuidV4(), DateVo.now().getTimestamp(), false, item);
  }

  static createRemote(id: string, timestamp: number, item: ItemModel) {
    return new AddItemCommand(id, timestamp, true, item);
  }

  public getIsReplayable = () => false;

  public execute({ itemManager }: CommandParams): void {
    const isItemAdded = itemManager.addItem(this.item);

    this.setUndoAction(() => {
      if (isItemAdded) {
        itemManager.removeItem(this.item.getId());
      }
    });
  }

  public getItem() {
    return this.item;
  }
}
