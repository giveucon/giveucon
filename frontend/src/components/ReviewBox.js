import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: '100%',
    },
    media: {
      paddingTop: "42.86%", // 21:9,
      // paddingTop: "56.25%", // 16:9,
    },
  }));

export default function ReviewBox({ actions=null, content=null, image=null, title=null, onClick=null, score=null, subtitle=null }) {
  const classes = useStyles();

  return (
    <Box paddingX={1}>
      <Typography variant="h5">
        {title}
      </Typography>
      <Box alignItems="center" display="flex" justifyContent="flex-start">
        <Box marginRight={1}>
          <Typography variant="subtitle1">
            {subtitle}
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box marginLeft={1}>
          <Rating
            value={score}
            readOnly 
          />
        </Box>
      </Box>
      <Box display={image ? "block" : "none"} paddingY={1}>
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
        <Typography variant="body1">
          {content}
        </Typography>
        <Box display="flex" justifyContent="flex-end" paddingX={0.5}>
          {actions}
        </Box>
      </Box>
    </Box>
  );
}
