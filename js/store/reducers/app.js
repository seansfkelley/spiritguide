import update from 'immutability-helper';

import ActionType from '../ActionType';

const EMPTY_STORE = {
  initialLoadComplete: false,
  ingredientMenuOpen: false
};

export default function reduceApp(state = EMPTY_STORE, action) {
  switch(action.type) {
    case ActionType.INITIAL_LOAD_COMPLETE:
      return update(state, {
        initialLoadComplete: { $set: true }
      });

    case ActionType.TOGGLE_INGREDIENT_MENU:
      return update(state, {
        ingredientMenuOpen: !state.ingredientMenuOpen
      });

    default:
      return state;
  }
}
