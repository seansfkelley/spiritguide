import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, StyleSheet, ActivityIndicatorIOS } from 'react-native';
import PureRender from 'pure-render-decorator';

import App from './App';
import { selectIsInitialLoadComplete } from '../store/selectors';

@PureRender
class AppWithLoadingScreen extends React.Component {
  static propTypes = {
    initialLoadComplete: React.PropTypes.bool.isRequired
  };

  render() {
    if (this.props.initialLoadComplete) {
      return (
        <App/>
      );
    } else {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicatorIOS size='large'/>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

function mapStateToProps(state) {
  return {
    initialLoadComplete: selectIsInitialLoadComplete(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWithLoadingScreen);
