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
      const maybeNewGroupName = recipe.sortName[0].toUpperCase();
      const newGroup = i === 0 || maybeNewGroupName !== groups[groups.length - 1].groupName;
      if (newGroup) {
        groups.push({
          groupName: maybeNewGroupName,
          recipes: [ recipe ]
        });
      } else {
        groups[groups.length - 1].recipes.push(recipe);
      }
    })
    return groups;
  }
);
