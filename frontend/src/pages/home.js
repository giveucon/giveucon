import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import HomeIcon from '@material-ui/icons/Home';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DirectionsIcon from '@material-ui/icons/Directions';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import AlertBox from '../components/AlertBox'
import Layout from '../components/Layout'
import Section from '../components/Section'
import SwipeableTileList from '../components/SwipeableTileList';
import Tile from '../components/Tile';
import requestToBackend from '../utils/requestToBackend'
import withAuth from '../utils/withAuth'

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

function Home({ selfUser }) {

  const router = useRouter();
  const [centralNoticeList, setCentralNoticeList] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const centralNoticeListResponse = await requestToBackend('api/central-notices/', 'get', 'json', null, null);
      setCentralNoticeList(centralNoticeListResponse.data);
    }
    selfUser && fetch();
  }, [selfUser]);

  return (
    <Layout title={`홈 - ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`}>
      <Section
        title='홈'
        titlePrefix={<IconButton><HomeIcon /></IconButton>}
        titleSuffix={[
          <IconButton onClick={() => router.push('/central-notices/')}>
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
        {centralNoticeList && (
          centralNoticeList.length > 0 ? (
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
            <AlertBox content='공지사항이 없습니다.' variant='information' />
          )
        )}
        {!centralNoticeList && (
          <SwipeableTileList autoplay={true}>
            <Tile skeleton/>
          </SwipeableTileList>
        )}
      </Section>
      <Section
        title='주변에서 사용할 수 있음'
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

export default withAuth(Home);
