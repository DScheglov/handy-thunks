# `createThunk(actionCreators, selectors)(thunk)`

```js
type ActionCreators = 
  dispatch: Dispatch => { [string]: (...args: any[]) => any } |
  { [string]: (...args: any[]) => any }
;

type GetState = <S>() => S;

type Selector = <S>(state: S, ...args: any[]) => any;

type Selectors = 
  { getState: GetState<S> => any } |
  Array<Selector> |
  { [string]: Selector }
;

createThunk(
  actionCreators: ActionCreators,
  selectors: Selectors
): Thunk
```

Creates a new **thunk** based on regular or async function 