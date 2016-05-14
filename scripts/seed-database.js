#!/usr/bin/env babel-node

import log from 'loglevel';
log.setLevel('info');

if (process.argv.indexOf('--force') === -1) {
  log.info('ERROR: will not reseed database unless --force is applied');
  process.exit(1);
}

const startTime = Date.now();

import _ from 'lodash';
import Promise from 'bluebird';
import md5 from 'MD5';

import { loadRecipeFile, loadIngredientGroups, loadIngredients } from '../default-data/loaders';
import config from '../js/db/config';
import { get as getDb } from '../js/db/couchdb';

const { recipeDb, ingredientDb, configDb } = getDb();

const DEFAULT_RECIPE_LIST_DOC_ID  = 'default-recipe-list';
const INGREDIENT_GROUP_DOC_ID  = 'ingredient-groups';

function logAttemptedOverwriteResult(result, docType = 'entries') {
  const failures = _.chain(result)
    .filter('error')
    .groupBy('name')
    .value()

  log.info(`${_.reject(result, 'error').length} ${docType} newly inserted`);
  if (_.size(failures)) {
    log.warn(`${_.get(failures, 'conflict.length') || 0} ${docType} already existed`);
    const nonConflictFailures = _.chain(failures)
      .omit('conflict')
      .values()
      .flatten()
      .value()
    if (nonConflictFailures.length) {
      log.error(`${nonConflictFailures.length} ${docType} failed for other reasons:\n${nonConflictFailures}`);
    }
  }
}

Promise.resolve()
.then(() => {
  log.info(`seeding database at ${config.couchDb.url}`);

  const recipeFilesToLoad = [
    'iba-recipes',
    'recipes'
  ];

  if (process.argv.indexOf('--include-custom-recipes') !== -1) {
    recipeFilesToLoad.push('custom-recipes');
    recipeFilesToLoad.push('michael-cecconi');
  }

  log.debug(`will load recipes from files: ${recipeFilesToLoad.join(', ')}`);

  const recipesWithId = _.chain(recipeFilesToLoad)
    .map(loadRecipeFile)
    .flatten()
    // So, we don't really care if this is a hash or not. It just needs to be sufficiently unique.
    // The reason it does this is because it avoids accidentally assigning the same ID to a default
    // recipe (which don't come with any) and a custom recipe (which should retain theirs forever).
    .map((r) => _.extend({ _id : md5(JSON.stringify(r)) }, r))
    .value()

  log.info(`${recipesWithId.length} recipes to be inserted`);

  return recipeDb.bulkDocs(recipesWithId)
  .then((result) => {
    return logAttemptedOverwriteResult(result, 'recipes');
  })
  .then(() => {
    return configDb.get(DEFAULT_RECIPE_LIST_DOC_ID)
    .catch((err) => {
      if  (!err || err.name == 'not_found') {
        return undefined;
      } else {
        throw err;
      }
    })
    .then((result) => {
      if (result) {
        return result._rev;
      } else {
        return undefined;
      }
    });
  })
  .then((_rev) => {
    return configDb.put({
      _id: DEFAULT_RECIPE_LIST_DOC_ID,
      _rev,
      defaultIds: _.map(recipesWithId, '_id')
    });
  })
  .then(() => {
    return log.info(`successfully updated list of default recipe IDs (new count: ${recipesWithId.length})`);
  });
})
.then(() => {
  const ingredients = loadIngredients();
  log.info(`${ingredients.length} ingredients to be inserted`);

  const ingredientsWithId = ingredients.map((i) => _.extend({ _id : i.tag }, i));

  return ingredientDb.bulkDocs(ingredientsWithId);
})
.then((result) => {
  return logAttemptedOverwriteResult(result, 'ingredients');
})
.then(() => {
  return configDb.get(INGREDIENT_GROUP_DOC_ID)
  .catch((err) => {
    if (!err || err.name == 'not_found') {
      return undefined;
    } else {
      throw err;
    }
  })
  .then((result) => {
    if (result) {
      return result._rev;
    } else {
      return undefined;
    }
  });
})
.then((_rev) => {
  const orderedGroups = loadIngredientGroups();

  return configDb.put({
    _id: INGREDIENT_GROUP_DOC_ID,
    _rev,
    orderedGroups
  })
  .then(() => {
    return log.info(`successfully updated list of ordered groups (new count: ${orderedGroups.length})`);
  });
})
.catch((err) => {
  log.error((err && err.stack) || err || 'unknown error');
})
.finally(() => {
  log.info(`seeding database finished in ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
});
