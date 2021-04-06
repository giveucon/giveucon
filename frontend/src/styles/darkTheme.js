import { createMuiTheme, createStyles } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
  overrides: {
    MuiBottomNavigationAction: createStyles({
      root: {
        minWidth: "40px",
      }
    }),
    MuiButton: createStyles({
      root: {
        borderRadius: "20px"
      }
    }),
    MuiPaper: createStyles({
      rounded: {
        borderRadius: "20px"
      }
    }),
  },
  props: {
    MuiIconButton: {
      color: "inherit",
    },
    MuiPaper: {
      elevation: 3,
    },
  },
});

export default theme;
