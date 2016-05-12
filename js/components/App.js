import React from 'react';
import { Navigator } from 'react-native';
import { connect } from 'react-redux';
import PureRender from 'pure-render-decorator';

import enumeration from '../util/enum';
import {
  selectAlphabeticalRecipes,
  selectGroupedAlphabeticalRecipes
} from '../store/selectors';
import { recipe } from './propTypes';
import RecipeList from './RecipeList';
import SwipableRecipeCards from './SwipableRecipeCards';

const RouteType = enumeration(
  'RECIPE_LIST',
  'RECIPE_CARDS'
);

@PureRender
class App extends React.Component {
  static propTypes = {
    alphabeticalRecipes: React.PropTypes.arrayOf(recipe),
    groupedAlphabeticalRecipes: React.PropTypes.arrayOf(React.PropTypes.arrayOf(recipe))
  };

  render() {
    return (
      <Navigator
        initialRoute={{ type: RouteType.RECIPE_CARDS }}
        configureScene={this._configureScene}
        renderScene={this._renderScene}
      />
    );
  }

  _configureScene = (route, routeStack) => {
    switch (route.type) {
      case RouteType.RECIPE_LIST:
        return null;

      case RouteType.RECIPE_CARDS:
        return Navigator.SceneConfigs.FloatFromBottom;

      default:
        throw new Error('Cannot configure scene for route type ' + (route.type ? route.type.toString() : route.type));
    }
  };

  _renderScene = (route, navigator) => {
    switch (route.type) {
      case RouteType.RECIPE_LIST:
        return <RecipeList
          recipes={this.props.groupedAlphabeticalRecipes}
          onPress={this._onRecipePress.bind(this, navigator)}
        />;

      case RouteType.RECIPE_CARDS:
        const initialIndex = this.props.groupedAlphabeticalRecipes.slice(0, route.sectionIndex)
          .map(section => section.length)
          .reduce((a, b) => a + b, 0) + route.rowIndex;
        return <SwipableRecipeCards
          recipes={this.props.alphabeticalRecipes}
          initialIndex={initialIndex}
        />;

      default:
        throw new Error('Cannot render route type ' + (route.type ? route.type.toString() : route.type));
    }
  };

  _onRecipePress = (navigator, sectionIndex, rowIndex) => {
    navigator.push({
      type: RouteType.RECIPE_CARDS,
      sectionIndex,
      rowIndex
    });
  };
}

function mapStateToProps(state) {
  return {
    alphabeticalRecipes: selectAlphabeticalRecipes(state),
    groupedAlphabeticalRecipes: selectGroupedAlphabeticalRecipes(state)
  };
}

export default connect(mapStateToProps)(App);
