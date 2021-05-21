import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import * as constants from 'constants';
import useI18n from 'hooks/useI18n'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
  },
  imageArea: {
    height: '10rem',
    width: '10rem',
    position: 'relative',
  },
  media: {
    height: '10rem',
    width: '10rem',
  },
}));

export default function CouponBox({ image, lng, lngDict, name, onClick, price, productPrice }) {

  const i18n = useI18n();
  const classes = useStyles();

  return (
    <Box display='flex' alignItems='center' justifyContent='flex-start'>
      <Box className={classes.imageArea}>
        <Card>
          <CardActionArea onClick={onClick}>
            <CardMedia
              className={classes.media}
              image={image || constants.NO_IMAGE_PATH}
              title={name}
            />
          </CardActionArea>
        </Card>
      </Box>
      <Box margin='1rem' flexGrow={1}>
        <Box marginBottom='0.5rem'>
          <Typography variant='h5'>{name}</Typography>
        </Box>
        <Divider />
        {(!productPrice) || (price === productPrice) && (
          <Box marginTop='0.5rem'>
            <Typography variant='h6'>{price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}</Typography>
          </Box>
        )}
        {productPrice && (price !== productPrice) && (
          <>
            <Box marginTop='0.5rem'>
              <Typography variant='body2' style={{textDecoration: 'line-through'}}>{productPrice.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}</Typography>
            </Box>
            <Box>
              <Typography variant='h6'>{price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}</Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
