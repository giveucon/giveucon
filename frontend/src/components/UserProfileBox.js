import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
    avatar: {
      width: theme.spacing(15),
      height: theme.spacing(15),
      zIndex: theme.zIndex.drawer + 1,
      boxShadow: theme.shadows[3],
    },
    media: {
      paddingTop: '100%', // 1:1,
      // paddingTop: '56.25%', // 16:9,
    },
  }));


export default function UserProfileBox({ actions=null, children, image=null, name=null, subtitle=null }) {
  const classes = useStyles();

  return (
    <Box margin={1} className={classes.root}>
      <Box display="flex" justifyContent="center" position="relative" >
        <Avatar alt={name} className={classes.avatar} src={image} />
      </Box>
      <Box position="relative" top={-55}>
        <Card className={classes.card}>
          <Box display={(name || subtitle || actions) ? 'block' : "none"} paddingTop={8} paddingBottom={1}>
            <Box display={name ? 'flex' : "none"} justifyContent="center">
              <Typography variant="h5">{name}</Typography>
            </Box>
            <Box display={subtitle ? 'flex' : "none"} justifyContent="center">
              <Typography variant="subtitle1">{subtitle}</Typography>
            </Box>
            <Box display={actions ? 'flex' : "none"} justifyContent="center">
              {actions}
            </Box>
          </Box>
          <Divider />
          <Box display={children ? 'block' : "none"}>
            {children}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
