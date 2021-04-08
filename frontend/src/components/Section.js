import React from 'react';
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
    title: {
      flexGrow: 1,
    },
  }));


export default function Section({ backButton=false, children=null, title=null, titlePrefix=null, titleSuffix=null }) {
  const router = useRouter();
  const classes = useStyles();
  return (
    <Box marginY={2}>
      <Paper>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          paddingX={1}
        >
          <Box display={backButton ? "block" : "none"}>
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
        <Box display={children ? "block" : "none"} padding={0.5}>
          {children}
        </Box>
      </Paper>
    </Box>
  );
}