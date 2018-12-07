export const mapKeys = (obj, mapper) => Object.keys(obj).reduce(
  (result, key) => Object.assign(result, {
    [key]: mapper(obj[key], key, obj),
  }),
  {}
);
