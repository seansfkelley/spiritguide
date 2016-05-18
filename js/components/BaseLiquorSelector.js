import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PureRender from 'pure-render-decorator';

import { IOS_STATUS_BAR_BACKGROUND_COLOR, DEFAULT_SANS_SERIF_FONT_FAMILY } from './constants';
import * as filterActions from '../store/actions/filterActions';
import { ANY_BASE_LIQUOR, BASE_LIQUORS } from '../definitions';
import SwipeSelector from './dumb/SwipeSelector';

const BASE_LIQUOR_OPTIONS = [ ANY_BASE_LIQUOR ].concat(BASE_LIQUORS).map(l => ({
  label: l.toUpperCase(),
  value: l
}));

@PureRender
class BaseLiquorSelector extends React.Component {
  static propTypes = {};

  render() {
    return (
      <SwipeSelector
        style={styles.selector}
        options={BASE_LIQUOR_OPTIONS}
        optionWidth={125}
        optionStyle={styles.option}
        selectedOptionStyle={styles.selectedOption}
        onOptionSelect={this.props.filterActions.setBaseLiquorFilter}
      />
    );
  }
}

const styles = StyleSheet.create({
  selector: {
    backgroundColor: IOS_STATUS_BAR_BACKGROUND_COLOR
  },
  option: {
    backgroundColor: IOS_STATUS_BAR_BACKGROUND_COLOR,
    color: '#ddd',
    fontFamily: DEFAULT_SANS_SERIF_FONT_FAMILY,
    fontSize: 16,
    fontWeight: '600'
  },
  selectedOption: {
    color: '#eee',
    fontWeight: '700'
  }
});

function mapDispatchToProps(dispatch) {
  return {
    filterActions: bindActionCreators(filterActions, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(BaseLiquorSelector);
