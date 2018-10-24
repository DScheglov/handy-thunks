import * as Redux from 'redux';
import thunk from 'redux-thunk';

import allActions from './all-actions';

const createStore = (reducers, initialState) => Redux.createStore(
  Redux.combineReducers({ ...reducers, allActions }),
  initialState,
  Redux.applyMiddleware(thunk)
);

export default createStore;
