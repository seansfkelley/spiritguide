import _ from 'lodash';

import { get as getDb } from './couchdb';

const { ingredientDb, configDb } = getDb();

export function getIngredients() {
  return ingredientDb.allDocs({
    include_docs : true
  })
  .then(({ total_rows, offset, rows }) => {
    // rows -> { id, key, value: { rev }, doc: { ... }}
    return _.chain(rows)
      .pluck('doc')
      .map((r) => _.omit(r, '_id', '_rev'))
      .value();
  });
}

export function getGroups() {
  return configDb.get('ingredient-groups')
  .then(({ orderedGroups }) => orderedGroups);
}
