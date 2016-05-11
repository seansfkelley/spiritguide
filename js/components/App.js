import React from 'react';
import { connect } from 'react-redux';
import PureRender from 'pure-render-decorator';

import { selectGroupedAlphabeticalRecipes } from '../store/selectors';
import { recipe } from './propTypes';
import RecipeList from './RecipeList';

@PureRender
class App extends React.Component {
  static propTypes = {
    groupedRecipes: React.PropTypes.arrayOf(React.PropTypes.arrayOf(recipe))
  };

  render() {
    return (
      <RecipeList recipes={this.props.groupedRecipes}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    groupedRecipes: selectGroupedAlphabeticalRecipes(state)
  };
}

export default connect(mapStateToProps)(App);
