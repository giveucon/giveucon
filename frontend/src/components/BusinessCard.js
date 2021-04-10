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
    maxWidth: "100%",
  },
  actions: {
    position: "absolute",
    bottom: "0.5rem",
    right: "0.5rem",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: "1.5rem",
    boxShadow: theme.shadows[3],
  },
  actionAreaWrapper: {
    position: "relative",
  },
  media: {
    paddingTop: "42.86%", // 21:9,
    // paddingTop: "56.25%", // 16:9,
  },
  title: {
    lineHeight: "1.5em",
    height: "1.5em",
    overflow: "hidden",
  },
}));


export default function BusinessCard({ actions=null, image=null, title=null, menuItems=null, onClick=null }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <Box margin={0.5} className={classes.root}>
      <Card>
        <Box className={classes.actionAreaWrapper}>
          <CardActionArea onClick={onClick}>
            <CardMedia
              className={classes.media}
              image={image}
              title={title}
            />
          </CardActionArea>
          <Box
            className={classes.actions}
            display={(actions || menuItems) ? "flex" : "none"}
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
        <Box display={title ? "block" : "none"}>
          <Box paddingX={1} paddingY={1}>
            <Typography variant="body1" className={classes.title}>{title}</Typography>
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