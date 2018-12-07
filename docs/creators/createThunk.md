# `createThunk(actionCreators, selectors)(func)`

```
createThunk: ([actionCreators], [selectors]) -> (func: Func<R>) -> Thunk<R>
```

Creates a new **thunk** based on regular or async function.

This creators is designed to make extraction code from React life-cycle methods easer.

Use `createThunk` if you need to write more consice code (you do not need to explicitly
use `dispatch` or `getState`).

## Example

```js
import { createThunk } from 'handy-thunks';
import { startLoading, endLoading } from './action-creators';
import { getCurrentId, getDataById } from './selectors';

const actionCreators = { startLoading, endLoading };
const selectors = { getCurrentId, getDataById };

const postForm = createThunk(actionCreators, selectors)(
  async function(
    { startLoading, endLoading }, // actions bound to dispatch
    { getCurrentId, getDataById }, // selectors bound to getState
    id = getCurrentId() // if id isn't passed we getting id from state
  ) {
    startLoading('POSTING::DATA');
    try {
      const data = getDataById(id);
      const result = await api().post(`/some/data/${id}`, data);
      return result;
    } finally {
      endLoading('POSTING::DATA')
    }
});

store.dispatch(
  postForm() // posting the data get by id from state
);

store.dispatch(
  postForm(123) // posting the data get by id from function call
);
```

## Parameters:

*first function application*
 - **actionCreators**: `Function` | `Map<String, ActionCreator>` | `Array<Selector>`, *optional* - action creators to be bound with dispatch. If **actionCreators** is not specifed the `dispatch` will be passed to the **func**.
 - **selectors**: `Function` | `Map<String, Selector>` | `Array<Selector>`, *optional* - selectors to be bount with getState. If **selectors** is not specified the `getState` will be passed to the **func**.

*second function application*
 - **func**: `Function`, ***required*** - function that receives bound action creators and bound selectors, and all arguments passed to the resulting Thunk and implements required logic.

## Returns:
 - **thunk**: `Thunk` -- thunk that receives **actionCreators** bound with `dispatch`, **selectors** bound with `getState` and all other arguments passed by the call.

## `actionCreators` as Function

```
actionCreators: dispatch -> any
```

Receives the `dispatch` and returns any that **func** needs.

It is an analog of `mapDispatchToProps` from `react-redux`.

The default value of **actionCreators** is `idX` function (`x => x`);

**Example**:
```js
import { bindActionCreators } from 'redux';
import { startLoading, endLoading } from './action-creators';

const actionCreators = dispatch => bindActionCreators(
  { startLoading, endLoading }, dispatch
);  

```

## `selectors` as Function

```
selectors: getState -> any
```

Receives the `getState` and returns any that **func** needs.

As Instance, you can just call `getState` to pass the stored `state` to the function.

**Example**:
```js
const selectors = getState => getState();
```