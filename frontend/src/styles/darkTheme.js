import { createMuiTheme, createStyles } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
  overrides: {
    MuiBottomNavigationAction: createStyles({
      root: {
        minWidth: "2.5rem",
      }
    }),
    MuiButton: createStyles({
      root: {
        borderRadius: "1.5rem",
      }
    }),
    MuiContainer: createStyles({
      root: {
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        ['@media (min-width:600px)']: {
          paddingLeft: "0.5rem",
          paddingRight: "0.5rem",
        },
      },
    }),
    MuiIconButton: createStyles({
      root: {
        padding: "0.5rem",
      }
    }),
    MuiPaper: createStyles({
      rounded: {
        borderRadius: "1.5rem",
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
