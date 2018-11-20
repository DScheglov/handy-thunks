const connected = selector => thunk => (
  (...args) => (dispatch, getState) => dispatch(
    thunk(selector(getState(), ...args), ...args)
  )
);

export default connected;
