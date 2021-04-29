import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
  },
  imageArea: {
    height: '10rem',
    position: 'relative',
  },
  media: {
    height: '10rem',
  },
  actions: {
    position: 'absolute',
    bottom: '0.5rem',
    right: '0.5rem',
    borderRadius: '1.5rem',
    boxShadow: theme.shadows[3],
  },
  titleArea: {
    height: '4rem',
    position: 'relative',
  },
  titleOnly: {
    lineHeight: '1.5em',
    height: '3em',
    overflow: 'hidden',
  },
  title: {
    lineHeight: '1.5em',
    height: '1.5em',
    overflow: 'hidden',
  },
  subtitle: {
    lineHeight: '1.5em',
    height: '1.5em',
    overflow: 'hidden',
  },
}));


export default function Tile({ actions=null, image=null, imageType='http', title=null, menuItems=null, onClick=null, skeleton=false, subtitle=null }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className={classes.root}>
      {
        skeleton ? (
          <>
            <Skeleton animation='wave' variant='rect' width='100%' height='10rem' style={{borderRadius: '1rem'}}/>
            <Box marginY='1rem'>
              <Skeleton animation='wave' width='100%' height='1rem' />
              <Skeleton animation='wave' width='80%' height='1rem' />
            </Box>
          </>
        ) : (
        <Card>
          {/* Image and action menus area */}
          <Box className={classes.imageArea}>
            <CardActionArea onClick={onClick}>
              {imageType === 'base64' && (
                <CardMedia
                  className={classes.media}
                  component='img'
                  src={image}
                  alt={title}
                />
              )}
              {imageType === 'http' && (
                <CardMedia
                  className={classes.media}
                  image={image}
                  title={title}
                />
              )}
            </CardActionArea>
            <Card
              className={classes.actions}
              display={(actions || menuItems) ? 'flex' : 'none'}
              justifyContent='flex-end'
            >
              {actions}
              {menuItems && (<IconButton onClick={handleClick}><MoreVertIcon /></IconButton>)}
            </Card>
          </Box>
  
          {/* Title and content area */}
          <Box className={classes.titleArea} display={(title || subtitle) ? 'block' : 'none'}>
            <Box display={(title && !subtitle) ? 'block' : 'none'}>
              <Box paddingX={1} paddingY={1}>
                <Typography variant='subtitle1' className={classes.titleOnly}>{title}</Typography>
              </Box>
            </Box>
            <Box display={(title && subtitle) ? 'block' : 'none'}>
              <Box paddingX={1} paddingTop={1}>
                <Typography variant='subtitle1' className={classes.title}>{title}</Typography>
              </Box>
              <Box paddingX={1} paddingBottom={1.25}>
                <Typography variant='subtitle2' className={classes.subtitle}>{subtitle}</Typography>
              </Box>
            </Box>
          </Box>
  
          {/* Menu definition */}
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {menuItems}
          </Menu>
        </Card>
        )
      }

    </Box>
  );
}
