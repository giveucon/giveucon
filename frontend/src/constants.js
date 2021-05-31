import Router from 'next/router'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import StoreMallDirectoryOutlinedIcon from '@material-ui/icons/StoreMallDirectoryOutlined';

import EN from 'locales/en.json'
import KO from 'locales/ko.json'

export const APP_VERSION = '0.2.1-beta';
export const LANGUAGE_LIST = [
  { name: 'English', lng: 'en', lngDict: EN },
  { name: '한국어', lng: 'ko', lngDict: KO }
];
export const DEFAULT_LATITUDE = 37.56682420267543;
export const DEFAULT_LONGITUDE = 126.978652258823;
export const COUPON_OTP_REFRESH_INTERVAL = 30000;
export const SIGNUP_PHONE_VERIFICATION_TIME_LIMIT = 180000;

export const RESPONSE_TYPE_OK = 'ok';
export const RESPONSE_TYPE_REQUEST_ERROR = 'request_error';
export const RESPONSE_TYPE_RESPONSE_ERROR = 'response_error';
export const RESPONSE_TYPE_UNKNOWN_ERROR = 'unknown_error';

export const FAVICON_PATH = '/images/icons/favicon.ico';
export const LOGO_PATH = '/images/logo.png';
export const NO_IMAGE_PATH = '/images/no_image.png';

export const AMOUNT_LIST = [1, 5, 10, 50, 100, 1000, 10000];
export const DATE_AMOUNT_LIST = [1, 7, 15, 30, 90, 180, 365];
export const MONEY_AMOUNT_LIST = [0.00001, 0.0005, 0.0001, 0.0005, 0.001, 0.005];
export const MONEY_DISCOUNT_LIST = [-0.00001, -0.0005, -0.0001, -0.0005, -0.001, -0.005];

export const HALF_TILE_LIST_SLICE_NUMBER = 5;
export const LIST_SLICE_NUMBER = 3;
export const TILE_LIST_SLICE_NUMBER = 3;
export const TIMESTAMP_REFRESH_INTERVAL = 100;

export const MENU_ITEM_LIST = [
  {
    value: 'goBack',
    icon: <ArrowBackIcon />,
    label: 'goBack',
    link: () => {Router.back()}
  },
  {
    value: 'home',
    icon: <HomeOutlinedIcon />,
    label: 'home',
    link: () => {Router.push('/home/')}
  },
  {
    value: 'myAccount',
    icon: <AccountCircleOutlinedIcon />,
    label: 'account',
    link: () => {Router.push('/my-account/')}
  },
  {
    value: 'myWallet',
    icon: <AccountBalanceWalletOutlinedIcon />,
    label: 'wallet',
    link: () => {Router.push('/my-wallet/')}
  },
  {
    value: 'scan',
    icon: <CameraAltOutlinedIcon />,
    label: 'scan',
    link: () => {Router.push('/coupons/scan/')}
  },
  {
    value: 'stores',
    icon: <StoreMallDirectoryOutlinedIcon />,
    label: 'stores',
    link: () => {Router.push('/stores/')}
  },
  {
    value: 'trades',
    icon: <LocalMallOutlinedIcon />,
    label: 'trades',
    link: () => {Router.push('/trades/')}
  }
];

export const COUPON_SELLING_STATUS_LIST = [
  {
    value: 'open',
    name: 'onSale'
  },
  {
    value: 'pre_pending',
    name: 'tradeRequested'
  },
  {
    value: 'pending',
    name: 'remitted'
  },
  {
    value: 'closed',
    name: 'completed'
  }
];
