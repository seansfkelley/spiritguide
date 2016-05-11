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
import styles from './js/styles';

initializeStore();

class SpiritGuideApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.app}>
          <App/>
        </View>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('spiritguide', () => SpiritGuideApp);
