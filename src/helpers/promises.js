import { compose } from 'redux';

export const isPromise = value => (
  value != null && typeof value.then === 'function'
);

export const ensureResolved = value => (
  isPromise(value) ? value : Promise.resolve(value)
);

export const ensureRejected = value => (
  isPromise(value) ? value : Promise.reject(value)
);

export const ensureAsync = fn => (...args) => {
  try {
    return ensureResolved(fn(...args));
  } catch (err) {
    return ensureRejected(err);
  }
};

export const ensureAsyncCompose = compose(ensureAsync, compose);