# `fallback(fallbackThunk)(thunk)`

```js
fallback(fallbackThunk: Action|Thunk)(thunk: Action|Thunk): Thunk;
```

Creates a new **thunk** that dispatches a `fallbackThunk` in case if `promise`
returned by original **thunk** is rejected.