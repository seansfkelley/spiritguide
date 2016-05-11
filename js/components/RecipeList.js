import React from 'react';
import { ListView, Text } from 'react-native';
import PureRender from 'pure-render-decorator';
import memoize from 'memoizee';

import { recipe } from './propTypes';
import styles from '../styles';

@PureRender
export default class RecipeList extends React.Component {
  static propTypes = {
    recipes: React.PropTypes.arrayOf(React.PropTypes.arrayOf(recipe)).isRequired
  };

  constructor() {
    super();
    this._getDataSource = memoize(this._getDataSource, { max: 1 });
  }

  render() {
    console.log(this.props.recipes);
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
      <Text>{rowData.name}</Text>
    );
  };

  _renderSectionHeader = (sectionData, sectionId) => {
    return (
      <Text>{sectionData[0].sortName[0].toUpperCase()}</Text>
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
