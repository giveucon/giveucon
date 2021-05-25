import React from 'react';
import Box from '@material-ui/core/Box';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

import useI18n from 'hooks/useI18n'

export default function WalletBox({ amount=null, onClick=null, skeleton=false, unit=null }) {
  const i18n = useI18n();
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
            <Box paddingLeft={2}>
            </Box>
            <Box display='flex' alignItems='flex-end' justifyContent='center'>
              <Typography variant='h5'>{amount / 100000000}</Typography>
              <Typography variant='h5'>{unit}</Typography>
            </Box>
          </CardActionArea>
        )
      }
    </>
  );
}
