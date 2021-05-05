import React from 'react';
import gravatar from 'gravatar';
import { useRouter } from 'next/router'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import StorefrontIcon from '@material-ui/icons/Storefront';

import * as constants from 'constants';
import Layout from 'components/Layout'
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList';
import Tile from 'components/Tile';
import UserProfileSection from 'components/UserProfileSection';
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getUser = async (context) => {
  return await requestToBackend(context, `api/users/${context.query.id}/`, 'get', 'json');
};

const getStoreList = async (context, user) => {
  return await requestToBackend(context, `api/stores/`, 'get', 'json', null, {
    user: user.id
  });
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const userResponse = await getUser(context);
  if (userResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const storeListResponse = await getStoreList(context, userResponse.data);
  return {
    props: { lng, lngDict, selfUser, user: userResponse.data, storeList: storeListResponse.data.results }
  }
})

function Id({ lng, lngDict, selfUser, user, storeList }) {

  const i18n = useI18n();
  const router = useRouter();
  
  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${user.user_name} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={user.user_name}
      />
      <UserProfileSection
        name={user.user_name}
        subtitle={user.email}
        image={gravatar.url(user.email, {default: 'identicon'})}
      >
      </UserProfileSection>


      <Section
        title={i18n.t('ownedStores')}
        titlePrefix={<IconButton><StorefrontIcon /></IconButton>}
        titleSuffix={
          <IconButton 
            onClick={() => router.push({
              pathname: '/stores/list/',
              query: { user: selfUser.id },
            })}>
            <ArrowForwardIcon />
          </IconButton>
        }
      >
        {storeList.length > 0 ? (
          <Grid container spacing={1}>
            {storeList.slice(0, constants.HALF_TILE_LIST_SLICE_NUMBER).map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile
                  title={item.name}
                  image={item.images.length > 0 ? item.images[0].image : constants.NO_IMAGE_PATH}
                  onClick={() => router.push(`/stores/${item.id}/` )}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      {selfUser.id === user.id && (
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push('/myaccount/')}
          >
            {i18n.t('goToMyAccount')}
          </Button>
        </Box>
      )}
    </Layout>
  );

}

export default Id;
