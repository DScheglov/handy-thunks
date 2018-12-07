import { mapKeys } from './map-keys';

const bindSelector = getState => selector => (...args) => selector(
  getState(),
  ...args
);

const bindActionCreator = dispatch => actionCreator => (...args) => dispatch(
  actionCreator(...args)
);

const mapWith = createBinder => (methods, storeMethod) => {
  const typeOfMethods = typeof methods;

  if (typeOfMethods === 'function') {
    return methods(storeMethod);
  }

  const binder = createBinder(storeMethod);

  if (Array.isArray(methods)) {
    return methods.map(binder);
  }

  if (typeOfMethods === 'object') {
    return mapKeys(methods, binder);
  }

  return storeMethod;
};

export const bindSelectors = mapWith(bindSelector);
export const bindActionCreators = mapWith(bindActionCreator);