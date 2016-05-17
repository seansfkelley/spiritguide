import React from 'react';
import { View, Text, ListView, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';

import { ingredient } from './propTypes';
import {
  rowAndSectionIdentities,
  getSectionData,
  makeGetRowData,
  trivialHasChanged
} from './util/listViewDataSourceUtils';

@PureRender
export default class IngredientConfigurator extends React.Component {
  static propTypes = {
    groupedIngredients: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      ingredients: React.PropTypes.arrayOf(ingredient).isRequired
    })).isRequired
  };

  state = {
    dataSource: this._recomputeDataSource(null, this.props.groupedIngredients)
  };

  componentWillReceiveProps(props) {
    if (this.props.groupedIngredients !== props.groupedIngredients) {
      this.setState({
        dataSource: this._recomputeDataSource(this.state.dataSource, props.groupedIngredients)
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.list}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSectionHeader={this._renderSectionHeader}
          initialListSize={15}
        />
      </View>
    );
  }

  _renderRow = (rowData, sectionId, rowId) => {
    return (
      <Text>{rowData.display}</Text>
    );
  };

  _renderSectionHeader = (sectionData, sectionId) => {
    return (
      <Text>{sectionData.name}</Text>
    );
  };

  _recomputeDataSource(dataSource, groupedIngredients) {
    const { sectionIds, rowIds } = rowAndSectionIdentities(groupedIngredients, 'ingredients');
    return (dataSource || new ListView.DataSource({
      rowHasChanged: trivialHasChanged,
      sectionHeaderHasChanged: trivialHasChanged,
      getSectionData,
      getRowData: makeGetRowData('ingredients')
    }))
    .cloneWithRowsAndSections(groupedIngredients, sectionIds, rowIds);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {

  }
});
