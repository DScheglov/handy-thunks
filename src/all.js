const all = thunks => (...args) => dispatch => Promise.all(
  thunks.map(
    thunk => dispatch(thunk(...args))
  )
);

export default all;