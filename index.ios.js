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

import React from 'react';
import { AppRegistry, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';

import App from './js/components/App';
import store, { initializeStore } from './js/store';

initializeStore();

class spiritguide extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <App/>
        </View>
      </Provider>
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
