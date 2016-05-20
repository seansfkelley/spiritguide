import _ from 'lodash';

import ingredientSplitsByRecipeId, {
  _computeSubstitutionMap,
  _generateSearchResult
} from '../js/store/selectors/ingredientSplitsByRecipeId';

function makeIngredientsByTag(array) {
  const ingredientsByTag = {};
  array.forEach(i => { ingredientsByTag[i.tag] = i; });
  return ingredientsByTag;
}

function ingredient(tag, generic = null) {
  const display = 'name-' + tag;
  return { tag, generic, display };
};

const IndexableIngredient = {
  A_ROOT: ingredient('a'),
  A_CHILD_1: ingredient('a-1', 'a'),
  A_CHILD_1_1: ingredient('a-1-1', 'a-1'),
  A_CHILD_2: ingredient('a-2', 'a'),
  A_CHILD_3: ingredient('a-3', 'a'),
  B_ROOT: ingredient('b'),
  Z_ROOT: ingredient('z'),
  NULL: ingredient()
};

const ResultIngredient = _.mapValues(IndexableIngredient, i => _.omit(i, 'generic'));

describe('ingredientSplitsByRecipeId', () => {
  describe('#_computeSubstitutionMap', () => {
    const ingredientsByTag = makeIngredientsByTag([
      IndexableIngredient.A_ROOT,
      IndexableIngredient.A_CHILD_1,
      IndexableIngredient.A_CHILD_1_1,
      IndexableIngredient.A_CHILD_1_1
    ]);

    it('should return a map from an ingredient to itself when given an ingredient with no generic', () => {
      _computeSubstitutionMap(
        [ IndexableIngredient.A_ROOT ],
        ingredientsByTag
      ).should.deep.equal({
        [IndexableIngredient.A_ROOT.tag]: [ IndexableIngredient.A_ROOT.tag ],
      });
    });

    it('should return a map that includes direct descendants in their generic\'s entry when both are given', () => {
      _computeSubstitutionMap(
        [ IndexableIngredient.A_ROOT, IndexableIngredient.A_CHILD_1 ],
        ingredientsByTag
      ).should.deep.equal({
        [IndexableIngredient.A_ROOT.tag]: [ IndexableIngredient.A_ROOT.tag, IndexableIngredient.A_CHILD_1.tag ],
        [IndexableIngredient.A_CHILD_1.tag]: [ IndexableIngredient.A_CHILD_1.tag ]
      });
    });

    it('should not include an inferred generic\'s tag as a value if that generic was not given', () => {
      _computeSubstitutionMap(
        [ IndexableIngredient.A_CHILD_1 ],
        ingredientsByTag
      ).should.deep.equal({
        [IndexableIngredient.A_ROOT.tag]: [ IndexableIngredient.A_CHILD_1.tag ],
        [IndexableIngredient.A_CHILD_1.tag]: [ IndexableIngredient.A_CHILD_1.tag ]
      });
    });

    it('should return a map where each generic includes all descendant generations\' tags', () => {
      _computeSubstitutionMap(
        [,
          IndexableIngredient.A_ROOT,
          IndexableIngredient.A_CHILD_1,
          IndexableIngredient.A_CHILD_1_1
        ],
        ingredientsByTag
      ).should.deep.equal({
        [IndexableIngredient.A_ROOT.tag]: [
          IndexableIngredient.A_ROOT.tag,
          IndexableIngredient.A_CHILD_1.tag,
          IndexableIngredient.A_CHILD_1_1.tag
        ],
        [IndexableIngredient.A_CHILD_1.tag]: [
          IndexableIngredient.A_CHILD_1.tag,
          IndexableIngredient.A_CHILD_1_1.tag
        ],
        [IndexableIngredient.A_CHILD_1_1.tag]: [
          IndexableIngredient.A_CHILD_1_1.tag
        ]
      });
    });

    it('should return a map where a generic with multiple descendants includes all their tags', () => {
      _computeSubstitutionMap(
        [,
          IndexableIngredient.A_ROOT,
          IndexableIngredient.A_CHILD_1,
          IndexableIngredient.A_CHILD_2
        ],
        ingredientsByTag
      ).should.deep.equal({
        [IndexableIngredient.A_ROOT.tag]: [
          IndexableIngredient.A_ROOT.tag,
          IndexableIngredient.A_CHILD_1.tag,
          IndexableIngredient.A_CHILD_2.tag
        ],
        [IndexableIngredient.A_CHILD_1.tag]: [
          IndexableIngredient.A_CHILD_1.tag
        ],
        [IndexableIngredient.A_CHILD_2.tag]: [
          IndexableIngredient.A_CHILD_2.tag
        ]
      });
    });
  });

  const ingredientsByTag = makeIngredientsByTag([
    IndexableIngredient.A_ROOT,
    IndexableIngredient.A_CHILD_1,
    IndexableIngredient.A_CHILD_1_1,
    IndexableIngredient.A_CHILD_2,
    IndexableIngredient.A_CHILD_3,
    IndexableIngredient.B_ROOT
  ]);

  function recipe(recipeId, ...ingredients) {
    // This is very important: the recipes that are indexed do NOT have a generic flag.
    return {
      recipeId,
      ingredients: ingredients.map(i => _.omit(i, 'generic'))
    };
  }

  it('should return the empty object when no recipes are given', () => {
    ingredientSplitsByRecipeId([], ingredientsByTag, []).should.be.empty;
  });

  it('should accept ingredientTags as an array of strings', () => {
    ingredientSplitsByRecipeId(
      [ recipe(null, IndexableIngredient.A_ROOT) ],
      ingredientsByTag,
      [ IndexableIngredient.A_ROOT.tag ]
    ).should.not.be.empty;
  });

  // This is an upgrade consideration, if someone has a tag in localStorage but it's removed in later versions.
  it('should should not throw an exception when given ingredients it doesn\'t understand', () => {
    ingredientSplitsByRecipeId(
      [],
      ingredientsByTag,
      [ IndexableIngredient.Z_ROOT.tag ]
    ).should.be.empty;
  });

  it('should return results keyed by recipe ID', () => {
    ingredientSplitsByRecipeId(
      [ recipe('abc', IndexableIngredient.A_ROOT) ],
      ingredientsByTag,
      [ IndexableIngredient.A_ROOT.tag ]
    ).should.have.all.keys([ 'abc' ]);
  });

  it('should return a match for a recipe that matches exactly', () => {
    ingredientSplitsByRecipeId(
      [ recipe(1, IndexableIngredient.A_ROOT) ],
      ingredientsByTag,
      [ IndexableIngredient.A_ROOT.tag ]
    ).should.deep.equal({
      '1': {
        missing: [],
        substitute: [],
        available: [ ResultIngredient.A_ROOT ]
      }
    });
  });

  it('should consider ingredients without tags always available', () => {
    ingredientSplitsByRecipeId(
      [ recipe(1, IndexableIngredient.A_ROOT, IndexableIngredient.NULL) ],
      ingredientsByTag,
      [ IndexableIngredient.A_ROOT.tag ]
    ).should.deep.equal({
      '1': {
        missing: [],
        substitute: [],
        available: [ ResultIngredient.A_ROOT, ResultIngredient.NULL ]
      }
    });
  });

  it('should silently ignore input ingredients with no tags', () => {
    ingredientSplitsByRecipeId(
      [ recipe(1, IndexableIngredient.A_ROOT, IndexableIngredient.NULL) ],
      ingredientsByTag,
      [ IndexableIngredient.A_ROOT.tag ]
    ).should.have.all.keys([ '1' ]);
  });

  it('should return an available match for a recipe if it calls for a parent (less specific) ingredient', () => {
    ingredientSplitsByRecipeId(
      [ recipe(1, IndexableIngredient.A_ROOT) ],
      ingredientsByTag,
      [ IndexableIngredient.A_CHILD_2.tag ]
    ).should.deep.equal({
      '1': {
        missing: [],
        substitute: [],
        available: [ ResultIngredient.A_ROOT ]
      }
    });
  });

  it('should return a substitutable match for a recipe if it calls for a sibling (equally specific) ingredient', () => {
    ingredientSplitsByRecipeId(
      [ recipe(1, IndexableIngredient.A_CHILD_1) ],
      ingredientsByTag,
      [ IndexableIngredient.A_CHILD_2.tag ]
    ).should.deep.equal({
      '1': {
        missing: [],
        substitute: [{
          need: ResultIngredient.A_CHILD_1,
          have: [ ResultIngredient.A_CHILD_2.display ]
        }],
        available: []
      }
    });
  });

  it('should return a substitutable match for a recipe if it calls for a child (more specific) ingredient', () => {
    ingredientSplitsByRecipeId(
      [ recipe(1, IndexableIngredient.A_CHILD_1) ],
      ingredientsByTag,
      [ IndexableIngredient.A_ROOT.tag ]
    ).should.deep.equal({
      '1': {
        missing: [],
        substitute: [{
          need: ResultIngredient.A_CHILD_1,
          have: [ ResultIngredient.A_ROOT.display ]
        }],
        available: []
      }
    });
  });

  it('should return multiple substitutable matches for a recipe (with sibling ingredients)', () => {
    ingredientSplitsByRecipeId(
      [ recipe(1, IndexableIngredient.A_CHILD_1) ],
      ingredientsByTag,
      [ IndexableIngredient.A_CHILD_2.tag, IndexableIngredient.A_CHILD_3.tag ]
    ).should.deep.equal({
      '1': {
        missing: [],
        substitute: [{
          need: ResultIngredient.A_CHILD_1,
          have: [ ResultIngredient.A_CHILD_2.display, ResultIngredient.A_CHILD_3.display ]
        }],
        available: []
      }
    });
  });

  it('should count unknown recipe ingredients as missing', () => {
    ingredientSplitsByRecipeId(
      [ recipe(1, IndexableIngredient.Z_ROOT, IndexableIngredient.A_ROOT) ],
      ingredientsByTag,
      [ IndexableIngredient.A_ROOT.tag ]
    ).should.deep.equal({
      '1': {
        missing: [ ResultIngredient.Z_ROOT ],
        substitute: [],
        available: [ ResultIngredient.A_ROOT ]
      }
    });
  });
});
