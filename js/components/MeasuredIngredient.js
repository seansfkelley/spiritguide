import _ from 'lodash';
import React from 'react';
import { View, ListView, Text, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';

import { measuredIngredient } from './propTypes';
import { DEFAULT_SANS_SERIF_FONT_FAMILY } from './constants';
import { fractionify } from '../util/format';
import Difficulty from './Difficulty';

const DIFFICULTY_COLOR = {
  [Difficulty.EASY]: 'green',
  [Difficulty.MEDIUM]: 'orange',
  [Difficulty.HARD]: 'red'
};

const DIFFICULTY_TEXT = {
  [Difficulty.EASY]: 'easy',
  [Difficulty.MEDIUM]: 'moderate',
  [Difficulty.HARD]: 'difficult'
};

@PureRender
export default class MeasuredIngredient extends React.Component {
  static propTypes = {
    ingredient: measuredIngredient.isRequired,
    style: View.propTypes.style,
    isMissing: React.PropTypes.bool,
    difficulty: React.PropTypes.oneOf(_.values(Difficulty)),
    isSubstituted: React.PropTypes.bool,
    displaySubstitutes: React.PropTypes.arrayOf(React.PropTypes.string)
  };

  render() {
    const difficultyColor = DIFFICULTY_COLOR[this.props.difficulty];
    return (
      <View style={[ styles.container, this.props.style ]}>
        <View style={styles.amountWrapper}>
          <Text style={styles.amount}>{fractionify(this.props.ingredient.displayAmount)}</Text>
          <Text style={styles.unit}>{_.get(this.props.ingredient, 'displayUnit', '').toUpperCase()}</Text>
        </View>
        <View style={styles.ingredientWrapper}>
          <Text style={[
            styles.ingredient,
            this.props.isMissing || this.props.isSubstituted ? styles.missing : null
          ]}>
            {this.props.ingredient.displayIngredient}
          </Text>
          {this.props.isMissing && this.props.difficulty
            ? <Text style={[ styles.difficulty, { color: difficultyColor, borderColor: difficultyColor } ]}>
                {DIFFICULTY_TEXT[this.props.difficulty].toUpperCase()}
              </Text>
            : null}
        </View>
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
  },
  ingredientWrapper: {
    flexDirection: 'row'
  },
  missing: {
    color: '#666',
    fontStyle: 'italic'
  },
  difficulty: {
    borderWidth: 1,
    borderRadius: 3,
    fontFamily: DEFAULT_SANS_SERIF_FONT_FAMILY,
    fontSize: 10,
    paddingTop: 3,
    paddingLeft: 4,
    paddingRight: 2,
    marginLeft: 6,
    lineHeight: 14
  }
});
