import { ensureAsyncCompose } from './helpers/promises';
import { ensureFunc } from './helpers/funcs';
import StateManager from './helpers/state-manager';
import Timer from './helpers/timer';


const lazy0 = () => 0;

const postponed = (delay, keySelector) => thunk => {
  const { assign, get } = StateManager();
  const getKey = ensureFunc(keySelector, lazy0);

  return (...args) => dispatch => {
    const key = getKey(...args);
    const timer = get(key) || Timer(delay);
    const newThunk = ensureAsyncCompose(dispatch, thunk);

    assign(
      key, timer.start(
        () => newThunk(...args)
      )
    );

    return timer.promise();
  };
};

export default postponed;
