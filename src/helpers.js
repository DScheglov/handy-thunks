export const isPromise = value => (
  value != null && typeof value.then === 'function'
);

export const ensureResolved = value => (
  isPromise(value) ? value : Promise.resolve(value)
);

export const ensureRjected = value => (
  isPromise(value) ? value : Promise.reject(value)
);

export const ensurePromise = fn => (...args) => {
  try {
    return ensureResolved(fn(...args));
  } catch (err) {
    return ensureRjected(err);
  }
};
