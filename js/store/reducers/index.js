import _ from 'lodash';
import update from 'immutability-helper';

import app from './appReducer';
import filters from './filtersReducer';
import recipes from './recipesReducer';
import ingredients from './ingredientsReducer';

update.extend('$without', (item, array) => _.without(array, item));
update.extend('$omit', (key, object) => _.omit(object, key));

export default {
  app,
  filters,
  recipes,
  ingredients
};
