import React from 'react';
import { useRouter } from 'next/router';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import HomeIcon from '@material-ui/icons/Home';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DirectionsIcon from '@material-ui/icons/Directions';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LoyaltyIcon from '@material-ui/icons/Loyalty';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox';
import Layout from 'components/Layout';
import Section from 'components/Section';
import SwipeableTileList from 'components/SwipeableTileList';
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

const getCentralNoticeList = async (context) => await requestToBackend(context, 'api/central-notices/', 'get', 'json');
const getNearStoreList = async (context) => await requestToBackend(context, 'api/stores/near/', 'get', 'json');
const getSelfCouponList = async (context, selfUser) => await requestToBackend(context, 'api/coupons/', 'get', 'json', null, {
    user: selfUser.id,
    used: false
  });

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const centralNoticeListResponse = await getCentralNoticeList(context);
  const nearStoreListResponse = await getNearStoreList(context);
  const selfCouponListResponse = await getSelfCouponList(context, selfUser);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      centralNoticeList: centralNoticeListResponse.data.results,
      nearStoreList: nearStoreListResponse.data.results,
      selfCouponList: selfCouponListResponse.data.results
    }
  }
})

function Index({ lng, lngDict, selfUser, centralNoticeList, nearStoreList, selfCouponList }) {

  const i18n = useI18n();
  const router = useRouter();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('home')} - ${i18n.t('_appName')}`}
    >
      <Section
        title={i18n.t('home')}
        titlePrefix={<IconButton><HomeIcon /></IconButton>}
        titleSuffix={[
          <IconButton>
            <Badge
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              color='error'
              badgeContent=''
              variant="dot"
            >
              <NotificationsIcon
                onClick={() => router.push({
                  pathname: '/notifications/list/',
                  query: { to_user: selfUser.id },
                })}
              />
            </Badge>
          </IconButton>,
          <IconButton onClick={() => router.push('/central-notices/')}>
            <AnnouncementIcon />
          </IconButton>,
          <IconButton>
            <AccountCircleIcon onClick={() => router.push('/my-account/')} />
          </IconButton>
        ]}
        padding={false}
      >
        {centralNoticeList.length > 0 && (
          <SwipeableTileList autoplay>
            {centralNoticeList.slice(0, constants.TILE_LIST_SLICE_NUMBER).map((item) => (
              <Tile
                key={item.id}
                title={item.article.title}
                image={
                  item.article.images && (item.article.images.length > 0)
                  ? item.article.images[0].image
                  : constants.NO_IMAGE_PATH
                }
                onClick={() => router.push(`/central-notices/${item.id}/` )}
              />
            ))}
          </SwipeableTileList>
        )}
      </Section>

      <Section
        title={i18n.t('nearbyStores')}
        titlePrefix={<IconButton><LocationOnIcon /></IconButton>}
        padding={false}
      >
        {nearStoreList.length > 0 ? (
          <SwipeableTileList half>
            {nearStoreList.slice(0, constants.HALF_TILE_LIST_SLICE_NUMBER).map((item) => (
              <Tile
                key={item.id}
                title={item.name}
                image={
                  item.images && (item.images.length > 0)
                  ? item.images[0].image
                  : constants.NO_IMAGE_PATH
                }
                onClick={() => router.push(`/stores/${item.id}/`)}
              />
            ))}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>


      <Section
        title={i18n.t('myCoupons')}
        titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
        padding={false}
      >
        {selfCouponList.length > 0 ? (
          <SwipeableTileList half>
            {selfCouponList.slice(0, constants.HALF_TILE_LIST_SLICE_NUMBER).map((item) => (
              <Tile
                key={item.id}
                title={item.product.name}
                image={
                  item.product.images && (item.product.images.length > 0)
                  ? item.product.images[0].image
                  : constants.NO_IMAGE_PATH
                }
                onClick={() => router.push(`/coupons/${item.id}/`)}
                actions={[
                  <IconButton
                    onClick={() => router.push(`https://map.kakao.com/link/to/${item.product.store.name},${item.product.store.location.latitude},${item.product.store.location.longitude}`)}
                  >
                    <DirectionsIcon/>
                  </IconButton>,
                  <IconButton>
                    <CropFreeIcon
                      onClick={() => router.push({
                        pathname: '/coupons/use/',
                        query: { id: item.id },
                      })}
                    />
                  </IconButton>
                ]}
              />
            ))}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
    </Layout>
  );
}

export default Index;
