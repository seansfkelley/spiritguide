import _ from 'lodash';
import ThunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { combineReducers, applyMiddleware, createStore, compose } from 'redux';
import Promise from 'bluebird';
import { AsyncStorage } from 'react-native';
import persistState, { mergePersistedState } from 'redux-localstorage-fix-localstorage-fork';
import adapter from 'redux-localstorage-fix-localstorage-fork/lib/adapters/AsyncStorage'
import filter from 'redux-localstorage-filter';
import debounce from 'redux-localstorage-debounce';

import { getDefaultRecipeIds, bulkLoad } from '../db/recipes';
import {
  setRecipeIds,
  loadRecipes,
  initialLoadComplete,
  loadIngredientGroups,
  loadIngredientsByTag
} from './actions';
import {
  selectRecipeIds,
  selectIsStateHydrated
} from './selectors';
import reducers from './reducers';

const storage = compose(
  debounce(250),
  filter([ 'filters', 'recipes.recipeIds', 'recipes.favoritedRecipeIds' ]),
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
  applyMiddleware(...middlewares),
  persistState(storage, 'spiritguide-serialized-store')
)(createStore)(rootReducer);

const SAVED_RECIPE_IDS_KEY = 'spiritguide-saved-recipe-ids';

export const initializeStore = _.once(() => {
  const initializationPromise = new Promise((resolve, reject) => {
    function loadData() {
      Promise.resolve()
      .then(() => {
        const recipeIds = selectRecipeIds(store.getState());
        if (!recipeIds || !recipeIds.length) {
          return getDefaultRecipeIds();
        } else {
          return recipeIds;
        }
      })
      .then(recipeIds => {
        return Promise.all([
          store.dispatch(setRecipeIds(recipeIds)),
          store.dispatch(loadRecipes(recipeIds)),
          // These two have an ordering constraint.
          store.dispatch(loadIngredientGroups())
          .then(() => {
            return store.dispatch(loadIngredientsByTag())
          })
        ])
      })
      .then(() => {
        return store.dispatch(initialLoadComplete());
      })
      .then(resolve)
      .catch(reject);
    }

    if (selectIsStateHydrated(store.getState())) {
      loadData();
    } else {
      const unsubscribe = store.subscribe(() => {
        if (selectIsStateHydrated(store.getState())) {
          unsubscribe();
          loadData();
        }
      });
    }
  });

  return initializationPromise;
});

export default store;
