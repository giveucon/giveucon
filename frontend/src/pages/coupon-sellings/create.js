import React, { useState } from 'react';
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component';
import toast from 'react-hot-toast';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import Radio from '@material-ui/core/Radio';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox'
import AmountInputBox from 'components/AmountInputBox'
import CouponBox from 'components/CouponBox'
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout'
import ListItem from 'components/ListItem'
import Section from 'components/Section'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const getCoupon = async (context) => await requestToBackend(context, `api/coupons/${context.query.coupon}/`, 'get', 'json', null, {
  used: false
});

const getSelfCouponList = async (context, selfUser) => await requestToBackend(context, `api/coupons/`, 'get', 'json', null, {
    user_name: selfUser.id
  });

const postCouponSelling = async (couponSelling) => await requestToBackend(null, 'api/coupon-sellings/', 'post', 'json', couponSelling, null);

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const couponResponse = context.query.coupon ? await getCoupon(context) : null;
  if (context.query.coupon && (couponResponse.status === 404)) {
    return {
      notFound: true
    }
  }
  const initialSelfCouponListResponse = await getSelfCouponList(context, selfUser);
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      coupon: context.query.coupon ? couponResponse.data : null,
      initialSelfCouponListResponse
    }
  }
})

function Create ({ lng, lngDict, selfUser, coupon, initialSelfCouponListResponse }) {
  const i18n = useI18n();
  const router = useRouter();
  const [couponSelling, setCouponSelling] = useState({
    coupon: coupon ? coupon.id : null,
    price: coupon ? coupon.product.price : 0,
  });

  const [selfCouponList, setSelfCouponList] = useState(initialSelfCouponListResponse.data.results);
  const [selfCouponListpage, setSelfCouponListpage] = useState(1);
  const [hasMoreSelfCouponList, setHasMoreSelfCouponList] = useState(initialSelfCouponListResponse.data.next);
  const getMoreSelfCouponList = async () => {
    const selfCouponListResponse = await requestToBackend(null, 'api/friends/', 'get', 'json', null, {
      from_user: selfUser.id,
      page: selfCouponListpage + 1
    });
    setSelfCouponList(prevSelfCouponList => (prevSelfCouponList || []).concat(selfCouponListResponse.data.results));
    setSelfCouponListpage(prevSelfCouponListpage => prevSelfCouponListpage + 1);
    if (selfCouponListpage.data.next === null) setHasMoreSelfCouponList(false);
  }

  if (coupon) {
    return (
      <Layout
        lng={lng}
      lngDict={lngDict}
        menuItemList={selfUser.menu_items}
        title={`${i18n.t('addCouponTrade')} - ${i18n.t('_appName')}`}
      >
        <Section
          backButton
          title={i18n.t('addCouponTrade')}
         />
        <Section
          title={i18n.t('coupon')}
          titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
        >
          <CouponBox
            lng={lng}
            lngDict={lngDict}
            name={coupon.product.name}
            image={coupon.product.images.length > 0 ? coupon.product.images[0].image : constants.NO_IMAGE_PATH}
            price={coupon.product.price}
          />
        </Section>
        <Section
          title={i18n.t('basicInfo')}
          titlePrefix={<IconButton><InfoOutlinedIcon /></IconButton>}
        >
          <Box paddingY={1}>
            <AmountInputBox
              variant='money'
              defaultAmount={coupon ? coupon.product.price : 0}
              label={i18n.t('price')}
              lng={lng}
              lngDict={lngDict}
              addAmountList={constants.MONEY_DISCOUNT_LIST}
              onChangeAmount={(amount) => {
                setCouponSelling(prevCouponSelling => ({ ...prevCouponSelling, price: amount }));
              }}
            />
          </Box>
        </Section>


        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => {
              const postCouponSellingResponse = await postCouponSelling(couponSelling);
              if (postCouponSellingResponse.status === 201) {
                router.push(`/coupon-sellings/${postCouponSellingResponse.data.id}/`);
                toast.success(i18n.t('_couponTradeAdded'));
              }
              else {
                toast.error(i18n.t('_errorOccurredProcessingRequest'));
              }
            }}
          >
            {i18n.t('submit')}
          </Button>
        </Box>
      </Layout>
    );
  }
    return (
      <Layout
        lng={lng}
      lngDict={lngDict}
        menuItemList={selfUser.menu_items}
        title={`${i18n.t('addCouponTrade')} - ${i18n.t('_appName')}`}
      >
        <Section
          backButton
          title={i18n.t('addCouponTrade')}
        />
        <Section
          title={i18n.t('couponList')}
          titlePrefix={<IconButton><LoyaltyIcon /></IconButton>}
        >
          {(selfCouponList.length > 0) ? (
            <InfiniteScroll
              dataLength={selfCouponList.length}
              next={getMoreSelfCouponList}
              hasMore={hasMoreSelfCouponList}
              height='10rem'
              loader={<InfiniteScrollLoader loading />}
              endMessage={<InfiniteScrollLoader loading={false} />}
            >
              {selfCouponList && selfCouponList.map((item) => (
                <ListItem
                  key={item.id}
                  variant='coupon'
                  title={item.product.name}
                  price={item.product.price}
                  date={item.expires_at}
                  image={item.product.images.length > 0 ? item.product.images[0].image : constants.NO_IMAGE_PATH}
                  prefix={
                    <Radio
                      value={item.id}
                      checked={couponSelling.coupon === item.id}
                      onChange={() => {
                        setCouponSelling(prevCouponSelling => ({...prevCouponSelling, coupon: item.id}))
                      }}
                    />
                  }
                  onClick={() => {
                    setCouponSelling(prevCouponSelling => ({...prevCouponSelling, coupon: item.id}))
                  }}
                />
              ))}
            </InfiniteScroll>
          ) : (
            <AlertBox content={i18n.t('_isEmpty')} variant='information' />
          )}
        </Section>
        <Section
          title={i18n.t('basicInfo')}
          titlePrefix={<IconButton><InfoOutlinedIcon /></IconButton>}
        >
          <Box paddingY={1}>
            <AmountInputBox
              variant='money'
              defaultAmount={coupon ? coupon.product.price : 0}
              label={i18n.t('price')}
              lng={lng}
              lngDict={lngDict}
              addAmountList={constants.MONEY_AMOUNT_LIST}
              onChangeAmount={(amount) => {
                setCouponSelling(prevCouponSelling => ({ ...prevCouponSelling, price: amount }));
              }}
            />
          </Box>
        </Section>


        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => {
              const postCouponSellingResponse = await postCouponSelling(couponSelling);
              if (postCouponSellingResponse.status === 201) {
                router.push(`/coupon-sellings/${postCouponSellingResponse.data.id}/`);
                toast.success(i18n.t('_couponTradeAdded'));
              }
              else {
                toast.error(i18n.t('_errorOccurredProcessingRequest'));
              }
            }}
          >
            {i18n.t('submit')}
          </Button>
        </Box>
      </Layout>
    );

}

export default Create;
