import React, { useEffect, useState } from 'react';
import gravatar from 'gravatar';
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import ContactsIcon from '@material-ui/icons/Contacts';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import Filter1Icon from '@material-ui/icons/Filter1';
import Filter2Icon from '@material-ui/icons/Filter2';
import Filter3Icon from '@material-ui/icons/Filter3';
import Filter4Icon from '@material-ui/icons/Filter4';
import Filter5Icon from '@material-ui/icons/Filter5';
import Filter6Icon from '@material-ui/icons/Filter6';
import Filter7Icon from '@material-ui/icons/Filter7';
import Filter8Icon from '@material-ui/icons/Filter8';
import Filter9Icon from '@material-ui/icons/Filter9';
import Filter9PlusIcon from '@material-ui/icons/Filter9Plus';
import PaymentIcon from '@material-ui/icons/Payment';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox'
import AmountInputBox from 'components/AmountInputBox'
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout'
import PayPalButton from 'components/PayPalButton'
import CouponBox from 'components/CouponBox'
import Section from 'components/Section'
import ListItem from 'components/ListItem'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCoupon = async (context) => await requestToBackend(context, `api/coupons/${context.query.coupon}/`, 'get', 'json');
const putCouponBuy = async (coupon) => await requestToBackend(null, `api/coupons/${coupon.id}/buy/`, 'put', 'json');

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

function Give({ lng, lngDict, selfUser, coupon, initialSelfFriendListResponse }) {

  const i18n = useI18n();
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [amountIcon, setAmountIcon] = useState(<FilterNoneIcon />);

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
    if (selfFriendListResponse.data.next === null) setHasMoreSelfFriendList(prevHasMoreSelfFriendList => false);
  }
  const [selectedFriendList, setSelectedFriendList] = useState([]);

  const merchantId = 'AAAAAAAAAAAA';

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
              {selfFriendList && selfFriendList.map((item, index) => (
                <ListItem
                  key={item.id}
                  variant='user'
                  title={item.to_user.user_name}
                  image={gravatar.url(item.to_user.email, {default: 'identicon'})}
                  prefix={
                    <Checkbox
                      checked={selectedFriendList.includes(item.id)}
                      onChange={(event) => {
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

        {/*
          <Section
            title={i18n.t('amount')}
            titlePrefix={<IconButton>{amountIcon}</IconButton>}
          >
            <Box paddingY={1}>
              <AmountInputBox
                label={i18n.t('amount')}
                lng={lng}
                lngDict={lngDict}
                defaultAmount={0}
                addAmountList={constants.AMOUNT_LIST}
                onChangeAmount={(amount) => {
                  setAmount(prevAmount => amount);
                  if (amount <= 0)  setAmountIcon(<FilterNoneIcon />)
                  if (amount === 1) setAmountIcon(<Filter1Icon />)
                  if (amount === 2) setAmountIcon(<Filter2Icon />)
                  if (amount === 3) setAmountIcon(<Filter3Icon />)
                  if (amount === 4) setAmountIcon(<Filter4Icon />)
                  if (amount === 5) setAmountIcon(<Filter5Icon />)
                  if (amount === 6) setAmountIcon(<Filter6Icon />)
                  if (amount === 7) setAmountIcon(<Filter7Icon />)
                  if (amount === 8) setAmountIcon(<Filter8Icon />)
                  if (amount === 9) setAmountIcon(<Filter9Icon />)
                  if (amount >= 10) setAmountIcon(<Filter9PlusIcon />)
                }}
              />
            </Box>
          </Section>
        */}

        {/*
          <PayPalButton merchantId={merchantId} price='0.01' description='test' />
        */}

        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => {
              const putCouponBuyResponse = await putCouponBuy(coupon);
              if (putCouponBuyResponse.status === 201) {
                router.push(`/coupons/${putCouponBuyResponse.data.id}/`);
                toast.success(i18n.t('_couponSuccessfullyPurchased'));
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

export default Give;
