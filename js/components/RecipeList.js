import React from 'react';
import { View, ListView, Text, TouchableHighlight, StyleSheet } from 'react-native';
import SearchBar from 'react-native-search-bar';
import PureRender from 'pure-render-decorator';

import { recipe } from './propTypes';
import { DEFAULT_SANS_SERIF_FONT_FAMILY } from './constants';
import {
  copyWithPrependedSentinel,
  rowAndSectionIdentities,
  getSectionData,
  makeGetRowData,
  shallowEqualHasChanged
} from './util/listViewDataSourceUtils';

const SEARCH_BAR_SENTINEL = Symbol('SEARCH_BAR_SENTINEL');

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

  componentDidMount() {
    this._isMounted = true;
    if (this._scrollBarHeight) {
      this.refs.list.scrollTo({ y: this._scrollBarHeight });
    }
  }

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
        ref='list'
      />
    );
  }

  _renderRow = (rowData, sectionId, rowId) => {
    if (rowData === SEARCH_BAR_SENTINEL) {
      return (
        <SearchBar
          onLayout={this._onSearchBarLayout}
        />
      );
    } else {
      return (
        <TouchableHighlight
          style={styles.row}
          underlayColor='#f6f6f6'
          onPress={this.props.onPress.bind(null, +sectionId, +rowId)}
        >
          <Text style={styles.rowText}>{rowData.name}</Text>
        </TouchableHighlight>
      );
    }
  };

  _renderSectionHeader = (sectionData, sectionId) => {
    if (sectionData.isSentinel) {
      return null;
    } else {
      return (
        <View style={styles.header}>
          <Text style={styles.headerText}>{sectionData.groupName}</Text>
        </View>
      );
    }
  };

  _onSearchBarLayout = (event) => {
    this._scrollBarHeight = event.nativeEvent.layout.height;
    if (this._isMounted) {
      this.refs.list.scrollTo({ y: this._scrollBarHeight, animated: false });
    }
  };

  _recomputeDataSource(dataSource, groupedRecipes) {
    const recipesWithSearchBarSentinel = copyWithPrependedSentinel(
      groupedRecipes,
      'recipes',
      SEARCH_BAR_SENTINEL
    );
    const { sectionIds, rowIds } = rowAndSectionIdentities(recipesWithSearchBarSentinel, 'recipes');
    return (dataSource || new ListView.DataSource({
      rowHasChanged: shallowEqualHasChanged,
      sectionHeaderHasChanged: shallowEqualHasChanged,
      getSectionData,
      getRowData: makeGetRowData('recipes')
    }))
    .cloneWithRowsAndSections(recipesWithSearchBarSentinel, sectionIds, rowIds);
  };

  resetScroll() {
    this.refs.list.scrollTo({ y: this._scrollBarHeight, animated: false });
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  searchBar: {

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
