# `chain(...thunks)`

```
chain(...thunk: Array<Thunk<*>>): AsyncThunk<*>
```

Creates a new thunk thad dispatches in async way all incoming thunks one by one passing
the result of each thunk to the next one (as arguments).

The first incoming thunk will be dispatched in the current task.

## Example:
```js
import { chain } from 'handy-thunks';
import { createUser, createOrg } from './thunks';

const readPayload = ({ payload }) => () => payload;

const createUserAndOrg = chain(
  createUser,
  readPayload,
  createOrg
);

// ....

dispatch(
  createUserAndOrg({ firstname: 'User', lastname: 'Super' })
);
```

## Parameters:

- **thunks**: `Array<Thunk<*>>` - ***required*** -- the thunks to be composed for sequental dispatch.

## Returns:

- **thunk**: `AsyncThunk<*>` -- the new thunk.
