import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import Box from '@material-ui/core/Box';

const styles = {

  root: {
    position: 'relative',
  },
  container: {
    maxWidth: '50%',
  },
};

class SwipeableTileList extends React.Component {

  render() {
    const children = React.Children.map(this.props.children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { doSomething: this.doSomething });
      }
      return child;
    });

    return (
      <div style={styles.root}>
        <SwipeableViews enableMouseEvents style={styles.root} containerStyle={styles.container}>
          {React.Children.map(children, child => (
            <Box margin={1}>
              {child}
            </Box>
          ))}
        </SwipeableViews>
      </div>
    );
  }
}

export default SwipeableTileList;
