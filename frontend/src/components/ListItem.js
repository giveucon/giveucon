import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
  }));

export default function ListItem({
  children=null,
  date=null,
  icon=null,
  image=null,
  onClick=null,
  prefix=null,
  score=null,
  skeleton=false,
  subtitle=null,
  suffix=null,
  title=null,
  variant='default'
}) {
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
          <Box
            alignItems='center'
            display='flex'
            flexDirection='row'
            justifyContent='flex-start'
          >
            <Box display={prefix ? 'block' : 'none'}>
              {prefix}
            </Box>
            
            {/* Body */}
            <CardActionArea onClick={onClick}>
              <Box
                alignItems='center'
                display='flex'
                flexDirection='row'
                justifyContent='flex-start'
              >
                <Box display={image ? 'block' : 'none'} margin='0.5rem'>
                  <Avatar alt={title} src={image} />
                </Box>
                <Box display={icon ? 'block' : 'none'} margin='0.5rem'>
                  {icon}
                </Box>
                <Box paddingLeft={(image || icon) ? 0 : 2} paddingRight={suffix ? 0 : 2} paddingY={1}>
                  <Box display={title ? 'block' : 'none'}>
                    <Typography variant='h6'>{title}</Typography>
                  </Box>
                  <Box display={(date || score) ? 'block' : 'none'}>
                    <Box display='flex' alignItems='center'>
                      <Box display={score ? 'block' : 'none'} marginRight={1}>
                        <Rating value={score} readOnly />
                      </Box>
                      <Box display={date ? 'block' : 'none'} marginRight={1}>
                        <Typography variant='date'>{new Date(date).toLocaleDateString()}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box display={subtitle ? 'block' : 'none'}>
                    <Typography variant='subtitle2'>{subtitle}</Typography>
                  </Box>
                </Box>
              </Box>
              {children}
            </CardActionArea>

            {/* Button, etc... */}
            <Box display={suffix ? 'block' : 'none'} flexShrink={0}>
              {suffix}
            </Box>
          </Box>
        )
      }
    </Box>
  );
}
