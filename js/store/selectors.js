import _ from 'lodash';
import { createSelector } from 'reselect';

const selectRecipesById = (state) => state.recipes.recipesById;

export const selectAlphabeticalRecipes = createSelector(
  selectRecipesById,
  (recipesById) => _.chain(recipesById).values().sortBy('sortName').value()
);
