import { ensureAsyncCompose } from './helpers/promises';
import PromiseBuffer from './helpers/promise-buffer';
import { ensureFunc } from './helpers/funcs';


const lazy0 = () => 0;

const chained = keySelector => thunk => {
  const { assign, get } = PromiseBuffer();
  const getKey = ensureFunc(keySelector, lazy0);

  return (...args) => dispatch => {
    const key = getKey(...args);
    const promise = get(key);
    const newThunk = ensureAsyncCompose(dispatch, thunk);

    return assign(
      key, promise
        ? promise.then(() => newThunk(...args))
        : newThunk(...args)
    );
  };
};

export default chained;
