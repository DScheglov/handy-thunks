const bindSelector = getState => selector => (...args) => selector(getState(), ...args);

const _bindSelectors = (selectors, getState) => {
  const bind = bindSelector(getState);
  return Object.keys(selectors).reduce(
    (bound, name) => {
      bound[name] = bind(selectors[name]);
      return bound;
    }, {}
  );
};

export const bindSelectors = (selectors, getState) => (
  Array.isArray(selectors) ? selectors.map(bindSelector(getState)) :
  typeof selectors === 'function' ? selectors(getState) :
  typeof selectors === 'object' ? _bindSelectors(selectors, getState) :
  getState
);
