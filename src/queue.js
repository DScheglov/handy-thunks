import { ensureAsyncCompose } from './helpers/promises';

const queue = (...thunks) => (...args) => dispatch => {
  const initial = ensureAsyncCompose(dispatch, thunks[0]);
  return thunks.slice(1).reduce(
    (promise, thunk) => promise.then(
      () => dispatch(thunk(...args))
    ),
    initial(...args)
  );
};

export default queue;