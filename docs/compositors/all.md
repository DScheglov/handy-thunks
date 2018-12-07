# `all(...thunks)`

```
all: (...thunks: Array<Thunk<*>>): AsyncThunk<Array<*>>
```

Creates a new thunk that dispatches all of **thunks** (in current task) and returns promise
will be resolved after all promises returned by **thunks** are resolved.

All of **thunks** will receive the same arguments as resulted thunk.

## Example:

```js
import { all } from 'handy-thunks';
import { loadUser, loadCompany } from './thunks';

export const loadUserAndCompany = all(
  loadUser,
  loadCompany
);

// ...

store.dispatch(
  loadUserAndCompany({ userId: 'some-user-id', companyId: 'some-company-id' })
);
```

## Paramters:
- **thunks**: `Array<Thunk<*>>` - ***required*** - the thunks to be composed in parallel.

## Returns:
- **thunk**: `AsyncThunk<Array<*>>`