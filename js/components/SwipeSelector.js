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

function rowHasChanged(r1, r2) {
  return r1 !== r2;
}

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
    initialIndex: React.PropTypes.number,
    style: View.propTypes.style
  };

  static defaultProps = {
    initialIndex: 0
  };

  state = {
    dataSource: this._recomputeDataSource(null, this.props.options)
  };

  componentWillReceiveProps(props) {
    if (this.props.options !== props.options) {
      this.setState({ dataSource: this._recomputeDataSource(this.state.dataSource, props.options) });
    }
    if (props.initialIndex !== this.props.initialIndex) {
      this._scrollToIndex(props.initialIndex, false);
    }
  }

  componentDidMount() {
    this._scrollToIndex(this.props.initialIndex, false);
  }

  render() {
    const paddingHorizontal = this._computeHorizontalPadding();
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
          scrollEventThrottle={500}
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
          <Text style={[ styles.optionText, this.props.optionStyle ]}>{rowData.label}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  _scrollToIndex = (index, animated) => {
    this.refs.list.scrollTo({
      x: this._computeHorizontalPadding() + (index - 1) * this.props.optionWidth,
      animated
    });
    this._lastIndexCalledBack = index;
    this.props.onOptionSelect(this.props.options[index].value);
  };

  _onScroll = (event) => {
    // TODO: Does react-native guarantee that it will fire an event when/after the scroll ends?
    const index = Math.floor(event.nativeEvent.contentOffset.x / this.props.optionWidth);
    // Overscroll could have us going past the ends.
    const clampedIndex = Math.max(Math.min(index, this.props.options.length - 1), 0);
    if (clampedIndex !== this._lastIndexCalledBack) {
      this._lastIndexCalledBack = clampedIndex;
      this.props.onOptionSelect(this.props.options[clampedIndex].value);
    }
  };

  _recomputeDataSource(dataSource, options) {
    return (dataSource || new ListView.DataSource({ rowHasChanged }))
    .cloneWithRows(options);
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
