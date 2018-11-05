const lazy = thunk => (
  (...args) => dispatch => {
    dispatch(thunk(...args));
    return Promise.resolve(args[0]);
  }
);

export default lazy;
