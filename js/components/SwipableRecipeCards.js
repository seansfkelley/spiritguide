import React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PureRender from 'pure-render-decorator';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  DEFAULT_SERIF_FONT_FAMILY,
  IOS_STATUS_BAR_BACKGROUND_COLOR
} from './constants';
import { recipe, ingredient, ingredientSplits } from './propTypes';
import RecipeCard from './RecipeCard';
import {
  selectFavoritedRecipeIds,
  selectIngredientsByTag,
  selectIngredientSplitsByRecipeId
} from '../store/selectors';
import * as recipeActions from '../store/actions/recipeActions';

@PureRender
class SwipableRecipeCards extends React.Component {
  static propTypes = {
    initialRecipes: React.PropTypes.arrayOf(recipe).isRequired,
    initialIndex: React.PropTypes.number.isRequired,
    favoritedRecipeIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    ingredientSplitsByRecipeId: React.PropTypes.objectOf(ingredientSplits).isRequired,
    ingredientsByTag: React.PropTypes.objectOf(ingredient).isRequired
  };

  state = {
    recipes: this.props.initialRecipes,
    currentIndex: this.props.initialIndex
  };

  render() {
    const { width, height } = Dimensions.get('window');
    const cardStyle = [{ width, height }, styles.card];
    return (
      <View style={styles.container}>
        <View style={[ styles.header, styles.headerBackground ]}/>
        <ScrollView
          style={styles.scroll}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={this._onScroll}
          scrollEventThrottle={250}
          ref='scroll'
        >
          {this.state.recipes.map((recipe, i) =>
            Math.abs(i - this.state.currentIndex) <= 2
              ? <RecipeCard
                  recipe={recipe}
                  ingredientSplits={this.props.ingredientSplitsByRecipeId[recipe.recipeId]}
                  ingredientsByTag={this.props.ingredientsByTag}
                  style={cardStyle}
                  key={recipe.recipeId}
                  isFavorited={this.props.favoritedRecipeIds.indexOf(recipe.recipeId) !== -1}
                  onFavoriteChange={this.props.recipeActions.setFavoriteRecipe}
                  onShare={console.log.bind(console)}
                />
              : <View style={cardStyle} key={recipe.recipeId}/> // Placeholder.
          )}
        </ScrollView>
        <View style={[ styles.header, styles.headerWithButtons ]}>
          <Icon.Button
            style={styles.headerButtonIcon}
            iconStyle={[
              styles.headerButtonIcon,
              this.state.currentIndex === 0 ? styles.headerButtonDisabled : null
            ]}
            name='chevron-left'
            onPress={this._changeIndex.bind(this, -1)}
            {...buttonStyles}
          />
          <View style={styles.headerSpacer}/>
          <Icon.Button
            style={styles.headerButton}
            iconStyle={[
              styles.headerButtonIcon,
              this.state.currentIndex === this.state.recipes.length - 1 ? styles.headerButtonDisabled : null
            ]}
            name='chevron-right'
            onPress={this._changeIndex.bind(this, 1)}
            {...buttonStyles}
          />
        </View>
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
    const currentIndex = Math.floor((xOffset + width / 2) / width);
    if (currentIndex >= 0 && currentIndex < this.state.recipes.length) {
      this.setState({ currentIndex });
    }
  };

  _changeIndex = (indexChange) => {
    const targetIndex = this.state.currentIndex + indexChange;
    if (targetIndex >= 0 && targetIndex < this.state.recipes.length) {
      const { width } = Dimensions.get('window');
      this.refs.scroll.scrollTo({
        x: width * targetIndex,
        y: 0,
        animated: true
      });
    }
  };
}

const buttonStyles = {
  color: '#eee',
  backgroundColor: 'transparent',
  borderRadius: 0
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 44
  },
  headerBackground: {
    backgroundColor: IOS_STATUS_BAR_BACKGROUND_COLOR
  },
  headerWithButtons: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonDisabled: {
    color: '#999'
  },
  headerButtonIcon: {
    marginRight: 0
  },
  headerSpacer: {
    flex: 1
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
    overflow: 'hidden'
  }
});

function mapStateToProps(state) {
  return {
    favoritedRecipeIds: selectFavoritedRecipeIds(state),
    ingredientsByTag: selectIngredientsByTag(state),
    ingredientSplitsByRecipeId: selectIngredientSplitsByRecipeId(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    recipeActions: bindActionCreators(recipeActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SwipableRecipeCards);
