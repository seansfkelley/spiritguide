import React from 'react';
import { View, ListView, ScrollView, Text, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';
import memoize from 'memoizee';

import { recipe } from './propTypes';
import MeasuredIngredient from './MeasuredIngredient';

@PureRender
export default class RecipeCard extends React.Component {
  static propTypes = {
    recipe: recipe.isRequired,
    style: View.propTypes.style
  };

  constructor() {
    super();
    this._getDataSources = memoize(this._getDataSources, { max: 1 });
  }

  render() {
    const { ingredients } = this._getDataSources(this.props.recipe);

    return (
      <View style={[ styles.card, this.props.style ]}>
        <Text style={styles.titleText}>{this.props.recipe.name}</Text>
        <ScrollView style={styles.recipeBody}>
          <ListView
            enableScroll={false}
            dataSource={ingredients}
            renderRow={this._renderIngredientRow}
            initialListSize={this.props.recipe.ingredients.length}
          />
        </ScrollView>
      </View>
    );
  }

  _getDataSources = (recipe) => {
    const trivialHasChanged = (o1, o2) => o1 !== o2;

    return {
      ingredients: new ListView.DataSource({
        rowHasChanged: trivialHasChanged
      }).cloneWithRows(recipe.ingredients)
    };
  };

  _renderIngredientRow = (rowData, sectionId, rowId) => {
    return <MeasuredIngredient
      ingredient={rowData}
      style={[
        { backgroundColor: +rowId % 2 ? '#ddd' : '#eee'},
        styles.ingredientRow
      ]}
    />;
  };
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column'
  },
  titleText: {
    fontFamily: 'Palatino',
    fontSize: 20
  },
  recipeBody: {
    flex: 1,
    paddingTop: 6
  },
  ingredientRow: {
    flex: 1
  }
});
