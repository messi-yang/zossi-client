import { Command } from '../command';
import { CommandParams } from '../command-params';
import { PositionVo } from '@/models/world/common/position-vo';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { DateVo } from '@/models/global/date-vo';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';
import { LinkUnitModel } from '@/models/world/unit/link-unit-model';

export class CreateLinkUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private itemId: string;

  private position: PositionVo;

  private direction: DirectionVo;

  private url: string;

  constructor(
    id: string,
    timestamp: number,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    url: string
  ) {
    this.id = id;
    this.timestamp = timestamp;
    this.itemId = itemId;
    this.position = position;
    this.direction = direction;
    this.url = url;
  }

  static new(itemId: string, position: PositionVo, direction: DirectionVo, url: string) {
    return new CreateLinkUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), itemId, position, direction, url);
  }

  static load(
    id: string,
    timestamp: number,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    url: string
  ) {
    return new CreateLinkUnitCommand(id, timestamp, itemId, position, direction, url);
  }

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.itemId);
    if (!item) return;

    if (!(item.getCompatibleUnitType() === UnitTypeEnum.Link)) return;

    const unitAtPos = unitManager.getUnit(this.position);
    if (unitAtPos) return;

    const playersAtPos = playerManager.getPlayersAtPos(this.position);
    if (playersAtPos) return;

    unitManager.addUnit(LinkUnitModel.new(this.itemId, this.position, this.direction));
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getItemId() {
    return this.itemId;
  }

  public getPosition() {
    return this.position;
  }

  public getDirection() {
    return this.direction;
  }

  public getUrl() {
    return this.url;
  }
}
