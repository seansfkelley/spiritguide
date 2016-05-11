import React from 'react';
import { ListView, Text } from 'react-native';
import PureRender from 'pure-render-decorator';
import memoize from 'memoizee';

import { recipe } from './propTypes';

@PureRender
export default class RecipeList extends React.Component {
  static propTypes = {
    recipes: React.PropTypes.arrayOf(recipe).isRequired
  };

  constructor() {
    super();
    this._getDataSource = memoize(this._getDataSource, { max: 1 });
  }

  render() {
    return (
      <ListView
        dataSource={this._getDataSource(this.props.recipes)}
        renderRow={this._renderRow}
      />
    );
  }

  _renderRow = (rowData, sectionId, rowId) => {
    return (
      <Text>{rowData.name}</Text>
    );
  };

  _getDataSource = (recipes) => {
    return new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    }).cloneWithRows(recipes);
  };
}
