import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

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

export default function MoneyAmountInputBox({ 
  addAmountList=constants.MONEY_AMOUNT_LIST,
  lng,
  lngDict, 
  onChangeAmount
}) {

  const [amount, setAmount] = useState(0);
  const i18n = useI18n();
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box>
        <TextField
          label={i18n.t('price')}
          value={amount || 0}
          fullWidth
          type='number'
          InputProps={{
            startAdornment: <InputAdornment position="start">{i18n.t('_localeCurrencyKRW')}</InputAdornment>,
          }}
          onChange={(event) => {
            onChangeAmount(event.target.value || 0);
            setAmount(prevAmount => event.target.value || 0);
          }}
        />
      </Box>
      <Box display='flex' flexWrap="wrap" paddingY={1}>
        {addAmountList.map((addAmount) => 
          <Box padding={0.5}>
            <Button
              color='default'
              variant='contained'
              onClick={() => {
                onChangeAmount(amount + addAmount);
                setAmount(prevAmount => prevAmount + addAmount);
              }}
            >
              {`+ ${new Number(addAmount).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
            </Button>
          </Box>
        )}
        <Box padding={0.5}>
          <Button
            className={classes.errorButton}
            variant='contained'
            onClick={() => {
              onChangeAmount(0);
              setAmount(prevAmount => 0);
            }}
          >
            {i18n.t('reset')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
