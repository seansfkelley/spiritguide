import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';

import { recipe } from './propTypes';
import RecipeCard from './RecipeCard';

@PureRender
export default class SwipableRecipeCards extends React.Component {
  static propTypes = {
    recipes: React.PropTypes.arrayOf(recipe).isRequired,
    initialIndex: React.PropTypes.number.isRequired
  };

  render() {
    return (
      <ScrollView
        style={styles.container}
        horizontal={true}
      >
        {this.props.recipes.map(recipe =>
          <RecipeCard recipe={recipe} style={styles.card} key={recipe.recipeId}/>)
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  card: {
    width: 300
  }
});
