import update from 'immutability-helper';

import ActionType from '../ActionType';

const EMPTY_STORE = {
  initialLoadComplete: false
};

export default function reduceApp(state = EMPTY_STORE, action) {
  switch(action.type) {
    case ActionType.INITIAL_LOAD_COMPLETE:
      return update(state, {
        initialLoadComplete: true
      });

    default:
      return state;
  }
}
