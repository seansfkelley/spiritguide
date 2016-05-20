import update from 'immutability-helper';

import ActionType from '../ActionType';

const EMPTY_STORE = {
  recipesById: {},
  favoritedRecipeIds: []
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
        recipesById: { $merge: { [recipeId]: action.payload } }
      });
    }

    case ActionType.DELETE_RECIPE:
      return update(state, {
        recipesById: { $omit: action.payload }
      });

    case ActionType.FAVORITE_RECIPE:
      return update(state, {
        favoritedRecipeIds: { $push: action.payload }
      });

    case ActionType.UNFAVORITE_RECIPE:
      return update(state, {
        favoritedRecipeIds: { $without: action.payload }
      });

    default:
      return state;
  }
}
