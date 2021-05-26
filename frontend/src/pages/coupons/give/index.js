import React, { useState } from 'react';
import gravatar from 'gravatar';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import ContactsIcon from '@material-ui/icons/Contacts';
import PaymentIcon from '@material-ui/icons/Payment';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox'
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout'
import CouponBox from 'components/CouponBox'
import Section from 'components/Section'
import ListItem from 'components/ListItem'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCoupon = async (context) => await requestToBackend(context, `api/coupons/${context.query.coupon}/`, 'get', 'json');

const putGiveCoupon = async (coupon, user) => await requestToBackend(null, `api/coupons/${coupon.id}/give/`, 'put', 'json', {
  user
}, null)

const getSelfFriendList = async (context, selfUser) => await requestToBackend(context, `api/friends/`, 'get', 'json', null, {
  from_user: selfUser.id
});

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponResponse = await getCoupon(context);
  if (couponResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const initialSelfFriendListResponse = await getSelfFriendList(context, selfUser);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      coupon: couponResponse.data,
      initialSelfFriendListResponse
    }
  }
})

function Index({ lng, lngDict, selfUser, coupon, initialSelfFriendListResponse }) {

  const i18n = useI18n();
  const router = useRouter();

  const [selfFriendList, setSelfFriendList] = useState(initialSelfFriendListResponse.data.results);
  const [selfFriendnListpage, setSelfFriendListpage] = useState(1);
  const [hasMoreSelfFriendList, setHasMoreSelfFriendList] = useState(initialSelfFriendListResponse.data.next);
  const getMoreSelfFriendList = async () => {
    const selfFriendListResponse = await requestToBackend(null, 'api/friends/', 'get', 'json', null, {
      from_user: selfUser.id,
      page: selfFriendnListpage + 1
    });
    setSelfFriendList(prevSelfFriendList => (prevSelfFriendList || []).concat(selfFriendListResponse.data.results));
    setSelfFriendListpage(prevSelfFriendListpage => prevSelfFriendListpage + 1);
    if (selfFriendListResponse.data.next === null) setHasMoreSelfFriendList(false);
  }
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <>
      <Layout
        lng={lng}
        lngDict={lngDict}
        menuItemList={selfUser.menu_items}
        title={`${i18n.t('giveCoupon')} - ${i18n.t('_appName')}`}
      >
        <Section
          backButton
          title={i18n.t('giveCoupon')}
         />
        <Section
          title={i18n.t('paymentInfo')}
          titlePrefix={<IconButton><PaymentIcon /></IconButton>}
        >
          <CouponBox
            name={coupon.product.name}
            price={coupon.product.price}
            image={coupon.product.images.length > 0 ? coupon.product.images[0].image : constants.NO_IMAGE_PATH}
            lng={lng}
            lngDict={lngDict}
          />
        </Section>


        <Section
          title={i18n.t('friendList')}
          titlePrefix={<IconButton><ContactsIcon /></IconButton>}
        >
          {(selfFriendList.length > 0) ? (
            <InfiniteScroll
              dataLength={selfFriendList.length}
              next={getMoreSelfFriendList}
              hasMore={hasMoreSelfFriendList}
              height='10rem'
              loader={<InfiniteScrollLoader loading />}
              endMessage={<InfiniteScrollLoader loading={false} />}
            >
              {selfFriendList && selfFriendList.map((item) => (
                <ListItem
                  key={item.id}
                  variant='user'
                  title={item.to_user.user_name}
                  image={gravatar.url(item.to_user.email, {default: 'identicon'})}
                  prefix={
                    <Radio
                      checked={selectedFriend === item.id}
                      onChange={() => setSelectedFriend(item.id)}
                    />
                  }
                  onClick={() => setSelectedFriend(item.id)}
                />
              ))}
            </InfiniteScroll>
          ) : (
            <AlertBox content={i18n.t('_isEmpty')} variant='information' />
          )}
        </Section>

        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => {
              const putGiveCouponResponse = await putGiveCoupon(coupon, selectedFriend);
              if (putGiveCouponResponse.status === 200) {
                toast.success(i18n.t('_couponGived'));
                router.push({
                  pathname: '/coupons/give/completed/',
                  query: { coupon: coupon.id },
                });
              }
              else {
                toast.error(i18n.t('_errorOccurredProcessingRequest'));
              }
            }}
          >
            {i18n.t('giveCoupon')}
          </Button>
        </Box>

        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.back()}
          >
            {i18n.t('goBack')}
          </Button>
        </Box>
      </Layout>
    </>
  );
}

export default Index;
