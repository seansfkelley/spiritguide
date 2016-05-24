import _ from 'lodash';
import { createSelector } from 'reselect';
import log from 'loglevel';

import { ANY_BASE_LIQUOR } from '../../definitions';
import {
  selectBaseLiquorFilter,
  selectRecipeSearchTerm,
  selectIngredientsByTag,
  selectRecipeIds,
  selectRecipesById,
  selectSelectedRecipeList,
  selectFavoritedRecipeIds,
  selectSelectedIngredientTags
} from './basicSelectors';
import ingredientSplitsByRecipeId from './ingredientSplitsByRecipeId';

// hee hee
const _nofilter = () => true;

const WHITESPACE_REGEX = /\s+/g;

export const selectAlphabeticalRecipes = createSelector(
  selectRecipeIds,
  selectRecipesById,
  (recipeIds, recipesById) => _.chain(recipesById).pick(recipeIds).values().sortBy('sortName').value()
);

export const selectIngredientSplitsByRecipeId = createSelector(
  selectAlphabeticalRecipes,
  selectIngredientsByTag,
  selectSelectedIngredientTags,
  (alphabeticalRecipes, ingredientsByTag, selectedIngredientTags) => {
    const tagList = _.keys(_.pickBy(selectedIngredientTags));
    return ingredientSplitsByRecipeId(alphabeticalRecipes, ingredientsByTag, tagList);
  }
);

// Exported for testing.
export const _selectCreateBaseLiquorFilterer = createSelector(
  selectBaseLiquorFilter,
  (baseLiquor) => {
    if (baseLiquor === ANY_BASE_LIQUOR) {
      return _nofilter;
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
);

// Exported for testing.
export const _selectCreateRecipeSearchTermFilterer = createSelector(
  selectRecipeSearchTerm,
  selectIngredientsByTag,
  (searchTerm, ingredientsByTag) => {
    searchTerm = _.deburr(searchTerm).trim().toLowerCase();
    if (searchTerm) {
      const terms = _.compact(searchTerm.split(WHITESPACE_REGEX));

      return (recipe) => {
        const searchable = _.chain(recipe.ingredients)
          .map('tag')
          .map((t) => ingredientsByTag[t] ? ingredientsByTag[t].searchable : null)
          .compact()
          .flatten()
          .concat(recipe.canonicalName.split(WHITESPACE_REGEX))
          .value()

      return _.every(terms, (t) => _.some(searchable, (s) => s.indexOf(t) !== -1));
      };
    } else {
      return _nofilter;
    }
  }
);

// Exported for testing.
// TODO: Is there a different way to organize this such that we don't incur the cost of computing the
// ingredient splits if we're not actually going to use it?
export const _selectCreateRecipeListFilterer = createSelector(
  selectSelectedRecipeList,
  selectFavoritedRecipeIds,
  selectIngredientSplitsByRecipeId,
  (selectedRecipeList, favoritedRecipeIds, ingredientSplitsByRecipeId) => {
    switch (selectedRecipeList) {
      // TODO: Use a real enumeration.
      case 'all':
        return _nofilter;

      case 'mixable':
        return (recipe) => ingredientSplitsByRecipeId[recipe.recipeId].missing.length === 0;

      case 'favorites':
        return (recipe) => favoritedRecipeIds.indexOf(recipe.recipeId) !== -1;

      case 'custom':
        return (recipe) => !!recipe.isCustom;
    }
  }
);

export const selectFilteredAlphabeticalRecipes = createSelector(
  selectAlphabeticalRecipes,
  _selectCreateBaseLiquorFilterer,
  _selectCreateRecipeSearchTermFilterer,
  _selectCreateRecipeListFilterer,
  (alphabeticalRecipes, ...filterers) => {
    let recipes = alphabeticalRecipes;
    filterers.forEach(fn => { recipes = recipes.filter(fn) });
    return recipes;
  }
);

export const selectGroupedAlphabeticalRecipes = createSelector(
  selectAlphabeticalRecipes,
  (alphabeticalRecipes) => {
    let groups = [];
    alphabeticalRecipes.forEach((recipe, i) => {
      const sortCharacter = recipe.sortName[0].toUpperCase();
      const maybeNewGroupName = /\d/.test(sortCharacter) ? '#' : sortCharacter;
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
  selectGroupedAlphabeticalRecipes,
  _selectCreateBaseLiquorFilterer,
  _selectCreateRecipeSearchTermFilterer,
  _selectCreateRecipeListFilterer,
  (groupedAlphabeticalRecipes, ...filterers) => {
    return groupedAlphabeticalRecipes
    .map(group => {
      let recipes = group.recipes;
      filterers.forEach(fn => { recipes = recipes.filter(fn)});
      return {
        groupName: group.groupName,
        recipes
      };
    })
    .filter(({ recipes }) => recipes.length > 0);
  }
);

