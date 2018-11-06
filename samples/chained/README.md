# `chained(keySelector)(thunk)`

```js
type KeySelector: (...args: Array<*>) => string|number|boolean;

chained(keySelector?: KeySelector)(thunk: Action|Thunk): Thunk;
```

Creates a new **thunk** that dispatches the original one after all promises returned in previous calls are resolved.

`keySelector` allows to separate calls with different promise chains.