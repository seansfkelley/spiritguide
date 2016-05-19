import React from 'react';
import { View, Text, ListView, Switch, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';
import SearchBar from 'react-native-search-bar';

import { ingredient } from './propTypes';
import { DEFAULT_SANS_SERIF_FONT_FAMILY } from './constants';
import {
  rowAndSectionIdentities,
  getSectionData,
  makeGetRowData,
  shallowEqualHasChanged
} from './util/listViewDataSourceUtils';

@PureRender
export default class IngredientConfigurator extends React.Component {
  static propTypes = {
    groupedIngredients: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      ingredients: React.PropTypes.arrayOf(ingredient).isRequired
    })).isRequired,
    selectedIngredientTags: React.PropTypes.objectOf(React.PropTypes.bool).isRequired,
    onIngredientStateChange: React.PropTypes.func.isRequired,
    onSearchTermChange: React.PropTypes.func.isRequired,
    style: View.propTypes.style
  };

  state = {
    dataSource: this._recomputeDataSource(null, this.props.groupedIngredients, this.props.selectedIngredientTags)
  };

  componentWillReceiveProps(props) {
    if (this.props.groupedIngredients !== props.groupedIngredients || this.props.selectedIngredientTags !== props.selectedIngredientTags) {
      this.setState({
        dataSource: this._recomputeDataSource(this.state.dataSource, props.groupedIngredients, props.selectedIngredientTags)
      });
    }
  }

  render() {
    return (
      <View style={[ styles.container, this.props.style ]}>
        <SearchBar
          onChangeText={this.props.onSearchTermChange}
          placeholder='Ingredient name...'
          barTintColor='#444'
          searchBarStyle='minimal'
          textColor='#eee'
        />
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
      <View style={styles.row}>
        <Text style={styles.rowText}>{rowData.ingredient.display}</Text>
        <Switch
          style={styles.rowSwitch}
          value={rowData.isEnabled}
          onValueChange={this.props.onIngredientStateChange.bind(null, rowData.ingredient.tag)}
          thumbTintColor='#bbb'
          tintColor='#444'
          onTintColor='#999'
        />
      </View>
    );
  };

  _renderSectionHeader = (sectionData, sectionId) => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{sectionData.name.toUpperCase()}</Text>
      </View>
    );
  };

  _recomputeDataSource(dataSource, groupedIngredients, selectedIngredientTags) {
    const augmentedGroupedIngredients = groupedIngredients.map(group => {
      const augmentedIngredients = group.ingredients.map(ingredient => {
        return {
          ingredient,
          isEnabled: !!selectedIngredientTags[ingredient.tag]
        };
      });

      return {
        name: group.name,
        ingredients: augmentedIngredients
      };
    });
    const { sectionIds, rowIds } = rowAndSectionIdentities(augmentedGroupedIngredients, 'ingredients');
    return (dataSource || new ListView.DataSource({
      rowHasChanged: shallowEqualHasChanged,
      sectionHeaderHasChanged: shallowEqualHasChanged,
      getSectionData,
      getRowData: makeGetRowData('ingredients')
    }))
    .cloneWithRowsAndSections(augmentedGroupedIngredients, sectionIds, rowIds);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {

  },
  row: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4a4a4a',
    borderBottomWidth: 1,
    borderBottomColor: '#434343'
  },
  rowText: {
    color: '#eee',
    fontSize: 16,
    fontFamily: DEFAULT_SANS_SERIF_FONT_FAMILY
  },
  rowSwitch: {

  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#393939'
  },
  headerText: {
    color: '#a8a8a8',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: DEFAULT_SANS_SERIF_FONT_FAMILY
  }
});
