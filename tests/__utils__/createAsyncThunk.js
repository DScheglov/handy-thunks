import { compose } from 'redux';
import { ensureAsync, ensureRejected } from '../../src/helpers/promises';

const createAsyncThunk = (asyncFn, successAction, failAction) => (...args) => dispatch => (
  ensureAsync(asyncFn)(...args)
    .then(compose(dispatch, successAction))
    .catch(compose(ensureRejected, dispatch, failAction))
);

export default createAsyncThunk;