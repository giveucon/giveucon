import React, { useState } from 'react';
import gravatar from 'gravatar';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
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

const getCouponSelling = async (context) => await requestToBackend(context, `api/coupon-sellings/${context.query.coupon_selling}/`, 'get', 'json');

const putCouponSelling = async (couponSelling, status) => await requestToBackend(null, `api/coupon-sellings/${couponSelling.id}`, 'get', 'json', {
  status: {"status": status}
}, null)

const getSelfFriendList = async (context, selfUser) => await requestToBackend(context, `api/friends/`, 'get', 'json', null, {
    from_user: selfUser.id
  });

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponSellingResponse = await getCouponSelling(context);
  if (couponSellingResponse.status === 404) {
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
      couponSelling: couponSellingResponse.data,
      initialSelfFriendListResponse
    }
  }
})

function Index({ lng, lngDict, selfUser, couponSelling, initialSelfFriendListResponse }) {

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
  const [selectedFriendList, setSelectedFriendList] = useState([]);

  return (
    <>
      <Layout
        lng={lng}
      lngDict={lngDict}
        menuItemList={selfUser.menu_items}
        title={`${i18n.t('giveCoupons')} - ${i18n.t('_appName')}`}
      >
        <Section
          backButton
          title={i18n.t('giveCoupons')}
         />
        <Section
          title={i18n.t('paymentInfo')}
          titlePrefix={<IconButton><PaymentIcon /></IconButton>}
        >
          <CouponBox
            name={couponSelling.coupon.product.name}
            price={couponSelling.price}
            image={couponSelling.coupon.product.images.length > 0 ? couponSelling.coupon.product.images[0].image : constants.NO_IMAGE_PATH}
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
                    <Checkbox
                      checked={selectedFriendList.includes(item.id)}
                      onChange={() => {
                        if (selectedFriendList.includes(item.id)) setSelectedFriendList(selectedFriendList.filter(element => element !== item.id));
                        else setSelectedFriendList(selectedFriendList.concat(item.id));
                        selectedFriendList.sort((lhs, rhs) => lhs - rhs);
                      }}
                    />
                  }
                  onClick={() => router.push(`/users/${item.to_user.id}/`)}
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
              const putCouponSellingResponse = await putCouponSelling(couponSelling, 'pre_pending');
              if (putCouponSellingResponse.status === 200) {
                toast.success(i18n.t('_couponTradeRequested'));
                router.push({
                  pathname: '/coupon-sellings/give/completed/',
                  query: { coupon_selling: couponSelling.id },
                });
              }
              else {
                toast.error(i18n.t('_errorOccurredProcessingRequest'));
              }
            }}
          >
            {i18n.t('issueCoupon')}
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
