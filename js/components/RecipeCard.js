import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';

import { recipe } from './propTypes';

@PureRender
export default class RecipeCard extends React.Component {
  static propTypes = {
    recipe: recipe.isRequired,
    style: View.propTypes.style
  };

  render() {
    return (
      <View style={[ styles.card, this.props.style ]}>
        <Text>{this.props.recipe.name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {

  }
});
