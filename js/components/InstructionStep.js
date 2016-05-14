import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';

import {
  DEFAULT_SERIF_FONT_FAMILY,
  DEFAULT_SANS_SERIF_FONT_FAMILY
} from './constants';

@PureRender
export default class InstructionStep extends React.Component {
  static propTypes = {
    number: React.PropTypes.number.isRequired,
    text: React.PropTypes.string.isRequired,
    style: View.propTypes.style
  };

  render() {
    return (
      <View style={[ this.props.style, styles.container ]}>
        <Text style={styles.number}>{this.props.number}.</Text>
        <Text style={styles.text}>{this.props.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  number: {
    fontFamily: DEFAULT_SERIF_FONT_FAMILY,
    color: '#999',
    marginRight: 6,
    fontSize: 16,
    marginTop: 3
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontFamily: DEFAULT_SANS_SERIF_FONT_FAMILY,
    marginBottom: 8
  }
});
