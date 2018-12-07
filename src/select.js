const select = selector => (
  (...args) => (_, getState) => selector(getState(), ...args)
);

export default select;