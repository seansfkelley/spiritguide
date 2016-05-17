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

export const selectIngredientsByTag = (state) => state.ingredients.ingredientsByTag;

export const selectOrderedIngredientGroups = (state) => state.ingredients.orderedIngredientGroups;

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
