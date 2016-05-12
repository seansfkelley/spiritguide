import React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
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
    const { width, height } = Dimensions.get('window');
    const fullScreen = { width, height };
    return (
      <ScrollView
        style={styles.container}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
      >
        {this.props.recipes.map(recipe =>
          <RecipeCard recipe={recipe} style={[ fullScreen, styles.card ]} key={recipe.recipeId}/>)
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  card: {
    overflow: 'hidden'
  }
});
