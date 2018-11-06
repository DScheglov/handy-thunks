const assign = branches => (key, branch) => {
  branches[key] = branch;
  return branch;
};

const reset = branches => key => () => {
  branches[key] = null;
};

const get = branches => id => branches[id];

const IStateManager = branches => ({
  assign: assign(branches),
  reset: reset(branches),
  get: get(branches),
});

const StateManager = () => IStateManager([]);

export default StateManager;