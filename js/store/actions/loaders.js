import _ from 'lodash';
import Promise from 'bluebird';

import { BASE_URL } from '../../definitions';

export function loadRecipes(recipeIds) {
  return (dispatch, getState) => {
    const { recipesById } = getState().recipes;

    const recipeIdsToLoad = _.keys(recipesById).filter(recipeId => !recipesById[recipeId]);

    // if (recipeIdsToLoad.length) {
      return Promise.resolve(fetch(BASE_URL + '/recipes/bulk'))
      .then(console.log.bind(console));
    // } else {
    //   return Promise.resolve();
    // }
  };
}
