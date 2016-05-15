import React from 'react';
import { View, ListView, Text, StyleSheet } from 'react-native';
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
    onSelect: React.PropTypes.func.isRequired,
    initialIndex: React.PropTypes.number
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
    return (
      <View style={styles.container}>
        <ListView
          style={styles.list}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  _renderRow = (rowData, sectionId, rowId) => {
    return (
      <View style={styles.option}>
        <Text style={styles.optionText}>{rowData.label}</Text>
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
    width: 200,
    overflow: 'visible'
  },
  option: {
    width: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  optionText: {
    paddingVertical: 8,
    paddingHorizontal: 16
  }
});
