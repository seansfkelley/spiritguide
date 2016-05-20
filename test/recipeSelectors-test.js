import {
  _selectCreateBaseLiquorFilterer,
  _selectCreateRecipeSearchTermFilterer
} from '../js/store/selectors/recipeSelectors';

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
