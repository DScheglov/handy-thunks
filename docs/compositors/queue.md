# `queue(...thunks)`

```
queue(...thunk: Array<Thunk<*>>): AsyncThunk<*>
```

Creates a new thunk thad dispatches in async way all incoming thunks one by one passing
its arguments to all incoming thunks.

The first incoming thunk will be dispatched in the current task.

## Example:
```js
import { queue } from 'handy-thunks';
import { createUser, createOrg } from './thunks';


const createUserAndOrg = queue(
  createUser,
  createOrg
);

// ....

dispatch(
  createUserAndOrg({
    firstname: 'User',
    lastname: 'Super',
    companyName: 'New Company',
  })
);
```

## Parameters:

- **thunks**: `Array<Thunk<*>>` - ***required*** -- the thunks to be composed for sequental dispatch.

## Returns:

- **thunk**: `AsyncThunk<*>` -- the new thunk.
