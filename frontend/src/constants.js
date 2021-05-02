import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import StorefrontIcon from '@material-ui/icons/Storefront';

export const HALF_TILE_LIST_SLICE_NUMBER = 5;
export const LIST_SLICE_NUMBER = 3;
export const LOGO_PATH = '/logo.png';
export const MENU_ITEM_LIST = [
  {
    value: 'home',
    icon: <HomeOutlinedIcon />,
    link: '/home/'
  },
  {
    value: 'myAccount',
    icon: <AccountCircleOutlinedIcon />,
    link: '/myaccount/'
  },
  {
    value: 'myWallet',
    icon: <AccountBalanceWalletOutlinedIcon />,
    link: '/mywallet/'
  },
  {
    value: 'scan',
    icon: <CameraAltOutlinedIcon />,
    link: '/coupons/scan/'
  },
  {
    value: 'stores',
    icon: <StorefrontIcon />,
    link: '/stores/'
  },
  {
    value: 'trades',
    icon: <LocalMallOutlinedIcon />,
    link: '/trades/'
  }
];
export const NO_IMAGE_PATH = '/no_image.png';
export const TILE_LIST_SLICE_NUMBER = 3;
