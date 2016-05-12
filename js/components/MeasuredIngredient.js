import React from 'react';
import { View, ListView, Text, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';

import { measuredIngredient } from './propTypes';
import { fractionify } from '../util/format';

@PureRender
export default class MeasuredIngredient extends React.Component {
  static propTypes = {
    ingredient: measuredIngredient.isRequired,
    style: View.propTypes.style
  };

  render() {
    return (
      <View style={[ styles.ingredient, this.props.style ]}>
        <Text style={styles.amount}>{fractionify(this.props.ingredient.displayAmount)}</Text>
        <Text style={styles.unit}>{this.props.ingredient.displayUnit}</Text>
        <Text style={styles.ingredient}>{this.props.ingredient.displayIngredient}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ingredient: {
    flexDirection: 'row'
  },
  amount: {
  },
  unit: {
  },
  ingredient: {

  }
});
