import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

import useI18n from 'hooks/useI18n'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
  },
  errorChip: {
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
       background: theme.palette.error.dark,
    },
  }
}));

export default function TransactionListItem({
  amount,
  fee,
  onClick,
  skeleton,
  timestamp,
  unit,
  variant
}) {
  const i18n = useI18n();
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      {
        skeleton ? (
          <Box display='flex' alignItems='center' justifyContent='flex-start' margin='1rem'>
            <Skeleton animation="wave" variant="circle" width='2rem' height='2rem'/>
            <Box flexGrow={1} margin='1rem'>
              <Skeleton animation="wave" width='100%' height='1rem'/>
              <Skeleton animation="wave" width='80%' height='1rem'/>
            </Box>
          </Box>
        ) : (
          <Card>
            <CardActionArea onClick={onClick}>
              <Box display='flex' justifyContent='flex-start' alignItems='center' paddingX='1rem' paddingY='0.5rem'>
                {variant === 'deposit' && (
                  <Chip
                    color="primary"
                    label={i18n.t('deposit')}
                  />
                )}
                {variant === 'withdraw' && (
                  <Chip
                    className={classes.errorChip}
                    label={i18n.t('withdraw')}
                  />
                )}
                <Box marginLeft='1rem'>
                  <Box display='flex' alignItems='flex-end'>
                    <Typography variant='h5'>
{variant === 'deposit' && '+'}
{variant === 'withdraw' && '-'}
</Typography>
                    <Typography variant='h5'>{amount / 100000000}</Typography>
                    <Typography variant='h5'>{unit}</Typography>
                  </Box>
                  <Box display='flex' alignItems='flex-end'>
                    <Typography variant='subtitle2'>{new Date(timestamp * 1000).toLocaleDateString()}</Typography>
                  </Box>
                  <Box display='flex' alignItems='flex-end'>
                    <Typography variant='subtitle2'>{`${i18n.t('fee')}: ${fee / 100000000}`}</Typography>
                    <Typography variant='subtitle2'>{unit}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardActionArea>
          </Card>
        )
      }
    </Box>
  );
}
