/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

// "polyfill" nextTick so PouchDB works.
process.nextTick = setImmediate;

// Log all the things ASAP.
import log from 'loglevel';
log.setLevel('debug');

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import App from './js/App';
import { initializeStore } from './js/store';

initializeStore();

class spiritguide extends Component {
  render() {
    return (
      <View style={styles.container}>
        <App/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('spiritguide', () => spiritguide);
