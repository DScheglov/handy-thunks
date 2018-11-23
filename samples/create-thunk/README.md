# `createThunk(actionCreators, selectors)(thunk)`

```
createThunk: ([actionCreators], [selectors]) -> func -> Thunk
```

Creates a new **thunk** based on regular or async function.
This creators is designed to make extraction code from React life-cycle methods 

## Example

```js
import { createThunk } from 'handy-thunks';

const actionCreators = {
  startLoading, endLoading, 
};

const selectors = { getCurrentId, getDataById };

const postForm = createThunk(actionCreators, selectors)((
  { startLoading, endLoading }, // actions bound to dispatch
  { getCurrentId, getDataById }, // selectors bound to getState
  id = getCurrentId()
) => {
  startLoading('POSTING::DATA');
  return api()
    .post(`/some/data/${id}`, getDataById(id))
    .finally(() => endLoading('POSTING::DATA'));
});
```

## Parameters:

 - **actionCreators**: `Function` | `Map<String, ActionCreator>`, *optional* - action creators to be bound with dispatch
 - **selectors**: `Function` | `Map<String, Selector>` | `Array<Selector>`, *optional* - selectors to be bount with getState
 - **func**: `Function`, ***required*** - function that receives bound action creators and bound selectors, and all arguments passed to the resulting Thunk and implements required logic.