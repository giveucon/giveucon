import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Box from '@material-ui/core/Box';

import Pagination from './Pagination';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = {
  root: {
    position: 'relative',
  },
  halfContainer: {
    maxWidth: '50%',
  },
};

class SwipeableTileList extends React.Component {

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
    const { autoplay, half, interval } = this.props;

    if (half) {
      return (
        <div style={styles.root}>
          <SwipeableViews enableMouseEvents style={styles.root} containerStyle={styles.halfContainer}>
            {React.Children.map(children, child => (
              <Box margin={1}>
                {child}
              </Box>
            ))}
          </SwipeableViews>
        </div>
      )
    } else {
      return (
        <div style={styles.root}>
          <AutoPlaySwipeableViews
            autoplay={autoplay ? autoplay : false}
            enableMouseEvents
            index={index}
            interval={interval ? interval : 5000}
            onChangeIndex={this.handleChangeIndex}
          >
            {React.Children.map(children, child => (
              <Box margin={1}>
                {child}
              </Box>
            ))}
          </AutoPlaySwipeableViews>
          {children.length > 1 && (
            <Pagination dots={children.length} index={index} onChangeIndex={this.handleChangeIndex} />
          )}
        </div>
      );
    }
  }
}

export default SwipeableTileList;
