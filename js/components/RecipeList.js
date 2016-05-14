import React from 'react';
import { View, ListView, Text, TouchableHighlight, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';
import memoize from 'memoizee';

import { recipe } from './propTypes';

@PureRender
export default class RecipeList extends React.Component {
  static propTypes = {
    recipes: React.PropTypes.arrayOf(React.PropTypes.arrayOf(recipe)).isRequired,
    onPress: React.PropTypes.func.isRequired
  };

  constructor() {
    super();
    this._getDataSource = memoize(this._getDataSource, { max: 1 });
  }

  render() {
    return (
      <ListView
        styles={styles.recipeList}
        dataSource={this._getDataSource(this.props.recipes)}
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
        <Text style={styles.headerText}>{sectionData[0].sortName[0].toUpperCase()}</Text>
      </View>
    );
  };

  _getDataSource = (recipes) => {
    return new ListView.DataSource({
      // TODO: Make these functions smarter.
      // TODO: Memoizing this is wrong; we want to be able to take advantage of the diffing behavior
      // that allows you to create new DataSources from old ones.
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    }).cloneWithRowsAndSections(recipes);
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
    paddingVertical: 12
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
    fontSize: 12
  }
});
