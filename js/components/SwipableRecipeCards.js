import React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import PureRender from 'pure-render-decorator';

import { recipe } from './propTypes';
import RecipeCard from './RecipeCard';

const OVERFLOW_VISIBLE = 30;
const INTER_CARD_SPACING = 8;

@PureRender
export default class SwipableRecipeCards extends React.Component {
  static propTypes = {
    recipes: React.PropTypes.arrayOf(recipe).isRequired,
    initialIndex: React.PropTypes.number.isRequired
  };

  render() {
    const { width, height } = Dimensions.get('window');
    const fullScreen = { width, height };
    const cardSizing = {
      height: height - 2 * OVERFLOW_VISIBLE,
      width: width - 2 * (OVERFLOW_VISIBLE + INTER_CARD_SPACING)
    };
    return (
      <View style={[ fullScreen, styles.container ]}>
        <ScrollView
          style={styles.scroll}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
        >
          {this.props.recipes.map(recipe =>
            <RecipeCard recipe={recipe} style={[ cardSizing, styles.card ]} key={recipe.recipeId}/>)
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: OVERFLOW_VISIBLE
  },
  scroll: {
    flex: 1,
    overflow: 'visible'
  },
  card: {
    overflow: 'hidden',
    marginHorizontal: INTER_CARD_SPACING
  }
});
