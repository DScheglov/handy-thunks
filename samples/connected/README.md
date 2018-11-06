# `connected(selector)(thunk)`

```js
connected(selector: Selector<S, R>)(thunk: Thunk|Action): Thunk;
```

Creates a new **thunk** that dispatches the original one with result returned be specified selector