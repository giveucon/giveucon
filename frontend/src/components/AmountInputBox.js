import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

import * as constants from 'constants';
import useI18n from 'hooks/useI18n'

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
  enableInfinite=false,
  endAdornment,
  label,
  lng,
  lngDict,
  onChangeAmount,
  onChangeInfinite=()=>{} 
}) {

  const [amount, setAmount] = useState(0);
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
            console.log(event.target);
            onChangeAmount(event.target.value || 0);
            setAmount(prevAmount => (event.target.value || 0));
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment>,
          }}
        />
      </Box>
      <Box display={infinite ? 'block' : 'none'}>
        <TextField
          label={i18n.t('amount')}
          value={i18n.t('infinite')}
          disabled
          fullWidth
        />
      </Box>
      <Box display='flex' flexWrap="wrap" paddingY={1}>
        {addAmountList.map((addAmount) => 
          <Box padding={0.5}>
            <Button
              color='default'
              variant='contained'
              onClick={() => {
                onChangeAmount(amount);
                onChangeInfinite(false);
                setAmount(prevAmount => prevAmount + addAmount);
                setInfinite(prevInfinite => false);
              }}
            >
              {`+ ${new Number(addAmount)}`}
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
                setAmount(prevAmount => 0);
                setInfinite(prevInfinite => true);
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
              onChangeAmount(0);
              onChangeInfinite(false);
              setAmount(prevAmount => 0);
              setInfinite(prevInfinite => false);
            }}
          >
            {i18n.t('reset')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
