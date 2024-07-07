import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';
import { LinkUnitModel } from '@/models/world/unit/link-unit-model';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { PositionVo } from '@/models/world/common/position-vo';
import { CommandNameEnum } from '../command-name-enum';

export class CreateLinkUnitCommand extends Command {
  constructor(
    id: string,
    createdAt: DateVo,
    isRemote: boolean,
    private unitId: string,
    private itemId: string,
    private position: PositionVo,
    private direction: DirectionVo,
    private label: string | null,
    private url: string
  ) {
    super(CommandNameEnum.CreateLinkUnit, id, createdAt, isRemote);
  }

  static create(itemId: string, position: PositionVo, direction: DirectionVo, label: string | null, url: string) {
    return new CreateLinkUnitCommand(generateUuidV4(), DateVo.now(), false, generateUuidV4(), itemId, position, direction, label, url);
  }

  static createRemote(
    id: string,
    createdAt: DateVo,
    unitId: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    label: string | null,
    url: string
  ) {
    return new CreateLinkUnitCommand(id, createdAt, true, unitId, itemId, position, direction, label, url);
  }

  public getIsClientOnly = () => false;

  public getRequiredItemId = () => this.itemId;

  public execute({ unitManager, playerManager, itemManager }: CommandParams): void {
    const item = itemManager.getItem(this.itemId);
    if (!item) return;

    if (!(item.getCompatibleUnitType() === UnitTypeEnum.Link)) return;

    const newUnit = LinkUnitModel.create(this.unitId, this.itemId, this.position, this.direction, item.getDimension(), this.label);

    const occupiedPositions = newUnit.getOccupiedPositions();
    for (let occupiedPositionIdx = 0; occupiedPositionIdx < occupiedPositions.length; occupiedPositionIdx += 1) {
      const occupiedPosition = occupiedPositions[occupiedPositionIdx];
      const unitAtPos = unitManager.getUnitByPos(occupiedPosition);
      if (unitAtPos) return;

      const playersAtPos = playerManager.getPlayersAtPos(occupiedPosition);
      if (playersAtPos) return;
    }

    const newUnitAdded = unitManager.addUnit(newUnit);

    this.setUndoAction(() => {
      if (newUnitAdded) {
        unitManager.removeUnit(newUnit.getId());
      }
    });
  }

  public getUnitId() {
    return this.unitId;
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

  public getLabel() {
    return this.label;
  }

  public getUrl() {
    return this.url;
  }
}
