import React from 'react';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    titlePrefix: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));


export default function Section({ backButton=false, border=true, children=null, title=null, titlePrefix=null, titleSuffix=null }) {
  const router = useRouter();
  const classes = useStyles();
  return (
    <Box marginX={1} marginY={border ? 2 : 0}>
      <Paper elevation={border ? 3 : 0}>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          paddingRight={1}
        >
          <Box display={backButton ? "block" : "none"} >
            <IconButton
              onClick={() => {router.back()}}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>
          <Box display={titlePrefix ? "block" : "none"}>
            {titlePrefix}
          </Box>
          <Box
            display={title ? "block" : "none"}
            flexGrow={1}
            paddingX={(backButton || titlePrefix) ? 0 : 2}
            paddingY={1.5}
          >
            <Typography variant="h6" className={classes.title}>{title}</Typography>
          </Box>
          <Box display={titleSuffix ? "block" : "none"} flexShrink={0}>
            {titleSuffix}
          </Box>
        </Box>
        <Box display={(backButton || titlePrefix || title || titleSuffix) && children ? "block" : "none"} >
          <Divider />
        </Box>
        <Box padding={2} display={children ? "block" : "none"}>
          {children}
        </Box>
      </Paper>
    </Box>
  );
}