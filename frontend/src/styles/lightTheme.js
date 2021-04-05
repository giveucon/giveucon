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
        minWidth: "40px",
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