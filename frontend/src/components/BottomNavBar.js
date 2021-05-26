import { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useRouter } from 'next/router';
import AppBar from '@material-ui/core/AppBar';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Container from '@material-ui/core/Container';

import useI18n from 'hooks/useI18n'
import * as constants from '../constants';

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

export default function BottomNavBar({ menuItemList }) {

  const i18n = useI18n();
  const router = useRouter();
  const classes = useStyles();

  let key = 0;
  const menuItemListAdapter = [];
  for (let i = 0; i < menuItemList.length; i++) {
    const menuItem = constants.MENU_ITEM_LIST.find(item => item.value === menuItemList[i]);
    if (menuItem) menuItemListAdapter.push(
      {
        key: ++key,
        icon: menuItem.icon,
        label: i18n.t(menuItem.label),
        onClick: menuItem.link,
        value: menuItem.value
      }
    );
  };

  return (
    <AppBar className={classes.appBar}>
      <Container maxWidth='xs'>
        <BottomNavigation
          className={classes.bottomNavigation}
          value={router.pathname}
          showLabels
        >
          {menuItemListAdapter.map(item => <BottomNavigationAction
              key={item.key}
              icon={item.icon}
              label={item.label}
              onClick={item.onClick}
              value={item.value}
            />)}
        </BottomNavigation>
      </Container>
    </AppBar>
  );
}
