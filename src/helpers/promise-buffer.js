const assign = promises => (key, promise) => {
  promises[key] = promise;
  return promise;
};

const reset = promises => key => () => {
  promises[key] = null;
};

const get = promises => id => promises[id];

const IPromiseBuffer = promises => ({
  assign: assign(promises),
  reset: reset(promises),
  get: get(promises),
});

const PromiseBuffer = () => IPromiseBuffer([]);

export default PromiseBuffer;