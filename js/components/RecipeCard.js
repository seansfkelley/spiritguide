import _ from 'lodash';
import React from 'react';
import { View, ListView, ScrollView, Text, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';
import memoize from 'memoizee';

import { recipe } from './propTypes';
import { DEFAULT_SERIF_FONT_FAMILY } from './constants';
import MeasuredIngredient from './MeasuredIngredient';
import InstructionStep from './InstructionStep';

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
    const { ingredients, instructions } = this._getDataSources(this.props.recipe);

    return (
      <View style={[ styles.card, this.props.style ]}>
        <Text style={styles.titleText}>{this.props.recipe.name}</Text>
        <ScrollView style={styles.recipeBody}>
          <ListView
            enableScroll={false}
            dataSource={ingredients}
            renderRow={this._renderIngredientRow}
            initialListSize={Infinity}
            style={styles.ingredientList}
          />
          <ListView
            enableScroll={false}
            dataSource={instructions}
            renderRow={this._renderInstructionRow}
            initialListSize={Infinity}
            style={styles.instructionList}
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
      }).cloneWithRows(recipe.ingredients),
      instructions: new ListView.DataSource({
        rowHasChanged: trivialHasChanged
      }).cloneWithRows(recipe.instructions.split('\n').filter(_.identity))
    };
  };

  _renderIngredientRow = (rowData, sectionId, rowId) => {
    return (
      <MeasuredIngredient
        ingredient={rowData}
        style={[
          { backgroundColor: +rowId % 2 ? '#ddd' : '#eee'},
          styles.ingredientRow
        ]}
      />
    );
  };

  _renderInstructionRow = (rowData, sectionId, rowId) => {
    return (
      <InstructionStep
        number={+rowId + 1}
        text={rowData}
        style={styles.instructionRow}
      />
    );
  };
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column'
  },
  titleText: {
    fontFamily: DEFAULT_SERIF_FONT_FAMILY,
    fontSize: 20
  },
  recipeBody: {
    flex: 1,
    marginTop: 12
  },
  ingredientList: {

  },
  ingredientRow: {
    flex: 1
  },
  instructionRow: {
    flex: 1,
    paddingHorizontal: 10
  },
  instructionList: {
    marginTop: 12
  }
});
