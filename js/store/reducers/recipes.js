import update from 'immutability-helper';

import ActionType from '../ActionType';

const EMPTY_STORE = {
  recipesById: {},
  customRecipeIds: [],
  defaultRecipeIds: []
};

export default function reduceRecipes(state = EMPTY_STORE, action) {
  switch(action.type) {
    case ActionType.RECIPES_LOADED:
      return update(state, {
        recipesById: { $merge: action.payload }
      });

    case ActionType.SAVE_RECIPE: {
      const { recipeId } = action.payload;
      return update(state, {
        customRecipeIds: { $push: recipeId },
        recipesById: { $merge: { [recipeId]: action.payload } }
      });
    }

    case ActionType.DELETE_RECIPE: {
      const recipeId = action.payload;
      return update(state, {
        customRecipeIds: { $without: recipeId }
      });
    }

    default:
      return state;
  }
}
