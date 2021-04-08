import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Pagination from './Pagination';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = {
  root: {
    position: 'relative',
  },
};

class SwipeableBusinessCard extends React.Component {

  state = {
    index: 0,
  };

  handleChangeIndex = index => {
    this.setState({
      index,
    });
  };

  render() {
    const children = React.Children.map(this.props.children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { doSomething: this.doSomething });
      }
      return child;
    });
    const { index } = this.state;

    return (
      <div style={styles.root}>
        <AutoPlaySwipeableViews enableMouseEvents index={index} onChangeIndex={this.handleChangeIndex}>
          {children}
        </AutoPlaySwipeableViews>
        <Pagination dots={React.Children.count(children)} index={index} onChangeIndex={this.handleChangeIndex} />
      </div>
    );
  }
}

export default SwipeableBusinessCard;
