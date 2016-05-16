import React from 'react';
import { View, StyleSheet } from 'react-native';
import PureRender from 'pure-render-decorator';

import { ingredient } from './propTypes';

@PureRender
export default class IngredientConfigurator extends React.Component {
  static propTypes = {
    groupedIngredients: React.PropTypes.arrayOf().isRequired
  };

  render() {
    return (
      <View style={styles.container}>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  }
});
