import { compose } from 'redux';
import { ensureAsync } from './promises';

export const withHandler = promiseMethod => (handlingThunk, ...handlingArgs) => thunk => (
  (...args) => dispatch => {
    const asyncThunk = ensureAsync(compose(dispatch, thunk));
    const handler = compose(dispatch, handlingThunk);
    return asyncThunk(...args)[promiseMethod](
      result => handler(...handlingArgs, result)
    );
  }
);