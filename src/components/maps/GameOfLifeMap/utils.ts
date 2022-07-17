import type { Coordinate } from './types';

export function getRelativeCoordinate(
  originCoord: Coordinate,
  relativeCoord: Coordinate
): Coordinate {
  return {
    x: originCoord.x + relativeCoord.x,
    y: originCoord.y + relativeCoord.y,
  };
}

export function isCoordInRelatCoordsForRevival(
  coord: Coordinate,
  originCoord: Coordinate,
  relatCoords: Coordinate[]
): boolean {
  let isUnitToBeRevived = false;
  for (let i = 0; i < relatCoords.length; i += 1) {
    const targetCoordiante = getRelativeCoordinate(originCoord, relatCoords[i]);
    if (coord.x === targetCoordiante.x && coord.y === targetCoordiante.y) {
      isUnitToBeRevived = true;
      break;
    }
  }
  return isUnitToBeRevived;
}
