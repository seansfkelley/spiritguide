import _ from 'lodash';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';

import { DEFAULT_SANS_SERIF_FONT_FAMILY } from './constants';
import Difficulty, { DIFFICULTY_COLOR, DIFFICULTY_TEXT } from './Difficulty';

@PureRender
export default class DifficultyPill extends React.Component {
  static propTypes = {
    difficulty: React.PropTypes.oneOf(_.values(Difficulty)).isRequired
  };

  render() {
    const difficultyColor = DIFFICULTY_COLOR[this.props.difficulty];
    return (
      <Text style={[ styles.pill, { color: difficultyColor, borderColor: difficultyColor } ]}>
        {DIFFICULTY_TEXT[this.props.difficulty].toUpperCase()}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  pill: {
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
