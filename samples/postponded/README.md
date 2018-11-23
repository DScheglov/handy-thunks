# `postponed(keySelector)(thunk)`

```js
type KeySelector: (...args: Array<*>) => string|number|boolean;

postponed(delay: number, keySelector?: KeySelector)(thunk: Action|Thunk): Thunk;
```

Create a new **thunk** that dispatches the original one with specified delay. If during this delay the new **thunk** will be called again (one or more time), the original thunk will be dispatched with argumetns of last call.

`keySelector` allows to separate calls with different promise chains.