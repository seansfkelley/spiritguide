import React from 'react';
import { View, ListView, Text, Dimensions, StyleSheet } from 'react-native';
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

  state = {
    dataSource: this._recomputeDataSource(null, this.props.options)
  };

  componentWillReceiveProps(props) {
    if (this.props.options !== props.options) {
      this.setState({ dataSource: this._recomputeDataSource(this.state.dataSource, props.options) });
    }
  }

  render() {
    // TODO: Is there a way we can compute something like `calc(50% - (optionWidth / 2))`?
    const { width } = Dimensions.get('window');
    const paddingHorizontal = (width - this.props.optionWidth) / 2;
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
        />
      </View>
    );
  }

  _renderRow = (rowData, sectionId, rowId) => {
    return (
      <View style={[ styles.option, { width: this.props.optionWidth } ]}>
        <Text style={[ styles.optionText, this.props.optionStyle ]}>{rowData.label}</Text>
      </View>
    );
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
