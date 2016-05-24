import _ from 'lodash';
import React from 'react';
import { View, ListView, ScrollView, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PureRender from 'pure-render-decorator';

import { shallowEqualHasChanged } from './util/listViewDataSourceUtils';
import { recipe } from './propTypes';
import {
  DEFAULT_SERIF_FONT_FAMILY,
  DEFAULT_SANS_SERIF_FONT_FAMILY,
  IOS_STATUS_BAR_BACKGROUND_COLOR
} from './constants';
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
            ? <Icon.Button
                style={styles.sourceButton}
                name='external-link'
                onPress={this._openUrl}
              >
                {recipe.source}
              </Icon.Button>
            : null
          }
        </ScrollView>
        <View style={styles.footer}>
          <Icon.Button
            style={styles.footerButton}
            name={this.props.isFavorited ? 'star' : 'star-o'}
            onPress={this.props.onFavoriteChange.bind(this, recipe.recipeId, !this.props.isFavorited)}
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

  _openUrl = () => {
    Linking.openURL(this.props.recipe.url);
  };
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
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
    paddingTop: 10,
    paddingHorizontal: 10
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
  sourceButton: {
    marginTop: 12
  },
  footer: {
    height: 44
  },
  footerButton: {
    flex: 1
  }
});
