import _ from 'lodash';
import ThunkMiddleware from 'redux-thunk';
import { combineReducers, applyMiddleware, createStore} from 'redux';

import { loadRecipes } from './actions';
import reducers from './reducers';

const rootReducer = combineReducers(reducers);

const store =  applyMiddleware(ThunkMiddleware)(createStore)(rootReducer);

export const initializeStore = _.once(() => {
  const recipeIds = [];

  store.dispatch(loadRecipes());
});

export default store;
