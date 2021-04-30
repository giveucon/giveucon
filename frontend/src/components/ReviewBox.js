import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Skeleton from '@material-ui/lab/Skeleton';

import SwipeableTileList from './SwipeableTileList'
import Tile from './Tile'

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
    media: {
      paddingTop: '42.86%', // 21:9,
      // paddingTop: '56.25%', // 16:9,
    },
  }));

export default function ReviewBox({ actions=null, content=null, imageList=null, title=null, onClick=null, score=null, skeleton=false, subtitle=null }) {
  const classes = useStyles();
  return (
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
        <Box paddingY={1}>
          <Box paddingX={1}>
            <Typography variant='h5'>
              {title}
            </Typography>
            <Box alignItems='center' display='flex' justifyContent='flex-start'>
              <Box marginRight={1}>
                <Typography variant='subtitle1'>
                  {subtitle}
                </Typography>
              </Box>
              <Divider orientation='vertical' flexItem />
              <Box marginLeft={1}>
                <Rating
                  value={score}
                  readOnly 
                />
              </Box>
            </Box>
          </Box>
          <Box display={imageList && (imageList.length > 0) ? 'block' : 'none'} paddingY={1}>
            <SwipeableTileList>
              {imageList && (imageList.length > 0) && imageList.map((item, index) => (
                <Tile
                  key={index}
                  image={item}
                />
              ))}
            </SwipeableTileList>
          </Box>
          <Box padding={1}>
            <Typography variant='body1'>
              {content}
            </Typography>
            <Box display='flex' justifyContent='flex-end' paddingX={0.5}>
              {actions}
            </Box>
          </Box>
        </Box>
      </>
    )
  );
}
