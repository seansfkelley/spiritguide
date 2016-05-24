import React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import PureRender from 'pure-render-decorator';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  DEFAULT_SERIF_FONT_FAMILY,
  IOS_STATUS_BAR_BACKGROUND_COLOR
} from './constants';
import { recipe } from './propTypes';
import RecipeCard from './RecipeCard';
import { selectFavoritedRecipeIds } from '../store/selectors';
import * as recipeActions from '../store/actions/recipeActions';

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
    const { width } = Dimensions.get('window');
    const cardStyle = [{ width }, styles.card];
    return (
      <View style={styles.container}>
        <View style={styles.header}/>
        <ScrollView
          style={styles.scroll}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={this._onScroll}
          scrollEventThrottle={100}
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
    const { width } = Dimensions.get('window');
    this.refs.scroll.scrollTo({
      x: width * this.props.initialIndex,
      y: 0,
      animated: false
    });
  }

  _onScroll = (event) => {
    const { width } = Dimensions.get('window');
    const xOffset = event.nativeEvent.contentOffset.x;
    this.setState({
      currentIndex: Math.floor((xOffset + width / 2) / width)
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 44,
    backgroundColor: IOS_STATUS_BAR_BACKGROUND_COLOR
  },
  recipeTitle: {
    fontFamily: DEFAULT_SERIF_FONT_FAMILY,
    fontSize: 20,
    color: '#eee'
  },
  scroll: {
    flex: 1
  },
  card: {
    flex: 1,
    overflow: 'hidden'
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
