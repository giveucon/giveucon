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

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
  },
  media: {
    paddingTop: '42.857142857%', // 21:9,
    // paddingTop: '56.25%', // 16:9,
  },
}));


function truncateString(string, maxLength) {
  var byteCount = 0;
  for(var i = 0; i < string.length; i++) {
    if(escape(string.charAt(i)).length == 6) {
      byteCount = byteCount + 2;
    } else {
      byteCount = byteCount + 1;
    }
    if (byteCount > maxLength) {
      string = string.substr(0, i - 3);
      string = string.concat("...");
      return string;
    }
  }        
  return string;
}

export default function BusinessCard({ actions=null, image=null, title=null, maxTitleLength=null, menuItems=null, onClick=null }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (maxTitleLength) {
    title = truncateString(title, maxTitleLength);
  }

  return (
    <Box margin={1}>
      <Card className={classes.root}>
        <CardActionArea onClick={onClick}>
          <CardMedia
            className={classes.media}
            image={image}
            title={title}
          />
        </CardActionArea>
        <Box alignItems="center" display="flex" justifyContent="flex-start">
          <Box display={title ? 'block' : "none"} flexGrow={1} paddingLeft={2} paddingY={1.5}>
            <Typography variant="body1">{title}</Typography>
          </Box>
          <Box
            display={(actions || menuItems) ? 'flex' : "none"}
            flexShrink={1}
            justifyContent="flex-end"
          >
            {actions}
            { menuItems ? (
              <IconButton onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              ) : null
            }
          </Box>
        </Box>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {menuItems}
        </Menu>
      </Card>
    </Box>
  );
}
