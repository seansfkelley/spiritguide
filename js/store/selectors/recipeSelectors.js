import _ from 'lodash';
import { createSelector } from 'reselect';

import { ANY_BASE_LIQUOR } from '../../definitions';
import recipeMatchesSearchTerm from './recipeMatchesSearchTerm';
import {
  selectBaseLiquorFilter,
  selectRecipeSearchTerm,
  selectIngredientsByTag,
  selectRecipesById
} from './basicSelectors';

// hee hee
const _nofilter = () => true;

const selectCreateBaseLiquorFilterer = createSelector(
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

const selectCreateRecipeSearchTermFilterer = createSelector(
  selectRecipeSearchTerm,
  selectIngredientsByTag,
  (searchTerm, ingredientsByTag) => {
    searchTerm = searchTerm.trim();
    if (searchTerm) {
      return (recipe) => {
        return recipeMatchesSearchTerm(recipe, searchTerm, ingredientsByTag);
      };
    } else {
      return _nofilter;
    }
  }
);

export const selectAlphabeticalRecipes = createSelector(
  selectRecipesById,
  (recipesById) => _.chain(recipesById).values().sortBy('sortName').value()
);

export const selectFilteredAlphabeticalRecipes = createSelector(
  selectAlphabeticalRecipes,
  selectCreateBaseLiquorFilterer,
  selectCreateRecipeSearchTermFilterer,
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
  selectGroupedAlphabeticalRecipes,
  selectCreateBaseLiquorFilterer,
  selectCreateRecipeSearchTermFilterer,
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

