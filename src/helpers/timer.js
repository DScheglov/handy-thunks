import { ensureAsync } from './promises';
import { compose } from 'redux';

const Timer = delay => ITimer(
  timerState(delay), {}
);

const ITimer = (state, self) => Object.assign(self, {
  start: start(state, self),
  promise: () => state.promise,
});

const timerState = delay => ({
  promise: null,
  resolve: null,
  reject: null,
  timier: null,
  delay,
});

const start = (state, self) => compose(
  () => self,
  startTimer(state),
  ensureTimerPromise(state),
  resetTimer(state),
  setCallback(state) 
);

const setCallback = state => cb => {
  state.callback = ensureAsync(cb); 
};

const resetTimer = state => () => {
  if (state.timer) clearTimeout(state.timer);
  state.timer = null;
};

const ensureTimerPromise = state => () => {
  state.promise = (
    state.promise ||
    new Promise(assignResolveReject(state))
  );
};

const assignResolveReject = state => (_resolve, _reject) => {
  state.resolve = _resolve;
  state.reject = _reject;
};

const startTimer = state => () => {
  const { delay, resolve, reject, callback } = state;

  state.timer = setTimeout(
    () => callback()
      .finally(reset(state))
      .then(resolve, reject),
    delay
  );
};

const reset = state => () => {
  state.promise = null;
  state.timer = null;
};

export default Timer;
