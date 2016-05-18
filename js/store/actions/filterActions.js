import ActionType from '../ActionType';

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
