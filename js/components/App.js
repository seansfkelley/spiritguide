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
import {
  IOS_STATUS_BAR_HEIGHT,
  DEFAULT_SANS_SERIF_FONT_FAMILY,
  IOS_STATUS_BAR_BACKGROUND_COLOR,
  IOS_STATUS_BAR_STYLE
} from './constants';
import {
  selectFilteredAlphabeticalRecipes,
  selectFilteredGroupedAlphabeticalRecipes,
  selectGroupedIngredients,
  selectRecipeSearchTerm
} from '../store/selectors';
import * as filterActions from '../store/actions/filterActions';
import { ANY_BASE_LIQUOR, BASE_LIQUORS } from '../definitions';
import { recipe, ingredient } from './propTypes';
import SwipeSelector from './SwipeSelector';
import RecipeList from './RecipeList';
import SwipableRecipeCards from './SwipableRecipeCards';
import IngredientConfigurator from './IngredientConfigurator';

const RouteType = enumeration(
  'RECIPE_LIST',
  'RECIPE_CARDS'
);

const BASE_LIQUOR_OPTIONS = [ ANY_BASE_LIQUOR ].concat(BASE_LIQUORS).map(l => ({
  label: l.toUpperCase(),
  value: l
}));

@PureRender
class App extends React.Component {
  static propTypes = {
    initialLoadComplete: React.PropTypes.bool.isRequired,
    filteredAlphabeticalRecipes: React.PropTypes.arrayOf(recipe).isRequired,
    filteredGroupedAlphabeticalRecipes: React.PropTypes.arrayOf(React.PropTypes.shape({
      groupName: React.PropTypes.string.isRequired,
      recipes: React.PropTypes.arrayOf(recipe).isRequired
    })).isRequired,
    groupedIngredients: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      ingredients: React.PropTypes.arrayOf(ingredient).isRequired
    })).isRequired,
    selectedIngredientTags: React.PropTypes.objectOf(React.PropTypes.bool).isRequired,
    filterActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
    recipeSearchTerm: React.PropTypes.string.isRequired
  };

  render() {
    if (this.props.initialLoadComplete) {
      return (
        <Navigator
          initialRoute={{ type: RouteType.RECIPE_LIST, sectionIndex: 1, rowIndex: 7 }}
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
        const menu = <IngredientConfigurator
          groupedIngredients={this.props.groupedIngredients}
          selectedIngredientTags={this.props.selectedIngredientTags}
          onIngredientStateChange={this._onIngredientToggle}
          style={styles.ingredientSidebar}
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
            <View style={[ styles.container, styles.dropShadow ]}>
              <View style={styles.statusBarSpacer}/>
              <StatusBar hidden={false} barStyle={IOS_STATUS_BAR_STYLE}/>
              <SwipeSelector
                style={styles.baseSelector}
                options={BASE_LIQUOR_OPTIONS}
                optionWidth={125}
                optionStyle={styles.baseSelectorOption}
                selectedOptionStyle={styles.selectedBaseSelectorOption}
                onOptionSelect={this._onBaseLiquorChange}
              />
              <RecipeList
                groupedRecipes={this.props.filteredGroupedAlphabeticalRecipes}
                onPress={this._onRecipePress.bind(this, navigator)}
                onSearchTermChange={this.props.filterActions.setRecipeSearchTerm}
                ref={(c) => this._recipeList = c}
              />
            </View>
          </SideMenu>
        );

      case RouteType.RECIPE_CARDS:
        const initialIndex = this.props.filteredGroupedAlphabeticalRecipes.slice(0, route.sectionIndex)
          .map(section => section.recipes.length)
          .reduce((a, b) => a + b, 0) + route.rowIndex;
        return (
          <View style={styles.container}>
            <StatusBar hidden={true} barStyle={IOS_STATUS_BAR_STYLE}/>
            <SwipableRecipeCards
              recipes={this.props.filteredAlphabeticalRecipes}
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

  _onBaseLiquorChange = (type) => {
    this.props.filterActions.setBaseLiquorFilter(type);
    if (this._recipeList) {
      this._recipeList.scrollToTop(!!this.props.recipeSearchTerm);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  dropShadow: {
    shadowColor: 'black',
    shadowRadius: 2,
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.5
  },
  statusBarSpacer: {
    height: IOS_STATUS_BAR_HEIGHT,
    backgroundColor: IOS_STATUS_BAR_BACKGROUND_COLOR
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ingredientSidebar: {
    paddingTop: IOS_STATUS_BAR_HEIGHT,
    backgroundColor: IOS_STATUS_BAR_BACKGROUND_COLOR
  },
  baseSelector: {
    backgroundColor: IOS_STATUS_BAR_BACKGROUND_COLOR
  },
  baseSelectorOption: {
    backgroundColor: IOS_STATUS_BAR_BACKGROUND_COLOR,
    color: '#ddd',
    fontFamily: DEFAULT_SANS_SERIF_FONT_FAMILY,
    fontSize: 16,
    fontWeight: '600'
  },
  selectedBaseSelectorOption: {
    color: '#eee',
    fontWeight: '700'
  }
});

function mapStateToProps(state) {
  return {
    initialLoadComplete: state.app.initialLoadComplete,
    filteredAlphabeticalRecipes: selectFilteredAlphabeticalRecipes(state),
    filteredGroupedAlphabeticalRecipes: selectFilteredGroupedAlphabeticalRecipes(state),
    groupedIngredients: selectGroupedIngredients(state),
    selectedIngredientTags: state.filters.selectedIngredientTags,
    recipeSearchTerm: selectRecipeSearchTerm(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    filterActions: bindActionCreators(filterActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
