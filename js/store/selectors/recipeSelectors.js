import _ from 'lodash';
import { createSelector } from 'reselect';
import log from 'loglevel';

import { ANY_BASE_LIQUOR } from '../../definitions';
import {
  selectBaseLiquorFilter,
  selectRecipeSearchTerm,
  selectIngredientsByTag,
  selectRecipesById
} from './basicSelectors';

// hee hee
const _nofilter = () => true;

const WHITESPACE_REGEX = /\s+/g;

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

export const selectAlphabeticalRecipes = createSelector(
  selectRecipesById,
  (recipesById) => _.chain(recipesById).values().sortBy('sortName').value()
);

export const selectFilteredAlphabeticalRecipes = createSelector(
  selectAlphabeticalRecipes,
  _selectCreateBaseLiquorFilterer,
  _selectCreateRecipeSearchTermFilterer,
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
  _selectCreateBaseLiquorFilterer,
  _selectCreateRecipeSearchTermFilterer,
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

