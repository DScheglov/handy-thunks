const onlyIf = predicate => thunk => (
  (...args) => dispatch => (
    predicate(...args)
      ? dispatch(thunk(...args))
      : Promise.resolve()
  )
);

export default onlyIf;