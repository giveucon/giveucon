import React from 'react';
import gravatar from 'gravatar';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AssistantIcon from '@material-ui/icons/Assistant';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import InfoIcon from '@material-ui/icons/Info';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import StoreIcon from '@material-ui/icons/Store';

import Layout from 'components/Layout'
import ListItem from 'components/ListItem'
import Section from 'components/Section'
import UserProfileBox from 'components/UserProfileBox'
import useI18n from 'hooks/useI18n'
import requestToBackend from 'utils/requestToBackend'
import withAuthServerSideProps from 'utils/withAuthServerSideProps'

const useStyles = makeStyles((theme) => ({
  errorButton: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
       background: theme.palette.error.dark,
    },
  },
}));

const getSelfPrePendingCouponSellingList = async (context, selfUser) => await requestToBackend(context, 'api/coupon-sellings', 'get', 'json', null, {
  buyer__id: selfUser.id,
  status__status: 'pre_pending',
});

const getSelfPendingCouponSellingList = async (context, selfUser) => await requestToBackend(context, 'api/coupon-sellings', 'get', 'json', null, {
  coupon__user__id: selfUser.id,
  status__status: 'pending',
});

export const getServerSideProps = withAuthServerSideProps (async (context, lng, lngDict, selfUser) => {
  const selfPrePendingCouponSellingListResponse = await getSelfPrePendingCouponSellingList(context, selfUser);
  if (selfPrePendingCouponSellingListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  const selfPendingCouponSellingListResponse = await getSelfPendingCouponSellingList(context, selfUser);
  if (selfPendingCouponSellingListResponse.status === 404) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      lng,
      lngDict,
      selfUser,
      selfPrePendingCouponSellingListResponse,
      selfPendingCouponSellingListResponse
    }
  }
})

function Index({
  lng,
  lngDict,
  selfUser,
  selfPrePendingCouponSellingListResponse,
  selfPendingCouponSellingListResponse
}) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  return (
    <Layout
      lng={lng}
      lngDict={lngDict}
      menuItemList={selfUser.menu_items}
      title={`${i18n.t('myAccount')} - ${i18n.t('_appName')}`}
    >
      <Section
        backButton
        title={i18n.t('myAccount')}
      >
        <UserProfileBox
          name={selfUser.user_name}
          subtitle={selfUser.email}
          image={gravatar.url(selfUser.email, {default: 'identicon'})}
          onClick={() => router.push(`/users/${selfUser.id}/`)}
        />
        <Box marginY={1}>
          <Button
            color='default'
            fullWidth
            variant='contained'
            onClick={() => router.push('/friends/')}
          >
            {i18n.t('myFriends')}
          </Button>
        </Box>
        <Box marginY={1}>
          <Button
            className={classes.errorButton}
            fullWidth
            variant='contained'
            onClick={() => router.push('/oauth/kakao/logout/')}
          >
            {i18n.t('logout')}
          </Button>
        </Box>
      </Section>


      <Section
        title={i18n.t('myWallet')}
        titleSuffix={
          <IconButton>
            <ArrowForwardIcon onClick={() => router.push('/my-wallet/')}/>
          </IconButton>
        }
      >
        <ListItem
          variant='default'
          title={i18n.t('myCoupons')}
          icon={<LoyaltyIcon />}
          onClick={() => router.push({
            pathname: '/coupons/list/',
            query: { user: selfUser.id },
          })}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('myFavoriteStores')}
          icon={<StoreIcon />}
          onClick={() => router.push({
            pathname: '/favorite-stores/list/',
            query: { user: selfUser.id },
          })}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('myFavoriteProducts')}
          icon={<ShoppingBasketIcon />}
          onClick={() => router.push({
            pathname: '/favorite-products/list/',
            query: { user: selfUser.id },
          })}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('tradesNeedToRemit')}
          icon={
            <Badge
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              color='error'
              badgeContent={selfPrePendingCouponSellingListResponse.data.count}
            >
              <AssistantIcon />
            </Badge>
          }
          onClick={() => router.push({
            pathname: '/coupon-sellings/list/',
            query: { buyer: selfUser.id, status: 'pre_pending' },
          })}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('myTransactions')}
          icon={<LocalAtmIcon />}
          onClick={() => router.push({
            pathname: '/my-wallet/transactions/',
            query: { user: selfUser.id },
          })}
        />
      </Section>


      <Section
        title={i18n.t('myBusiness')}
        titleSuffix={
          <IconButton>
            <ArrowForwardIcon onClick={() => router.push('/my-business/')}/>
          </IconButton>
        }
      >
        <ListItem
          variant='default'
          title={i18n.t('myStores')}
          icon={<StoreIcon />}
          onClick={() => router.push({
            pathname: '/stores/list/',
            query: { user: selfUser.id },
          })}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('myProducts')}
          icon={<ShoppingBasketIcon />}
          onClick={() => router.push({
            pathname: '/products/list/',
            query: { user: selfUser.id },
          })}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('tradeConfirmationRequests')}
          icon={
            <Badge
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              color='error'
              badgeContent={selfPendingCouponSellingListResponse.data.count}
            >
              <AssistantIcon />
            </Badge>
          }
          onClick={() => router.push({
            pathname: '/coupon-sellings/list/',
            query: { user: selfUser.id, status: 'pending' },
          })}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('tradeConfirmationRequests')}
          icon={<AssistantIcon />}
          onClick={() => router.push({
            pathname: '/coupon-sellings/list/',
            query: { user: selfUser.id, status: 'pending' },
          })}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('scanCoupon')}
          icon={<CropFreeIcon />}
          onClick={() => router.push('/coupons/scan/')}
        />
      </Section>


      <Section
        title={i18n.t('general')}
      >
        <ListItem
          variant='default'
          title={i18n.t('notifications')}
          icon={<NotificationsIcon />}
          onClick={() => router.push({
            pathname: '/notifications/list/',
            query: { to_user: selfUser.id },
          })}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('notices')}
          icon={<AnnouncementIcon />}
          onClick={() => router.push('/central-notices/')}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('settings')}
          icon={<SettingsIcon />}
          onClick={() => router.push('/my-account/update/')}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('about')}
          icon={<InfoIcon />}
          onClick={() => router.push('/about/')}
        />
      </Section>


      <Section
        title={i18n.t('developerTools')}
      >
        <ListItem
          variant='default'
          title={i18n.t('createDatabase')}
          icon={<DataUsageIcon />}
          onClick={() => router.push('/database/create/')}
        />
        <Divider />
        <ListItem
          variant='default'
          title={i18n.t('components')}
          icon={<DashboardIcon />}
          onClick={() => {router.push('/sandbox/components/')}}
        />
      </Section>
    </Layout>
  );
}

export default Index;
