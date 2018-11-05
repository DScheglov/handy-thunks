export const isFunc = fn => (
  typeof fn === 'function'
);

export const ensureFunc = (fn, def) => (
  isFunc(fn) ? fn : def
);
