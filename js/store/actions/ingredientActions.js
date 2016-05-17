import _ from 'lodash';
import log from 'loglevel';

import { normalizeIngredient } from '../../../shared/normalization';
import ActionType from '../ActionType';
import { getIngredients, getGroups } from '../../db/ingredients';

// Exported for theoretical test code that may or may not ever exist.
export function _computeIngredientsByTag(ingredients) {
  let ingredientsByTag = {};

  _.each(ingredients, i => {
    ingredientsByTag[i.tag] = i;
  });

  _.each(ingredients, i => {
    if (i.generic && !ingredientsByTag[i.generic]) {
      log.trace(`ingredient ${i.tag} refers to unknown generic ${i.generic}; inferring generic`);
      ingredientsByTag[i.generic] = normalizeIngredient({
        tag: i.generic,
        display: `[inferred] ${i.generic}`
      });
    }
  });

  return ingredientsByTag;
}

export function loadIngredientsByTag() {
  return (dispatch, getState) => {
    return getIngredients()
    .then(ingredients => {
      dispatch({
        type: ActionType.INGREDIENTS_LOADED,
        payload: _computeIngredientsByTag(ingredients)
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
