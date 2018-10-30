# handy-thunks

Tools for coding with `redux-thunk`

## Installation

```shell
npm i handy-thunks
```

## Overview

The package provides easy way to create, enhance and compose `thunks` in order to build flow of any complexity by using following tools:

### [1. Thunk creators](#creators):
   - `createThunk(actionCreators, selectors)(func)`
   - `voidThunk`

### [2. Flow compositors](#compositors):
   - `all(arrayOfThunks)`
   - `queue(arrayOfThunks)`
   - `chain(arrayOfThunks)`

### [3. Thunk decorators](#decorators):
   - `connected(selector)(thunk)`
   - `loading(startAction, endAction)(thunk)`
   - `fallback(fallbackThunk)(thunk)`
   - `cleanUp(cleanUpThunk)(thunk)`
   - `onlyIf(predicate)(thunk)`
   - `chained(keySelector)(thunk)`
   - `single(keySelector)(thunk)`
   - `postponded(keySelector)(thunk)`
   - `lazy(thunk)`



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

