import _ from 'lodash';
import update from 'immutability-helper';

import app from './app';
import filters from './filters';
import recipes from './recipes';
import ingredients from './ingredients';

update.extend('$without', (item, array) => _.without(array, item));
update.extend('$omit', (key, object) => _.omit(object, key));

export default {
  app,
  filters,
  recipes,
  ingredients
};
