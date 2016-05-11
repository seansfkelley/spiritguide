import _ from 'lodash';
import log from 'loglevel';
import Promise from 'bluebird';

import { get } from './couchdb';

const { recipeDb, configDb } = get();

export function getDefaultRecipeIds() {
  return configDb.get('default-recipe-list')
  .then(({ defaultIds }) => {
    log.debug(`loaded ${defaultIds.length} default recipe IDs`);
    return defaultIds;
  });
}

export function save(recipe) {
  return recipeDb.post(recipe)
  .then(({ ok, id, rev }) => {
    log.info(`saved new recipe with ID ${id}`);
    return id;
  });
}

export function load(recipeId) {
  return recipeDb.get(recipeId)
  .then((recipe) => {
    if (recipe) {
      return _.extend({ recipeId }, _.omit(recipe, '_id'));
    } else {
      log.info(`failed to find recipe with ID '${recipeId}'`);
    }
  });
}

export function bulkLoad(recipeIds) {
  if (!recipeIds || recipeIds.length === 0) {
    log.debug(`bulk-load requested to load nothing; parameter was ${JSON.stringify(recipeIds)}`);
    return Promise.resolve({});
  } else {
    log.debug(`bulk-loading ${recipeIds.length} recipes`);
    return recipeDb.allDocs({
      keys: recipeIds,
      include_docs: true
    })
    .then(({ total_rows, offset, rows }) => {
      log.debug(`bulk-loaded ${rows.length} rows for recipes`);

      // rows -> { id, key, value: { rev }, doc: { ... }}
      const recipes = _.chain(rows)
        .map('doc')
        .compact()
        .keyBy('_id')
        .mapValues(r => _.omit(r, '_id', '_rev'))
        .value();

      const loadedIds = _.keys(recipes);
      const missingIds = _.difference(recipeIds, loadedIds);
      if (missingIds.length) {
        log.warn(`failed to bulk-load some recipes: ${missingIds.join(', ')}`);
      }

      return recipes;
    });
  }
}
