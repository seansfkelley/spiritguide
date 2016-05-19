import _ from 'lodash';

import assert from './tinyassert';

export function normalizeIngredient(i) {
  assert(i.display);

  i = _.clone(i);
  _.defaults(i, {
    tag: i.display.toLowerCase(),
    searchable: [],
    tangible: true
  });

  i.searchable.push(_.deburr(i.display).toLowerCase());
  i.searchable.push(i.tag);
  i.searchable = _.uniq(_.invokeMap(i.searchable, 'toLowerCase'));
  // TODO: Add display for generic to here.
  // if i.generic and not _.contains i.searchable, i.generic
  //   i.searchable.push i.generic

  return i;
}

export function normalizeRecipe(r) {
  assert(r.name);

  r = _.clone(r);
  r.canonicalName = _.deburr(r.name).toLowerCase();
  nameWords = r.canonicalName.split(' ');
  if ([ 'a', 'the' ].indexOf(nameWords[0]) !== -1) {
    r.sortName = nameWords.slice(1).join(' ');
  } else {
    r.sortName = r.canonicalName;
  }
  r.base = r.base || [];

  return r;
}
