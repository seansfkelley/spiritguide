import React from 'react';
import {
  View,
  Navigator,
  StatusBar,
  ActivityIndicatorIOS,
  StyleSheet
} from 'react-native';
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
    initialLoadComplete: React.PropTypes.bool.isRequired,
    alphabeticalRecipes: React.PropTypes.arrayOf(recipe).isRequired,
    groupedAlphabeticalRecipes: React.PropTypes.arrayOf(React.PropTypes.arrayOf(recipe)).isRequired
  };

  render() {
    if (this.props.initialLoadComplete) {
      return (
        <Navigator
          initialRoute={{ type: RouteType.RECIPE_CARDS, sectionIndex: 1, rowIndex: 7 }}
          configureScene={this._configureScene}
          renderScene={this._renderScene}
        />
      );
    } else {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicatorIOS size='large'/>
        </View>
      );
    }
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
      console.log(this.props);
        const initialIndex = this.props.groupedAlphabeticalRecipes.slice(0, route.sectionIndex)
          .map(section => section.length)
          .reduce((a, b) => a + b, 0) + route.rowIndex;
          console.log(initialIndex);
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

function mapStateToProps(state) {
  return {
    initialLoadComplete: state.app.initialLoadComplete,
    alphabeticalRecipes: selectAlphabeticalRecipes(state),
    groupedAlphabeticalRecipes: selectGroupedAlphabeticalRecipes(state)
  };
}

export default connect(mapStateToProps)(App);
