import { compose } from 'redux';

const createAsyncThunk = (asyncFn, successAction, failAction) => (...args) => dispatch => (
  asyncFn(...args)
    .then(compose(dispatch, successAction))
    .catch(compose(dispatch, failAction))
);

export default createAsyncThunk;