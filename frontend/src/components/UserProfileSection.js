import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
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
      zIndex: theme.zIndex.drawer + 1,
      width: theme.spacing(15),
      height: theme.spacing(15),
      boxShadow: theme.shadows[3],
    },
    avatarWrapper: {
      height: theme.spacing(7.5),
    },
    paperWrapper: {
      position: 'relative',
    },
    media: {
      paddingTop: '100%', // 1:1,
      // paddingTop: '56.25%', // 16:9,
    },
  }));

export default function UserProfileSection({ actions=null, children, image=null, name=null, onClick=null, subtitle=null }) {
  const classes = useStyles();

  return (
    <Box className={classes.root} marginBottom={2}>
      <Box className={classes.paperWrapper}>
        <Box className={classes.avatarWrapper} display='flex' justifyContent='center'>
          <IconButton className={classes.avatarIconButton}>
            <Avatar alt={name} className={classes.avatar} src={image} />
          </IconButton>
        </Box>
        <Paper>
          <Box display={(name || subtitle || actions) ? 'block' : 'none'} paddingTop={10} paddingBottom={2}>
            <Box display={name ? 'flex' : 'none'} justifyContent='center'>
              <Typography variant='h4'>{name}</Typography>
            </Box>
            <Box display={subtitle ? 'flex' : 'none'} justifyContent='center'>
              <Typography variant='h5'>{subtitle}</Typography>
            </Box>
            <Box display={actions ? 'flex' : 'none'} justifyContent='center'>
              {actions}
            </Box>
          </Box>
          <Divider />
          <Box display={children ? 'block' : 'none'} padding={2}>
            {children}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
