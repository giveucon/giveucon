import React, { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import * as constants from 'constants';
import AlertBox from 'components/AlertBox';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader';
import Layout from 'components/Layout';
import Section from 'components/Section';
import Tile from 'components/Tile';
import useI18n from 'hooks/useI18n';
import requestToBackend from 'utils/requestToBackend';
import withAuthServerSideProps from 'utils/withAuthServerSideProps';

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => ({
    props: {
      lng,
      lngDict,
      selfUser
    }
  }))

function Search({ lng, lngDict, selfUser }) {

  const i18n = useI18n();
  const router = useRouter();
  const [keywords, setKeywords] = useState({
    name: null,
    tagName: null
  });
  const [couponSellingList, setCouponSellingList] = useState([]);
  const [couponSellingListpage, setCouponSellingListpage] = useState(1);
  const [hasMoreCouponSellingList, setHasMoreCouponSellingList] = useState(true);

  const getCouponSellingList = async () => {
    const params = {
      coupon__product__name: keywords.name || null
    };
    const getCouponSellingListResponse = await requestToBackend(null, 'api/coupon-sellings/', 'get', 'json', null, params);
    if (getCouponSellingListResponse.status === 200) {
      setCouponSellingList(getCouponSellingListResponse.data.results);
      setCouponSellingListpage(1);
      if (getCouponSellingListResponse.data.next === null) setHasMoreCouponSellingList(false);
    }
    else toast.error(i18n.t('_errorOccurredProcessingRequest'));
  };

  const getMoreCouponSellingList = async () => {
    const params = {
      coupon__product__name: keywords.name || null,
      page: couponSellingListpage + 1,
    };
    const getCouponSellingListResponse = await requestToBackend(null, 'api/couponSellings/', 'get', 'json', null, params);
    if (getCouponSellingListResponse.status === 200) {
      for (const couponSelling of getCouponSellingListResponse.data.results) {
        const favoriteCouponSellingResponse = await getCouponSellingList(null, selfUser, couponSelling);
        couponSelling.favorite = (favoriteCouponSellingResponse.data.results.length === 1) ? favoriteCouponSellingResponse.data.results[0] : null
      }
      setCouponSellingList(prevCouponSellingList => prevCouponSellingList.concat(getCouponSellingListResponse.data.results));
      setCouponSellingListpage(prevCouponSellingListpage => prevCouponSellingListpage + 1);
      if (getCouponSellingListResponse.data.next === null) setHasMoreCouponSellingList(false);
    }
    else toast.error(i18n.t('_errorOccurredProcessingRequest'));
  }

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('searchCouponTrades')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('searchCouponTrades')}
      />


      <Section
        title={i18n.t('keywords')}
        titlePrefix={<IconButton><VpnKeyIcon /></IconButton>}
      >
        <Box paddingY={1}>
          <TextField
            name='name'
            value={keywords.name}
            fullWidth
            label={i18n.t('name')}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              setKeywords(prevKeywords => ({ ...prevKeywords, name: event.target.value }));
            }}
          />
        </Box>
        <Box marginY={1}>
          <Button
            color='primary'
            fullWidth
            variant='contained'
            onClick={async () => await getCouponSellingList(keywords)}
          >
            {i18n.t('searchCouponTrades')}
          </Button>
        </Box>
      </Section>

      <Section
        title={i18n.t('searchResults')}
        titlePrefix={<IconButton><SearchIcon /></IconButton>}
        padding={false}
      >
        {couponSellingList.length > 0 ? (
          <InfiniteScroll
            dataLength={couponSellingList.length}
            next={getMoreCouponSellingList}
            hasMore={hasMoreCouponSellingList}
            loader={<InfiniteScrollLoader loading />}
            endMessage={<InfiniteScrollLoader loading={false} />}
          >
            <Grid container>
              {couponSellingList.map((item) => (
                <Grid item xs={6} key={item.id}>
                  <Tile
                    title={item.coupon.product.name}
                    image={item.coupon.product.images.length > 0 ? item.coupon.product.images[0].image : constants.NO_IMAGE_PATH}
                    onClick={() => router.push(`/coupon-sellings/${item.id}/`)}
                  />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        ) : (
          <AlertBox content={i18n.t('_isEmpty')} variant='information' />
        )}
      </Section>
    </Layout>
  );
}

export default Search;
