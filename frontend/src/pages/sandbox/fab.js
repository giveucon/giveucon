import React from 'react';
import { useRouter } from 'next/router'
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';

import Layout from 'components/Layout'
import Section from 'components/Section'
import Tile from 'components/Tile';
import withAuthServerSideProps from 'withAuthServerSideProps'

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  return {
    props: { lng, lngDict, selfUser }
  }
})

function FabTest({ lng, lngDict, selfUser }) {
  const router = useRouter();
  return (
    <>
    <Layout title={`플로팅 액션 버튼 테스트 - ${i18n.t('_appName')}`}>
        <Section
          backButton
          title='플로팅 액션 버튼 테스트'
        >
        <Grid container>
          {[...Array(10).keys()].map((item, index) => (
            <Grid item xs={6} key={index}>
              <Tile
                title='Tile'
                image='https://cdn.pixabay.com/photo/2015/07/29/12/08/hot-air-balloon-865819_960_720.jpg'
              />
            </Grid>
          ))}
        </Grid>
        </Section>
        <Fab
          color='primary'
          onClick={() => alert( 'Tapped' )}
        >
          <AddIcon />
        </Fab>
      </Layout>
    </>
  );
}

export default FabTest;
