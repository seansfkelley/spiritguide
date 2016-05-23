import React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import PureRender from 'pure-render-decorator';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { recipe } from './propTypes';
import RecipeCard from './RecipeCard';
import { selectFavoritedRecipeIds } from '../store/selectors';
import * as recipeActions from '../store/actions/recipeActions';

const OVERFLOW_VISIBLE = 30;
const INTER_CARD_SPACING = 8;

// TODO: Replace this with horizontal ListView.
@PureRender
class SwipableRecipeCards extends React.Component {
  static propTypes = {
    initialRecipes: React.PropTypes.arrayOf(recipe).isRequired,
    initialIndex: React.PropTypes.number.isRequired,
    favoritedRecipeIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  };

  state = {
    recipes: this.props.initialRecipes,
    currentIndex: this.props.initialIndex
  };

  render() {
    const { width, height } = Dimensions.get('window');
    const containerSizing = { width, height };
    const cardSizing = {
      height: height - 2 * OVERFLOW_VISIBLE,
      width: width - 2 * (OVERFLOW_VISIBLE + INTER_CARD_SPACING)
    };
    const cardStyle = [ cardSizing, styles.card ];
    return (
      <View style={[ containerSizing, styles.container ]}>
        <ScrollView
          style={styles.scroll}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={this._onScroll}
          scrollEventThrottle={500}
          ref='scroll'
        >
          {this.state.recipes.map((recipe, i) =>
            Math.abs(i - this.state.currentIndex) <= 2
              ? <RecipeCard
                  recipe={recipe}
                  style={cardStyle}
                  key={recipe.recipeId}
                  isFavorited={this.props.favoritedRecipeIds.indexOf(recipe.recipeId) !== -1}
                  onFavoriteChange={this.props.recipeActions.setFavoriteRecipe}
                  onShare={console.log.bind(console)}
                />
              : <View style={cardStyle} key={recipe.recipeId}/> // Placeholder.
          )}
        </ScrollView>
      </View>
    );
  }

  componentDidMount() {
    this.refs.scroll.scrollTo({
      x: this._computePageSize() * this.props.initialIndex,
      y: 0,
      animated: false
    });
  }

  _computePageSize() {
    return Dimensions.get('window').width - 2 * OVERFLOW_VISIBLE;
  }

  _onScroll = (event) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const pageSize = this._computePageSize();
    this.setState({
      currentIndex: Math.floor((xOffset + pageSize / 2) / pageSize)
    });
  };
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

function mapStateToProps(state) {
  return {
    favoritedRecipeIds: selectFavoritedRecipeIds(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    recipeActions: bindActionCreators(recipeActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SwipableRecipeCards);
