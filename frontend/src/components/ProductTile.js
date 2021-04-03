import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import BaseTile from './BaseTile'


const useStyles = makeStyles((theme) => ({
  fab: {
    right: '1.25em',
    position: 'inherit',
  },
}));


export default function ProductTile({ image=null, onClick=null, menuItems=null, name=null }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  name = name.length > 20 ? name.substr(0, 20) + '...' : name;
  return (
    <>
      <BaseTile
        onClick={onClick}
        image={image}
        imageTitle={name}
        contents={
          <Box paddingX={1}>
            <Typography variant="body1">{name}</Typography>
          </Box>
        }
        actions={ menuItems ? (
          <IconButton onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
         ) : null
        }
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems}
      </Menu>
    </>
  );
}
