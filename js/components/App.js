import React from 'react';
import { connect } from 'react-redux';
import PureRender from 'pure-render-decorator';

import { selectAlphabeticalRecipes } from '../store/selectors';
import { recipe } from './propTypes';
import RecipeList from './RecipeList';

@PureRender
class App extends React.Component {
  static propTypes = {
    alphabeticalRecipes: React.PropTypes.arrayOf(recipe)
  };

  render() {
    return (
      <RecipeList recipes={this.props.alphabeticalRecipes}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    alphabeticalRecipes: selectAlphabeticalRecipes(state)
  };
}

export default connect(mapStateToProps)(App);
