import recipeMatchesSearchTerm from '../js/store/selectors/recipeMatchesSearchTerm';

const searchableIngredient = (tag, ...searchable) => ({ tag, searchable });

const searchableRecipe = (canonicalName, ...ingredients) => ({ canonicalName, ingredients });

const makeIngredientsByTag = (array) => {
  const ingredientsByTag = {};
  array.forEach(i => { ingredientsByTag[i.tag] = i });
  return ingredientsByTag;
};

describe('recipeMatchesSearchTerm', () => {
  const ONE = searchableIngredient('ingredient-1', '1', 'one');
  const TWO = searchableIngredient('ingredient-2', '2', 'two');

  const ingredientsByTag = makeIngredientsByTag([ ONE, TWO ]);

  context('should return true', () => {
    context('when given a single-word search term', () => {
      it('that is a substring of the recipe name', () => {
        recipeMatchesSearchTerm(
          searchableRecipe('recipe name'),
          'recipe',
          ingredientsByTag
        ).should.be.true;
      });

      it('that is a substring of a searchable term of a recipe ingredient', () => {
        recipeMatchesSearchTerm(
          searchableRecipe('recipe name', ONE),
          'one',
          ingredientsByTag
        ).should.be.true;
      });
    });

    context('when given a space-delimited search term', () => {
      it('where all space-delimited terms are substrings of searchable terms of one ingredient', () => {
        recipeMatchesSearchTerm(
          searchableRecipe('recipe name', ONE),
          'one 1',
          ingredientsByTag
        ).should.be.true;
      });

      it('where all space-delimited terms are substrings of searchable terms of multiple ingredients', () => {
        recipeMatchesSearchTerm(
          searchableRecipe('recipe name', ONE, TWO),
          'one two',
          ingredientsByTag
        ).should.be.true;
      });

      it('where all space-delimited terms are substrings of a searchable term or the title', () => {
        recipeMatchesSearchTerm(
          searchableRecipe('recipe name', ONE),
          'one name',
          ingredientsByTag
        ).should.be.true;
      });
    });
  });

  context('should return false', () => {
    it('when given a string of all whitespace', () => {
      recipeMatchesSearchTerm(
        searchableRecipe('recipe name'),
        ' ',
        ingredientsByTag
      ).should.be.false;
    });

    it('when given a space-delimited search term where only one of the two terms are substrings of a searchable term', () => {
      recipeMatchesSearchTerm(
        searchableRecipe('recipe name', ONE, TWO),
        'one three',
        ingredientsByTag
      ).should.be.false;
    });
  });
});
