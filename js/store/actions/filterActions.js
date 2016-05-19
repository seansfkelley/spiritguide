import ActionType from '../ActionType';

export function setRecipeSearchTerm(payload) {
  return {
    type: ActionType.SET_RECIPE_SEARCH_TERM,
    payload
  };
}

export function setIngredientSearchTerm(payload) {
  return {
    type: ActionType.SET_INGREDIENT_SEARCH_TERM,
    payload
  };
}

export function setSelectedIngredientTags(payload) {
  return {
    type: ActionType.SET_SELECTED_INGREDIENT_TAGS,
    payload
  };
}

export function setBaseLiquorFilter(payload) {
  return {
    type: ActionType.SET_BASE_LIQUOR_FILTER,
    payload
  };
}
