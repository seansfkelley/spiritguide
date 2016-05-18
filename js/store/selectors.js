import _ from 'lodash';
import { createSelector } from 'reselect';

import { ANY_BASE_LIQUOR } from '../definitions';

// hee hee
function nofilter() {
  return true;
}

function makeBaseLiquorFilterer(baseLiquor) {
  if (baseLiquor === ANY_BASE_LIQUOR) {
    return nofilter;
  } else {
    return (recipe) => {
      if (_.isString(recipe.base)) {
        return recipe.base == baseLiquor;
      } else if (_.isArray(recipe.base)) {
        return recipe.base.indexOf(baseLiquor) !== -1;
      } else {
        log.warn(`recipe '${recipe.name}' has a non-string, non-array base: ${recipe.base}`);
        return false;
      }
    };
  }
}

export const selectBaseLiquorFilter = (state) => state.filters.baseLiquorFilter;

export const selectRecipesById = (state) => state.recipes.recipesById;

export const selectAlphabeticalRecipes = createSelector(
  selectRecipesById,
  (recipesById) => _.chain(recipesById).values().sortBy('sortName').value()
);

export const selectFilteredAlphabeticalRecipes = createSelector(
  selectBaseLiquorFilter,
  selectAlphabeticalRecipes,
  (baseLiquorFilter, alphabeticalRecipes) => {
    return alphabeticalRecipes.filter(makeBaseLiquorFilterer(baseLiquorFilter));
  }
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

export const selectFilteredGroupedAlphabeticalRecipes = createSelector(
  selectBaseLiquorFilter,
  selectGroupedAlphabeticalRecipes,
  (baseLiquorFilter, groupedAlphabeticalRecipes) => {
    return groupedAlphabeticalRecipes
    .map(group => ({
      groupName: group.groupName,
      recipes: group.recipes.filter(makeBaseLiquorFilterer(baseLiquorFilter))
    }))
    .filter(({ recipes }) => recipes.length > 0);
  }
);

export const selectSelectedIngredientTags = (state) => state.filters.selectedIngredientTags;

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
