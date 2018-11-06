# `createThunk(actionCreators, selectors)(thunk)`

```js
type ActionCreators = 
  dispatch: Dispatch => { [string]: (...args: mixed[]) => mixed } |
  { [string]: (...args: mixed[]) => mixed }
;

type GetState = <S>() => S;

type Selector = <S>(state: S, ...args: mixed[]) => mixed;

type Selectors = 
  { getState: GetState<S> => mixed } |
  Array<Selector> |
  { [string]: Selector }
;

createThunk(
  actionCreators: ActionCreators,
  selectors: Selectors
): Thunk
```

Creates a new **thunk** based on regular or async function 