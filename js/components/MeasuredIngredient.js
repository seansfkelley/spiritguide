import React from 'react';
import { View, ListView, Text, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';

import { measuredIngredient } from './propTypes';
import { DEFAULT_SANS_SERIF_FONT_FAMILY } from './constants';
import { fractionify } from '../util/format';

@PureRender
export default class MeasuredIngredient extends React.Component {
  static propTypes = {
    ingredient: measuredIngredient.isRequired,
    style: View.propTypes.style
  };

  render() {
    return (
      <View style={[ styles.container, this.props.style ]}>
        <View style={styles.amountWrapper}>
          <Text style={styles.amount}>{fractionify(this.props.ingredient.displayAmount)}</Text>
          <Text style={styles.unit}>{_.get(this.props.ingredient, 'displayUnit', '').toUpperCase()}</Text>
        </View>
        <Text style={styles.ingredient}>{this.props.ingredient.displayIngredient}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  amountWrapper: {
    width: 100,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  amount: {
    marginRight: 4,
    fontFamily: DEFAULT_SANS_SERIF_FONT_FAMILY
  },
  unit: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
    fontFamily: DEFAULT_SANS_SERIF_FONT_FAMILY
  },
  ingredient: {
    flex: 1,
    fontFamily: DEFAULT_SANS_SERIF_FONT_FAMILY
  }
});
