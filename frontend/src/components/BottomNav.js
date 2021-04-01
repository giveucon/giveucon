import { makeStyles } from '@material-ui/styles';
import { useRouter } from 'next/router';
import AppBar from '@material-ui/core/AppBar';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Container from '@material-ui/core/Container';

import MoreIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.default,
    top: 'auto',
    bottom: 0,
  },
  bottomNavBar: {
    backgroundColor: theme.palette.background.default,
  },
}));


export default function BottomNavAppBar(props) {
  const router = useRouter();
  const classes = useStyles();
  let key = 0;
  const actions = [
    ['Button', 'home', <MoreIcon />],
    ['Button', 'home', <MoreIcon />],
    ['Button', 'home', <MoreIcon />],
    ['Button', 'home', <MoreIcon />],
    ['Button', 'home', <MoreIcon />]
  ].map(([label, value, icon]) => {
      return (
        <BottomNavigationAction
          key={++key}
          label={label}
          value={value}
          icon={icon}
          onClick={() => {router.push(`/${value}`)}}
        />
      )
  });
  return (
      <AppBar className={classes.appBar}>
        <Container maxWidth="sm">
          <BottomNavigation
            className={classes.bottomNavBar}
            value={router.pathname.split('/')[1] || 'home'}
          >
            {actions}
          </BottomNavigation>
        </Container>
      </AppBar>
  );
}
