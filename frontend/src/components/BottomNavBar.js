import { useEffect } from 'react';

import { makeStyles } from '@material-ui/styles';
import { useRouter } from 'next/router';
import AppBar from '@material-ui/core/AppBar';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Container from '@material-ui/core/Container';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import StorefrontIcon from '@material-ui/icons/Storefront';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';

import useI18n from 'hooks/useI18n'
import EN from 'locales/en.json'
import KO from 'locales/ko.json'

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.default,
    top: 'auto',
    bottom: 0,
    zIndex: theme.zIndex.drawer + 1,
  },
  bottomNavigation: {
    backgroundColor: theme.palette.background.default,
  },
}));

const allMenuItemList = [
  {
    value: 'home',
    icon: <HomeOutlinedIcon />,
    link: '/home/'
  },
  {
    value: 'myWallet',
    icon: <AccountBalanceWalletOutlinedIcon />,
    link: '/mywallet/'
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
  },
  {
    value: 'myAccount',
    icon: <AccountCircleOutlinedIcon />,
    link: '/myaccount/'
  },
]

export default function BottomNavBar({ menuItemValueList, locale }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  useEffect(() => {
    locale === 'ko' && i18n.locale('ko', KO);
    locale === 'en' && i18n.locale('en', EN);
  }, [])

  let key = 0;
  let menuItemList = [];
  for (const menuItemKey in menuItemValueList) {
    const menuItem = allMenuItemList.find(item => item.value === menuItemValueList[menuItemKey]);
    menuItem && menuItemList.push(
      {
        key: ++key,
        icon: menuItem.icon,
        label: i18n.t(menuItem.value),
        onClick: () => {router.push(`${menuItem.link}`)},
        value: menuItem.value
      }
    );
  };

  return (
    <AppBar className={classes.appBar}>
      <Container maxWidth='xs'>
        <BottomNavigation
          className={classes.bottomNavigation}
          value={router.pathname.split('/')[1] || 'home'}
          showLabels
        >
          {menuItemList.map(item => {
            return <BottomNavigationAction 
              key={item.key}
              icon={item.icon}
              label={item.label}
              onClick={item.onClick}
              value={item.value}
            />
          })}
        </BottomNavigation>
      </Container>
    </AppBar>
  );
}
