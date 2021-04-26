import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import CardActionArea from '@material-ui/core/CardActionArea';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
    avatar: {
      width: '5rem',
      height: '5rem',
    },
  }));

export default function UserProfileBox({ image=null, name=null, onClick=null, skeleton=false, subtitle=null }) {
  const classes = useStyles();

  return (
    <>
      {
        skeleton ? (
          <Box display='flex' alignItems='center' justifyContent='flex-start' margin='1rem'>
            <Skeleton animation="wave" variant="circle" width='5rem' height='5rem'/>
            <Box flexGrow={1} marginX='1rem'>
              <Skeleton animation="wave" width='100%' height='1rem'/>
              <Skeleton animation="wave" width='80%' height='1rem'/>
            </Box>
          </Box>
        ) : (
          <CardActionArea onClick={onClick}>
            <Box alignItems='center' display='flex' justifyContent='flex-start' margin='1rem'>
              <Box paddingRight={2}>
                <Avatar alt={name} className={classes.avatar} src={image} />
              </Box>
              <Divider orientation='vertical' flexItem />
              <Box paddingLeft={2}>
                <Typography variant='h5'>{name}</Typography>
                <Typography variant='subtitle1'>{subtitle}</Typography>
              </Box>
            </Box>
          </CardActionArea>
        )
      }
    </>
  );
}
