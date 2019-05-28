import { compose } from 'redux';
import { ensureAsync } from './helpers/promises';

const chain = (...thunks) => {
  if (Array.isArray(thunks[0])) {
    // supporting previous interface of the chain decorator
    thunks = thunks[0];
  }

  return (...args) => dispatch => {
    const first = thunks[0];
    const initial = ensureAsync(compose(dispatch, first));

    return thunks.slice(1).reduce(
      (promise, thunk) => promise.then(compose(dispatch, thunk)),
      initial(...args)
    );
  };
}

export default chain;