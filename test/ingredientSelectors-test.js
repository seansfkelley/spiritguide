import {
  selectGroupedIngredients,
  selectFilteredGroupedIngredients
} from '../js/store/selectors/ingredientSelectors';

describe('selectGroupedIngredients', () => {
  xit('needs tests');
});

describe('selectFilteredGroupedIngredients', () => {
  const selector = selectFilteredGroupedIngredients.resultFunc;

  const GROUPED_INGREDIENTS = [{
    name: 'A',
    ingredients: [
      { searchable: [ 'a', '1', 'alpha' ] },
      { searchable : [ 'a', '2' ] }
    ]
  }, {
    name: 'B',
    ingredients: [
      { searchable : [ 'b', '1' ] },
      { searchable : [ 'b', '2' ] }
    ]
  }];

  it('should return grouped ingredients as-is when the search term is the empty string', () => {
    selector(GROUPED_INGREDIENTS, '').should.deep.equal(GROUPED_INGREDIENTS);
  });

  it('should return grouped ingredients as-is when the search term is whitespace-only', () => {
    selector(GROUPED_INGREDIENTS, ' \t').should.deep.equal(GROUPED_INGREDIENTS);
  });

  it('should return the empty list if nothing matches', () => {
    selector(GROUPED_INGREDIENTS, 'fskjdhfk').should.deep.equal([]);
  });

  it('should return one group with one match when one ingredient matches', () => {
    selector(GROUPED_INGREDIENTS, 'alpha').should.deep.equal([{
      name: 'A',
      ingredients: [
        { searchable: [ 'a', '1', 'alpha' ] }
      ]
    }]);
  });

  it('should return multiple groups if there are matches in multiple groups', () => {
    selector(GROUPED_INGREDIENTS, '1').should.deep.equal([{
      name: 'A',
      ingredients: [
        { searchable: [ 'a', '1', 'alpha' ] }
      ]
    }, {
      name: 'B',
      ingredients: [
        { searchable: [ 'b', '1' ] }
      ]
    }]);
  });

  it('should omit entire groups if they have no matching results', () => {
    selector(GROUPED_INGREDIENTS, 'a').should.deep.equal([{
      name: 'A',
      ingredients: [
        { searchable: [ 'a', '1', 'alpha' ] },
        { searchable : [ 'a', '2' ] }
      ]
    }]);
  });

  it('should find the search term as a substring when matching', () => {
    selector(GROUPED_INGREDIENTS, 'lph').should.deep.equal([{
      name: 'A',
      ingredients: [
        { searchable: [ 'a', '1', 'alpha' ] }
      ]
    }]);
  });

  it('should be case-insensitive when matching', () => {
    selector(GROUPED_INGREDIENTS, 'ALPHA').should.deep.equal([{
      name: 'A',
      ingredients: [
        { searchable: [ 'a', '1', 'alpha' ] }
      ]
    }]);
  });

});
