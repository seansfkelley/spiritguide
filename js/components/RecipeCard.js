import _ from 'lodash';
import React from 'react';
import { View, ListView, ScrollView, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PureRender from 'pure-render-decorator';

import { shallowEqualHasChanged } from './util/listViewDataSourceUtils';
import { recipe, ingredient, ingredientSplits } from './propTypes';
import {
  DEFAULT_SERIF_FONT_FAMILY,
  DEFAULT_SANS_SERIF_FONT_FAMILY,
  IOS_STATUS_BAR_BACKGROUND_COLOR
} from './constants';
import MeasuredIngredient from './MeasuredIngredient';
import InstructionStep from './InstructionStep';
import Difficulty from './Difficulty';

const ORDERED_INGREDIENT_CATEGORIES = [
  {
    key: 'missing',
    getProps: (ingredient, props) => ({
      ingredient,
      isMissing: true,
      difficulty: Difficulty.of(props.ingredientsByTag[ingredient.tag].difficulty)
    })
  }, {
    key: 'substitute',
    getProps: ({ have, need }, props) => ({
      ingredient: need,
      isSubstituted: true,
      displaySubstitutes: have
    })
  }, {
    key: 'available',
    getProps: (ingredient, props) => ({
      ingredient
    })
  }
];

@PureRender
export default class RecipeCard extends React.Component {
  static propTypes = {
    recipe: recipe.isRequired,
    ingredientSplits: ingredientSplits.isRequired,
    ingredientsByTag: React.PropTypes.objectOf(ingredient).isRequired,
    style: View.propTypes.style,
    isFavorited: React.PropTypes.bool.isRequired,
    onFavoriteChange: React.PropTypes.func.isRequired,
    onShare: React.PropTypes.func.isRequired
  };

  state = {
    dataSources: this._recomputeDataSources(null, this.props)
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.recipe !== nextProps.recipe) {
      this.setState({
        dataSources: this._recomputeDataSources(this.state.dataSources, nextProps)
      });
    }
  }

  render() {
    const { ingredients, instructions } = this.state.dataSources;
    const recipe = this.props.recipe;

    return (
      <View style={[ styles.card, this.props.style ]}>
        <View style={styles.header}>
          <Text style={styles.titleText}>{recipe.name}</Text>
        </View>
        <ScrollView style={styles.recipeBody}>
          <ListView
            scrollEnabled={false}
            dataSource={ingredients}
            renderRow={this._renderIngredientRow}
            initialListSize={Infinity}
            style={styles.ingredientList}
          />
          <ListView
            scrollEnabled={false}
            dataSource={instructions}
            renderRow={this._renderInstructionRow}
            initialListSize={Infinity}
            style={styles.instructionList}
          />
          {recipe.notes
            ? <Text style={styles.notes}>{recipe.notes}</Text>
            : null
          }
          {recipe.source && recipe.url
            ? <View style={styles.sourceButtonWrapper}>
                <View style={styles.sourceButtonSpacer}/>
                <Icon.Button
                  style={styles.sourceButton}
                  iconStyle={styles.sourceButtonIcon}
                  name='external-link'
                  onPress={this._openUrl}
                  {...sourceButtonStyle}
                >
                  {recipe.source}
                </Icon.Button>
              </View>
            : null
          }
        </ScrollView>
        <View style={styles.footer}>
          <Icon.Button
            style={styles.footerButton}
            name={this.props.isFavorited ? 'star' : 'star-o'}
            onPress={this.props.onFavoriteChange.bind(this, recipe.recipeId, !this.props.isFavorited)}
            {...footerButtonStyle}
          >
            {this.props.isFavorited ? 'Favorited' : 'Favorite'}
          </Icon.Button>
        </View>
      </View>
    );
  }

  _recomputeDataSources(dataSources, props) {
    const { recipe, ingredientSplits } = props;
    const { ingredients, instructions } = (dataSources || {});

    const mungedIngredients = _.flatMap(ORDERED_INGREDIENT_CATEGORIES, ({ key, getProps }) => {
      return ingredientSplits[key].map(s => getProps(s, props));
    });

    return {
      ingredients: (ingredients || new ListView.DataSource({
        rowHasChanged: shallowEqualHasChanged
      })).cloneWithRows(mungedIngredients),
      instructions: (instructions || new ListView.DataSource({
        rowHasChanged: shallowEqualHasChanged
      })).cloneWithRows(recipe.instructions.split('\n').filter(_.identity))
    };
  };

  _renderIngredientRow = (rowData, sectionId, rowId) => {
    return (
      <MeasuredIngredient
        {...rowData}
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

  _openUrl = () => {
    Linking.openURL(this.props.recipe.url);
  };
}

const sourceButtonStyle = {
  backgroundColor: 'transparent',
  borderRadius: 0,
  color: '#888',
  size: 16
};

const footerButtonStyle = {
  backgroundColor: 'transparent',
  borderRadius: 0,
  color: '#888'
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column'
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: 44
  },
  titleText: {
    fontFamily: DEFAULT_SERIF_FONT_FAMILY,
    fontSize: 20,
    color: '#eee'
  },
  ingredientList: {
    flex: 0
  },
  recipeBody: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20
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
  notes: {
    marginTop: 12,
    fontFamily: DEFAULT_SANS_SERIF_FONT_FAMILY,
    fontStyle: 'italic',
    fontSize: 16
  },
  sourceButtonWrapper: {
    marginTop: 12,
    flexDirection: 'row'
  },
  sourceButtonSpacer: {
    flex: 1
  },
  sourceButton: {
    justifyContent: 'flex-end'
  },
  sourceButtonIcon: {
    color: '#aaa'
  },
  footer: {
  },
  footerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: 'transparent',
    borderTopColor: '#ddd'
  }
});
