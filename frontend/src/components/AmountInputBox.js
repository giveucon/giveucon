import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

import useI18n from 'hooks/useI18n'
import * as constants from '../constants';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
    media: {
      height: '10rem',
    },
    errorButton: {
      background: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      '&:hover': {
         background: theme.palette.error.dark,
      },
    },
  }));

export default function AmountInputBox({
  addAmountList=constants.AMOUNT_LIST,
  defaultAmount=0,
  enableInfinite=false,
  label,
  onChangeAmount,
  onChangeInfinite=()=>{},
  unit,
  variant='default'
}) {

  const [amount, setAmount] = useState(defaultAmount);
  const [infinite, setInfinite] = useState(false);
  const i18n = useI18n();
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box display={!infinite ? 'block' : 'none'}>
        <TextField
          label={label}
          value={amount || 0}
          fullWidth
          type='number'
          onChange={(event) => {
            onChangeAmount(event.target.value || 0);
            setAmount(event.target.value || 0);
          }}
          InputProps={{
            startAdornment:
              (variant==='money')
              ? <InputAdornment position='start'>{unit}</InputAdornment>
              : null,
            endAdornment:
              (variant==='date')
              ? <InputAdornment position='end'>{i18n.t('days')}</InputAdornment>
              : null,
          }}
        />
      </Box>
      <Box display={infinite ? 'block' : 'none'}>
        <TextField
          label={label}
          value={i18n.t('infinite')}
          disabled
          fullWidth
        />
      </Box>
      <Box display='flex' flexWrap='wrap' paddingY={1}>
        {addAmountList.map((addAmount) =>
          <Box padding={0.5}>
            <Button
              color='default'
              variant='contained'
              onClick={() => {
                onChangeAmount(amount + addAmount);
                onChangeInfinite(false);
                setAmount(prevAmount => prevAmount + addAmount);
                setInfinite(false);
              }}
            >
              {variant==='default' && `+ ${addAmount}`}
              {variant==='date' && `+ ${addAmount}${i18n.t('days')}`}
              {variant==='money' && `${addAmount >= 0 ? '+' : '-'} ${Math.abs(addAmount)}${unit}`}
            </Button>
          </Box>
        )}
        {enableInfinite && (
          <Box padding={0.5}>
            <Button
              color='default'
              variant='contained'
              onClick={() => {
                onChangeAmount(0);
                onChangeInfinite(true);
                setAmount(0);
                setInfinite(true);
              }}
            >
              {i18n.t('infinite')}
            </Button>
          </Box>
        )}
        <Box padding={0.5}>
          <Button
            className={classes.errorButton}
            variant='contained'
            onClick={() => {
              onChangeAmount(defaultAmount);
              onChangeInfinite(false);
              setAmount(defaultAmount);
              setInfinite(false);
            }}
          >
            {i18n.t('reset')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
