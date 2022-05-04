import { useRef, useContext, useEffect } from 'react';
import GameOfLibertyContext from '@/contexts/GameOfLiberty';
import useElementResolutionCalculator from '@/hooks/useElementResolutionCalculator';
import type {
  Area as GameOfLibertyArea,
  Units as GameOfLibertyUnits,
} from '@/contexts/GameOfLiberty';
import GameField from '@/components/fields/GameField';
import type { Units as GameFieldUnits } from '@/components/fields/GameField';

function convertGameOfLibertyUnitsToGameFieldUnits(
  area: GameOfLibertyArea,
  units: GameOfLibertyUnits
): GameFieldUnits {
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

function GameOfLifeContainer({ unitSize }: Props) {
  const wrapperRef = useRef<HTMLElement>(null);
  const [gameWidth, gameHeight] = useElementResolutionCalculator(
    wrapperRef,
    unitSize
  );

  const { area, units, status, joinGame, watchUnits } =
    useContext(GameOfLibertyContext);

  useEffect(() => {
    joinGame();
  }, []);

  useEffect(() => {
    if (status !== 'ONLINE') {
      return;
    }
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
  }, [status, gameWidth, gameHeight]);

  const gameFieldUnits = convertGameOfLibertyUnitsToGameFieldUnits(area, units);

  return (
    <section ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <GameField units={gameFieldUnits} unitSize={unitSize} />
    </section>
  );
}

export default GameOfLifeContainer;
