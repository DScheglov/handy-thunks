# `onlyIf(predicate)(thunk)`

```js
type Predicate: (...args: Array<*>): mixed;

onlyIf(predicate: Predicate)(thunk: Thunk|Action): Thunk;
```


Creates a new **thunk** that dispatches the original one only if `predicate` called with arguments returns `true`-value. In other case the new **thunk** does nothing. 