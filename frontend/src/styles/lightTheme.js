import { createMuiTheme, createStyles } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: { // Green[600]
      light: "#68b36b",
      main: "#43a047",
      dark: "#2e7031",
      // contrastText: "#ffffff",
    },
    secondary: { // Lime[A400]
      light: "#d1ff33",
      main: "#c6ff00",
      dark: "#8ab200",
      // contrastText: "#ffffff",
    },
    error: { // Red
      light: "#f6685e",
      main: "#f44336",
      dark: "#aa2e25",
      // contrastText: "#ffffff",
    },
    background: { // White
      default: '#ffffff',
    },
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
    MuiFab: createStyles({
      root: {
        margin: 0,
        top: 'auto',
        right: "1.5rem",
        bottom: "6rem",
        left: 'auto',
        position: 'absolute',
      }
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