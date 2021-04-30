import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

import SwipeableTileList from './SwipeableTileList'
import Tile from './Tile'

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
    media: {
      height: '10rem',
    },
  }));

export default function NoticeBox({ children=null, content=null, imageList=null, onClick=null, skeleton=false, title=null, subtitle=null }) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {
        skeleton ? (
          <>
            <Skeleton animation='wave' variant='rect' width='100%' height='10rem' style={{borderRadius: '1rem'}}/>
            <Box marginY='1rem'>
              <Skeleton animation='wave' width='100%' height='1rem' />
              <Skeleton animation='wave' width='100%' height='1rem' />
              <Skeleton animation='wave' width='80%' height='1rem' />
            </Box>
          </>
        ) : (
          <>
            <Box display={imageList && (imageList.length > 0) ? 'block' : 'none'} paddingY={1}>
              <SwipeableTileList autoplay={true}>
                {imageList && (imageList.length > 0) && imageList.map((item, index) => (
                  <Tile
                    key={index}
                    image={item}
                  />
                ))}
              </SwipeableTileList>
            </Box>
            <Box paddingY={1}>
              <Typography variant='h6'>{title}</Typography>
              <Typography variant='subtitle1'>{subtitle}</Typography>
            </Box>
            <Divider />
            <Box paddingY={1}>
              <Typography variant='body1'>{content}</Typography>
            </Box>
            <Box paddingY={1}>
              {children}
            </Box>
          </>
        )
      }
    </Box>
  );
}
