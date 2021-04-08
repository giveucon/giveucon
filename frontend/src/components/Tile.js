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
    paddingTop: '100%', // 1:1,
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

export default function Tile({ actions=null, image=null, title=null, maxTitleLength=null, menuItems=null, onClick=null }) {
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
        <Box display={title ? 'block' : "none"}>
          <Box paddingX={2} paddingTop={1} paddingBottom={(actions || menuItems) ? 0 : 1}>
            <Typography variant="body1">{title}</Typography>
          </Box>
        </Box>
        <Box
          display={(actions || menuItems) ? 'flex' : "none"}
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
