import _ from 'lodash';
import Promise from 'bluebird';
import { bulkLoad } from '../../db/recipes';

export function loadRecipes(recipeIds) {
  return (dispatch, getState) => {
    const { recipesById } = getState().recipes;

    const recipeIdsToLoad = _.keys(recipesById).filter(recipeId => !recipesById[recipeId]);

    if (recipeIdsToLoad.length) {
      // return Promise.resolve(fetch('http://localhost:5984/recipes/bulk'))
      return bulkLoad(recipeIdsToLoad)
      .then(console.log.bind(console));
    } else {
      return Promise.resolve();
    }
  };
}
