import { useRef, useContext, useEffect } from 'react';
import GameOfLibertyContext from '@/contexts/GameOfLiberty';
import useElementResolutionCalculator from '@/hooks/useElementResolutionCalculator';
import type {
  Area as GameOfLibertyArea,
  Units as GameOfLibertyUnits,
} from '@/contexts/GameOfLiberty';
import GameOfLifeMap from '@/components/maps/GameOfLifeMap';
import type { Units as GameOfLifeMapUnits } from '@/components/maps/GameOfLifeMap';

function convertGameOfLibertyUnitsToGameOfLifeMapUnits(
  area: GameOfLibertyArea,
  units: GameOfLibertyUnits
): GameOfLifeMapUnits {
  const { from } = area;
  return units.map((rowUnits, rowIdx) =>
    rowUnits.map((unit, colIdx) => ({
      coordinate: { x: from.x + rowIdx, y: from.y + colIdx },
      alive: unit.alive,
      age: unit.age,
    }))
  );
}

type Props = {
  unitSize: number;
};

function GameOfLifeMapContainer({ unitSize }: Props) {
  const wrapperRef = useRef<HTMLElement>(null);
  const [gameWidth, gameHeight] = useElementResolutionCalculator(
    wrapperRef,
    unitSize
  );

  const { area, units, status, watchUnits } = useContext(GameOfLibertyContext);

  useEffect(() => {
    if (status === 'ONLINE') {
      watchUnits({
        from: {
          x: 0,
          y: 0,
        },
        to: {
          x: gameWidth - 1,
          y: gameHeight - 1,
        },
      });
    }
  }, [status, gameWidth, gameHeight]);

  const gameFieldUnits = convertGameOfLibertyUnitsToGameOfLifeMapUnits(
    area,
    units
  );

  return (
    <section ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <GameOfLifeMap units={gameFieldUnits} />
    </section>
  );
}

export default GameOfLifeMapContainer;
