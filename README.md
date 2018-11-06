# handy-thunks &middot; [![Build Status](https://travis-ci.org/DScheglov/handy-thunks.svg?branch=master)](https://travis-ci.org/DScheglov/handy-thunks) [![Coverage Status](https://coveralls.io/repos/github/DScheglov/handy-thunks/badge.svg?branch=master)](https://coveralls.io/github/DScheglov/handy-thunks?branch=master) [![npm version](https://img.shields.io/npm/v/handy-thunks.svg?style=flat-square)](https://www.npmjs.com/package/handy-thunks) [![npm downloads](https://img.shields.io/npm/dm/handy-thunks.svg?style=flat-square)](https://www.npmjs.com/package/handy-thunks) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/DScheglov/handy-thunks/blob/master/LICENSE)

Tools for coding with `redux-thunk`

## Installation

```shell
npm i handy-thunks
```

## Overview

The package provides easy way to create, enhance and compose `thunks` in order to build flow of any complexity by using following tools:


### 1. Thunk creators

- [createThunk(actionCreators, selectors)(func)](https://github.com/DScheglov/handy-thunks/tree/master/samples/create-thunk)
- [voidThunk](https://github.com/DScheglov/handy-thunks/tree/master/samples/void-thunk)


### 2. Flow compositors

- [all(...thunks)](https://github.com/DScheglov/handy-thunks/tree/master/samples/all) 
- [queue(...thunks)](https://github.com/DScheglov/handy-thunks/tree/master/samples/queue)
- [chain(...thunks)](https://github.com/DScheglov/handy-thunks/tree/master/samples/chain) 


### 3. Thunk decorators

- [connected(selector)(thunk)](https://github.com/DScheglov/handy-thunks/tree/master/samples/connected) 
- [loading(startAction, endAction)(...loadingArgs)(thunk)](https://github.com/DScheglov/handy-thunks/tree/master/samples/loading)
- [fallback(fallbackThunk)(thunk)](https://github.com/DScheglov/handy-thunks/tree/master/samples/fallback)
- [followedBy(nextThunk)(thunk)](https://github.com/DScheglov/handy-thunks/tree/master/samples/followed-by)
- [cleanUp(cleaningThunk)(thunk)](https://github.com/DScheglov/handy-thunks/tree/master/samples/clean-up)
- [onlyIf(predicate)(thunk)](https://github.com/DScheglov/handy-thunks/tree/master/samples/only-if)
- [chained(keySelector)(thunk)](https://github.com/DScheglov/handy-thunks/tree/master/samples/chained)
- [single(keySelector)(thunk)](https://github.com/DScheglov/handy-thunks/tree/master/samples/single) 
- [postponded(delay, keySelector)(thunk)](https://github.com/DScheglov/handy-thunks/tree/master/samples/postponded)
- [lazy(thunk)](https://github.com/DScheglov/handy-thunks/tree/master/samples/lazy)


## Example:

**./src/flows.js** (*complicated thunks*):
```js
import { queue, all, connected, loading } from 'handy-thunks';

import { getUser } from './store/users';
import { loadUser, loadContracts, loadOffers } from './thunks';


const withUserId = connected(state => getUser(state).id);
const withLoading = loading(startLoading, endLoading)('ALL');

const fetchUserData = queue(
  loadUser,
  all(
    withUserId(loadContracts),
    withUserId(loadOffers),
  ),
);

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

