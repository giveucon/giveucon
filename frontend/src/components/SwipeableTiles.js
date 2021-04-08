import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';

const styles = {

  root: {
    position: 'relative',
  },
  slideContainer: {
    maxWidth: "50%",
  },
};

class SwipeableTile extends React.Component {

  render() {
    const children = React.Children.map(this.props.children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { doSomething: this.doSomething });
      }
      return child;
    });

    return (
      <div style={styles.root}>
        <SwipeableViews enableMouseEvents style={styles.root} slideStyle={styles.slideContainer}>
          {children}
        </SwipeableViews>
      </div>
    );
  }
}

export default SwipeableTile;
