import type { NextPage, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useContext, useEffect } from 'react';

import { wrapper } from '@/stores';
import { getInitialLocale } from '@/utils/i18n';
import GameOfLibertyContext from '@/contexts/GameOfLiberty';
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

const Home: NextPage = function Home() {
  const { area, units, joinGame } = useContext(GameOfLibertyContext);
  useEffect(() => {
    joinGame();
  }, []);

  const gameFieldUnits = convertGameOfLibertyUnitsToGameFieldUnits(area, units);
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
