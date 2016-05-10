import ThunkMiddleware from 'redux-thunk';
import { combineReducers, applyMiddleware, createStore} from 'redux';

import reducers from './reducers';

const rootReducer = combineReducers(reducers);

export default applyMiddleware(ThunkMiddleware)(createStore)(rootReducer);
