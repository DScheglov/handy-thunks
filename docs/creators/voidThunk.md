# `voidThunk`

```
voidThunk: SyncThunk<undefined>
```

A curried function that does nothing. Use it if you need to skip any action.

## Example:
```js
import { queue, voidThunk, fallback } from 'handy-thunks';
import { loadUser, loadUserAvatar } from './thunks';

const ignoreErrors = fallback(voidThunk);

const loadUserProfile = queue(
  loadUser,
  ignoreErrors(loadUserAvatar)
);
```

[**Live sample**](https://codesandbox.io/s/github/DScheglov/deco-thunks/tree/fallback-sample/?module=%2Fsrc%2FAppToolBar%2Fthunks.js) at codesandbox.io

