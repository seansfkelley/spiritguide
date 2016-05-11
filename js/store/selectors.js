import _ from 'lodash';
import { createSelector } from 'reselect';

const selectRecipesById = (state) => state.recipes.recipesById;

export const selectAlphabeticalRecipes = createSelector(
  selectRecipesById,
  (recipesById) => _.chain(recipesById).values().sortBy('sortName').value()
);

export const selectGroupedAlphabeticalRecipes = createSelector(
  selectAlphabeticalRecipes,
  (alphabeticalRecipes) => {
    let groups = [];
    alphabeticalRecipes.forEach((recipe, i) => {
      const newGroup = i === 0 || recipe.sortName[0] !== alphabeticalRecipes[i - 1].sortName[0];
      if (newGroup) {
        groups.push([ recipe ]);
      } else {
        groups[groups.length - 1].push(recipe);
      }
    })
    return groups;
  }
);
