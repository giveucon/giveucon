import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
    media: {
      height: '10rem',
    },
  }));

export default function ArticleBox({ children=null, content=null, image=null, onClick=null, skeleton=false, title=null, subtitle=null }) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {
        skeleton ? (
          <>
            <Skeleton animation='wave' variant='rect' width='100%' height='10rem' style={{borderRadius: '1rem'}}/>
            <Box marginY='1rem'>
              <Skeleton animation='wave' width='100%' height='1rem' />
              <Skeleton animation='wave' width='100%' height='1rem' />
              <Skeleton animation='wave' width='80%' height='1rem' />
            </Box>
          </>
        ) : (
          <>
            <Box display={image ? 'block' : 'none'} paddingY={1}>
              <Card>
                <CardActionArea onClick={onClick}>
                  <CardMedia
                    className={classes.media}
                    image={image}
                    title={title}
                  />
                </CardActionArea>
              </Card>
            </Box>
            <Box paddingY={1}>
              <Typography variant='h6'>{title}</Typography>
              <Typography variant='subtitle1'>{subtitle}</Typography>
            </Box>
            <Divider />
            <Box paddingY={1}>
              <Typography variant='body1'>{content}</Typography>
            </Box>
            <Box paddingY={1}>
              {children}
            </Box>
          </>
        )
      }
    </Box>
  );
}
