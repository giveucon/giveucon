import Router from 'next/router'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import StoreMallDirectoryOutlinedIcon from '@material-ui/icons/StoreMallDirectoryOutlined';

export const APP_VERSION = '0.1.0-alpha';
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
    link: () => {Router.push('/myaccount/')}
  },
  {
    value: 'myWallet',
    icon: <AccountBalanceWalletOutlinedIcon />,
    label: 'wallet',
    link: () => {Router.push('/mywallet/')}
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
export const NO_IMAGE_PATH = '/no_image.png';
export const TILE_LIST_SLICE_NUMBER = 3;
