import ActionType from '../ActionType';

export function setSelectedIngredientTags(payload) {
  return {
    type: ActionType.SET_SELECTED_INGREDIENT_TAGS,
    payload
  };
}
