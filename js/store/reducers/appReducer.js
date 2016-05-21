import update from 'immutability-helper';
import { actionTypes as ReduxLocalStorageActionTypes } from 'redux-localstorage-fix-localstorage-fork';

import ActionType from '../ActionType';

const EMPTY_STORE = {
  isStateHydrated: false,
  isInitialLoadComplete: false,
  ingredientMenuOpen: false
};

export default function reduceApp(state = EMPTY_STORE, action) {
  switch(action.type) {
    case ReduxLocalStorageActionTypes.INIT:
      return update(state, {
        isStateHydrated: { $set: true }
      });

    case ActionType.INITIAL_LOAD_COMPLETE:
      return update(state, {
        isInitialLoadComplete: { $set: true }
      });

    case ActionType.TOGGLE_INGREDIENT_MENU:
      return update(state, {
        ingredientMenuOpen: !state.ingredientMenuOpen
      });

    default:
      return state;
  }
}
