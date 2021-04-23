import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
  }));


export default function ListItemCard({ onClick=null, title=null, prefix=null, skeleton=false, subtitle=null, suffix=null }) {
  const classes = useStyles();
  return (
    <Box marginY={1}>
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
            <Box
              alignItems='center'
              display='flex'
              flexDirection='row'
              justifyContent='flex-start'
            >
              {/* Avatar, Icon, etc... */}
              <Box display={prefix ? 'block' : 'none'} margin='0.5rem'>
                {prefix}
              </Box>

              {/* Body */}
              <CardActionArea onClick={onClick}>
                <Box
                  display={(title || subtitle) ? 'block' : 'none'}
                  paddingLeft={prefix ? 0 : 2}
                  paddingRight={suffix ? 0 : 2}
                  flexGrow={1}
                  paddingY={1}
                >
                  <Typography variant='h6'>{title}</Typography>
                  <Typography variant='subtitle2'>{subtitle}</Typography>
                </Box>
              </CardActionArea>

              {/* Button, etc... */}
              <Box display={suffix ? 'block' : 'none'} flexShrink={0}>
                {suffix}
              </Box>
            </Box>
          </Card>
        )
      }
    </Box>
  );
}
