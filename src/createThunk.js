import { bindActionCreators } from 'redux';
import { bindSelectors } from './bind-selectors';
import idX from './idX';

const createThunk = (actionCreators = idX, selectors = idX) => func => (
  (...args) => (dispatch, getState) => func(
    bindActionCreators(actionCreators, dispatch),
    bindSelectors(selectors, getState),
    ...args
  )
);

export default createThunk;
