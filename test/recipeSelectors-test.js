import {
  _selectCreateBaseLiquorFilterer,
  _selectCreateRecipeSearchTermFilterer
} from '../js/store/selectors/recipeSelectors';
import { ANY_BASE_LIQUOR } from '../js/definitions';

describe('_selectCreateBaseLiquorFilterer', () => {
  const selector = _selectCreateBaseLiquorFilterer.resultFunc;

  const RECIPE_A = { base : [ 'a' ] };
  const RECIPE_B = { base : [ 'b' ] };
  const RECIPE_A_B = { base : [ 'a', 'b' ] };

  const RECIPE_A_STRING = { base : 'a' };
  const RECIPE_B_STRING = { base : 'b' };

  const RECIPE_NULL = {};
  const RECIPE_OBJECT = { base : {} };

  it('should return the list as-is if the filter is ANY_BASE_LIQUOR', () => {
    [
      RECIPE_A,
      RECIPE_B
    ].filter(selector(ANY_BASE_LIQUOR)).should.deep.equal([
      RECIPE_A,
      RECIPE_B
    ]);
  });

  it('should filter recipes properly when their "base" property is a string', () => {
    [
      RECIPE_A_STRING,
      RECIPE_B_STRING
    ].filter(selector('a')).should.deep.equal([
      RECIPE_A_STRING
    ]);
  });

  it('should filter recipes properly when their "base" property is an array of strings', () => {
    [
      RECIPE_A,
      RECIPE_B
    ].filter(selector('a')).should.deep.equal([
      RECIPE_A
    ]);
  });

  it('should filter out recipes with no "base" property', () => {
    [
      RECIPE_A,
      RECIPE_NULL
    ].filter(selector('a')).should.deep.equal([
      RECIPE_A
    ]);
  });

  it('should filter out recipes with a non-string, non-array "base" property', () => {
    [
      RECIPE_A,
      RECIPE_OBJECT
    ].filter(selector('a')).should.deep.equal([
      RECIPE_A
    ]);
  });

  it('should retain recipes if any "base" matches when it\'s an array of strings', () => {
    [
      RECIPE_A,
      RECIPE_A_B
    ].filter(selector('b')).should.deep.equal([
      RECIPE_A_B
    ]);
  });
});

describe('_selectCreateRecipeSearchTermFilterer', () => {
  const selector = _selectCreateRecipeSearchTermFilterer.resultFunc;

  const searchableIngredient = (tag, ...searchable) => ({ tag, searchable });

  const searchableRecipe = (canonicalName, ...ingredients) => ({ canonicalName, ingredients });

  function makeIngredientsByTag(array) {
    const ingredientsByTag = {};
    array.forEach(i => { ingredientsByTag[i.tag] = i });
    return ingredientsByTag;
  };

  const ONE = searchableIngredient('ingredient-1', '1', 'one');
  const TWO = searchableIngredient('ingredient-2', '2', 'two');

  const ingredientsByTag = makeIngredientsByTag([ ONE, TWO ]);

  context('should return true', () => {
    it('when given a string of all whitespace', () => {
      const filterer = selector(
        ' ',
        ingredientsByTag
      );

      filterer(searchableRecipe('recipe name')).should.be.true;
    });

    context('when given a single-word search term', () => {
      it('that is a substring of the recipe name', () => {
        const filterer = selector(
          'recipe',
          ingredientsByTag
        );

        filterer(searchableRecipe('recipe name')).should.be.true;
      });

      it('that is a substring of a searchable term of a recipe ingredient', () => {
        const filterer = selector(
          'one',
          ingredientsByTag
        );

        filterer(searchableRecipe('recipe name', ONE)).should.be.true;
      });
    });

    context('when given a space-delimited search term', () => {
      it('where all space-delimited terms are substrings of searchable terms of one ingredient', () => {
        const filterer = selector(
          'one 1',
          ingredientsByTag
        );

        filterer(searchableRecipe('recipe name', ONE)).should.be.true;
      });

      it('where all space-delimited terms are substrings of searchable terms of multiple ingredients', () => {
        const filterer = selector(
          'one two',
          ingredientsByTag
        );

        filterer(searchableRecipe('recipe name', ONE, TWO)).should.be.true;
      });

      it('where all space-delimited terms are substrings of a searchable term or the title', () => {
        const filterer = selector(
          'one name',
          ingredientsByTag
        );

        filterer(searchableRecipe('recipe name', ONE)).should.be.true;
      });
    });
  });

  context('should return false', () => {
    it('when given a space-delimited search term where only one of the two terms are substrings of a searchable term', () => {
      const filterer = selector(
        'one three',
        ingredientsByTag
      );

      filterer(searchableRecipe('recipe name', ONE, TWO)).should.be.false;
    });
  });
});
