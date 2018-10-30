# handy-thunks

Tools for coding with `redux-thunk`

## Installation

```shell
npm i handy-thunks
```

## Overview

The package provides easy way to create, enhance and compose `thunks` in order to build flow of any complexity by using following tools:

### 1. **Thunk** creators:
   - [`createThunk(actionCreators, selectors)(func)`](./samples/create-thunk) - creates new **thunk** based on regular or async function
   - [`voidThunk`](./samples/void-thunk) - creates a **thunk** that do nothing

### 2. Flow compositors:
   - [`all(arrayOfThunks)`](./samples/all) - creates new **thunk** that runs base thunks in parallel
   - [`queue(arrayOfThunks)`](./samples/queue) - creates new **thunk** that runs base thunks one by one with arguments of new thunk
   - [`chain(arrayOfThunks)`](./samples/chain) - create new **thunk** that runs base thunks one by one and passes the result of previous **thunk** to the next one


### 3. **Thunk** decorators:
   - [`connected(selector)(thunk)`](./samples/connected) - creates a new **thunk** that dispatches the original one with result returned be specified selector
   - [`loading(startAction, endAction)(...loadingArgs)(thunk)`](./samples/loading) - creates a new **thunk** that dispatches `startAction` before calling original **thunk** and `endAction` after the promise returned by original **thunk** resolves or rejects.
   - [`fallback(fallbackThunk)(thunk)`](./samples/fallback) - creates a new **thunk** that dispatches a `fallbackThunk` in case if `promise` returned by original **thunk** is rejected.
   - [`cleanUp(cleanUpThunk)(thunk)`](./samples/clean-up) - creates a new **thunk** that dispatches a `cleanUpThunk` after `promise` returned by original **thunk** is resolved or rejected.
   - [`onlyIf(predicate)(thunk)`](./samples/only-if) - creates a new **thunk** that dispatches the original one only if `predicate` called with arguments returns `true`. In other case the new **thunk** does nothing.
   - [`chained(keySelector)(thunk)`](./samples/chained) - creates a new **thunk** that dispatches the original one after all promises returned in previous calls are resolved.
   - [`single(keySelector)(thunk)`](./samples/single) - creates a new **thunk** that prevents dispatching an original thunk if promise returned by the previous call is not resolved yet.
   - [`postponded(delay, keySelector)(thunk)`](./samples/postponded) - create a new **thunk** that dispatches the original one in delay specified. If during this delay the new **thunk** will be called again (one or more time), the original thunk will be dispatched with argumetns of last call.
   - [`lazy(thunk)`](./samples/lazy) - creates a new **thunk** that dispatches the original one, but returns resolved promise not waiting for resolution of original **thunk** promise at all.


## Example:

**./src/flows.js** (*complicated thunks*):
```js
import { queue, all, connected, loading } from 'handy-thunks';

import { getUser } from './store/users';
import { loadUser, loadContracts, loadOffers } from './thunks';


const withUserId = connected(state => getUser(state).id);
const withLoading = loading(startLoading, endLoading)('ALL');

const fetchUserData = queue([
  loadUser,
  all([
    withUserId(loadContracts),
    withUserId(loadOffers),
  ]),
]);

export default withLoading(fetchUserData);
```

**./src/thunks.js** (*simple thunks*):
```js
import { compose } from 'redux';
import api from './api';
import { saveUser, readUser } from './store/users';
import { saveUserContracts, readContracts } from './store/contracts';
import { saveUserOffers, readOffers } from './store/offers';

export const loadUser = () => dispatch => api()
  .get('/user')
  .then(compose(dispatch, saveUser, readUser));

export const loadContracts = userId => dispatch => api()
  .get(`/users/${userId}/contracts`)
  .then(compose(dispatch, saveUserContracts, readContracts));

export const loadOffers = userId => dispatch => api()
  .get(`/users/${userId}/offers`)
  .then(compose(dispatch, saveUserOffers, readOffers));
```

