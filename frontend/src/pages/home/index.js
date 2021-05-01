import React from 'react';
import { useRouter } from 'next/router'
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import HomeIcon from '@material-ui/icons/Home';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DirectionsIcon from '@material-ui/icons/Directions';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import AlertBox from 'components/AlertBox'
import Layout from 'components/Layout'
import Section from 'components/Section'
import SwipeableTileList from 'components/SwipeableTileList';
import Tile from 'components/Tile';
import useI18n from 'hooks/use-i18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const geoRecommendedCouponList = [
  <Tile
    key={1}
    title='첫 번째 쿠폰'
    subtitle='10,000원'
    image='https://cdn.pixabay.com/photo/2016/02/19/11/40/woman-1209862_960_720.jpg'
    onClick={() => alert( 'Tapped' )}
    actions={[
      <IconButton><DirectionsIcon /></IconButton>,
      <IconButton><CropFreeIcon /></IconButton>
    ]}
  />,
  <Tile
    key={2}
    title='두 번째 쿠폰'
    subtitle='20,000원'
    image='https://cdn.pixabay.com/photo/2018/04/04/01/51/girl-3288623_960_720.jpg'
    onClick={() => alert( 'Tapped' )}
    actions={[
      <IconButton><DirectionsIcon /></IconButton>,
      <IconButton><CropFreeIcon /></IconButton>
    ]}
  />,
  <Tile
    key={3}
    title='세 번째 쿠폰'
    subtitle='30,000원'
    image='https://cdn.pixabay.com/photo/2018/08/13/03/21/woman-3602245_960_720.jpg'
    onClick={() => alert( 'Tapped' )}
    actions={[
      <IconButton><DirectionsIcon /></IconButton>,
      <IconButton><CropFreeIcon /></IconButton>
    ]}
  />
]

export const getServerSideProps = withAuthServerSideProps(async (context, lng, lngDict, selfUser) => {
  const centralNoticeListResponse = await requestToBackend(context, 'api/central-notices/', 'get', 'json');
  return {
    props: { 
      lng, lngDict, selfUser, centralNoticeList: centralNoticeListResponse.data.results
    },
  };
})

function Index({ lng, lngDict, selfUser, centralNoticeList }) {

  const i18n = useI18n()
  const router = useRouter();

  return (
    <Layout title={`${i18n.t('pages.home.index.pageTitle')} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        title={i18n.t('pages.home.index.pageTitle')}
        titlePrefix={<IconButton><HomeIcon /></IconButton>}
        titleSuffix={[
          <IconButton onClick={() => router.push('/central-notices/list/')}>
            <AnnouncementIcon />
          </IconButton>,
          <IconButton>
            <Badge badgeContent={100} color='error' max={99}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
        ]}
        padding={false}
      >
        {centralNoticeList.length > 0 ? (
          <SwipeableTileList autoplay={true}>
            {centralNoticeList.slice(0, 2).map((item, index) => (
              <Tile
                key={index}
                title={item.article.title}
                image={
                  item.images && (item.images.length > 0)
                  ? item.images[0].image
                  : '/no_image.png'
                }
                onClick={() => router.push(`/central-notices/${item.id}/` )}
              />
            ))}
          </SwipeableTileList>
        ) : (
          <AlertBox content={i18n.t('common.dialogs.empty')} variant='information' />
        )}
      </Section>
      
      <Section
        title={i18n.t('pages.home.index.nearby')}
        titlePrefix={<IconButton><LocationOnIcon /></IconButton>}
        padding={false}
      >
        <SwipeableTileList half>
          {geoRecommendedCouponList}
        </SwipeableTileList>
      </Section>
    </Layout>
  );
}

export default Index;
