import _ from 'lodash';
import ThunkMiddleware from 'redux-thunk';
import { combineReducers, applyMiddleware, createStore} from 'redux';
import Promise from 'bluebird';

import { getDefaultRecipeIds, bulkLoad } from '../db/recipes';
import { loadRecipes } from './actions';
import reducers from './reducers';

const rootReducer = combineReducers(reducers);

const store =  applyMiddleware(ThunkMiddleware)(createStore)(rootReducer);

export const initializeStore = _.once(() => {
  getDefaultRecipeIds()
  .then(recipeIds => {
    store.dispatch(loadRecipes(recipeIds));
  });
});

export default store;
