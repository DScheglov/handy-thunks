import { bindSelectors, bindActionCreators } from './helpers/bind-redux';
import idX from './helpers/idX';

const createThunk = (actionCreators = idX, selectors = idX) => func => (
  (...args) => (dispatch, getState) => func(
    bindActionCreators(actionCreators, dispatch),
    bindSelectors(selectors, getState),
    ...args
  )
);

export default createThunk;
