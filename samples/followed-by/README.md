# `followedBy(nextThunk)(thunk)`

```js
followedBy(nextThunk: Action|Thunk)(thunk: Action|Thunk): Thunk;
```

Creates a new **thunk** that dispatches a `nextThunk` in case if `promise`
returned by original **thunk** is fullfilled.