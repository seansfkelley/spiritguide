import update from 'immutability-helper';

import ActionType from '../ActionType';
import { ANY_BASE_LIQUOR, RECIPE_LIST_TYPES } from '../../definitions';

const EMPTY_STORE = {
  recipeSearchTerm: '',
  ingredientSearchTerm: '',
  selectedIngredientTags: {},
  baseLiquorFilter: ANY_BASE_LIQUOR,
  selectedRecipeList: RECIPE_LIST_TYPES[0]
};

export default function reduceFilters(state = EMPTY_STORE, action) {
  switch(action.type) {
    case ActionType.SET_RECIPE_SEARCH_TERM:
      return update(state, {
        recipeSearchTerm: { $set: action.payload }
      });

    case ActionType.SET_INGREDIENT_SEARCH_TERM:
      return update(state, {
        ingredientSearchTerm: { $set: action.payload }
      });

    case ActionType.SET_SELECTED_INGREDIENT_TAGS:
      return update(state, {
        selectedIngredientTags: { $merge: action.payload }
      });

    case ActionType.SET_BASE_LIQUOR_FILTER:
      return update(state, {
        baseLiquorFilter: { $set: action.payload }
      });

    case ActionType.SET_SELECTED_RECIPE_LIST:
      return update(state, {
        selectedRecipeList: { $set: action.payload }
      });

    default:
      return state;
  }
}
