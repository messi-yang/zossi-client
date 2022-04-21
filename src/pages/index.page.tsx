import type { NextPage, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useContext, useEffect } from 'react';

import { wrapper } from '@/stores';
import { getInitialLocale } from '@/utils/i18n';
import GameSocketContext from '@/contexts/GameSocket';
import type {
  Area as GameSocketArea,
  Units as GameSocketUnits,
} from '@/contexts/GameSocket';
import GameField from '@/components/fields/GameField';
import type { Units as GameFieldUnits } from '@/components/fields/GameField';

function convertGameSocketUnitsToGameFieldUnits(
  area: GameSocketArea,
  units: GameSocketUnits
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

const Home: NextPage = function Home() {
  const { status, area, units, joinGame, watchGameBlock } =
    useContext(GameSocketContext);
  useEffect(() => {
    joinGame();
  }, []);
  useEffect(() => {
    if (status === 'ESTABLISHED') {
      watchGameBlock({
        from: { x: 30, y: 30 },
        to: { x: 60, y: 60 },
      });
    }
  }, [status]);

  const gameFieldUnits = convertGameSocketUnitsToGameFieldUnits(area, units);
  return (
    <main>
      <GameField units={gameFieldUnits} />
    </main>
  );
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
  () =>
    async ({ locale }) => ({
      props: {
        ...(await serverSideTranslations(getInitialLocale(locale), ['index'])),
      },
    })
);

export default Home;
