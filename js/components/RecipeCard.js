import _ from 'lodash';
import React from 'react';
import { View, ListView, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PureRender from 'pure-render-decorator';

import { shallowEqualHasChanged } from './util/listViewDataSourceUtils';
import { recipe } from './propTypes';
import { DEFAULT_SERIF_FONT_FAMILY } from './constants';
import MeasuredIngredient from './MeasuredIngredient';
import InstructionStep from './InstructionStep';

@PureRender
export default class RecipeCard extends React.Component {
  static propTypes = {
    recipe: recipe.isRequired,
    style: View.propTypes.style,
    isFavorited: React.PropTypes.bool.isRequired,
    onFavoriteChange: React.PropTypes.func.isRequired,
    onShare: React.PropTypes.func.isRequired
  };

  state = {
    dataSources: this._recomputeDataSources(null, this.props.recipe)
  };

  componentWillReceiveProps(props) {
    if (this.props.recipe !== props.recipe) {
      this.setState({
        dataSources: this._recomputeDataSources(this.state.dataSources, props.recipe)
      });
    }
  }

  render() {
    const { ingredients, instructions } = this.state.dataSources;

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
        <View style={styles.footer}>
          <Icon.Button
            style={styles.footerButton}
            name={this.props.isFavorited ? 'star' : 'star-o'}
            onPress={this.props.onFavoriteChange.bind(this, this.props.recipe.recipeId, !this.props.isFavorited)}
          >
            {this.props.isFavorited ? 'Unfavorite' : 'Favorite'}
          </Icon.Button>
        </View>
      </View>
    );
  }

  _recomputeDataSources(dataSources, recipe) {
    const { ingredients, instructions } = (dataSources || {});

    return {
      ingredients: (ingredients || new ListView.DataSource({
        rowHasChanged: shallowEqualHasChanged
      })).cloneWithRows(recipe.ingredients),
      instructions: (instructions || new ListView.DataSource({
        rowHasChanged: shallowEqualHasChanged
      })).cloneWithRows(recipe.instructions.split('\n').filter(_.identity))
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
  },
  footer: {
    height: 44
  },
  footerButton: {
    flex: 1
  }
});
