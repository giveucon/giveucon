import { createMuiTheme, createStyles } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
  overrides: {
    MuiAccordion: createStyles({
      rounded: {
        borderRadius: '1.5rem',
        '&:first-child': {
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
        },
        '&:last-child': {
          borderBottomLeftRadius: '1.5rem',
          borderBottomRightRadius: '1.5rem',
        },
      },
    }),
    MuiAccordionSummary: createStyles({
      root: {
        padding: '0rem 1rem 0rem 0.5rem',
        minHeight: '0rem',
        '&$expanded': {
          minHeight: '0rem',
        },
      },
      content: {
        margin: '0rem',
        '&$expanded': {
          margin: '0rem',
        },
      },
      expanded: {},
    }),
    MuiAccordionDetails: createStyles({
      root: {
        padding: '0rem',
      },
    }),
    MuiBottomNavigationAction: createStyles({
      root: {
        minWidth: '2.5rem',
      }
    }),
    MuiButton: createStyles({
      root: {
        borderRadius: '1.5rem',
      }
    }),
    MuiContainer: createStyles({
      root: {
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
        ['@media (min-width:600px)']: {
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',
        },
      },
    }),
    MuiFab: createStyles({
      root: {
        margin: 0,
        top: 'auto',
        right: '1.5rem',
        bottom: '5rem',
        left: 'auto',
        position: 'fixed',
      }
    }),
    MuiIconButton: createStyles({
      root: {
        padding: '0.5rem',
      }
    }),
    MuiPaper: createStyles({
      rounded: {
        borderRadius: '1.5rem',
      }
    }),
  },
  props: {
    MuiIconButton: {
      color: 'inherit',
    },
    MuiPaper: {
      elevation: 2,
    },
  },
});

export default theme;
