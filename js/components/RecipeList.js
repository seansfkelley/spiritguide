import React from 'react';
import { View, ListView, Text, TouchableHighlight, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';

import { recipe } from './propTypes';
import { DEFAULT_SANS_SERIF_FONT_FAMILY } from './constants';
import {
  rowAndSectionIdentities,
  getSectionData,
  makeGetRowData,
  shallowEqualHasChanged
} from './util/listViewDataSourceUtils';

@PureRender
export default class RecipeList extends React.Component {
  static propTypes = {
    groupedRecipes: React.PropTypes.arrayOf(React.PropTypes.shape({
      groupName: React.PropTypes.string.isRequired,
      recipes: React.PropTypes.arrayOf(recipe).isRequired
    })).isRequired,
    onPress: React.PropTypes.func.isRequired
  };

  state = {
    dataSource: this._recomputeDataSource(null, this.props.groupedRecipes)
  };

  componentWillReceiveProps(props) {
    if (this.props.groupedRecipes !== props.groupedRecipes) {
      this.setState({
        dataSource: this._recomputeDataSource(this.state.dataSource, props.groupedRecipes)
      });
    }
  }

  render() {
    return (
      <ListView
        styles={styles.recipeList}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        renderSectionHeader={this._renderSectionHeader}
        initialListSize={15}
      />
    );
  }

  _renderRow = (rowData, sectionId, rowId) => {
    return (
      <TouchableHighlight
        style={styles.row}
        underlayColor='#f6f6f6'
        onPress={this.props.onPress.bind(null, +sectionId, +rowId)}
      >
        <Text style={styles.rowText}>{rowData.name}</Text>
      </TouchableHighlight>
    );
  };

  _renderSectionHeader = (sectionData, sectionId) => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{sectionData.groupName}</Text>
      </View>
    );
  };

  _recomputeDataSource(dataSource, groupedRecipes) {
    const { sectionIds, rowIds } = rowAndSectionIdentities(groupedRecipes, 'recipes');
    return (dataSource || new ListView.DataSource({
      rowHasChanged: shallowEqualHasChanged,
      sectionHeaderHasChanged: shallowEqualHasChanged,
      getSectionData,
      getRowData: makeGetRowData('recipes')
    }))
    .cloneWithRowsAndSections(groupedRecipes, sectionIds, rowIds);
  };
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  row: {
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  rowText: {
    fontSize: 16,
    paddingLeft: 12,
    paddingVertical: 12,
    fontFamily: DEFAULT_SANS_SERIF_FONT_FAMILY
  },
  header: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#f6f6f6',
    paddingVertical: 2,
    paddingLeft: 6
  },
  headerText: {
    color: '#444',
    fontSize: 12,
    fontFamily: DEFAULT_SANS_SERIF_FONT_FAMILY
  }
});
