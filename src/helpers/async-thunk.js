import { compose } from 'redux';
import { ensureAsyncCompose } from './promises';

export const withHandler = promiseMethod => (handlingThunk, ...handlingArgs) => thunk => (
  (...args) => dispatch => {
    const asyncThunk = ensureAsyncCompose(dispatch, thunk);
    const handler = compose(
      dispatch,
      (...newArgs) => handlingThunk(...handlingArgs, ...newArgs)
    );

    const promise = asyncThunk(...args);
    return promise[promiseMethod](handler);
  }
);