import React from 'react';
import PureRender from 'pure-render-decorator';

import RecipeList from './RecipeList';

@PureRender
export default class App extends React.Component {
  render() {
    return (
      <RecipeList
        recipes={[{
          name: 'Test Recipe',
          base: 'gin',
          ingredients: [],
          instructions: 'Mix it!'
        }]}
      />
    );
  }
}
