# `select(selector)`

```
select: (selector: Selector<S, R>): SyncThunk<R>
```

Using **selector** creates thunk that retuns some data from stored state.

## Example:

```js
import { queue, select } from 'handy-thunks';
import { save } from './users/reducers';
import api from './api';

const loadUser = userId => dispatch => api()
  .get(`/users/${userId}`)
  .then(user => dispatch(save(user)))
;

const getUser = (state, userId) => state.users[userId];

export const getUserFromServer = queue(
  loadUser,
  select(getUser),
);

// ... somewhere in async function
const user = await store.dispatch(
  getUserFromServer('some-user-id')
);
```

## Parameters:
- **selector**: `Selector<S, R>` - ***required*** - function receives state and other paramters and returns some derived data.

## Returns:
 - **thunk**: `SyncThunk<R>`