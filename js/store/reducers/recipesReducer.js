import update from 'immutability-helper';

import ActionType from '../ActionType';

const EMPTY_STORE = {
  recipesById: {},
  recipeIds: [],
  favoritedRecipeIds: []
};

export default function reduceRecipes(state = EMPTY_STORE, action) {
  switch(action.type) {
    case ActionType.SET_RECIPE_IDS:
      return update(state, {
        recipeIds: { $set: action.payload }
      });

    case ActionType.RECIPES_LOADED:
      return update(state, {
        recipesById: { $merge: action.payload }
      });

    case ActionType.SAVE_RECIPE: {
      const { recipeId } = action.payload;
      return update(state, {
        recipeIds: { $push: recipeId },
        recipesById: { $merge: { [recipeId]: action.payload } }
      });
    }

    case ActionType.DELETE_RECIPE:
      return update(state, {
        recipeIds: { $without: action.payload  },
        favoritedRecipeIds: { $without: action.payload },
        recipesById: { $omit: action.payload }
      });

    case ActionType.SET_FAVORITE_RECIPE:
      if (action.payload.isFavorited) {
        return update(state, {
          favoritedRecipeIds: { $push: [action.payload.recipeId ] }
        });
      } else {
        return update(state, {
          favoritedRecipeIds: { $without: action.payload.recipeId }
        });
      }

    default:
      return state;
  }
}
