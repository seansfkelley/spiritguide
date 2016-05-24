import React from 'react';
import { View, ListView, Text, TouchableHighlight, StyleSheet } from 'react-native';
import SearchBar from 'react-native-search-bar';
import PureRender from 'pure-render-decorator';

import { recipe, ingredient, ingredientSplits } from './propTypes';
import { DEFAULT_SANS_SERIF_FONT_FAMILY } from './constants';
import {
  copyWithPrependedSentinel,
  rowAndSectionIdentities,
  getSectionData,
  makeGetRowData,
  shallowEqualHasChanged
} from './util/listViewDataSourceUtils';
import { getHardest } from './Difficulty';

const SEARCH_BAR_SENTINEL = Symbol('SEARCH_BAR_SENTINEL');
const NO_RESULTS_SENTINEL = Symbol('NO_RESULTS_SENTINEL');

@PureRender
export default class RecipeList extends React.Component {
  static propTypes = {
    groupedRecipes: React.PropTypes.arrayOf(React.PropTypes.shape({
      groupName: React.PropTypes.string.isRequired,
      recipes: React.PropTypes.arrayOf(recipe).isRequired
    })).isRequired,
    onPress: React.PropTypes.func.isRequired,
    searchTerm: React.PropTypes.string.isRequired,
    onSearchTermChange: React.PropTypes.func.isRequired,
    ingredientSplitsByRecipeId: React.PropTypes.objectOf(ingredientSplits).isRequired,
    ingredientsByTag: React.PropTypes.objectOf(ingredient).isRequired
  };

  state = {
    dataSource: this._recomputeDataSource(null, this.props)
  };

  componentDidMount() {
    this._isMounted = true;
    if (this._searchBarHeight) {
      this.scrollToTop(!!this.props.searchTerm);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        dataSource: this._recomputeDataSource(this.state.dataSource, nextProps)
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
          text={this.props.searchTerm}
          onLayout={this._onSearchBarLayout}
          onChangeText={this.props.onSearchTermChange}
          placeholder='Name or ingredient...'
        />
      );
    } else if (rowData === NO_RESULTS_SENTINEL) {
      return (
        <View style={styles.noResultsWrapper}>
          <Text style={styles.noResultsText}>
            {'Nothing to see here!\n' +
            'Try broadening your filtering options.'}
          </Text>
        </View>
      );
    } else {
      return (
        <TouchableHighlight
          style={styles.row}
          underlayColor='#f6f6f6'
          onPress={this.props.onPress.bind(null, +sectionId - 1, +rowId)}
        >
          <Text style={styles.rowText}>{rowData.name} {rowData.difficulty && rowData.difficulty.toString()}</Text>
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
    this._searchBarHeight = event.nativeEvent.layout.height;
    if (this._isMounted) {
      this.scrollToTop(!!this.props.searchTerm);
    }
  };

  _recomputeDataSource(dataSource, props) {
    const { groupedRecipes, ingredientSplitsByRecipeId, ingredientsByTag } = props;

    const mungedGroupedRecipes = groupedRecipes.map(group => ({
      groupName: group.groupName,
      recipes: group.recipes.map(r => {
        const missingIngredients = props.ingredientSplitsByRecipeId[r.recipeId].missing;
        let difficulty;
        if (missingIngredients.length) {
          difficulty = getHardest(_.chain(missingIngredients)
            .map('tag')
            .map((tag) => this.props.ingredientsByTag[tag])
            .map('difficulty')
            .value()
          );
        }
        return {
          name: r.name,
          difficulty
        };
      })
    }))

    let recipesWithSentinels = mungedGroupedRecipes;
    if (recipesWithSentinels.length === 0) {
      recipesWithSentinels = copyWithPrependedSentinel(
        recipesWithSentinels,
        'recipes',
        NO_RESULTS_SENTINEL
      );
    }

    recipesWithSentinels = copyWithPrependedSentinel(
      recipesWithSentinels,
      'recipes',
      SEARCH_BAR_SENTINEL
    );

    const { sectionIds, rowIds } = rowAndSectionIdentities(recipesWithSentinels, 'recipes');
    return (dataSource || new ListView.DataSource({
      rowHasChanged: shallowEqualHasChanged,
      sectionHeaderHasChanged: shallowEqualHasChanged,
      getSectionData,
      getRowData: makeGetRowData('recipes')
    }))
    .cloneWithRowsAndSections(recipesWithSentinels, sectionIds, rowIds);
  };

  scrollToTop(showSearchBar) {
    this.refs.list.scrollTo({
      y: showSearchBar ? 0 : this._searchBarHeight,
      animated: false
    });
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  searchBar: {

  },
  noResultsWrapper: {
    alignItems: 'center'
  },
  noResultsText: {
    paddingTop: 30,
    fontFamily: DEFAULT_SANS_SERIF_FONT_FAMILY,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20
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
