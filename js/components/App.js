import React from 'react';
import { View, Navigator, StatusBar, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PureRender from 'pure-render-decorator';

import enumeration from '../util/enum';
import { IOS_STATUS_BAR_HEIGHT } from './constants';
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
        initialRoute={{ type: RouteType.RECIPE_LIST, sectionIndex: 0, rowIndex: 0 }}
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
        return (
          <View style={styles.container}>
            <View style={styles.statusBarSpacer}/>
            <StatusBar hidden={false}/>
            <RecipeList
              recipes={this.props.groupedAlphabeticalRecipes}
              onPress={this._onRecipePress.bind(this, navigator)}
            />
          </View>
        );

      case RouteType.RECIPE_CARDS:
        const initialIndex = this.props.groupedAlphabeticalRecipes.slice(0, route.sectionIndex)
          .map(section => section.length)
          .reduce((a, b) => a + b, 0) + route.rowIndex;
        return (
          <View style={styles.container}>
            <StatusBar hidden={true}/>
            <SwipableRecipeCards
              recipes={this.props.alphabeticalRecipes}
              initialIndex={initialIndex}
            />
          </View>
        );

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

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBarSpacer: {
    height: IOS_STATUS_BAR_HEIGHT
  }
});

function mapStateToProps(state) {
  return {
    alphabeticalRecipes: selectAlphabeticalRecipes(state),
    groupedAlphabeticalRecipes: selectGroupedAlphabeticalRecipes(state)
  };
}

export default connect(mapStateToProps)(App);
