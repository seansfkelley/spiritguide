import _ from 'lodash';
import log from 'loglevel';

import assert from  '../../../shared/tinyassert';

export function _includeAllGenerics(ingredients, ingredientsByTag) {
  const withGenerics = [];

  ingredients.forEach(current => {
    withGenerics.push(current);
    while (current = ingredientsByTag[current.generic]) {
      withGenerics.push(current);
    };
  });

  return _.uniq(withGenerics);
}

export function _toMostGenericTags(ingredients, ingredientsByTag) {
  return _.chain(_includeAllGenerics(ingredients, ingredientsByTag))
    .reject('generic')
    .map('tag')
    .uniq()
    .value();
};

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
        const currentTag = _.get(ingredientsByTag, [ _.get(currentIngredient, 'generic'), 'tag' ]);
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

  // Fucking hell I just want Set objects.
  ingredientTags = _.keys(ingredientTags);

  const exactlyAvailableIngredientsRaw = ingredientTags.map((tag) => ingredientsByTag[tag]);
  const exactlyAvailableIngredients = _.compact(exactlyAvailableIngredientsRaw);
  if (exactlyAvailableIngredientsRaw.length !== exactlyAvailableIngredients.length) {
    extraneous = _.chain(exactlyAvailableIngredientsRaw)
      .map((value, i) => value || ingredientTags[i])
      .compact()
      .value()
    log.warn(`some tags that were searched are extraneous and will be ignored: ${JSON.stringify(extraneous)}`);
  }

  const substitutionMap = _computeSubstitutionMap(exactlyAvailableIngredients, ingredientsByTag);
  const allAvailableTagsWithGenerics = _.keys(substitutionMap);

  return _.chain(recipes)
    .map((r) => {
      const indexableIngredients = _.chain(r.ingredients)
        .filter('tag')
        .map(i => ingredientsByTag[i.tag])
        .value();
      const unknownIngredientAdjustment = indexableIngredients.length - _.compact(indexableIngredients).length;
      const mostGenericRecipeTags = _toMostGenericTags(_.compact(indexableIngredients), ingredientsByTag);
      const missingCount = _.difference(
        mostGenericRecipeTags,
        allAvailableTagsWithGenerics
      ).length + unknownIngredientAdjustment;

      return _generateSearchResult(r, substitutionMap, ingredientsByTag);
    })
    .compact()
    .reduce((obj, result) => {
      obj[result.recipeId] = _.omit(result, 'recipeId');
      return obj;
    }, {})
    .value();
}
