# `lazy(thunk)`

```js

lazy(thunk: Action|Thunk): Thunk;
```

Creates a new **thunk** that dispatches the original one, but returns resolved promise not waiting for resolution of original **thunk** promise at all.