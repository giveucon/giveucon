import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

export default function ProductBox({ image, lng, lngDict, name, onClick, price }) {
  
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
        <Box marginTop='0.5rem'>
          <Typography variant='h6'>{`${price.toLocaleString('ko-KR')}${i18n.t('_localeCurrencyKoreanWon')}`}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
