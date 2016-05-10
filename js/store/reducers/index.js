import _ from 'lodash';
import update from 'immutability-helper';

import app from './app';
import filters from './filters';
import recipes from './recipes';

update.extend('$without', (item, array) => _.without(array, item));

export default {
  app,
  filters,
  recipes
};
