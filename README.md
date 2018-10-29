# handy-thunks

Tools for coding with `redux-thunks`

## Installation

```shell
npm i handy-thunks
```

## Overview

The package provides easy way to enhance and compose `thunks` in order to build flow of any complexity by using following tools:

### 1. Flow compositors:
   - [`all(arrayOfThunks)`](#all) - creates new thunk that runs base thunks in parallel
   - [`queue(arrayOfThunks)`](#queue) - creates new thunk that runs base thunks one by one with arguments of new thunk
   - [`chain(arrayOfThunks)`](#chain) - create new thunk that runs base thunks one by one and passes the result of previous thunk to the next one

### 2. Thunk decorators:
   - [`connected(...selectors)(thunk)`](#connected)
   - [`loading(startAction, endAction)(thunk)`](#loading)
   - [`fallback(fallbackThunk)(thunk)`](#fallback)
   - [`onlyIf(predicate)(thunk)`](#only-if)
   - [`chained(keySelector)(thunk)`](#chained)
   - [`single(keySelector)(thunk)`](#single)
   - [`postponded(keySelector)(thunk)`](#postponded)
   - [`lazy(thunk)`](#lazy)

### 3. Other helpers:
  - [`voidThunk`](#void-thunk)


## Example:

**./src/flows.js** (*complicated thunks*):
```js
import { compose } from 'redux';
import { queue, all, connected, loading } from 'handy-thunks';

import { getUser } from './store/users';
import { loadUser, loadContracts, loadOffers } from './thunks';


const withUserId = connected(state => getUser(state).id);
const withLoading = loading(startLoading, endLoading);

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

