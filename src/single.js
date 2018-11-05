import { ensureAsyncCompose } from './helpers/promises';
import PromiseBuffer from './helpers/promise-buffer';
import { ensureFunc } from './helpers/funcs';


const lazy0 = () => 0;

const single = keySelector => thunk => {
  const { assign, reset, get } = PromiseBuffer();
  const getKey = ensureFunc(keySelector, lazy0);

  return (...args) => dispatch => {
    const key = getKey(...args);
    const promise = get(key);

    if (promise) return promise;

    const newThunk = ensureAsyncCompose(dispatch, thunk);
    return assign(
      key, newThunk(...args).finally(reset(key))
    );
  };
};

export default single;
