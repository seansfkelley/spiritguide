import _ from 'lodash';
import Promise from 'bluebird';

import store from './';
import { getDefaultRecipeIds } from '../db/recipes';
import {
  setRecipeIds,
  loadRecipes,
  initialLoadComplete,
  loadIngredientGroups,
  loadIngredientsByTag
} from './actions';
import {
  selectRecipeIds,
  selectIsStateHydrated
} from './selectors';

export default _.once(() => {
  const initializationPromise = new Promise((resolve, reject) => {
    function loadData() {
      Promise.resolve()
      .then(() => {
        const recipeIds = selectRecipeIds(store.getState());
        if (!recipeIds || !recipeIds.length) {
          return getDefaultRecipeIds();
        } else {
          return recipeIds;
        }
      })
      .then(recipeIds => {
        return Promise.all([
          store.dispatch(setRecipeIds(recipeIds)),
          store.dispatch(loadRecipes(recipeIds)),
          // These two have an ordering constraint.
          store.dispatch(loadIngredientGroups())
          .then(() => {
            return store.dispatch(loadIngredientsByTag())
          })
        ])
      })
      .then(() => {
        return store.dispatch(initialLoadComplete());
      })
      .then(resolve)
      .catch(reject);
    }

    if (selectIsStateHydrated(store.getState())) {
      loadData();
    } else {
      const unsubscribe = store.subscribe(() => {
        if (selectIsStateHydrated(store.getState())) {
          unsubscribe();
          loadData();
        }
      });
    }
  });

  return initializationPromise;
});
