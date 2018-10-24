import { ensurePromise } from './helpers';
import { compose } from 'redux';

const chain = thunks => (...args) => dispatch => {
  const first = thunks[0];
  const initial = ensurePromise(compose(dispatch, first));

  return thunks.slice(1).reduce(
    (promise, thunk) => promise.then(compose(dispatch, thunk)),
    initial(...args)
  );
};

export default chain;