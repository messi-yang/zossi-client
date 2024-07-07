import { Command } from '../command';
import { CommandParams } from '../command-params';
import { ItemModel } from '@/models/world/item/item-model';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';
import { CommandNameEnum } from '../command-name-enum';

export class AddItemCommand extends Command {
  private item: ItemModel;

  constructor(id: string, createdAt: DateVo, isRemote: boolean, item: ItemModel) {
    super(CommandNameEnum.AddItem, id, createdAt, isRemote);
    this.item = item;
  }

  static create(item: ItemModel) {
    return new AddItemCommand(generateUuidV4(), DateVo.now(), false, item);
  }

  static createRemote(id: string, createdAt: DateVo, item: ItemModel) {
    return new AddItemCommand(id, createdAt, true, item);
  }

  public getIsClientOnly = () => true;

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
