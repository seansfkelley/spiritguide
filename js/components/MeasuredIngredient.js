import _ from 'lodash';
import React from 'react';
import { View, ListView, Text, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';

import { measuredIngredient } from './propTypes';
import { DEFAULT_SANS_SERIF_FONT_FAMILY } from './constants';
import { fractionify } from '../util/format';
import Difficulty from './Difficulty';
import DifficultyPill from './DifficultyPill';

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
    return (
      <View style={[ styles.container, this.props.style ]}>
        <View style={styles.mainRow}>
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
              ? <DifficultyPill difficulty={this.props.difficulty}/>
              : null}
          </View>
        </View>
        {this.props.isSubstituted && this.props.displaySubstitutes
          ? <View style={styles.substituteList}>
              {this._formatSubstitutes()}
            </View>
          : null}
      </View>
    );
  }

  _formatSubstitutes() {
    const substitutes = this.props.displaySubstitutes;
    let text;
    if (substitutes.length === 1) {
      text = substitutes[0];
    } else {
      text = `${substitutes.slice(0, substitutes.length - 1).join(', ')} or ${substitutes[substitutes.length - 1]}`;
    }
    return (
      <Text style={styles.substitutes}>substitute: {text}</Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  mainRow: {
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
  substituteList: {
    paddingLeft: 30,
    paddingTop: 5,
  },
  substitutes: {
    fontFamily: DEFAULT_SANS_SERIF_FONT_FAMILY,
    color: '#444'
  }
});
