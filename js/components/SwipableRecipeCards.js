import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import PureRender from 'pure-render-decorator';

import { recipe } from './propTypes';

@PureRender
export default class SwipableRecipeCards extends React.Component {
  static propTypes = {
    recipes: React.PropTypes.arrayOf(recipe)
  };

  render() {
    return (
      <Text>testing!</Text>
    );
  }
}
