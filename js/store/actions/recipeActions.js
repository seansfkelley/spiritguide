import _ from 'lodash';
import Promise from 'bluebird';

import ActionType from '../ActionType';
import { bulkLoad } from '../../db/recipes';

export function setRecipeIds(payload) {
  return {
    type: ActionType.SET_RECIPE_IDS,
    payload
  };
}

export function loadRecipes(recipeIds) {
  return (dispatch, getState) => {
    const { recipesById } = getState().recipes;

    const recipeIdsToLoad = recipeIds.filter(recipeId => !recipesById[recipeId]);

    if (recipeIdsToLoad.length) {
      return bulkLoad(recipeIdsToLoad)
      .then(payload => {
        dispatch({
          type: ActionType.RECIPES_LOADED,
          payload
        });
      });
    } else {
      return Promise.resolve();
    }
  };
}

export function setFavoriteRecipe(recipeId, isFavorited) {
  return {
    type: ActionType.SET_FAVORITE_RECIPE,
    payload: {
      recipeId,
      isFavorited
    }
  };
}
