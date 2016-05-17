import React from 'react';
import {
  View,
  Navigator,
  StatusBar,
  ActivityIndicatorIOS,
  StyleSheet,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PureRender from 'pure-render-decorator';
import SideMenu from 'react-native-side-menu';

import enumeration from '../util/enum';
import { IOS_STATUS_BAR_HEIGHT } from './constants';
import {
  selectAlphabeticalRecipes,
  selectGroupedAlphabeticalRecipes,
  selectGroupedIngredients
} from '../store/selectors';
import * as filterActions from '../store/actions/filterActions';
import { BASE_LIQUORS } from '../definitions';
import { recipe, ingredient } from './propTypes';
import SwipeSelector from './SwipeSelector';
import RecipeList from './RecipeList';
import SwipableRecipeCards from './SwipableRecipeCards';
import IngredientConfigurator from './IngredientConfigurator';

const RouteType = enumeration(
  'RECIPE_LIST',
  'RECIPE_CARDS'
);

@PureRender
class App extends React.Component {
  static propTypes = {
    initialLoadComplete: React.PropTypes.bool.isRequired,
    alphabeticalRecipes: React.PropTypes.arrayOf(recipe).isRequired,
    groupedAlphabeticalRecipes: React.PropTypes.arrayOf(React.PropTypes.shape({
      groupName: React.PropTypes.string.isRequired,
      recipes: React.PropTypes.arrayOf(recipe).isRequired
    })).isRequired,
    groupedIngredients: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      ingredients: React.PropTypes.arrayOf(ingredient).isRequired
    })).isRequired,
    selectedIngredientTags: React.PropTypes.objectOf(React.PropTypes.bool).isRequired,
    filterActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired
  };

  render() {
    if (this.props.initialLoadComplete) {
      return (
        <Navigator
          initialRoute={{ type: RouteType.RECIPE_LIST, sectionIndex: 1, rowIndex: 7 }}
          configureScene={this._configureScene}
          renderScene={this._renderScene}
          sceneStyle={styles.navigator}
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
        const menu = <IngredientConfigurator
          groupedIngredients={this.props.groupedIngredients}
          selectedIngredientTags={this.props.selectedIngredientTags}
          onIngredientStateChange={this._onIngredientToggle}
        />;
        return (
          <SideMenu
            menu={menu}
            overlayAnimationStyle={(value, maxValue) => {
              return {
                backgroundColor: value.interpolate({
                  inputRange: [0, maxValue],
                  outputRange: [ 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.2)' ]
                })
              };
            }}
          >
            <View style={styles.container}>
              <View style={styles.statusBarSpacer}/>
              <StatusBar hidden={false}/>
              <SwipeSelector
                options={BASE_LIQUORS.map(l => ({ label: l, value: l }))}
                onSelect={console.log.bind(console)}
              />
              <RecipeList
                groupedRecipes={this.props.groupedAlphabeticalRecipes}
                onPress={this._onRecipePress.bind(this, navigator)}
              />
            </View>
          </SideMenu>
        );

      case RouteType.RECIPE_CARDS:
        const initialIndex = this.props.groupedAlphabeticalRecipes.slice(0, route.sectionIndex)
          .map(section => section.recipes.length)
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

  _onIngredientToggle = (tag, state) => {
    this.props.filterActions.setSelectedIngredientTags({
      [tag]: state
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
  },
  navigator: {
    backgroundColor: 'white'
  }
});

function mapStateToProps(state) {
  return {
    initialLoadComplete: state.app.initialLoadComplete,
    alphabeticalRecipes: selectAlphabeticalRecipes(state),
    groupedAlphabeticalRecipes: selectGroupedAlphabeticalRecipes(state),
    groupedIngredients: selectGroupedIngredients(state),
    selectedIngredientTags: state.filters.selectedIngredientTags
  };
}

function mapDispatchToProps(dispatch) {
  return {
    filterActions: bindActionCreators(filterActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
