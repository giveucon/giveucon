import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
    avatar: {
      width: theme.spacing(15),
      height: theme.spacing(15),
    },
    avatarIconButton: {
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


export default function UserProfileSection({ actions=null, children, image=null, name=null, onClick=null, subtitle=null }) {
  const classes = useStyles();

  return (
    <Box margin={2} className={classes.root}>
      <Box>
        <Box position="relative" top={55} display="flex" justifyContent="center" position="relative" >
          <IconButton className={classes.avatarIconButton}>
            <Avatar alt={name} className={classes.avatar} src={image} />
          </IconButton>
        </Box>
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
          <Box display={children ? 'block' : "none"} padding={2}>
            {children}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
