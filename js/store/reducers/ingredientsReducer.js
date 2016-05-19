import update from 'immutability-helper';

import ActionType from '../ActionType';
import { INGREDIENTS_LOADED, INGREDIENT_GROUPS_LOADED } from '../../definitions';

const EMPTY_STORE = {
  ingredientsByTag: {},
  orderedIngredientGroups: []
};

export default function reduceIngredients(state = EMPTY_STORE, action) {
  switch(action.type) {
    case ActionType.INGREDIENTS_LOADED:
      return update(state, {
        ingredientsByTag: { $set: action.payload }
      });

    case ActionType.INGREDIENT_GROUPS_LOADED:
      return update(state, {
        orderedIngredientGroups: { $set: action.payload }
      });

    default:
      return state;
  }
}
