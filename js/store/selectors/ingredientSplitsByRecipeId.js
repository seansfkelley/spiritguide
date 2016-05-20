import _ from 'lodash';
import log from 'loglevel';

import assert from  '../../../shared/tinyassert';

export function _computeSubstitutionMap(ingredients, ingredientsByTag) {
  const ingredientsByTagWithGenerics = {};

  function pushToKey(key, value) {
    let tagList = ingredientsByTagWithGenerics[key];
    if (!tagList) {
      ingredientsByTagWithGenerics[key] = tagList = [];
    }
    tagList.push(value);
  }

  ingredients.forEach(i => {
    let generic = i;
    pushToKey(generic.tag, i.tag);
    while (generic = ingredientsByTag[generic.generic]) {
      pushToKey(generic.tag, i.tag);
    }
  });

  return ingredientsByTagWithGenerics;
}

function _generateSearchResult(recipe, substitutionMap, ingredientsByTag) {
  const missing = [];
  const available = [];
  const substitute = [];

  recipe.ingredients.forEach(ingredient => {
    // Things like 'water' are untagged.
    if (!ingredient.tag) {
      available.push(ingredient);
    } else if (substitutionMap[ingredient.tag]) {
      available.push(ingredient);
    } else {
      const currentTag = ingredient.tag;
      while (currentTag) {
        if (substitutionMap[currentTag]) {
          substitute.push({
            need: ingredient,
            have: substitutionMap[currentTag].map((t) => ingredientsByTag[t].display)
          });
          break;
        }
        const currentIngredient = ingredientsByTag[currentTag];
        if (!currentIngredient) {
          log.warn(`recipe '${recipe.name}' calls for or has a generic that calls for unknown tag '${currentTag}'`);
        };
        currentTag = _.get(ingredientsByTag, [ _.get(currentIngredient, 'generic'), 'tag' ]);
      }

      if (!currentTag) {
        missing.push(ingredient);
      }
    }
  });

  return { recipeId : recipe.recipeId, missing, available, substitute };
};

export default function(recipes, ingredientsByTag, ingredientTags) {
  assert(recipes);
  assert(ingredientsByTag);
  assert(ingredientTags);
  assert(_.isArray(ingredientTags));

  const exactlyAvailableIngredientsRaw = ingredientTags.map(tag => ingredientsByTag[tag]);
  const exactlyAvailableIngredients = _.compact(exactlyAvailableIngredientsRaw);
  if (exactlyAvailableIngredientsRaw.length !== exactlyAvailableIngredients.length) {
    const extraneous = _.chain(exactlyAvailableIngredientsRaw)
      .map((value, i) => value || ingredientTags[i])
      .compact()
      .value()
    log.warn(`some tags that were searched are extraneous and will be ignored: ${JSON.stringify(extraneous)}`);
  }

  const substitutionMap = _computeSubstitutionMap(exactlyAvailableIngredients, ingredientsByTag);

  return _.chain(recipes)
    .map(r => _generateSearchResult(r, substitutionMap, ingredientsByTag))
    .keyBy('recipeId')
    .mapValues(r => _.omit(r, 'recipeId'))
    .value();
}
