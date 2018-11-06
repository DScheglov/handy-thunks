import { ensureAsyncCompose } from './helpers/promises';
import { ensureFunc } from './helpers/funcs';
import StateManager from './helpers/state-manager';
import TimerState from './helpers/timer-state';


const lazy0 = () => 0;

const postponded = (delay, keySelector) => thunk => {
  const { assign, get } = StateManager();
  const getKey = ensureFunc(keySelector, lazy0);

  return (...args) => dispatch => {
    const key = getKey(...args);
    const timer = get(key) || TimerState(delay);
    const newThunk = ensureAsyncCompose(dispatch, thunk);

    assign(
      key, timer.startWith(() => newThunk(...args))
    );

    return timer.promise;
  };
};

export default postponded;
