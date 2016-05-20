import _ from 'lodash';
import ThunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { combineReducers, applyMiddleware, createStore, compose } from 'redux';
import Promise from 'bluebird';
import { AsyncStorage } from 'react-native';
import persistState, { mergePersistedState } from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/AsyncStorage'
import filter from 'redux-localstorage-filter';
import debounce from 'redux-localstorage-debounce';

import { getDefaultRecipeIds, bulkLoad } from '../db/recipes';
import {
  loadRecipes,
  initialLoadComplete,
  loadIngredientGroups,
  loadIngredientsByTag
} from './actions';
import reducers from './reducers';

const storage = compose(
  debounce(250),
  filter([ 'filters' ]),
)(adapter(AsyncStorage));

const middlewares = [
  ThunkMiddleware,
  createLogger({
    actionTransformer: action => _.defaults({ type: action.type.toString() }, action),
    collapsed: true
  })
];

const rootReducer = compose(
  mergePersistedState((initial, persisted) => _.merge({}, initial, persisted))
)(combineReducers(reducers));

const store = compose(
  persistState(storage, 'spiritguide-serialized-store'),
  applyMiddleware(...middlewares)
)(createStore)(rootReducer);

const SAVED_RECIPE_IDS_KEY = 'spiritguide-saved-recipe-ids';

export const initializeStore = _.once(() => {
  Promise.resolve(AsyncStorage.getItem(SAVED_RECIPE_IDS_KEY))
  .then(recipeIds => {
    return JSON.parse(recipeIds || 'null') || getDefaultRecipeIds();
  })
  .then(recipeIds => {
    return AsyncStorage.setItem(SAVED_RECIPE_IDS_KEY, JSON.stringify(recipeIds)).then(() => recipeIds);
  })
  .then(recipeIds => {
    return Promise.all([
      store.dispatch(loadRecipes(recipeIds)),
      // These two have an ordering constraint.
      store.dispatch(loadIngredientGroups())
      .then(() => {
        return store.dispatch(loadIngredientsByTag())
      })
    ]);
  })
  .then(() => {
    store.dispatch(initialLoadComplete());
  });
});

export default store;
