import React from 'react';
import {
  View,
  ListView,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet
} from 'react-native';
import PureRender from 'pure-render-decorator';

import { shallowEqualHasChanged } from './util/listViewDataSourceUtils';

@PureRender
export default class SwipeSelector extends React.Component {
  static propTypes = {
    options: React.PropTypes.arrayOf(React.PropTypes.shape({
      label: React.PropTypes.string.isRequired,
      value: React.PropTypes.string.isRequired
    })).isRequired,
    onOptionSelect: React.PropTypes.func.isRequired,
    optionWidth: React.PropTypes.number.isRequired,
    optionStyle: Text.propTypes.style,
    selectedOptionStyle: Text.propTypes.style,
    initialIndex: React.PropTypes.number,
    style: View.propTypes.style
  };

  static defaultProps = {
    initialIndex: 0
  };

  state = {
    dataSource: this._recomputeDataSource(null, this.props.options, this.props.initialIndex),
    currentIndex: this.props.initialIndex
  };

  componentWillReceiveProps(nextProps) {
    let targetIndex = this.state.currentIndex;
    if (nextProps.initialIndex !== this.props.initialIndex) {
      targetIndex = nextProps.initialIndex;
      this._scrollToIndex(targetIndex, false);
      this.setState({ currentIndex: targetIndex });
    }

    if (this.props.options !== nextProps.options) {
      this.setState({
        dataSource: this._recomputeDataSource(this.state.dataSource, nextProps.options, targetIndex)
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.currentIndex !== this.state.currentIndex) {
      this.props.onOptionSelect(this.props.options[nextState.currentIndex].value);
    }
  }

  componentDidMount() {
    this._scrollToIndex(this.props.initialIndex, false);
  }

  render() {
    const paddingHorizontal = this._computeHorizontalPadding();
    // TODO: I don't want to have to get the scroll position every 16ms, but it seems to be the only way that is reliable.
    return (
      <View style={[ styles.container, this.props.style ]}>
        <ListView
          style={styles.list}
          contentContainerStyle={{ paddingHorizontal }}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          horizontal={true}
          snapToAlignment='start'
          snapToInterval={this.props.optionWidth}
          decelerationRate='fast'
          showsHorizontalScrollIndicator={false}
          onScroll={this._onScroll}
          scrollEventThrottle={16}
          ref='list'
        />
      </View>
    );
  }

  _computeHorizontalPadding() {
    // TODO: Is there a way we can compute something like `calc(50% - (optionWidth / 2))`?
    const { width } = Dimensions.get('window');
    return (width - this.props.optionWidth) / 2;
  }

  _renderRow = (rowData, sectionId, rowId) => {
    return (
      <TouchableWithoutFeedback onPress={this._scrollToIndex.bind(null, +rowId, true)}>
        <View style={[ styles.option, { width: this.props.optionWidth } ]}>
          <Text style={[
            styles.optionText,
            this.props.optionStyle,
            rowData.isSelected ? this.props.selectedOptionStyle : null
          ]}>{rowData.label}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  _scrollToIndex = (index, animated) => {
    this.refs.list.scrollTo({
      x: this._computeHorizontalPadding() + (index - 1) * this.props.optionWidth,
      animated
    });
  };

  _onScroll = (event) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / this.props.optionWidth + 0.5);
    // Overscroll could have us going past the ends.
    const clampedIndex = Math.max(Math.min(index, this.props.options.length - 1), 0);
    if (clampedIndex !== this.state.currentIndex) {
      this.setState({
        currentIndex: clampedIndex,
        dataSource: this._recomputeDataSource(this.state.dataSource, this.props.options, clampedIndex)
      });
    }
  };

  _recomputeDataSource(dataSource, options, currentIndex) {
    const optionsWithSelectedState = options.map((option, i) => ({
      label: option.label,
      value: option.value,
      isSelected: i === currentIndex
    }));
    return (dataSource || new ListView.DataSource({
      rowHasChanged: shallowEqualHasChanged
    }))
    .cloneWithRows(optionsWithSelectedState);
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  list: {
  },
  option: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  optionText: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16
  }
});
