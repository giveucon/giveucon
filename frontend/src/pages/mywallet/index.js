import React from 'react';
import { useRouter } from 'next/router'
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DirectionsIcon from '@material-ui/icons/Directions';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCouponList = async (context, selfUser) => {
  const params = {
    user: selfUser.id
  };
  return await requestToBackend(context, 'api/coupons/', 'get', 'json', null, params);
};

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, darkMode, selfUser) => {
  const selfCouponListResponse = await getCouponList(context, selfUser);
  return {
    props: { lng, lngDict, darkMode, selfUser, selfCouponList: selfCouponListResponse.data.results }
  }
})

function Index({ lng, lngDict, darkMode, selfUser, selfCouponList }) {

  const i18n = useI18n();
  const router = useRouter();
  
  return (
    <Layout
      locale={lng}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('myWallet')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('myWallet')}
      >
      </Section>
      <Section
        title={i18n.t('myCoupons')}
        titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
        titleSuffix={<IconButton><ArrowForwardIcon /></IconButton>}
      >
        {(selfCouponList.length > 0) ? (
          <Grid container spacing={1}>
            {selfCouponList.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Tile
                  title={item.product.name}
                  image={item.product.images.length > 0 ? item.product.images[0].image : constants.NO_IMAGE_PATH}
                  actions={[
                    <IconButton><DirectionsIcon /></IconButton>,
                    <IconButton
                      onClick={() => router.push({
                        pathname: '/coupons/use/',
                        query: { id: item.id },
                      })}
                    >
                      <CropFreeIcon />
                    </IconButton>
                  ]}
                  onClick={() => router.push(`/coupons/${item.id}/`)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
    </Layout>
  );
}

export default Index;
