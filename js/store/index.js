import _ from 'lodash';
import ThunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { combineReducers, applyMiddleware, createStore} from 'redux';
import Promise from 'bluebird';
import { AsyncStorage } from 'react-native';

import { getDefaultRecipeIds, bulkLoad } from '../db/recipes';
import { loadRecipes } from './actions';
import reducers from './reducers';

const rootReducer = combineReducers(reducers);

const middlewares = [
  ThunkMiddleware,
  createLogger({
    actionTransformer: action => _.defaults({ type: action.type.toString() }, action)
  })
]

const store =  applyMiddleware(...middlewares)(createStore)(rootReducer);

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
    store.dispatch(loadRecipes(recipeIds));
  });
});

export default store;
