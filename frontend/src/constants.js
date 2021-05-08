import Router from 'next/router'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import StoreMallDirectoryOutlinedIcon from '@material-ui/icons/StoreMallDirectoryOutlined';

export const AMOUNT_LIST = [1, 5, 10, 50, 100, 1000, 10000];
export const APP_VERSION = '0.1.0-alpha';
export const COUPON_OTP_REFRESH_INTERVAL = 30000;
export const COUPON_TIMESTAMP_REFRESH_INTERVAL = 100;
export const DATE_AMOUNT_LIST = [1, 7, 15, 30, 90, 180, 365];
export const HALF_TILE_LIST_SLICE_NUMBER = 5;
export const LIST_SLICE_NUMBER = 3;
export const LOGO_PATH = '/logo.png';
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
export const MONEY_AMOUNT_LIST = [100, 500, 1000, 5000, 10000, 50000];
export const NO_IMAGE_PATH = '/no_image.png';
export const TILE_LIST_SLICE_NUMBER = 3;
