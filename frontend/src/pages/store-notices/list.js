import React from 'react';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import AlertBox from '../../components/AlertBox'
import Layout from '../../components/Layout'
import Section from '../../components/Section'
import Tile from '../../components/Tile';
import requestToBackend from '../requestToBackend'
import withAuthServerSideProps from '../withAuthServerSideProps'

const getStoreNoticeList = async (session, context) => {
  const params = {
    user: context.query.user || null,
    store: context.query.store || null,
  };
  return await requestToBackend(session, 'api/stores', 'get', 'json', null, params);
};

const getStore = async (session, context) => {
  return await requestToBackend(session, `api/stores/${context.query.store}/`, 'get', 'json');
};

export const getServerSideProps = withAuthServerSideProps(async (context, session, selfUser) => {
  const storeListResponse = await getStoreNoticeList(session, context);
  const storeResponse = await getStore(session, context);
  return {
    props: { session, selfUser, storeList: storeListResponse.data, store: storeResponse.data },
  };
})

function List({ session, selfUser, storeList, store }) {
  const router = useRouter();
  return (
    <Layout title={`가게 공지사항 목록 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        backButton
        title='가게 공지사항 목록'
      >
        {storeList && (storeList.length > 0) ? (
          <Grid container>
            {storeList && storeList.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile
                  title={item.name}
                  image={item.images.length > 0 ? item.images[0].image : '/no_image.png'}
                  onClick={() => router.push(`/store-notices/${item.id}/`)}
                  menuItems={
                    <MenuItem>Menu Item</MenuItem>
                  }
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AlertBox content='가게가 없습니다.' variant='information' />
        )}
      </Section>
      { store && (store.user === selfUser.id) && (
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={() => router.push({
              pathname: '/store-notices/create/',
              query: { store: store.id },
            })}
          >
            새 가게 공지사항 추가
          </Button>
        </Box>
      )}
    </Layout>
  );
}

export default List;
