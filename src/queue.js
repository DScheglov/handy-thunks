const queue = thunks => (...args) => dispatch => thunks.reduce(
  (promise, thunk) => promise.then(
    () => dispatch(thunk(...args))
  ),
  Promise.resolve()
);

export default queue;