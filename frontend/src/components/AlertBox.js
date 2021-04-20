import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
  }));

export default function AlertBox({ content=null, variant="information" }) {
  const classes = useStyles();
  return (
    <Box className={classes.root} padding={2}>
      <Box display='flex' alignItems='center' justifyContent='center'>
        { variant === 'information' && (<FontAwesomeIcon icon={faInfoCircle} color="grey" size="5x" />)}
        { variant === 'success' && (<FontAwesomeIcon icon={faCheckCircle} color="grey" size="5x" />)}
        { variant === 'question' && (<FontAwesomeIcon icon={faQuestionCircle} color="grey" size="5x" />)}
        { variant === 'warning' && (<FontAwesomeIcon icon={faExclamationCircle} color="grey" size="5x" />)}
        { variant === 'error' && (<FontAwesomeIcon icon={faTimesCircle} color="grey" size="5x" />)}
      </Box>
      <Box paddingTop={2}>
        <Typography align='center'>{content}</Typography>
      </Box>
    </Box>
  );
}
