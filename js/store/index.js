import _ from 'lodash';
import ThunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { combineReducers, applyMiddleware, createStore, compose } from 'redux';
import { AsyncStorage } from 'react-native';
import persistState, { mergePersistedState } from 'redux-localstorage-fix-localstorage-fork';
import adapter from 'redux-localstorage-fix-localstorage-fork/lib/adapters/AsyncStorage'
import filter from 'redux-localstorage-filter';
import debounce from 'redux-localstorage-debounce';

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

export default store;
