import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme) => ({
    root: {
      maxHeight: '100%',
      maxWidth: '100%',
    },
    avatar: {
        height: '80%',
        width: '80%',
    },
  }));


export default function UserListItem({ content=null, image=null, menuItems=null, name=null, onClick=null }) {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <ListItem button onClick={onClick}>
      <ListItemAvatar>
        <Avatar alt={name} src={image} />
      </ListItemAvatar>
      <ListItemText
        primary={name.length > 28 ? name.substr(0, 28) + '...' : name}
        secondary={content}
      />
      <ListItemSecondaryAction>
        <Box display={menuItems ? "block" : "none"}>
          <IconButton onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {menuItems}
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
