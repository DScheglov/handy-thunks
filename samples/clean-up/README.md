# `cleanUp(cleaningThunk)(thunk)`

```js
cleanUp(cleaningThunk: Action|Thunk)(thunk: Action|Thunk): Thunk;
```

Creates a new **thunk** that dispatches a `cleaningThunk` in any case of `promise`
returned by original **thunk** is rejected or fullfilled.