[![Build Status](https://travis-ci.org/DScheglov/handy-thunks.svg?branch=master)](https://travis-ci.org/DScheglov/handy-thunks)
[![Coverage Status](https://coveralls.io/repos/github/DScheglov/handy-thunks/badge.svg?branch=master)](https://coveralls.io/github/DScheglov/handy-thunks?branch=master)
# handy-thunks

Tools for coding with `redux-thunk`

## Installation

```shell
npm i handy-thunks
```

## Overview

The package provides easy way to create, enhance and compose `thunks` in order to build flow of any complexity by using following tools:

### 1. **Thunk** creators:
   - [`createThunk(actionCreators, selectors)(func)`](https://github.com/DScheglov/handy-thunks/tree/master/samples/create-thunk) - creates new **thunk** based on regular or async function
   - [`voidThunk`](https://github.com/DScheglov/handy-thunks/tree/master/samples/void-thunk) - creates a **thunk** that do nothing

### 2. Flow compositors:
   - [`all(arrayOfThunks)`](https://github.com/DScheglov/handy-thunks/tree/master/samples/all) - creates new **thunk** that runs base thunks in parallel
   - [`queue(arrayOfThunks)`](https://github.com/DScheglov/handy-thunks/tree/master/samples/queue) - creates new **thunk** that runs base thunks one by one with arguments of new thunk
   - [`chain(arrayOfThunks)`](https://github.com/DScheglov/handy-thunks/tree/master/samples/chain) - create new **thunk** that runs base thunks one by one and passes the result of previous **thunk** to the next one


### 3. **Thunk** decorators:
   - [`connected(selector)(thunk)`](https://github.com/DScheglov/handy-thunks/tree/master/samples/connected) - creates a new **thunk** that dispatches the original one with result returned be specified selector
   - [`loading(startAction, endAction)(...loadingArgs)(thunk)`](https://github.com/DScheglov/handy-thunks/tree/master/samples/loading) - creates a new **thunk** that dispatches `startAction` before calling original **thunk** and `endAction` after the promise returned by original **thunk** resolves or rejects.
   - [`fallback(fallbackThunk)(thunk)`](https://github.com/DScheglov/handy-thunks/tree/master/samples/fallback) - creates a new **thunk** that dispatches a `fallbackThunk` in case if `promise` returned by original **thunk** is rejected.
   - [`cleanUp(cleanUpThunk)(thunk)`](https://github.com/DScheglov/handy-thunks/tree/master/samples/clean-up) - creates a new **thunk** that dispatches a `cleanUpThunk` after `promise` returned by original **thunk** is resolved or rejected.
   - [`onlyIf(predicate)(thunk)`](https://github.com/DScheglov/handy-thunks/tree/master/samples/only-if) - creates a new **thunk** that dispatches the original one only if `predicate` called with arguments returns `true`. In other case the new **thunk** does nothing.
   - [`chained(keySelector)(thunk)`](https://github.com/DScheglov/handy-thunks/tree/master/samples/chained) - creates a new **thunk** that dispatches the original one after all promises returned in previous calls are resolved.
   - [`single(keySelector)(thunk)`](https://github.com/DScheglov/handy-thunks/tree/master/samples/single) - creates a new **thunk** that prevents dispatching an original thunk if promise returned by the previous call is not resolved yet.
   - [`postponded(delay, keySelector)(thunk)`](https://github.com/DScheglov/handy-thunks/tree/master/samples/postponded) - create a new **thunk** that dispatches the original one in delay specified. If during this delay the new **thunk** will be called again (one or more time), the original thunk will be dispatched with argumetns of last call.
   - [`lazy(thunk)`](https://github.com/DScheglov/handy-thunks/tree/master/samples/lazy) - creates a new **thunk** that dispatches the original one, but returns resolved promise not waiting for resolution of original **thunk** promise at all.


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

