import type { NextPage, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { wrapper } from '@/stores';
import { getInitialLocale } from '@/utils/i18n';

const Landing: NextPage = function Landing() {
  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        backgroundColor: '#1E1E1E',
      }}
    />
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

export default Landing;
