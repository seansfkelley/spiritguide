import { getIngredients, getGroups } from '../db/ingredients';

export function loadIngredientsByTag() {
  return (dispatch, getState) => {
    return getIngredients()
    .then(ingredients => {
      // ...
      dispatch({
        type: ActionType.INGREDIENTS_LOADED,
        payload
      })
    });
  };
}

export function loadIngredientGroups() {
  return (dispatch, getState) => {
    return getGroups()
    .then(payload => {
      dispatch({
        type: ActionType.INGREDIENT_GROUPS_LOADED,
        payload
      })
    });
  };
}
