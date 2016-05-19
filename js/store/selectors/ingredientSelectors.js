import _ from 'lodash';
import { createSelector } from 'reselect';

import {
  selectIngredientsByTag,
  selectOrderedIngredientGroups
} from './basicSelectors';

const _displaySort = (i) => i.display.toLowerCase();

export const selectGroupedIngredients = createSelector(
  selectIngredientsByTag,
  selectOrderedIngredientGroups,
  (ingredientsByTag, orderedIngredientGroups) =>
    _.chain(ingredientsByTag)
      .filter('tangible')
      .sortBy(_displaySort)
      .groupBy('group')
      .map((ingredients, groupTag) => ({
        name: _.find(orderedIngredientGroups, { type: groupTag }).display,
        ingredients
      }))
      .sortBy(({ name }) => _.findIndex(orderedIngredientGroups, { display: name }))
      .value()
)
