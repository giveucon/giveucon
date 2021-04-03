import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
    media: {
      paddingTop: '100%', // 1:1,
      // paddingTop: '56.25%', // 16:9,
    },
  }));


export default function BaseTile({ actions=null, contents=null, image=null, imageTitle=null, onClick=null }) {
  const classes = useStyles();

  return (
    <Box margin={1}>
      <Card className={classes.root}>
        <CardActionArea onClick={onClick}>
          <CardMedia
            className={classes.media}
            image={image}
            title={imageTitle ? imageTitle : "Image"}
          />
        </CardActionArea>
        <Box display={contents ? 'block' : "none"} padding={1}>
          {contents}
        </Box>
        <Box display={actions ? 'flex' : "none"} justifyContent="flex-end">
          {actions}
        </Box>
      </Card>
    </Box>
  );
}
