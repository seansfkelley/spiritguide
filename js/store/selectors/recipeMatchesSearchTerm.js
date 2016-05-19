import _ from 'lodash';

import assert from '../../../shared/tinyassert';

const WHITESPACE_REGEX = /\s+/g;

// SO INEFFICIENT.
export default function(recipe, searchTerm, ingredientsByTag){
  assert(recipe);
  assert(ingredientsByTag);

  searchTerm = searchTerm.trim().toLowerCase();

  if (!searchTerm) {
    return false;
  }

  const terms = _.compact(searchTerm.split(WHITESPACE_REGEX));

  const searchable = _.chain(recipe.ingredients)
    .map('tag')
    .map((t) => ingredientsByTag[t] ? ingredientsByTag[t].searchable : null)
    .compact()
    .flatten()
    .concat(recipe.canonicalName.split(WHITESPACE_REGEX))
    .value()

  return _.every(terms, (t) => _.some(searchable, (s) => s.indexOf(t) !== -1));
}
