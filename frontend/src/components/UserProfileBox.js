import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import CardActionArea from '@material-ui/core/CardActionArea';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
    avatar: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
  }));

export default function UserProfileBox({ image=null, name=null, onClick=null, subtitle=null }) {
  const classes = useStyles();

  return (
    <CardActionArea onClick={onClick}>
      <Box alignItems='center' display='flex' justifyContent='center' padding={2}>
        <Box paddingX={2}>
          <Avatar alt={name} className={classes.avatar} src={image} />
        </Box>
        <Divider orientation='vertical' flexItem />
        <Box paddingX={2}>
          <Typography variant='h5'>{name}</Typography>
          <Typography variant='subtitle1'>{subtitle}</Typography>
        </Box>
      </Box>
    </CardActionArea>
  );
}
