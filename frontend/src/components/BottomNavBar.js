import { useEffect } from 'react';

import { makeStyles } from '@material-ui/styles';
import { useRouter } from 'next/router';
import AppBar from '@material-ui/core/AppBar';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Container from '@material-ui/core/Container';

import * as constants from '../constants';
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

export default function BottomNavBar({ menuItemKeyList, locale }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  useEffect(() => {
    locale === 'ko' && i18n.locale('ko', KO);
    locale === 'en' && i18n.locale('en', EN);
  }, [])

  let key = 0;
  let menuItemList = [];
  for (const menuItemKey in menuItemKeyList) {
    const menuItem = constants.MENU_ITEM_LIST.find(item => item.key === menuItemKeyList[menuItemKey]);
    menuItem && menuItemList.push(
      {
        key: ++key,
        icon: menuItem.icon,
        label: i18n.t(menuItem.label),
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
          value={router.pathname || 'home'}
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
