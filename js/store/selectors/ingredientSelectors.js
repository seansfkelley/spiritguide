import _ from 'lodash';
import { createSelector } from 'reselect';

import assert from '../../../shared/tinyassert';

import {
  selectIngredientsByTag,
  selectOrderedIngredientGroups,
  selectIngredientSearchTerm
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

export const selectFilteredGroupedIngredients = createSelector(
  selectGroupedIngredients,
  selectIngredientSearchTerm,
  (groupedIngredients, searchTerm) => {
    assert(groupedIngredients);

    searchTerm = _.deburr(searchTerm.trim().toLowerCase());

    if (!searchTerm) {
      return groupedIngredients;
    }

    return groupedIngredients
      .map(({ name, ingredients }) => ({
        name,
        ingredients: ingredients.filter(i => _.some(i.searchable, term => term.indexOf(searchTerm) !== -1))
      }))
      .filter(({ ingredients }) => ingredients.length > 0);
  }
)
