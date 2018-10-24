const allActions = (state = [], action) => (
  action.type.indexOf('@@redux/INIT') < 0
    ? [...state, action]
    : state
);

export default allActions;