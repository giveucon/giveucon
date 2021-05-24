import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle , faExclamationCircle , faInfoCircle , faQuestionCircle , faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(() => ({
    root: {
      maxWidth: '100%',
      position: 'relative',
    },
    alertArea: {
      height: '100%',
    },
  }));

export default function AlertBox({ content=null, skeleton=false, variant="information" }) {
  const classes = useStyles();
  return (
    <Box className={classes.root} padding={2}>
      {skeleton && (
        <Box className={classes.alertArea}>
          <Box display='flex' alignItems='center' justifyContent='center'>
            <Skeleton animation='wave' variant='circle' width='5rem' height='5rem' />
          </Box>
          <Box display='flex' alignItems='center' justifyContent='center' paddingTop='1rem'>
            <Skeleton animation='wave' width='60%' height='1rem' />
          </Box>
          <Box display='flex' alignItems='center' justifyContent='center'>
            <Skeleton animation='wave' width='40%' height='1rem' />
          </Box>
        </Box>
      )}
      {!skeleton && (
        <Box className={classes.alertArea}>
          <Box display='flex' alignItems='center' justifyContent='center'>
            { variant === 'information' && (<FontAwesomeIcon icon={faInfoCircle} color="grey" size="5x" />)}
            { variant === 'success' && (<FontAwesomeIcon icon={faCheckCircle} color="grey" size="5x" />)}
            { variant === 'question' && (<FontAwesomeIcon icon={faQuestionCircle} color="grey" size="5x" />)}
            { variant === 'warning' && (<FontAwesomeIcon icon={faExclamationCircle} color="grey" size="5x" />)}
            { variant === 'error' && (<FontAwesomeIcon icon={faTimesCircle} color="grey" size="5x" />)}
          </Box>
          <Box paddingTop='1rem'>
            <Typography align='center'>{content}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
