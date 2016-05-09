import React from 'react';
import ReactNative from 'react-native';
import PureRender from 'pure-render-decorator';

const {
  ListView,
  Text
} = ReactNative;

import { recipe } from './propTypes';

@PureRender
export default class RecipeList extends React.Component {
  static propTypes = {
    recipes: React.PropTypes.arrayOf(recipe).isRequired
  };

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    }).cloneWithRows(this.props.recipes),
  };

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
      />
    );
  }

  _renderRow = (rowData, sectionId, rowId) => {
    return (
      <Text>{rowData.name}</Text>
    );
  };
}
